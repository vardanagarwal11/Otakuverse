// Solana/Anchor program utility functions for OtakuVerse advanced features
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';

// Program ID from deployment
const PROGRAM_ID = new PublicKey('6XC7XVUWDQCLPGuJusuVRUnSuWLHFBLw8fDD7srCVAxE');
const TESTNET_RPC = 'https://api.testnet.solana.com';

// IDL for the program
const IDL = {
  "version": "0.1.0",
  "name": "otakuverse_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        { "name": "globalState", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "stakeNft",
      "accounts": [
        { "name": "stakingAccount", "isMut": true, "isSigner": false },
        { "name": "staker", "isMut": true, "isSigner": true },
        { "name": "nftMint", "isMut": false, "isSigner": false },
        { "name": "userTokenAccount", "isMut": true, "isSigner": false },
        { "name": "programTokenAccount", "isMut": true, "isSigner": false },
        { "name": "programAuthority", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "associatedTokenProgram", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "nftMint", "type": "publicKey" }]
    },
    {
      "name": "createProposal",
      "accounts": [
        { "name": "proposalAccount", "isMut": true, "isSigner": false },
        { "name": "globalState", "isMut": true, "isSigner": false },
        { "name": "creator", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "title", "type": "string" },
        { "name": "description", "type": "string" }
      ]
    },
    {
      "name": "voteOnProposal",
      "accounts": [
        { "name": "proposalAccount", "isMut": true, "isSigner": false },
        { "name": "voteAccount", "isMut": true, "isSigner": false },
        { "name": "voter", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "proposalId", "type": "u64" },
        { "name": "support", "type": "bool" }
      ]
    },
    {
      "name": "createEvent",
      "accounts": [
        { "name": "eventAccount", "isMut": true, "isSigner": false },
        { "name": "globalState", "isMut": true, "isSigner": false },
        { "name": "creator", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "eventId", "type": "u64" },
        { "name": "communityId", "type": "string" },
        { "name": "title", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "timestamp", "type": "i64" }
      ]
    },
    {
      "name": "rsvpEvent",
      "accounts": [
        { "name": "eventAccount", "isMut": true, "isSigner": false },
        { "name": "rsvpAccount", "isMut": true, "isSigner": false },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "eventId", "type": "u64" }]
    },
    {
      "name": "mintBadge",
      "accounts": [
        { "name": "badgeAccount", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "badgeId", "type": "u64" },
        { "name": "name", "type": "string" },
        { "name": "description", "type": "string" }
      ]
    },
    {
      "name": "verifyAccess",
      "accounts": [
        { "name": "accessAccount", "isMut": true, "isSigner": false },
        { "name": "nftMint", "isMut": false, "isSigner": false },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "nftMint", "type": "publicKey" },
        { "name": "expirationTime", "type": "i64" }
      ]
    }
  ]
};

function getProgram(wallet: any) {
  const connection = new Connection(TESTNET_RPC, 'confirmed');
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  return new Program(IDL as any, PROGRAM_ID, provider);
}

export async function stakeNft(nftMint: string, wallet: any) {
  try {
    const program = getProgram(wallet);
    const nftMintPubkey = new PublicKey(nftMint);
    
    // Derive PDAs
    const [stakingAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('staking'), wallet.publicKey.toBuffer(), nftMintPubkey.toBuffer()],
      PROGRAM_ID
    );
    
    const [programAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from('program_authority')],
      PROGRAM_ID
    );
    
    // Get token accounts
    const userTokenAccount = await getAssociatedTokenAddress(nftMintPubkey, wallet.publicKey);
    const programTokenAccount = await getAssociatedTokenAddress(nftMintPubkey, programAuthority, true);
    
    const tx = await program.methods
      .stakeNft(nftMintPubkey)
      .accounts({
        stakingAccount,
        staker: wallet.publicKey,
        nftMint: nftMintPubkey,
        userTokenAccount,
        programTokenAccount,
        programAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log('NFT staked successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error staking NFT:', error);
    throw new Error(`Failed to stake NFT: ${error.message}`);
  }
}

