import { PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';

export interface StakingAccount {
  staker: PublicKey;
  nftMint: PublicKey;
  stakedAt: number;
  rewardAccrued: number;
  isActive: boolean;
}

export interface Listing {
  seller: PublicKey;
  nftMint: PublicKey;
  price: number;
  createdAt: number;
}

export interface VotingPower {
  user: PublicKey;
  amount: number;
  lastUpdated: number;
}

export interface Proposal {
  id: number;
  creator: PublicKey;
  title: string;
  description: string;
  createdAt: number;
  forVotes: number;
  againstVotes: number;
  status: number;
}

export interface Vote {
  proposalId: number;
  voter: PublicKey;
  support: boolean;
  timestamp: number;
}

export interface Trade {
  id: number;
  initiator: PublicKey;
  counterparty: PublicKey;
  initiatorNft: PublicKey;
  counterpartyNft: PublicKey;
  status: number;
  expirationTime: number;
}

export interface Event {
  id: number;
  communityId: string;
  creator: PublicKey;
  title: string;
  description: string;
  timestamp: number;
  status: number;
  maxParticipants: number;
  currentParticipants: number;
}

export interface RSVP {
  eventId: number;
  user: PublicKey;
  timestamp: number;
}

export interface Membership {
  user: PublicKey;
  communityId: string;
  isActive: boolean;
  canCreateEvents: boolean;
  joinedAt: number;
}

export interface Access {
  user: PublicKey;
  nftMint: PublicKey;
  grantedAt: number;
  expirationTime: number;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  mintedAt: number;
}

export interface Reward {
  user: PublicKey;
  amount: number;
  lastRewardedAt: number;
}

export interface OtakuVerseProgram {
  programId: PublicKey;
  provider: AnchorProvider;
  account: {
    staking: {
      fetch: (publicKey: PublicKey) => Promise<StakingAccount>;
    };
    listing: {
      fetch: (publicKey: PublicKey) => Promise<Listing>;
    };
    votingPower: {
      fetch: (publicKey: PublicKey) => Promise<VotingPower>;
    };
    proposal: {
      fetch: (publicKey: PublicKey) => Promise<Proposal>;
    };
    vote: {
      fetch: (publicKey: PublicKey) => Promise<Vote>;
    };
    trade: {
      fetch: (publicKey: PublicKey) => Promise<Trade>;
    };
    event: {
      fetch: (publicKey: PublicKey) => Promise<Event>;
    };
    rsvp: {
      fetch: (publicKey: PublicKey) => Promise<RSVP>;
    };
    membership: {
      fetch: (publicKey: PublicKey) => Promise<Membership>;
    };
    access: {
      fetch: (publicKey: PublicKey) => Promise<Access>;
    };
    badge: {
      fetch: (publicKey: PublicKey) => Promise<Badge>;
    };
    reward: {
      fetch: (publicKey: PublicKey) => Promise<Reward>;
    };
  };
  methods: {
    stakeNft: any;
    unstakeNft: any;
    createProposal: any;
    voteOnProposal: any;
    finalizeProposal: any;
    initiateTrade: any;
    acceptTrade: any;
    cancelTrade: any;
    createEvent: any;
    rsvpEvent: any;
    cancelEvent: any;
    verifyAccess: any;
    revokeAccess: any;
    mintBadge: any;
    rewardUser: any;
  };
} 