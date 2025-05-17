use anchor_lang::prelude::*;

/// Custom errors for the OtakuVerse program
#[error_code]
pub enum OtakuVerseError {
    /// Invalid instruction data passed
    #[msg("Invalid instruction data")]
    InvalidInstructionData,

    /// Not enough SOL to purchase NFT
    #[msg("Insufficient funds for purchase")]
    InsufficientFunds,

    /// User doesn't have permission
    #[msg("Unauthorized access")]
    Unauthorized,

    /// NFT already minted
    #[msg("NFT already exists")]
    NFTAlreadyExists,

    /// NFT not found
    #[msg("NFT not found")]
    NFTNotFound,

    /// Invalid NFT metadata
    #[msg("Invalid NFT metadata")]
    InvalidNFTMetadata,

    /// Invalid message data
    #[msg("Invalid message data")]
    InvalidMessageData,

    /// Community not found
    #[msg("Community not found")]
    CommunityNotFound,
}
