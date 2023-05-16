use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use specta::Type;
use uuid::Uuid;

use crate::encounters::{Encounter, EncounterCollection};

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub enum EncounterCommands {
    ListEncounter,
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub enum EncounterCommandResponse {
    EncounterList(HashMap<Uuid, Encounter>),
}

impl EncounterCommandResponse{
    pub fn list_from_collection(collection: &EncounterCollection) -> Result<Self, String> {
        Ok(Self::EncounterList(collection.list_encounters()))
    }
}
