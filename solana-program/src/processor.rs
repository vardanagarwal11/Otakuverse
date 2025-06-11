use borsh::BorshDeserialize;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{clock::Clock, rent::Rent, Sysvar},
};
use spl_token::instruction as token_instruction;
use mpl_token_metadata::instruction as metadata_instruction;
// Ensure these are imported for clarity
use spl_token;
use mpl_token_metadata;

use crate::{
    error::OtakuVerseError,
    instruction::OtakuVerseInstruction,
    state::{
        nft::{NFTData, NFTAttribute, NFTRarity},
        community::{CommunityData, MessageData},
    },
};

/// Process the instruction
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = OtakuVerseInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        OtakuVerseInstruction::MintNFTReward {
            name,
            symbol,
            uri,
            anime_title,
            rarity,
        } => process_mint_nft_reward(program_id, accounts, name, symbol, uri, anime_title, rarity),
        OtakuVerseInstruction::MintEnhancedNFT {
            name,
            symbol,
            uri,
            anime_title,
            rarity,
            description,
            collection_id,
            attributes,
            royalty_basis_points,
        } => process_mint_enhanced_nft(
            program_id,
            accounts,
            name,
            symbol,
            uri,
            anime_title,
            rarity,
            description,
            collection_id,
            attributes,
            royalty_basis_points,
        ),
        OtakuVerseInstruction::PurchaseNFT { price } => {
            process_purchase_nft(program_id, accounts, price)
        }
        OtakuVerseInstruction::UpdateNFTMetadata {
            uri,
            name,
            description,
            attributes_to_add,
            royalty_basis_points,
        } => process_update_nft_metadata(
            program_id,
            accounts,
            uri,
            name,
            description,
            attributes_to_add,
            royalty_basis_points,
        ),
        OtakuVerseInstruction::VerifyNFT { mint } => {
            process_verify_nft(program_id, accounts, mint)
        }
        OtakuVerseInstruction::ListNFTForSale { price } => {
            process_list_nft_for_sale(program_id, accounts, price)
        }
        OtakuVerseInstruction::CancelNFTListing => {
            process_cancel_nft_listing(program_id, accounts)
        }
        OtakuVerseInstruction::SendCommunityMessage {
            community_id,
            content,
        } => process_send_community_message(program_id, accounts, community_id, content),
    }
}

/// Process MintNFTReward instruction
fn process_mint_nft_reward(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    name: String,
    symbol: String,
    uri: String,
    anime_title: String,
    rarity: String,
) -> ProgramResult {
    msg!("Processing MintNFTReward instruction");

    // Get accounts
    let account_info_iter = &mut accounts.iter();
    let authority_info = next_account_info(account_info_iter)?;
    let nft_mint_info = next_account_info(account_info_iter)?;
    let nft_token_info = next_account_info(account_info_iter)?;
    let nft_metadata_info = next_account_info(account_info_iter)?;
    let mint_authority_info = next_account_info(account_info_iter)?;
    let update_authority_info = next_account_info(account_info_iter)?;
    let system_program_info = next_account_info(account_info_iter)?;
    let token_program_info = next_account_info(account_info_iter)?;
    let token_metadata_program_info = next_account_info(account_info_iter)?;
    let rent_info = next_account_info(account_info_iter)?;

    // Verify the authority is a signer
    if !authority_info.is_signer {
        return Err(OtakuVerseError::Unauthorized.into());
    }

    // Create mint account
    let rent = Rent::from_account_info(rent_info)?;
    let mint_rent = rent.minimum_balance(spl_token::state::Mint::LEN);

    invoke(
        &system_instruction::create_account(
            authority_info.key,
            nft_mint_info.key,
            mint_rent,
            spl_token::state::Mint::LEN as u64,
            spl_token::id(),
        ),
        &[authority_info.clone(), nft_mint_info.clone()],
    )?;

    // Initialize mint
    invoke(
        &token_instruction::initialize_mint(
            spl_token::id(),
            nft_mint_info.key,
            mint_authority_info.key,
            Some(update_authority_info.key),
            0,
        )?,
        &[
            nft_mint_info.clone(),
            rent_info.clone(),
            token_program_info.clone(),
        ],
    )?;

    // Create token account
    invoke(
        &spl_associated_token_account::instruction::create_associated_token_account(
            authority_info.key,
            authority_info.key,
            nft_mint_info.key,
        ),
        &[
            authority_info.clone(),
            nft_token_info.clone(),
            authority_info.clone(),
            nft_mint_info.clone(),
            system_program_info.clone(),
            token_program_info.clone(),
        ],
    )?;

    // Mint token
    invoke(
        &token_instruction::mint_to(
            spl_token::id(),
            nft_mint_info.key,
            nft_token_info.key,
            mint_authority_info.key,
            &[],
            1,
        )?,
        &[
            nft_mint_info.clone(),
            nft_token_info.clone(),
            mint_authority_info.clone(),
            token_program_info.clone(),
        ],
    )?;

    // Create metadata
    invoke(
        &metadata_instruction::create_metadata_accounts_v3(
            *token_metadata_program_info.key,
            *nft_metadata_info.key,
            *nft_mint_info.key,
            *mint_authority_info.key,
            *authority_info.key,
            *update_authority_info.key,
            name,
            symbol,
            uri,
            None,
            0,
            true,
            true,
            None,
            None,
            None,
        ),
        &[
            nft_metadata_info.clone(),
            nft_mint_info.clone(),
            mint_authority_info.clone(),
            authority_info.clone(),
            update_authority_info.clone(),
            system_program_info.clone(),
            rent_info.clone(),
            token_metadata_program_info.clone(),
        ],
    )?;

    // Get the current timestamp
    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;

    // Create NFT data
    let nft_data = Box::new(NFTData::new(
        *nft_mint_info.key,
        *authority_info.key,
        name,
        symbol,
        uri,
        anime_title,
        rarity,
        0,
        current_timestamp,
    ));

    // Store NFT data (in a real implementation, this would be stored on-chain)
    // For simplicity, we're just logging it here
    msg!("NFT minted successfully: {:?}", nft_data);

    Ok(())
}