export async function unstakeNft(nftMint: string, wallet: any) {
  try {
    const program = getProgram(wallet);
    const nftMintPubkey = new PublicKey(nftMint);
    
    // Derive PDAs
    const [stakingAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('staking'), wallet.publicKey.toBuffer(), nftMintPubkey.toBuffer()],
      PROGRAM_ID
    );
    
    const [programAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from('program_authority')],
      PROGRAM_ID
    );
    
    // Get token accounts
    const userTokenAccount = await getAssociatedTokenAddress(nftMintPubkey, wallet.publicKey);
    const programTokenAccount = await getAssociatedTokenAddress(nftMintPubkey, programAuthority, true);
    
    const tx = await program.methods
      .unstakeNft()
      .accounts({
        stakingAccount,
        staker: wallet.publicKey,
        nftMint: nftMintPubkey,
        userTokenAccount,
        programTokenAccount,
        programAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
    
    console.log('NFT unstaked successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error unstaking NFT:', error);
    throw new Error(`Failed to unstake NFT: ${error.message}`);
  }
}

export async function createProposal(title: string, description: string, wallet: any) {
  try {
    const program = getProgram(wallet);
    
    // Get global state
    const [globalState] = PublicKey.findProgramAddressSync(
      [Buffer.from('global_state')],
      PROGRAM_ID
    );
    
    // Fetch current proposal count
    const globalStateData = await program.account.globalState.fetch(globalState);
    const proposalId = globalStateData.totalProposals;
    
    // Derive proposal PDA
    const [proposalAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('proposal'), proposalId.toArrayLike(Buffer, 'le', 8)],
      PROGRAM_ID
    );
    
    const tx = await program.methods
      .createProposal(title, description)
      .accounts({
        proposalAccount,
        globalState,
        creator: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log('Proposal created successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error creating proposal:', error);
    throw new Error(`Failed to create proposal: ${error.message}`);
  }
}

export async function voteOnProposal(proposalId: number, support: boolean, wallet: any) {
  try {
    const program = getProgram(wallet);
    const proposalIdBN = new BN(proposalId);
    
    // Derive PDAs
    const [proposalAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('proposal'), proposalIdBN.toArrayLike(Buffer, 'le', 8)],
      PROGRAM_ID
    );
    
    const [voteAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('vote'), wallet.publicKey.toBuffer(), proposalIdBN.toArrayLike(Buffer, 'le', 8)],
      PROGRAM_ID
    );
    
    const tx = await program.methods
      .voteOnProposal(proposalIdBN, support)
      .accounts({
        proposalAccount,
        voteAccount,
        voter: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log('Vote cast successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error voting on proposal:', error);
    throw new Error(`Failed to vote on proposal: ${error.message}`);
  }
}

export async function finalizeProposal(proposalId: number, wallet: any) {
  try {
    const program = getProgram(wallet);
    const proposalIdBN = new BN(proposalId);
    
    // Derive proposal PDA
    const [proposalAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('proposal'), proposalIdBN.toArrayLike(Buffer, 'le', 8)],
      PROGRAM_ID
    );
    
    const tx = await program.methods
      .finalizeProposal(proposalIdBN)
      .accounts({
        proposalAccount,
        finalizer: wallet.publicKey,
      })
      .rpc();
    
    console.log('Proposal finalized successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error finalizing proposal:', error);
    throw new Error(`Failed to finalize proposal: ${error.message}`);
  }
}

