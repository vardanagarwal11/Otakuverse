use anchor_lang::prelude::*;
use crate::state::nft::{NFTAttribute, NFTRarity};

/// Instructions supported by the OtakuVerse program
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub enum OtakuVerseInstruction {
    /// Mint a new NFT as a reward for watching anime
    ///
    /// Accounts expected:
    /// 0. `[signer]` The authority account (payer)
    /// 1. `[writable]` The NFT mint account
    /// 2. `[writable]` The NFT token account
    /// 3. `[writable]` The NFT metadata account
    /// 4. `[]` The mint authority
    /// 5. `[]` The update authority
    /// 6. `[]` The system program
    /// 7. `[]` The token program
    /// 8. `[]` The token metadata program
    /// 9. `[]` The rent sysvar
    MintNFTReward {
        /// Name of the NFT
        name: String,
        /// Symbol of the NFT
        symbol: String,
        /// URI pointing to the NFT metadata
        uri: String,
        /// Anime title associated with the NFT
        anime_title: String,
        /// Rarity of the NFT (common, rare, epic, legendary)
        rarity: String,
    },

    /// Mint a new NFT with enhanced metadata
    ///
    /// Accounts expected:
    /// 0. `[signer]` The authority account (payer)
    /// 1. `[writable]` The NFT mint account
    /// 2. `[writable]` The NFT token account
    /// 3. `[writable]` The NFT metadata account
    /// 4. `[]` The mint authority
    /// 5. `[]` The update authority
    /// 6. `[]` The system program
    /// 7. `[]` The token program
    /// 8. `[]` The token metadata program
    /// 9. `[]` The rent sysvar
    MintEnhancedNFT {
        /// Name of the NFT
        name: String,
        /// Symbol of the NFT
        symbol: String,
        /// URI pointing to the NFT metadata
        uri: String,
        /// Anime title associated with the NFT
        anime_title: String,
        /// Rarity of the NFT
        rarity: NFTRarity,
        /// Description of the NFT
        description: String,
        /// Collection ID this NFT belongs to (if any)
        collection_id: Option<Pubkey>,
        /// Attributes of the NFT
        attributes: Vec<NFTAttribute>,
        /// Royalty percentage for secondary sales (in basis points)
        royalty_basis_points: u16,
    },

    /// Purchase an NFT from the marketplace
    ///
    /// Accounts expected:
    /// 0. `[signer]` The buyer account (payer)
    /// 1. `[writable]` The seller account (receiver)
    /// 2. `[writable]` The NFT mint account
    /// 3. `[writable]` The buyer's NFT token account
    /// 4. `[writable]` The seller's NFT token account
    /// 5. `[]` The system program
    /// 6. `[]` The token program
    PurchaseNFT {
        /// Price in lamports
        price: u64,
    },

    /// Update NFT metadata
    ///
    /// Accounts expected:
    /// 0. `[signer]` The owner account
    /// 1. `[writable]` The NFT metadata account
    /// 2. `[]` The NFT mint account
    UpdateNFTMetadata {
        /// New URI pointing to the NFT metadata
        uri: Option<String>,
        /// New name of the NFT
        name: Option<String>,
        /// New description of the NFT
        description: Option<String>,
        /// Attributes to add to the NFT
        attributes_to_add: Vec<NFTAttribute>,
        /// Royalty percentage for secondary sales (in basis points)
        royalty_basis_points: Option<u16>,
    },

    /// Verify an NFT
    ///
    /// Accounts expected:
    /// 0. `[signer]` The authority account (must be OtakuVerse admin)
    /// 1. `[writable]` The NFT metadata account
    /// 2. `[]` The NFT mint account
    VerifyNFT {
        /// Mint address of the NFT to verify
        mint: Pubkey,
    },

    /// List an NFT for sale
    ///
    /// Accounts expected:
    /// 0. `[signer]` The owner account
    /// 1. `[writable]` The NFT metadata account
    /// 2. `[]` The NFT mint account
    ListNFTForSale {
        /// Price in lamports
        price: u64,
    },

    /// Cancel an NFT listing
    ///
    /// Accounts expected:
    /// 0. `[signer]` The owner account
    /// 1. `[writable]` The NFT metadata account
    /// 2. `[]` The NFT mint account
    CancelNFTListing,

    /// Send a message in a community chat
    ///
    /// Accounts expected:
    /// 0. `[signer]` The sender account
    /// 1. `[writable]` The community account
    /// 2. `[writable]` The message account
    /// 3. `[]` The system program
    SendCommunityMessage {
        /// Community ID
        community_id: String,
        /// Message content
        content: String,
    },
}