/// Process PurchaseNFT instruction
fn process_purchase_nft(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    price: u64,
) -> ProgramResult {
    msg!("Processing PurchaseNFT instruction");

    // Get accounts
    let account_info_iter = &mut accounts.iter();
    let buyer_info = next_account_info(account_info_iter)?;
    let seller_info = next_account_info(account_info_iter)?;
    let nft_mint_info = next_account_info(account_info_iter)?;
    let buyer_token_info = next_account_info(account_info_iter)?;
    let seller_token_info = next_account_info(account_info_iter)?;
    let system_program_info = next_account_info(account_info_iter)?;
    let token_program_info = next_account_info(account_info_iter)?;

    // Verify the buyer is a signer
    if !buyer_info.is_signer {
        return Err(OtakuVerseError::Unauthorized.into());
    }

    // Transfer SOL from buyer to seller
    invoke(
        &system_instruction::transfer(buyer_info.key, seller_info.key, price),
        &[
            buyer_info.clone(),
            seller_info.clone(),
            system_program_info.clone(),
        ],
    )?;

    // Transfer NFT from seller to buyer
    invoke(
        &token_instruction::transfer(
            spl_token::id(),
            seller_token_info.key,
            buyer_token_info.key,
            seller_info.key,
            &[],
            1,
        )?,
        &[
            seller_token_info.clone(),
            buyer_token_info.clone(),
            seller_info.clone(),
            token_program_info.clone(),
        ],
    )?;

    msg!("NFT purchased successfully");

    Ok(())
}

