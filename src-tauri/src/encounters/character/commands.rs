use serde::{Deserialize, Serialize};
use specta::Type;
use uuid::Uuid;

use crate::encounters::Character;

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Type)]
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
            CharacterCommand::UpdateName { id, .. } => *id,
            CharacterCommand::UpdateInitiative { id, .. } => *id,
            CharacterCommand::UpdateInitiativeModifier { id, .. } => *id,
            CharacterCommand::UpdateCurrentHp { id, .. } => *id,
            CharacterCommand::UpdateTotalHp { id, .. } => *id,
            CharacterCommand::UpdateTemporaryHp { id, .. } => *id,
            CharacterCommand::Heal { id, .. } => *id,
            CharacterCommand::Damage { id, .. } => *id,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Type)]
#[serde(rename_all = "camelCase")]
pub enum FrontendMessageType {
    Success,
    Error,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Type)]
#[serde(rename_all = "camelCase")]
pub struct FrontendMessage {
    #[serde(rename = "type")]
    pub message_type: FrontendMessageType,
    pub message: String,
}

impl FrontendMessage {
    pub fn success<T: Into<String>>(message: T) -> Self {
        Self {
            message_type: FrontendMessageType::Success,
            message: message.into(),
        }
    }

    pub fn error<T: Into<String>>(message: T) -> Self {
        Self {
            message_type: FrontendMessageType::Error,
            message: message.into(),
        }
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Type)]
#[serde(rename_all = "camelCase")]
pub struct CharacterChangeMessages {
    pub name: Option<Vec<FrontendMessage>>,
    pub initiative: Option<Vec<FrontendMessage>>,
    pub hp: Option<Vec<FrontendMessage>>,
}

impl CharacterChangeMessages {
    pub fn none() -> Self {
        Self::default()
    }

    pub fn with_name_error_message<T: Into<String>>(self, message: T) -> Self {
        let message = FrontendMessage::error(message);
        let name = match self.name {
            Some(mut messages) => {
                messages.push(message);
                Some(messages)
            }
            None => Some(vec![message]),
        };

        Self { name, ..self }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Type)]
#[serde(rename_all = "camelCase")]
pub enum CharacterCommandResponse {
    UpdatedCharacter {
        character: Character,
        messages: CharacterChangeMessages,
    },
}

impl CharacterCommandResponse {
    pub fn updated(character: &Character) -> Self {
        Self::UpdatedCharacter {
            character: character.clone(),
            messages: CharacterChangeMessages::none(),
        }
    }

    pub fn updated_with_messages(character: &Character, messages: CharacterChangeMessages) -> Self {
        Self::UpdatedCharacter {
            character: character.clone(),
            messages,
        }
    }
}
