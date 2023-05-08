use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use ulid::Ulid;

use crate::encounters::{EncounterCollection, EncounterDescription};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum EncounterCommands {
    ListEncounter,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum EncounterCommandResponse {
    EncounterList(HashMap<Ulid, EncounterDescription>),
}

impl EncounterCommandResponse{
    pub fn list_from_collection(collection: &EncounterCollection) -> Result<Self, String> {
        Ok(Self::EncounterList(collection.list_encounters()))
    }
}