/// Process MintEnhancedNFT instruction
fn process_mint_enhanced_nft(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    name: String,
    symbol: String,
    uri: String,
    anime_title: String,
    rarity: NFTRarity,
    description: String,
    collection_id: Option<Pubkey>,
    attributes: Vec<NFTAttribute>,
    royalty_basis_points: u16,
) -> ProgramResult {
    msg!("Processing MintEnhancedNFT instruction");

    // Get accounts
    let account_info_iter = &mut accounts.iter();
    let authority_info = next_account_info(account_info_iter)?;
    let nft_mint_info = next_account_info(account_info_iter)?;
    let nft_token_info = next_account_info(account_info_iter)?;
    let nft_metadata_info = next_account_info(account_info_iter)?;
    let mint_authority_info = next_account_info(account_info_iter)?;
    let update_authority_info = next_account_info(account_info_iter)?;
    let system_program_info = next_account_info(account_info_iter)?;
    let token_program_info = next_account_info(account_info_iter)?;
    let token_metadata_program_info = next_account_info(account_info_iter)?;
    let rent_info = next_account_info(account_info_iter)?;

    // Verify the authority is a signer
    if !authority_info.is_signer {
        return Err(OtakuVerseError::Unauthorized.into());
    }

    // Create mint account
    let rent = Rent::from_account_info(rent_info)?;
    let mint_rent = rent.minimum_balance(spl_token::state::Mint::LEN);

    invoke(
        &system_instruction::create_account(
            authority_info.key,
            nft_mint_info.key,
            mint_rent,
            spl_token::state::Mint::LEN as u64,
            spl_token::id(),
        ),
        &[authority_info.clone(), nft_mint_info.clone()],
    )?;

    // Initialize mint
    invoke(
        &token_instruction::initialize_mint(
            spl_token::id(),
            nft_mint_info.key,
            mint_authority_info.key,
            Some(update_authority_info.key),
            0,
        )?,
        &[
            nft_mint_info.clone(),
            rent_info.clone(),
            token_program_info.clone(),
        ],
    )?;

    // Create token account
    invoke(
        &spl_associated_token_account::instruction::create_associated_token_account(
            authority_info.key,
            authority_info.key,
            nft_mint_info.key,
        ),
        &[
            authority_info.clone(),
            nft_token_info.clone(),
            authority_info.clone(),
            nft_mint_info.clone(),
            system_program_info.clone(),
            token_program_info.clone(),
        ],
    )?;

    // Mint token
    invoke(
        &token_instruction::mint_to(
            spl_token::id(),
            nft_mint_info.key,
            nft_token_info.key,
            mint_authority_info.key,
            &[],
            1,
        )?,
        &[
            nft_mint_info.clone(),
            nft_token_info.clone(),
            mint_authority_info.clone(),
            token_program_info.clone(),
        ],
    )?;

    // Create metadata
    // Convert royalty basis points to creators share
    let creators_share = royalty_basis_points / 100;

    // Create metadata with royalties
    let creators = vec![
        mpl_token_metadata::state::Creator {
            address: *authority_info.key,
            verified: true,
            share: creators_share,
        },
    ];

    invoke(
        &metadata_instruction::create_metadata_accounts_v3(
            *token_metadata_program_info.key,
            *nft_metadata_info.key,
            *nft_mint_info.key,
            *mint_authority_info.key,
            *authority_info.key,
            *update_authority_info.key,
            name.clone(),
            symbol.clone(),
            uri.clone(),
            Some(creators),
            royalty_basis_points,
            true,
            true,
            None,
            None,
            None,
        ),
        &[
            nft_metadata_info.clone(),
            nft_mint_info.clone(),
            mint_authority_info.clone(),
            authority_info.clone(),
            update_authority_info.clone(),
            system_program_info.clone(),
            rent_info.clone(),
            token_metadata_program_info.clone(),
        ],
    )?;

    // Get the current timestamp
    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;

    // Create NFT data with enhanced metadata
    let nft_data = Box::new(NFTData::new_with_details(
        *nft_mint_info.key,
        *authority_info.key,
        name,
        symbol,
        uri,
        anime_title,
        rarity,
        0,
        current_timestamp,
        *authority_info.key,
        description,
        collection_id,
        attributes,
        royalty_basis_points,
        false, // Not verified by default
    ));

    // Store NFT data (in a real implementation, this would be stored on-chain)
    // For simplicity, we're just logging it here
    msg!("Enhanced NFT minted successfully: {:?}", nft_data);

    Ok(())
}

/// Process UpdateNFTMetadata instruction
fn process_update_nft_metadata(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    uri: Option<String>,
    name: Option<String>,
    description: Option<String>,
    attributes_to_add: Vec<NFTAttribute>,
    royalty_basis_points: Option<u16>,
) -> ProgramResult {
    msg!("Processing UpdateNFTMetadata instruction");

    // Get accounts
    let account_info_iter = &mut accounts.iter();
    let owner_info = next_account_info(account_info_iter)?;
    let nft_metadata_info = next_account_info(account_info_iter)?;
    let nft_mint_info = next_account_info(account_info_iter)?;

    // Verify the owner is a signer
    if !owner_info.is_signer {
        return Err(OtakuVerseError::Unauthorized.into());
    }

    // In a real implementation, we would:
    // 1. Fetch the NFT data from the account
    // 2. Verify the owner is the actual owner of the NFT
    // 3. Update the metadata
    // 4. Store the updated metadata

    // For simplicity, we'll just log the update
    msg!("NFT metadata updated successfully");
    msg!("URI: {:?}", uri);
    msg!("Name: {:?}", name);
    msg!("Description: {:?}", description);
    msg!("Attributes to add: {:?}", attributes_to_add);
    msg!("Royalty basis points: {:?}", royalty_basis_points);

    Ok(())
}

