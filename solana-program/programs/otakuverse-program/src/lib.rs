use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("6XC7XVUWDQCLPGuJusuVRUnSuWLHFBLw8fDD7srCVAxE");

#[program]
pub mod otakuverse_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.authority = ctx.accounts.authority.key();
        global_state.total_nfts_minted = 0;
        global_state.total_staked = 0;
        global_state.total_proposals = 0;
        global_state.total_events = 0;
        Ok(())
    }

    pub fn stake_nft(ctx: Context<StakeNft>, nft_mint: Pubkey) -> Result<()> {
        let staking_account = &mut ctx.accounts.staking_account;
        let clock = Clock::get()?;
        
        staking_account.staker = ctx.accounts.staker.key();
        staking_account.nft_mint = nft_mint;
        staking_account.staked_at = clock.unix_timestamp;
        staking_account.reward_accrued = 0;
        staking_account.is_active = true;

        // Transfer NFT to program
        let cpi_accounts = token::Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.program_token_account.to_account_info(),
            authority: ctx.accounts.staker.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, 1)?;

        Ok(())
    }

    pub fn unstake_nft(ctx: Context<UnstakeNft>) -> Result<()> {
        let staking_account = &mut ctx.accounts.staking_account;
        let clock = Clock::get()?;
        
        require!(staking_account.is_active, ErrorCode::NFTNotStaked);
        
        // Calculate rewards (1 token per day staked)
        let staking_duration = clock.unix_timestamp - staking_account.staked_at;
        let days_staked = staking_duration / 86400; // seconds in a day
        let rewards = days_staked as u64;
        
        staking_account.reward_accrued += rewards;
        staking_account.is_active = false;

        // Transfer NFT back to user
        let seeds = &[
            b"program_authority",
            &[ctx.bumps.program_authority],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = token::Transfer {
            from: ctx.accounts.program_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.program_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, 1)?;

        Ok(())
    }

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal_account;
        let clock = Clock::get()?;
        
        proposal.id = ctx.accounts.global_state.total_proposals;
        proposal.creator = ctx.accounts.creator.key();
        proposal.title = title;
        proposal.description = description;
        proposal.created_at = clock.unix_timestamp;
        proposal.for_votes = 0;
        proposal.against_votes = 0;
        proposal.status = 0; // Active

        ctx.accounts.global_state.total_proposals += 1;

        Ok(())
    }

    pub fn vote_on_proposal(
        ctx: Context<VoteOnProposal>,
        proposal_id: u64,
        support: bool,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal_account;
        let vote = &mut ctx.accounts.vote_account;
        let clock = Clock::get()?;

        require!(proposal.status == 0, ErrorCode::ProposalNotActive);

        vote.proposal_id = proposal_id;
        vote.voter = ctx.accounts.voter.key();
        vote.support = support;
        vote.timestamp = clock.unix_timestamp;

        if support {
            proposal.for_votes += 1;
        } else {
            proposal.against_votes += 1;
        }

        Ok(())
    }

    pub fn finalize_proposal(ctx: Context<FinalizeProposal>, proposal_id: u64) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal_account;
        
        require!(proposal.status == 0, ErrorCode::ProposalNotActive);
        
        // Simple majority rule
        if proposal.for_votes > proposal.against_votes {
            proposal.status = 1; // Passed
        } else {
            proposal.status = 2; // Rejected
        }

        Ok(())
    }

    pub fn create_event(
        ctx: Context<CreateEvent>,
        event_id: u64,
        community_id: String,
        title: String,
        description: String,
        timestamp: i64,
    ) -> Result<()> {
        let event = &mut ctx.accounts.event_account;
        
        event.id = event_id;
        event.community_id = community_id;
        event.creator = ctx.accounts.creator.key();
        event.title = title;
        event.description = description;
        event.timestamp = timestamp;
        event.status = 0; // Active
        event.max_participants = 100;
        event.current_participants = 0;

        ctx.accounts.global_state.total_events += 1;

        Ok(())
    }

    pub fn rsvp_event(ctx: Context<RsvpEvent>, event_id: u64) -> Result<()> {
        let event = &mut ctx.accounts.event_account;
        let rsvp = &mut ctx.accounts.rsvp_account;
        let clock = Clock::get()?;

        require!(event.status == 0, ErrorCode::EventNotActive);
        require!(
            event.current_participants < event.max_participants,
            ErrorCode::EventFull
        );

        rsvp.event_id = event_id;
        rsvp.user = ctx.accounts.user.key();
        rsvp.timestamp = clock.unix_timestamp;

        event.current_participants += 1;

        Ok(())
    }

    pub fn mint_badge(
        ctx: Context<MintBadge>,
        badge_id: u64,
        name: String,
        description: String,
    ) -> Result<()> {
        let badge = &mut ctx.accounts.badge_account;
        let clock = Clock::get()?;
        
        badge.id = badge_id;
        badge.name = name;
        badge.description = description;
        badge.minted_at = clock.unix_timestamp;

        Ok(())
    }

    pub fn verify_access(
        ctx: Context<VerifyAccess>,
        nft_mint: Pubkey,
        expiration_time: i64,
    ) -> Result<()> {
        let access = &mut ctx.accounts.access_account;
        let clock = Clock::get()?;
        
        access.user = ctx.accounts.user.key();
        access.nft_mint = nft_mint;
        access.granted_at = clock.unix_timestamp;
        access.expiration_time = expiration_time;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + GlobalState::INIT_SPACE,
        seeds = [b"global_state"],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeNft<'info> {
    #[account(
        init,
        payer = staker,
        space = 8 + StakingAccount::INIT_SPACE,
        seeds = [b"staking", staker.key().as_ref(), nft_mint.key().as_ref()],
        bump
    )]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub staker: Signer<'info>,
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = staker,
        associated_token::mint = nft_mint,
        associated_token::authority = program_authority
    )]
    pub program_token_account: Account<'info, TokenAccount>,
    /// CHECK: PDA authority for the program
    #[account(
        seeds = [b"program_authority"],
        bump
    )]
    pub program_authority: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnstakeNft<'info> {
    #[account(
        mut,
        seeds = [b"staking", staker.key().as_ref(), nft_mint.key().as_ref()],
        bump,
        has_one = staker
    )]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(mut)]
    pub staker: Signer<'info>,
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub program_token_account: Account<'info, TokenAccount>,
    /// CHECK: PDA authority for the program
    #[account(
        seeds = [b"program_authority"],
        bump
    )]
    pub program_authority: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Proposal::INIT_SPACE,
        seeds = [b"proposal", global_state.total_proposals.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal_account: Account<'info, Proposal>,
    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct VoteOnProposal<'info> {
    #[account(
        mut,
        seeds = [b"proposal", proposal_id.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal_account: Account<'info, Proposal>,
    #[account(
        init,
        payer = voter,
        space = 8 + Vote::INIT_SPACE,
        seeds = [b"vote", voter.key().as_ref(), proposal_id.to_le_bytes().as_ref()],
        bump
    )]
    pub vote_account: Account<'info, Vote>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(proposal_id: u64)]
