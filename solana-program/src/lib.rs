#![cfg(not(feature = "nspl_tokentrypoint"))]

pub mod error;
pub mod instruction;
pub mod processor;
pub mod state {
    pub mod nft;
    pub mod community;
    pub mod r#mod;
}

use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    processor::process_instruction(program_id, accounts, instruction_data)
}
