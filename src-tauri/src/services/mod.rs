use serde::{Deserialize, Serialize};
use specta::Type;

pub mod files;
pub mod file_system_connection;

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