/// Creates a MintNFTReward instruction
pub fn mint_nft_reward(
    program_id: &Pubkey,
    authority: &Pubkey,
    nft_mint: &Pubkey,
    nft_token: &Pubkey,
    nft_metadata: &Pubkey,
    mint_authority: &Pubkey,
    update_authority: &Pubkey,
    name: String,
    symbol: String,
    uri: String,
    anime_title: String,
    rarity: String,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new_readonly(*authority, true),
        AccountMeta::new(*nft_mint, false),
        AccountMeta::new(*nft_token, false),
        AccountMeta::new(*nft_metadata, false),
        AccountMeta::new_readonly(*mint_authority, false),
        AccountMeta::new_readonly(*update_authority, false),
        AccountMeta::new_readonly(system_program::id(), false),
        AccountMeta::new_readonly(spl_token::id(), false),
        AccountMeta::new_readonly(mpl_token_metadata::id(), false),
        AccountMeta::new_readonly(rent::id(), false),
    ];

    let instruction_data = OtakuVerseInstruction::MintNFTReward {
        name,
        symbol,
        uri,
        anime_title,
        rarity,
    };

    Instruction {
        program_id: *program_id,
        accounts,
        data: instruction_data.try_to_vec().unwrap(),
    }
}

/// Creates a PurchaseNFT instruction
pub fn purchase_nft(
    program_id: &Pubkey,
    buyer: &Pubkey,
    seller: &Pubkey,
    nft_mint: &Pubkey,
    buyer_token: &Pubkey,
    seller_token: &Pubkey,
    price: u64,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new(*buyer, true),
        AccountMeta::new(*seller, false),
        AccountMeta::new_readonly(*nft_mint, false),
        AccountMeta::new(*buyer_token, false),
        AccountMeta::new(*seller_token, false),
        AccountMeta::new_readonly(system_program::id(), false),
        AccountMeta::new_readonly(spl_token::id(), false),
    ];

    let instruction_data = OtakuVerseInstruction::PurchaseNFT { price };

    Instruction {
        program_id: *program_id,
        accounts,
        data: instruction_data.try_to_vec().unwrap(),
    }
}

/// Creates a MintEnhancedNFT instruction
pub fn mint_enhanced_nft(
    program_id: &Pubkey,
    authority: &Pubkey,
    nft_mint: &Pubkey,
    nft_token: &Pubkey,
    nft_metadata: &Pubkey,
    mint_authority: &Pubkey,
    update_authority: &Pubkey,
    name: String,
    symbol: String,
    uri: String,
    anime_title: String,
    rarity: NFTRarity,
    description: String,
    collection_id: Option<Pubkey>,
    attributes: Vec<NFTAttribute>,
    royalty_basis_points: u16,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new_readonly(*authority, true),
        AccountMeta::new(*nft_mint, false),
        AccountMeta::new(*nft_token, false),
        AccountMeta::new(*nft_metadata, false),
        AccountMeta::new_readonly(*mint_authority, false),
        AccountMeta::new_readonly(*update_authority, false),
        AccountMeta::new_readonly(system_program::id(), false),
        AccountMeta::new_readonly(spl_token::id(), false),
        AccountMeta::new_readonly(mpl_token_metadata::id(), false),
        AccountMeta::new_readonly(rent::id(), false),
    ];

    let instruction_data = OtakuVerseInstruction::MintEnhancedNFT {
        name,
        symbol,
        uri,
        anime_title,
        rarity,
        description,
        collection_id,
        attributes,
        royalty_basis_points,
    };

    Instruction {
        program_id: *program_id,
        accounts,
        data: instruction_data.try_to_vec().unwrap(),
    }
}

