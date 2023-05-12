use ulid::Ulid;
use serde::{Deserialize, Serialize};

use crate::encounters::Character;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum CharacterCommand {
    UpdateName { id: Ulid, name: String },
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum CharacterCommandResponse {
    UpdatedCharacter(Character),
}

impl CharacterCommandResponse {
    pub fn updated(character: &Character) -> Self {
        Self::UpdatedCharacter(character.clone())
    }
}