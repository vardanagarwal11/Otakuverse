// Solana/Anchor program utility functions for OtakuVerse advanced features
// (Staking, DAO, Trading, Events, Badges, Access, etc.)

import { getProgram } from './anchorSetup';
import { PublicKey } from '@solana/web3.js';

export async function stakeNft(nftMint: string, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive staking account PDA
  const [stakingAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('staking'), wallet.publicKey.toBuffer(), new web3.PublicKey(nftMint).toBuffer()],
    program.programId
  );
  
  // Derive NFT account
  const [nftAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('nft'), new web3.PublicKey(nftMint).toBuffer()],
    program.programId
  );
  
  // Check if NFT is already staked
  try {
    const stakingData = await program.account.staking.fetch(stakingAccount);
    if (stakingData && stakingData.isActive) {
      throw new Error('NFT is already staked');
    }
  } catch (error) {
    // Account doesn't exist yet, which is fine
  }
  
  // Check NFT ownership
  const connection = new web3.Connection(web3.clusterApiUrl('testnet'), 'confirmed');
  const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
    mint: new web3.PublicKey(nftMint)
  });
  
  if (tokenAccounts.value.length === 0) {
    throw new Error('You do not own this NFT');
  }
  
  return await program.methods.stakeNft(new web3.PublicKey(nftMint)).accounts({
    staker: wallet.publicKey,
    stakingAccount: stakingAccount,
    nftAccount: nftAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function unstakeNft(nftMint: string, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive staking account PDA
  const [stakingAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('staking'), wallet.publicKey.toBuffer(), new web3.PublicKey(nftMint).toBuffer()],
    program.programId
  );
  
  // Derive NFT account
  const [nftAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('nft'), new web3.PublicKey(nftMint).toBuffer()],
    program.programId
  );
  
  // Check if NFT is staked
  const stakingData = await program.account.staking.fetch(stakingAccount);
  if (!stakingData || !stakingData.isActive) {
    throw new Error('NFT is not staked');
  }
  
  // Check cooldown period (24 hours)
  const currentTime = Math.floor(Date.now() / 1000);
  const stakingTime = stakingData.stakedAt;
  const cooldownPeriod = 24 * 60 * 60; // 24 hours in seconds
  
  if (currentTime - stakingTime < cooldownPeriod) {
    const remainingTime = cooldownPeriod - (currentTime - stakingTime);
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    throw new Error(`Cannot unstake yet. Please wait ${hours}h ${minutes}m`);
  }
  
  return await program.methods.unstakeNft(new web3.PublicKey(nftMint)).accounts({
    staker: wallet.publicKey,
    stakingAccount: stakingAccount,
    nftAccount: nftAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function createProposal(title: string, description: string, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Generate a unique proposal ID using timestamp and random bytes
  const timestamp = Date.now();
  const randomBytes = web3.Keypair.generate().publicKey.toBuffer();
  const proposalId = Buffer.concat([Buffer.from(timestamp.toString()), randomBytes]);
  
  // Derive proposal account PDA
  const [proposalAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('proposal'), proposalId],
    program.programId
  );
  
  // Check if user has enough voting power
  const [votingPowerAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('voting_power'), wallet.publicKey.toBuffer()],
    program.programId
  );
  
  const votingPower = await program.account.votingPower.fetch(votingPowerAccount);
  if (!votingPower || votingPower.amount < 1000) { // Minimum 1000 tokens required
    throw new Error('Insufficient voting power to create proposal');
  }
  
  return await program.methods.createProposal(title, description).accounts({
    creator: wallet.publicKey,
    proposalAccount: proposalAccount,
    votingPowerAccount: votingPowerAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function voteOnProposal(proposalId: number, support: boolean, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive proposal account PDA
  const [proposalAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('proposal'), Buffer.from(proposalId.toString())],
    program.programId
  );
  
  // Check proposal status
  const proposalData = await program.account.proposal.fetch(proposalAccount);
  if (!proposalData) {
    throw new Error('Proposal does not exist');
  }
  
  if (proposalData.status !== 0) { // 0 = active
    throw new Error('Proposal is no longer active');
  }
  
  // Check if voting period has ended
  const currentTime = Math.floor(Date.now() / 1000);
  const votingEndTime = proposalData.createdAt + (7 * 24 * 60 * 60); // 7 days voting period
  if (currentTime > votingEndTime) {
    throw new Error('Voting period has ended');
  }
  
  // Check if user has already voted
  const [voteAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('vote'), wallet.publicKey.toBuffer(), Buffer.from(proposalId.toString())],
    program.programId
  );
  
  try {
    const voteData = await program.account.vote.fetch(voteAccount);
    if (voteData) {
      throw new Error('You have already voted on this proposal');
    }
  } catch (error) {
    // Account doesn't exist yet, which is fine
  }
  
  return await program.methods.voteOnProposal(proposalId, support).accounts({
    voter: wallet.publicKey,
    proposalAccount: proposalAccount,
    voteAccount: voteAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function finalizeProposal(proposalId: number, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive proposal account PDA
  const [proposalAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('proposal'), Buffer.from(proposalId.toString())],
    program.programId
  );
  
  // Check proposal status
  const proposalData = await program.account.proposal.fetch(proposalAccount);
  if (!proposalData) {
    throw new Error('Proposal does not exist');
  }
  
  if (proposalData.status !== 0) { // 0 = active
    throw new Error('Proposal is already finalized');
  }
  
  // Check if voting period has ended
  const currentTime = Math.floor(Date.now() / 1000);
  const votingEndTime = proposalData.createdAt + (7 * 24 * 60 * 60); // 7 days voting period
  if (currentTime <= votingEndTime) {
    throw new Error('Voting period has not ended yet');
  }
  
  // Check if user has enough voting power to finalize
  const [votingPowerAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('voting_power'), wallet.publicKey.toBuffer()],
    program.programId
  );
  
  const votingPower = await program.account.votingPower.fetch(votingPowerAccount);
  if (!votingPower || votingPower.amount < 5000) { // Minimum 5000 tokens required to finalize
    throw new Error('Insufficient voting power to finalize proposal');
  }
  
  return await program.methods.finalizeProposal(proposalId).accounts({
    finalizer: wallet.publicKey,
    proposalAccount: proposalAccount,
    votingPowerAccount: votingPowerAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function initiateTrade(tradeId: number, initiatorNft: string, counterparty: string, counterpartyNft: string, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive trade account PDA
  const [tradeAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('trade'), Buffer.from(tradeId.toString())],
    program.programId
  );
  
  // Check if trade already exists
  try {
    const tradeData = await program.account.trade.fetch(tradeAccount);
    if (tradeData) {
      throw new Error('Trade ID already exists');
    }
  } catch (error) {
    // Account doesn't exist yet, which is fine
  }
  
  // Check initiator NFT ownership
  const connection = new web3.Connection(web3.clusterApiUrl('testnet'), 'confirmed');
  const initiatorTokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
    mint: new web3.PublicKey(initiatorNft)
  });
  
  if (initiatorTokenAccounts.value.length === 0) {
    throw new Error('You do not own the initiator NFT');
  }
  
  // Check counterparty NFT ownership
  const counterpartyTokenAccounts = await connection.getTokenAccountsByOwner(new web3.PublicKey(counterparty), {
    mint: new web3.PublicKey(counterpartyNft)
  });
  
  if (counterpartyTokenAccounts.value.length === 0) {
    throw new Error('Counterparty does not own the specified NFT');
  }
  
  // Set trade expiration (24 hours from now)
  const expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
  
  return await program.methods.initiateTrade(tradeId, initiatorNft, counterparty, counterpartyNft, expirationTime).accounts({
    initiator: wallet.publicKey,
    counterparty: new web3.PublicKey(counterparty),
    tradeAccount: tradeAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function acceptTrade(tradeId: number, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive trade account PDA
  const [tradeAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('trade'), Buffer.from(tradeId.toString())],
    program.programId
  );
  
  // Check trade status
  const tradeData = await program.account.trade.fetch(tradeAccount);
  if (!tradeData) {
    throw new Error('Trade does not exist');
  }
  
  if (tradeData.status !== 0) { // 0 = pending
    throw new Error('Trade is no longer pending');
  }
  
  // Check if trade has expired
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > tradeData.expirationTime) {
    throw new Error('Trade has expired');
  }
  
  // Check if caller is the counterparty
  if (!tradeData.counterparty.equals(wallet.publicKey)) {
    throw new Error('Only the counterparty can accept this trade');
  }
  
  // Check counterparty NFT ownership
  const connection = new web3.Connection(web3.clusterApiUrl('testnet'), 'confirmed');
  const counterpartyTokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
    mint: tradeData.counterpartyNft
  });
  
  if (counterpartyTokenAccounts.value.length === 0) {
    throw new Error('You no longer own the counterparty NFT');
  }
  
  return await program.methods.acceptTrade(tradeId).accounts({
    counterparty: wallet.publicKey,
    tradeAccount: tradeAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function cancelTrade(tradeId: number, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive trade account PDA
  const [tradeAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('trade'), Buffer.from(tradeId.toString())],
    program.programId
  );
  
  // Check trade status
  const tradeData = await program.account.trade.fetch(tradeAccount);
  if (!tradeData) {
    throw new Error('Trade does not exist');
  }
  
  if (tradeData.status !== 0) { // 0 = pending
    throw new Error('Trade is no longer pending');
  }
  
  // Check if caller is the initiator
  if (!tradeData.initiator.equals(wallet.publicKey)) {
    throw new Error('Only the initiator can cancel this trade');
  }
  
  return await program.methods.cancelTrade(tradeId).accounts({
    initiator: wallet.publicKey,
    tradeAccount: tradeAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function createEvent(eventId: number, communityId: string, title: string, description: string, timestamp: number, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive event account PDA
  const [eventAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('event'), Buffer.from(eventId.toString())],
    program.programId
  );
  
  // Derive community account PDA
  const [communityAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('community'), Buffer.from(communityId)],
    program.programId
  );
  
  // Check if user is a community member
  const [membershipAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('membership'), wallet.publicKey.toBuffer(), Buffer.from(communityId)],
    program.programId
  );
  
  const membershipData = await program.account.membership.fetch(membershipAccount);
  if (!membershipData || !membershipData.isActive) {
    throw new Error('You must be an active community member to create events');
  }
  
  // Check if user has permission to create events
  if (!membershipData.canCreateEvents) {
    throw new Error('You do not have permission to create events in this community');
  }
  
  // Validate event timestamp (must be in the future)
  const currentTime = Math.floor(Date.now() / 1000);
  if (timestamp <= currentTime) {
    throw new Error('Event timestamp must be in the future');
  }
  
  // Validate event title and description
  if (!title || title.length < 3 || title.length > 100) {
    throw new Error('Event title must be between 3 and 100 characters');
  }
  
  if (!description || description.length < 10 || description.length > 1000) {
    throw new Error('Event description must be between 10 and 1000 characters');
  }
  
  return await program.methods.createEvent(eventId, communityId, title, description, timestamp).accounts({
    creator: wallet.publicKey,
    eventAccount: eventAccount,
    communityAccount: communityAccount,
    membershipAccount: membershipAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function rsvpEvent(eventId: number, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive event account PDA
  const [eventAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('event'), Buffer.from(eventId.toString())],
    program.programId
  );
  
  // Check event status
  const eventData = await program.account.event.fetch(eventAccount);
  if (!eventData) {
    throw new Error('Event does not exist');
  }
  
  if (eventData.status !== 0) { // 0 = active
    throw new Error('Event is no longer active');
  }
  
  // Check if event is full
  if (eventData.maxParticipants && eventData.currentParticipants >= eventData.maxParticipants) {
    throw new Error('Event is full');
  }
  
  // Check if user has already RSVP'd
  const [rsvpAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('rsvp'), wallet.publicKey.toBuffer(), Buffer.from(eventId.toString())],
    program.programId
  );
  
  try {
    const rsvpData = await program.account.rsvp.fetch(rsvpAccount);
    if (rsvpData) {
      throw new Error('You have already RSVP\'d to this event');
    }
  } catch (error) {
    // Account doesn't exist yet, which is fine
  }
  
  // Check if user is a community member
  const [membershipAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('membership'), wallet.publicKey.toBuffer(), Buffer.from(eventData.communityId)],
    program.programId
  );
  
  const membershipData = await program.account.membership.fetch(membershipAccount);
  if (!membershipData || !membershipData.isActive) {
    throw new Error('You must be an active community member to RSVP to events');
  }
  
  return await program.methods.rsvpEvent(eventId).accounts({
    user: wallet.publicKey,
    eventAccount: eventAccount,
    rsvpAccount: rsvpAccount,
    membershipAccount: membershipAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function cancelEvent(eventId: number, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive event account PDA
  const [eventAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('event'), Buffer.from(eventId.toString())],
    program.programId
  );
  
  // Check event status
  const eventData = await program.account.event.fetch(eventAccount);
  if (!eventData) {
    throw new Error('Event does not exist');
  }
  
  if (eventData.status !== 0) { // 0 = active
    throw new Error('Event is already cancelled or completed');
  }
  
  // Check if caller is the event creator
  if (!eventData.creator.equals(wallet.publicKey)) {
    throw new Error('Only the event creator can cancel the event');
  }
  
  // Check if event is too close to start time (less than 24 hours)
  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilEvent = eventData.timestamp - currentTime;
  if (timeUntilEvent < 24 * 60 * 60) {
    throw new Error('Cannot cancel event less than 24 hours before start time');
  }
  
  return await program.methods.cancelEvent(eventId).accounts({
    creator: wallet.publicKey,
    eventAccount: eventAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function mintBadge(badgeId: number, name: string, description: string, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive badge account PDA
  const [badgeAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('badge'), Buffer.from(badgeId.toString())],
    program.programId
  );
  
  return await program.methods.mintBadge(badgeId, name, description).accounts({
    authority: wallet.publicKey,
    badgeAccount: badgeAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function rewardUser(user: string, amount: number, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive user reward account PDA
  const [rewardAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('reward'), new web3.PublicKey(user).toBuffer()],
    program.programId
  );
  
  return await program.methods.rewardUser(user, amount).accounts({
    authority: wallet.publicKey,
    user: new web3.PublicKey(user),
    rewardAccount: rewardAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function verifyAccess(nftMint: string, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive NFT account PDA
  const [nftAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('nft'), new web3.PublicKey(nftMint).toBuffer()],
    program.programId
  );
  
  // Check NFT existence and ownership
  const connection = new web3.Connection(web3.clusterApiUrl('testnet'), 'confirmed');
  const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
    mint: new web3.PublicKey(nftMint)
  });
  
  if (tokenAccounts.value.length === 0) {
    throw new Error('You do not own this NFT');
  }
  
  // Derive access account PDA
  const [accessAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('access'), wallet.publicKey.toBuffer(), new web3.PublicKey(nftMint).toBuffer()],
    program.programId
  );
  
  // Check if access is already granted and not expired
  try {
    const accessData = await program.account.access.fetch(accessAccount);
    if (accessData) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime < accessData.expirationTime) {
        throw new Error('Access is already granted and not expired');
      }
    }
  } catch (error) {
    // Account doesn't exist yet or access is expired, which is fine
  }
  
  // Set access expiration (30 days from now)
  const expirationTime = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
  
  return await program.methods.verifyAccess(nftMint, expirationTime).accounts({
    user: wallet.publicKey,
    nftAccount: nftAccount,
    accessAccount: accessAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}

export async function revokeAccess(nftMint: string, userToRevoke: string, wallet: any) {
  const program = getProgram(wallet);
  const web3 = require('@solana/web3.js');
  
  // Derive NFT account PDA
  const [nftAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('nft'), new web3.PublicKey(nftMint).toBuffer()],
    program.programId
  );
  
  // Check if caller owns the NFT
  const connection = new web3.Connection(web3.clusterApiUrl('testnet'), 'confirmed');
  const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
    mint: new web3.PublicKey(nftMint)
  });
  
  if (tokenAccounts.value.length === 0) {
    throw new Error('You do not own this NFT');
  }
  
  // Derive access account PDA for the user to revoke
  const [accessAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('access'), new web3.PublicKey(userToRevoke).toBuffer(), new web3.PublicKey(nftMint).toBuffer()],
    program.programId
  );
  
  // Check if access exists
  try {
    const accessData = await program.account.access.fetch(accessAccount);
    if (!accessData) {
      throw new Error('No access to revoke');
    }
  } catch (error) {
    throw new Error('No access to revoke');
  }
  
  return await program.methods.revokeAccess(nftMint, new web3.PublicKey(userToRevoke)).accounts({
    owner: wallet.publicKey,
    nftAccount: nftAccount,
    accessAccount: accessAccount,
    systemProgram: web3.SystemProgram.programId,
  }).rpc();
}
