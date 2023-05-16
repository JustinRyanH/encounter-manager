use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::encounters::Character;

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum CharacterCommand {
    UpdateName { id: Uuid, name: String },
    UpdateInitiative { id: Uuid, initiative: i32 },
    UpdateInitiativeModifier { id: Uuid, modifier: i32 },
    UpdateCurrentHp { id: Uuid, hp: i32 },
    UpdateTotalHp { id: Uuid, hp: i32 },
    UpdateTemporaryHp { id: Uuid, hp: i32 },
    Heal { id: Uuid, hp: i32 },
    Damage { id: Uuid, hp: i32 },
}

impl CharacterCommand {
    pub fn id(&self) -> Uuid {
        match self {
            CharacterCommand::UpdateName { id, .. } => { *id }
            CharacterCommand::UpdateInitiative { id, .. } => { *id }
            CharacterCommand::UpdateInitiativeModifier { id, .. } => { *id }
            CharacterCommand::UpdateCurrentHp { id, .. } => { *id }
            CharacterCommand::UpdateTotalHp { id, .. } => { *id }
            CharacterCommand::UpdateTemporaryHp { id, .. } => { *id }
            CharacterCommand::Heal { id, .. } => { *id }
            CharacterCommand::Damage { id, .. } => { *id }
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum FrontendMessageType {
    Success,
    Error,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct FrontendMessage {
    #[serde(rename = "type")]
    pub message_type: FrontendMessageType,
    pub message: String,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct CharacterChangeMessages {
    pub name: Option<Vec<FrontendMessage>>,
    pub initiative: Option<Vec<FrontendMessage>>,
    pub hp: Option<Vec<FrontendMessage>>,
}

impl CharacterChangeMessages {
    pub fn none() -> Self {
        Self {
            name: None,
            initiative: None,
            hp: None,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum CharacterCommandResponse {
    UpdatedCharacter {
        character: Character,
        messages: CharacterChangeMessages,
    },
}

impl CharacterCommandResponse {
    pub fn updated(character: &Character) -> Self {
        Self::UpdatedCharacter { character: character.clone(), messages: CharacterChangeMessages::none() }
    }
}