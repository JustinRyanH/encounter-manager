use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use specta::Type;
use uuid::Uuid;

use crate::encounters::{Character, Encounter, EncounterCollection};
use crate::encounters::character::CharacterChangeMessages;

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
pub struct AddCharacterCommand {
    pub id: Uuid,
    pub character: Character,
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub struct AddCharacterResult {
    encounter: Encounter,
    character_change: CharacterChangeMessages,
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub enum EncounterCommands {
    ListEncounter,
    UpdateStage(UpdateStageCommand),
    AddCharacter(AddCharacterCommand),
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub enum EncounterCommandResponse {
    EncounterList(HashMap<Uuid, Encounter>),
    EncounterChanged(Encounter),
    CharacterAdded(AddCharacterResult),
}

impl EncounterCommandResponse{
    pub fn list_from_collection(collection: &EncounterCollection) -> Result<Self, String> {
        Ok(Self::EncounterList(collection.list_encounters()))
    }

    pub fn from_stage_command(encounter: &mut Encounter, cmd: EncounterStageCmd) -> Result<Self, String> {
        match cmd {
            EncounterStageCmd::Start => encounter.start()?,
            EncounterStageCmd::Restart => encounter.restart()?,
            EncounterStageCmd::Pause => encounter.pause()?,
            EncounterStageCmd::Stop => encounter.stop()?,
            EncounterStageCmd::Next => encounter.next()?,
        }

        Ok(Self::EncounterChanged(encounter.clone()))
    }

    pub fn character_added(encounter: &Encounter, message: &CharacterChangeMessages) -> Self {
        Self::CharacterAdded(AddCharacterResult {
            encounter: encounter.clone(),
            character_change: message.clone(),
        })
    }
}