/// Process VerifyNFT instruction
fn process_verify_nft(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    mint: Pubkey,
) -> ProgramResult {
    msg!("Processing VerifyNFT instruction");

    // Get accounts
    let account_info_iter = &mut accounts.iter();
    let authority_info = next_account_info(account_info_iter)?;
    let nft_metadata_info = next_account_info(account_info_iter)?;
    let nft_mint_info = next_account_info(account_info_iter)?;

    // Verify the authority is a signer
    if !authority_info.is_signer {
        return Err(OtakuVerseError::Unauthorized.into());
    }

    // In a real implementation, we would:
    // 1. Verify the authority is an OtakuVerse admin
    // 2. Fetch the NFT data from the account
    // 3. Verify the mint address matches
    // 4. Set the NFT as verified
    // 5. Store the updated NFT data

    // For simplicity, we'll just log the verification
    msg!("NFT verified successfully: {}", mint);

    Ok(())
}

/// Process ListNFTForSale instruction
fn process_list_nft_for_sale(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    price: u64,
) -> ProgramResult {
    msg!("Processing ListNFTForSale instruction");

    // Get accounts
    let account_info_iter = &mut accounts.iter();
    let owner_info = next_account_info(account_info_iter)?;
    let nft_metadata_info = next_account_info(account_info_iter)?;
    let nft_mint_info = next_account_info(account_info_iter)?;

    // Verify the owner is a signer
    if !owner_info.is_signer {
        return Err(OtakuVerseError::Unauthorized.into());
    }

    // In a real implementation, we would:
    // 1. Fetch the NFT data from the account
    // 2. Verify the owner is the actual owner of the NFT
    // 3. Set the NFT for sale with the specified price
    // 4. Store the updated NFT data

    // For simplicity, we'll just log the listing
    msg!("NFT listed for sale successfully");
    msg!("Price: {} lamports", price);

    Ok(())
}

/// Process CancelNFTListing instruction
fn process_cancel_nft_listing(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    msg!("Processing CancelNFTListing instruction");

    // Get accounts
    let account_info_iter = &mut accounts.iter();
    let owner_info = next_account_info(account_info_iter)?;
    let nft_metadata_info = next_account_info(account_info_iter)?;
    let nft_mint_info = next_account_info(account_info_iter)?;

    // Verify the owner is a signer
    if !owner_info.is_signer {
        return Err(OtakuVerseError::Unauthorized.into());
    }

    // In a real implementation, we would:
    // 1. Fetch the NFT data from the account
    // 2. Verify the owner is the actual owner of the NFT
    // 3. Remove the NFT from sale
    // 4. Store the updated NFT data
    // NOTE: If you encounter stack overflow errors, box large arrays/structs to reduce stack usage.

    // For simplicity, we'll just log the cancellation
    msg!("NFT listing cancelled successfully");

    Ok(())
}

/// Process SendCommunityMessage instruction
fn process_send_community_message(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    community_id: String,
    content: String,
) -> ProgramResult {
    msg!("Processing SendCommunityMessage instruction");

    // Get accounts
    let account_info_iter = &mut accounts.iter();
    let sender_info = next_account_info(account_info_iter)?;
    let community_info = next_account_info(account_info_iter)?;
    let message_info = next_account_info(account_info_iter)?;
    let system_program_info = next_account_info(account_info_iter)?;

    // Verify the sender is a signer
    if !sender_info.is_signer {
        return Err(OtakuVerseError::Unauthorized.into());
    }

    // Verify the community exists
    let community_data = CommunityData::unpack_from_slice(&community_info.data.borrow())
        .map_err(|_| OtakuVerseError::CommunityNotFound)?;

    if community_data.id != community_id {
        return Err(OtakuVerseError::CommunityNotFound.into());
    }

    // Get the current timestamp
    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;

    // Create message data
    let message_data = MessageData {
        
        community_id,
        sender: *sender_info.key,
        content,
        sent_at: current_timestamp,
    };

    // Store message data (in a real implementation, this would be stored on-chain)
    // For simplicity, we're just logging it here
    msg!("Message sent successfully: {:?}", message_data);

    Ok(())
}
