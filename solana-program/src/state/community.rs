use anchor_lang::prelude::*;

/// Community data structure
#[account]
#[derive(Debug)]
pub struct CommunityData {
    /// The unique ID of the community
    pub id: String,
    /// The name of the community
    pub name: String,
    /// The description of the community
    pub description: String,
    /// The creator of the community
    pub creator: Pubkey,
    /// The timestamp when the community was created
    pub created_at: i64,
}

/// Message data structure
#[account]
#[derive(Debug)]
pub struct MessageData {
    /// The community ID this message belongs to
    pub community_id: String,
    /// The sender of the message
    pub sender: Pubkey,
    /// The content of the message
    pub content: String,
    /// The timestamp when the message was sent
    pub sent_at: i64,
}