pub struct FinalizeProposal<'info> {
    #[account(
        mut,
        seeds = [b"proposal", proposal_id.to_le_bytes().as_ref()],
        bump
    )]
    pub proposal_account: Account<'info, Proposal>,
    pub finalizer: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(event_id: u64)]
pub struct CreateEvent<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Event::INIT_SPACE,
        seeds = [b"event", event_id.to_le_bytes().as_ref()],
        bump
    )]
    pub event_account: Account<'info, Event>,
    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(event_id: u64)]
pub struct RsvpEvent<'info> {
    #[account(
        mut,
        seeds = [b"event", event_id.to_le_bytes().as_ref()],
        bump
    )]
    pub event_account: Account<'info, Event>,
    #[account(
        init,
        payer = user,
        space = 8 + RSVP::INIT_SPACE,
        seeds = [b"rsvp", user.key().as_ref(), event_id.to_le_bytes().as_ref()],
        bump
    )]
    pub rsvp_account: Account<'info, RSVP>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(badge_id: u64)]
pub struct MintBadge<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Badge::INIT_SPACE,
        seeds = [b"badge", badge_id.to_le_bytes().as_ref()],
        bump
    )]
    pub badge_account: Account<'info, Badge>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyAccess<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Access::INIT_SPACE,
        seeds = [b"access", user.key().as_ref(), nft_mint.key().as_ref()],
        bump
    )]
    pub access_account: Account<'info, Access>,
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct GlobalState {
    pub authority: Pubkey,
    pub total_nfts_minted: u64,
    pub total_staked: u64,
    pub total_proposals: u64,
    pub total_events: u64,
}

#[account]
#[derive(InitSpace)]
pub struct StakingAccount {
    pub staker: Pubkey,
    pub nft_mint: Pubkey,
    pub staked_at: i64,
    pub reward_accrued: u64,
    pub is_active: bool,
}

#[account]
#[derive(InitSpace)]
pub struct Proposal {
    pub id: u64,
    pub creator: Pubkey,
    #[max_len(100)]
    pub title: String,
    #[max_len(1000)]
    pub description: String,
    pub created_at: i64,
    pub for_votes: u64,
    pub against_votes: u64,
    pub status: u8, // 0: Active, 1: Passed, 2: Rejected
}

#[account]
#[derive(InitSpace)]
pub struct Vote {
    pub proposal_id: u64,
    pub voter: Pubkey,
    pub support: bool,
    pub timestamp: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Event {
    pub id: u64,
    #[max_len(50)]
    pub community_id: String,
    pub creator: Pubkey,
    #[max_len(100)]
    pub title: String,
    #[max_len(1000)]
    pub description: String,
    pub timestamp: i64,
    pub status: u8, // 0: Active, 1: Completed, 2: Cancelled
    pub max_participants: u32,
    pub current_participants: u32,
}

#[account]
#[derive(InitSpace)]
pub struct RSVP {
    pub event_id: u64,
    pub user: Pubkey,
    pub timestamp: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Badge {
    pub id: u64,
    #[max_len(50)]
    pub name: String,
    #[max_len(200)]
    pub description: String,
    pub minted_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Access {
    pub user: Pubkey,
    pub nft_mint: Pubkey,
    pub granted_at: i64,
    pub expiration_time: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("NFT is not staked")]
    NFTNotStaked,
    #[msg("Proposal is not active")]
    ProposalNotActive,
    #[msg("Event is not active")]
    EventNotActive,
    #[msg("Event is full")]
    EventFull,
    #[msg("Unauthorized access")]
    Unauthorized,
}