import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OtakuverseProgram } from "../target/types/otakuverse_program";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";
import { assert } from "chai";

describe("otakuverse-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.OtakuverseProgram as Program<OtakuverseProgram>;
  
  let globalState: PublicKey;
  let authority: Keypair;
  let user: Keypair;
  let nftMint: PublicKey;
  let userTokenAccount: PublicKey;

  before(async () => {
    authority = Keypair.generate();
    user = Keypair.generate();

    // Airdrop SOL to accounts
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(authority.publicKey, 10 * LAMPORTS_PER_SOL)
    );
    
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 10 * LAMPORTS_PER_SOL)
    );

    // Find global state PDA
    [globalState] = PublicKey.findProgramAddressSync(
      [Buffer.from("global_state")],
      program.programId
    );

    // Create NFT mint
    nftMint = await createMint(
      provider.connection,
      authority,
      authority.publicKey,
      null,
      0
    );

    // Create user token account
    userTokenAccount = await createAccount(
      provider.connection,
      user,
      nftMint,
      user.publicKey
    );

    // Mint NFT to user
    await mintTo(
      provider.connection,
      authority,
      nftMint,
      userTokenAccount,
      authority,
      1
    );
  });

  it("Initializes the program", async () => {
    await program.methods
      .initialize()
      .accounts({
        globalState,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    const globalStateAccount = await program.account.globalState.fetch(globalState);
    assert.equal(globalStateAccount.authority.toString(), authority.publicKey.toString());
    assert.equal(globalStateAccount.totalNftsMinted.toNumber(), 0);
  });

  it("Stakes an NFT", async () => {
    const [stakingAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("staking"), user.publicKey.toBuffer(), nftMint.toBuffer()],
      program.programId
    );

    const [programAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_authority")],
      program.programId
    );

    await program.methods
      .stakeNft(nftMint)
      .accounts({
        stakingAccount,
        staker: user.publicKey,
        nftMint,
        userTokenAccount,
        programAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const stakingData = await program.account.stakingAccount.fetch(stakingAccount);
    assert.equal(stakingData.staker.toString(), user.publicKey.toString());
    assert.equal(stakingData.nftMint.toString(), nftMint.toString());
    assert.equal(stakingData.isActive, true);
  });

  it("Creates a proposal", async () => {
    const globalStateAccount = await program.account.globalState.fetch(globalState);
    const proposalId = globalStateAccount.totalProposals;

    const [proposalAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("proposal"), proposalId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .createProposal("Test Proposal", "This is a test proposal for the DAO")
      .accounts({
        proposalAccount,
        globalState,
        creator: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const proposal = await program.account.proposal.fetch(proposalAccount);
    assert.equal(proposal.title, "Test Proposal");
    assert.equal(proposal.creator.toString(), user.publicKey.toString());
    assert.equal(proposal.status, 0); // Active
  });

  it("Votes on a proposal", async () => {
    const proposalId = new anchor.BN(0);

    const [proposalAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("proposal"), proposalId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [voteAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), user.publicKey.toBuffer(), proposalId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .voteOnProposal(proposalId, true)
      .accounts({
        proposalAccount,
        voteAccount,
        voter: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const proposal = await program.account.proposal.fetch(proposalAccount);
    assert.equal(proposal.forVotes.toNumber(), 1);
    assert.equal(proposal.againstVotes.toNumber(), 0);

    const vote = await program.account.vote.fetch(voteAccount);
    assert.equal(vote.support, true);
    assert.equal(vote.voter.toString(), user.publicKey.toString());
  });

  it("Creates an event", async () => {
    const eventId = new anchor.BN(1);
    const timestamp = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

    const [eventAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), eventId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .createEvent(eventId, "anime-community", "Anime Watch Party", "Join us for a fun anime watch party!", new anchor.BN(timestamp))
      .accounts({
        eventAccount,
        globalState,
        creator: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const event = await program.account.event.fetch(eventAccount);
    assert.equal(event.title, "Anime Watch Party");
    assert.equal(event.communityId, "anime-community");
    assert.equal(event.creator.toString(), user.publicKey.toString());
  });

  it("RSVPs to an event", async () => {
    const eventId = new anchor.BN(1);

    const [eventAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), eventId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const [rsvpAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("rsvp"), user.publicKey.toBuffer(), eventId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .rsvpEvent(eventId)
      .accounts({
        eventAccount,
        rsvpAccount,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const event = await program.account.event.fetch(eventAccount);
    assert.equal(event.currentParticipants, 1);

    const rsvp = await program.account.rsvp.fetch(rsvpAccount);
    assert.equal(rsvp.user.toString(), user.publicKey.toString());
    assert.equal(rsvp.eventId.toNumber(), 1);
  });

  it("Mints a badge", async () => {
    const badgeId = new anchor.BN(1);

    const [badgeAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("badge"), badgeId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    await program.methods
      .mintBadge(badgeId, "Early Adopter", "Badge for early platform adopters")
      .accounts({
        badgeAccount,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    const badge = await program.account.badge.fetch(badgeAccount);
    assert.equal(badge.name, "Early Adopter");
    assert.equal(badge.description, "Badge for early platform adopters");
  });

  it("Verifies access", async () => {
    const expirationTime = Math.floor(Date.now() / 1000) + 2592000; // 30 days from now

    const [accessAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("access"), user.publicKey.toBuffer(), nftMint.toBuffer()],
      program.programId
    );

    await program.methods
      .verifyAccess(nftMint, new anchor.BN(expirationTime))
      .accounts({
        accessAccount,
        nftMint,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const access = await program.account.access.fetch(accessAccount);
    assert.equal(access.user.toString(), user.publicKey.toString());
    assert.equal(access.nftMint.toString(), nftMint.toString());
  });
});