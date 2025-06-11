use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub enum OtakuVerseError {
    InvalidInstructionData,
    InsufficientFunds,
    Unauthorized,
    NFTAlreadyExists,
    NFTNotFound,
    InvalidNFTMetadata,
    InvalidMessageData,
    CommunityNotFound,
}

impl From<OtakuVerseError> for ProgramError {
    fn from(e: OtakuVerseError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