export async function createEvent(eventId: number, communityId: string, title: string, description: string, timestamp: number, wallet: any) {
  try {
    const program = getProgram(wallet);
    const eventIdBN = new BN(eventId);
    const timestampBN = new BN(timestamp);
    
    // Get global state
    const [globalState] = PublicKey.findProgramAddressSync(
      [Buffer.from('global_state')],
      PROGRAM_ID
    );
    
    // Derive event PDA
    const [eventAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('event'), eventIdBN.toArrayLike(Buffer, 'le', 8)],
      PROGRAM_ID
    );
    
    const tx = await program.methods
      .createEvent(eventIdBN, communityId, title, description, timestampBN)
      .accounts({
        eventAccount,
        globalState,
        creator: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log('Event created successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error(`Failed to create event: ${error.message}`);
  }
}

export async function rsvpEvent(eventId: number, wallet: any) {
  try {
    const program = getProgram(wallet);
    const eventIdBN = new BN(eventId);
    
    // Derive PDAs
    const [eventAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('event'), eventIdBN.toArrayLike(Buffer, 'le', 8)],
      PROGRAM_ID
    );
    
    const [rsvpAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('rsvp'), wallet.publicKey.toBuffer(), eventIdBN.toArrayLike(Buffer, 'le', 8)],
      PROGRAM_ID
    );
    
    const tx = await program.methods
      .rsvpEvent(eventIdBN)
      .accounts({
        eventAccount,
        rsvpAccount,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log('RSVP successful:', tx);
    return tx;
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    throw new Error(`Failed to RSVP to event: ${error.message}`);
  }
}

export async function mintBadge(badgeId: string, wallet: any) {
  try {
    const program = getProgram(wallet);
    const badgeIdNum = parseInt(badgeId);
    const badgeIdBN = new BN(badgeIdNum);
    
    // Derive badge PDA
    const [badgeAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('badge'), badgeIdBN.toArrayLike(Buffer, 'le', 8)],
      PROGRAM_ID
    );
    
    const tx = await program.methods
      .mintBadge(badgeIdBN, `Badge ${badgeId}`, `Description for badge ${badgeId}`)
      .accounts({
        badgeAccount,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log('Badge minted successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error minting badge:', error);
    throw new Error(`Failed to mint badge: ${error.message}`);
  }
}

export async function verifyAccess(area: string, wallet: any) {
  try {
    const program = getProgram(wallet);
    
    // For demo purposes, use a dummy NFT mint
    const dummyNftMint = new PublicKey('11111111111111111111111111111112');
    const expirationTime = new BN(Math.floor(Date.now() / 1000) + 2592000); // 30 days
    
    // Derive access PDA
    const [accessAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('access'), wallet.publicKey.toBuffer(), dummyNftMint.toBuffer()],
      PROGRAM_ID
    );
    
    const tx = await program.methods
      .verifyAccess(dummyNftMint, expirationTime)
      .accounts({
        accessAccount,
        nftMint: dummyNftMint,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    console.log('Access verified successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error verifying access:', error);
    throw new Error(`Failed to verify access: ${error.message}`);
  }
}

// Trading functions (simplified for demo)
export async function initiateTrade(tradeId: number, initiatorNft: string, counterparty: string, counterpartyNft: string, wallet: any) {
  console.log('Trade initiated (demo):', { tradeId, initiatorNft, counterparty, counterpartyNft });
  return 'demo_trade_tx';
}

export async function acceptTrade(tradeId: number, wallet: any) {
  console.log('Trade accepted (demo):', tradeId);
  return 'demo_accept_tx';
}

export async function cancelTrade(tradeId: number, wallet: any) {
  console.log('Trade cancelled (demo):', tradeId);
  return 'demo_cancel_tx';
}

// Purchase NFT function (simplified for demo)
export async function purchaseNft(nftId: string, wallet: any) {
  console.log('NFT purchased (demo):', nftId);
  return 'demo_purchase_tx';
}

// Reward user function (simplified for demo)
export async function rewardUser(user: string, amount: number, wallet: any) {
  console.log('User rewarded (demo):', { user, amount });
  return 'demo_reward_tx';
}

// Cancel event function (simplified for demo)
export async function cancelEvent(eventId: number, wallet: any) {
  console.log('Event cancelled (demo):', eventId);
  return 'demo_cancel_event_tx';
}

// Revoke access function (simplified for demo)
export async function revokeAccess(nftMint: string, userToRevoke: string, wallet: any) {
  console.log('Access revoked (demo):', { nftMint, userToRevoke });
  return 'demo_revoke_tx';
}