/// Creates an UpdateNFTMetadata instruction
pub fn update_nft_metadata(
    program_id: &Pubkey,
    owner: &Pubkey,
    nft_metadata: &Pubkey,
    nft_mint: &Pubkey,
    uri: Option<String>,
    name: Option<String>,
    description: Option<String>,
    attributes_to_add: Vec<NFTAttribute>,
    royalty_basis_points: Option<u16>,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new_readonly(*owner, true),
        AccountMeta::new(*nft_metadata, false),
        AccountMeta::new_readonly(*nft_mint, false),
    ];

    let instruction_data = OtakuVerseInstruction::UpdateNFTMetadata {
        uri,
        name,
        description,
        attributes_to_add,
        royalty_basis_points,
    };

    Instruction {
        program_id: *program_id,
        accounts,
        data: instruction_data.try_to_vec().unwrap(),
    }
}

/// Creates a VerifyNFT instruction
pub fn verify_nft(
    program_id: &Pubkey,
    authority: &Pubkey,
    nft_metadata: &Pubkey,
    nft_mint: &Pubkey,
    mint: Pubkey,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new_readonly(*authority, true),
        AccountMeta::new(*nft_metadata, false),
        AccountMeta::new_readonly(*nft_mint, false),
    ];

    let instruction_data = OtakuVerseInstruction::VerifyNFT { mint };

    Instruction {
        program_id: *program_id,
        accounts,
        data: instruction_data.try_to_vec().unwrap(),
    }
}

/// Creates a ListNFTForSale instruction
pub fn list_nft_for_sale(
    program_id: &Pubkey,
    owner: &Pubkey,
    nft_metadata: &Pubkey,
    nft_mint: &Pubkey,
    price: u64,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new_readonly(*owner, true),
        AccountMeta::new(*nft_metadata, false),
        AccountMeta::new_readonly(*nft_mint, false),
    ];

    let instruction_data = OtakuVerseInstruction::ListNFTForSale { price };

    Instruction {
        program_id: *program_id,
        accounts,
        data: instruction_data.try_to_vec().unwrap(),
    }
}

/// Creates a CancelNFTListing instruction
pub fn cancel_nft_listing(
    program_id: &Pubkey,
    owner: &Pubkey,
    nft_metadata: &Pubkey,
    nft_mint: &Pubkey,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new_readonly(*owner, true),
        AccountMeta::new(*nft_metadata, false),
        AccountMeta::new_readonly(*nft_mint, false),
    ];

    let instruction_data = OtakuVerseInstruction::CancelNFTListing;

    Instruction {
        program_id: *program_id,
        accounts,
        data: instruction_data.try_to_vec().unwrap(),
    }
}

/// Creates a SendCommunityMessage instruction
pub fn send_community_message(
    program_id: &Pubkey,
    sender: &Pubkey,
    community: &Pubkey,
    message: &Pubkey,
    community_id: String,
    content: String,
) -> Instruction {
    let accounts = vec![
        AccountMeta::new(*sender, true),
        AccountMeta::new(*community, false),
        AccountMeta::new(*message, false),
        AccountMeta::new_readonly(system_program::id(), false),
    ];

    let instruction_data = OtakuVerseInstruction::SendCommunityMessage {
        community_id,
        content,
    };

    Instruction {
        program_id: *program_id,
        accounts,
        data: instruction_data.try_to_vec().unwrap(),
    }
}
