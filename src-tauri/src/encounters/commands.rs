use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use specta::Type;
use uuid::Uuid;

use crate::encounters::{Encounter, EncounterCollection};

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub enum EncounterStageCmd {
    Start,
    Restart,
    Pause,
    Stop,
    Next,
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub struct UpdateStageCommand {
    pub id: Uuid,
    pub stage: EncounterStageCmd,
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub enum EncounterCommands {
    ListEncounter,
    UpdateStage(UpdateStageCommand),
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub enum EncounterCommandResponse {
    EncounterList(HashMap<Uuid, Encounter>),
    EncounterChanged(Encounter),
}

impl EncounterCommandResponse{
    pub fn list_from_collection(collection: &EncounterCollection) -> Result<Self, String> {
        Ok(Self::EncounterList(collection.list_encounters()))
    }

    pub fn from_stage_command(encounter: &mut Encounter, cmd: EncounterStageCmd) -> Result<Self, String> {
        match cmd {
            EncounterStageCmd::Start => {}
            EncounterStageCmd::Restart => {}
            EncounterStageCmd::Pause => {}
            EncounterStageCmd::Stop => {}
            EncounterStageCmd::Next => {}
        }

        Ok(Self::EncounterChanged(encounter.clone()))
    }
}
