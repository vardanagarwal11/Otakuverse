use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::pubkey::Pubkey;

/// Community data structure
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct CommunityData {
    pub id: String,
    pub name: String,
    pub description: String,
    pub creator: Pubkey,
    pub created_at: i64,
}

impl CommunityData {
    pub fn unpack_from_slice(input: &[u8]) -> Result<Self, solana_program::program_error::ProgramError> {
        Self::try_from_slice(input).map_err(|_| solana_program::program_error::ProgramError::InvalidAccountData)
    }
}

/// Message data structure
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct MessageData {
    pub community_id: String,
    pub sender: Pubkey,
    pub content: String,
    pub sent_at: i64,
}
