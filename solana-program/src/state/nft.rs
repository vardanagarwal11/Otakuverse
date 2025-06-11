use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::pubkey::Pubkey;

/// NFT rarity enum
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub enum NFTRarity {
    Common,
    Rare,
    Epic,
    Legendary,
}

impl NFTRarity {
    pub fn from_str(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "common" => NFTRarity::Common,
            "rare" => NFTRarity::Rare,
            "epic" => NFTRarity::Epic,
            "legendary" => NFTRarity::Legendary,
            _ => NFTRarity::Common,
        }
    }

    pub fn to_string(&self) -> String {
        match self {
            NFTRarity::Common => "Common".to_string(),
            NFTRarity::Rare => "Rare".to_string(),
            NFTRarity::Epic => "Epic".to_string(),
            NFTRarity::Legendary => "Legendary".to_string(),
        }
    }
}

/// NFT attribute structure
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct NFTAttribute {
    pub trait_type: String,
    pub value: String,
}

/// NFT data structure
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
#[derive(BorshSerialize, BorshDeserialize)]
pub struct NFTData {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub anime_title: String,
    pub rarity: NFTRarity,
    pub is_for_sale: bool,
    /// The price of the NFT in lamports (if for sale)
    pub price: u64,
    /// The timestamp when the NFT was created
    pub created_at: i64,
    /// The creator of the NFT
    pub creator: Pubkey,
    /// The description of the NFT
    pub description: String,
    /// The collection ID this NFT belongs to (if any)
    pub collection_id: Option<Pubkey>,
    /// The attributes of the NFT
    pub attributes: Vec<NFTAttribute>,
    /// The royalty percentage for secondary sales (in basis points, e.g. 250 = 2.5%)
    pub royalty_basis_points: u16,
    /// Whether the NFT has been verified by the OtakuVerse platform
    pub is_verified: bool,
}

impl NFTData {
    /// Set the NFT for sale
    pub fn set_for_sale(&mut self, price: u64) {
        self.is_for_sale = true;
        self.price = price;
    }

    /// Remove the NFT from sale
    pub fn remove_from_sale(&mut self) {
        self.is_for_sale = false;
    }

    /// Transfer ownership of the NFT
    pub fn transfer(&mut self, new_owner: Pubkey) {
        self.owner = new_owner;
        self.is_for_sale = false;
    }

    /// Verify the NFT
    pub fn verify(&mut self) {
        self.is_verified = true;
    }

    /// Add an attribute to the NFT
    pub fn add_attribute(&mut self, trait_type: String, value: String) {
        self.attributes.push(NFTAttribute { trait_type, value });
    }

    /// Set the collection ID for the NFT
    pub fn set_collection(&mut self, collection_id: Pubkey) {
        self.collection_id = Some(collection_id);
    }

    /// Remove the NFT from a collection
    pub fn remove_from_collection(&mut self) {
        self.collection_id = None;
    }

    /// Set the royalty percentage for secondary sales
    pub fn set_royalty(&mut self, royalty_basis_points: u16) {
        // Ensure royalty is not more than 100%
        if royalty_basis_points <= 10000 {
            self.royalty_basis_points = royalty_basis_points;
        }
    }

    /// Calculate the royalty amount for a given sale price
    pub fn calculate_royalty(&self, sale_price: u64) -> u64 {
        (sale_price as u128 * self.royalty_basis_points as u128 / 10000) as u64
    }
}
impl NFTData {
    pub fn new() -> Self {
        Self {
            mint: Pubkey::default(),
            owner: Pubkey::default(),
            name: String::new(),
            symbol: String::new(),
            uri: String::new(),
            anime_title: String::new(),
            rarity: NFTRarity::Common,
            is_for_sale: false,
            price: 0,
            created_at: 0,
            creator: Pubkey::default(),
            description: String::new(),
            collection_id: None,
            attributes: vec![],
            royalty_basis_points: 0,
            is_verified: false,
        }
    }
    pub fn new_with_details(
        mint: Pubkey,
        owner: Pubkey,
        name: String,
        symbol: String,
        uri: String,
        anime_title: String,
        rarity: NFTRarity,
        creator: Pubkey,
        description: String,
        collection_id: Option<Pubkey>,
        attributes: Vec<NFTAttribute>,
        royalty_basis_points: u16,
    ) -> Self {
        Self {
            mint,
            owner,
            name,
            symbol,
            uri,
            anime_title,
            rarity,
            is_for_sale: false,
            price: 0,
            created_at: 0,
            creator,
            description,
            collection_id,
            attributes,
            royalty_basis_points,
            is_verified: false,
        }
    }
}