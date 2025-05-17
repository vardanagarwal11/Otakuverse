use anchor_lang::prelude::*;

declare_id!("6WVQUSeRZPpZDukYxKc1gLjG1hRtUMHCGpvoC7vsEFw1");

#[program]
pub mod otakuverse_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("OtakuVerse program initialized!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
