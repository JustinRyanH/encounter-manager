use ulid::Ulid;
use serde::{Deserialize, Serialize};

use crate::encounters::Character;

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum CharacterCommand {
    UpdateName { id: Ulid, name: String },
    UpdateInitiative { id: Ulid, initiative: i32 },
    UpdateInitiativeModifier { id: Ulid, modifier: i32 },
    UpdateCurrentHp { id: Ulid, hp: i32 },
    UpdateTotalHp { id: Ulid, hp: i32 },
    UpdateTemporaryHp { id: Ulid, hp: i32 },
    Heal { id: Ulid, hp: i32 },
    Damage { id: Ulid, hp: i32 },
}

impl CharacterCommand {
    pub fn id(&self) -> Ulid {
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
pub enum CharacterCommandResponse {
    UpdatedCharacter(Character),
}

impl CharacterCommandResponse {
    pub fn updated(character: &Character) -> Self {
        Self::UpdatedCharacter(character.clone())
    }
}