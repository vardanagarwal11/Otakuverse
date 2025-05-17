import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OtakuverseAnchorProgram } from "../target/types/otakuverse_anchor_program";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { assert } from "chai";

describe("otakuverse-program", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.OtakuverseProgram as Program<OtakuverseAnchorProgram>;
  
  // Test accounts
  const user = anchor.web3.Keypair.generate();
  const buyer = anchor.web3.Keypair.generate();
  const mintKeypair = anchor.web3.Keypair.generate();
  
  // NFT metadata
  const nftName = "Naruto #1";
  const nftSymbol = "NRTO";
  const nftUri = "https://otakuverse.io/nft/naruto1.json";
  const animeTitle = "Naruto";
  const rarity = "Legendary";
  const nftPrice = new anchor.BN(0.5 * LAMPORTS_PER_SOL);
  
  // PDA for NFT account
  let nftPDA: PublicKey;
  let nftBump: number;
  
  // Token accounts
  let userTokenAccount: PublicKey;
  let buyerTokenAccount: PublicKey;
  
  before(async () => {
    // Airdrop SOL to user and buyer
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 10 * LAMPORTS_PER_SOL)
    );
    
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(buyer.publicKey, 10 * LAMPORTS_PER_SOL)
    );
    
    // Find PDA for NFT account
    [nftPDA, nftBump] = await PublicKey.findProgramAddress(
      [Buffer.from("nft"), mintKeypair.publicKey.toBuffer()],
      program.programId
    );
    
    // Get associated token accounts
    userTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      user.publicKey
    );
    
    buyerTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      buyer.publicKey
    );
  });
  
  it("Initializes the program", async () => {
    await program.methods
      .initialize()
      .accounts({
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();
  });
  
  it("Mints an NFT", async () => {
    await program.methods
      .mintNft(nftName, nftSymbol, nftUri, animeTitle, rarity)
      .accounts({
        owner: user.publicKey,
        nftAccount: nftPDA,
        mint: mintKeypair.publicKey,
        tokenAccount: userTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([user, mintKeypair])
      .rpc();
    
    // Fetch the NFT account and verify data
    const nftAccount = await program.account.nftData.fetch(nftPDA);
    assert.equal(nftAccount.name, nftName);
    assert.equal(nftAccount.symbol, nftSymbol);
    assert.equal(nftAccount.uri, nftUri);
    assert.equal(nftAccount.animeTitle, animeTitle);
    assert.equal(nftAccount.rarity, rarity);
    assert.equal(nftAccount.isListed, false);
    assert.equal(nftAccount.price.toNumber(), 0);
    assert.equal(nftAccount.owner.toString(), user.publicKey.toString());
    assert.equal(nftAccount.mint.toString(), mintKeypair.publicKey.toString());
  });
  
  it("Lists an NFT for sale", async () => {
    await program.methods
      .listNftForSale(nftPrice)
      .accounts({
        owner: user.publicKey,
        nftAccount: nftPDA,
        mint: mintKeypair.publicKey,
        tokenAccount: userTokenAccount,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    
    // Fetch the NFT account and verify data
    const nftAccount = await program.account.nftData.fetch(nftPDA);
    assert.equal(nftAccount.isListed, true);
    assert.equal(nftAccount.price.toString(), nftPrice.toString());
  });
  
  it("Purchases an NFT", async () => {
    const sellerBalanceBefore = await provider.connection.getBalance(user.publicKey);
    const buyerBalanceBefore = await provider.connection.getBalance(buyer.publicKey);
    
    await program.methods
      .purchaseNft(nftPrice)
      .accounts({
        buyer: buyer.publicKey,
        seller: user.publicKey,
        nftAccount: nftPDA,
        mint: mintKeypair.publicKey,
        sellerTokenAccount: userTokenAccount,
        buyerTokenAccount: buyerTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([buyer])
      .rpc();
    
    // Fetch the NFT account and verify data
    const nftAccount = await program.account.nftData.fetch(nftPDA);
    assert.equal(nftAccount.isListed, false);
    assert.equal(nftAccount.price.toNumber(), 0);
    assert.equal(nftAccount.owner.toString(), buyer.publicKey.toString());
    
    // Verify SOL transfer
    const sellerBalanceAfter = await provider.connection.getBalance(user.publicKey);
    const buyerBalanceAfter = await provider.connection.getBalance(buyer.publicKey);
    
    // Account for transaction fees
    assert.approximately(
      sellerBalanceAfter - sellerBalanceBefore,
      nftPrice.toNumber(),
      1000000 // Allow for small rounding errors
    );
    
    // Buyer paid the price plus some fees
    assert.isBelow(
      buyerBalanceBefore - buyerBalanceAfter,
      nftPrice.toNumber() + 0.01 * LAMPORTS_PER_SOL
    );
  });
  
  it("Cancels an NFT listing", async () => {
    // First list the NFT again
    await program.methods
      .listNftForSale(nftPrice)
      .accounts({
        owner: buyer.publicKey,
        nftAccount: nftPDA,
        mint: mintKeypair.publicKey,
        tokenAccount: buyerTokenAccount,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();
    
    // Now cancel the listing
    await program.methods
      .cancelListing()
      .accounts({
        owner: buyer.publicKey,
        nftAccount: nftPDA,
        mint: mintKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();
    
    // Fetch the NFT account and verify data
    const nftAccount = await program.account.nftData.fetch(nftPDA);
    assert.equal(nftAccount.isListed, false);
    assert.equal(nftAccount.price.toNumber(), 0);
  });
});
