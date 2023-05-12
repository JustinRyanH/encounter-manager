import { invoke } from "@tauri-apps/api";

import {
  EncounterCommands,
  EncounterResponse,
  EncounterListType,
  CharacterCommand,
  CharacterType,
} from "~/types/EncounterTypes";

export async function queryEncounter(command: EncounterCommands): Promise<EncounterResponse> {
  return await invoke("encounter", { command });
}

export async function listEncounter(): Promise<EncounterListType> {
  const result = await queryEncounter({ listEncounter: null });
  return result.encounterList || {};
}

export async function updateCharacter(encounterId: string, command: CharacterCommand) {
  return await invoke("update_encounter_character", { encounterId, command });
}

export async function updateCharacterName({ encounterId, characterId, name }: { encounterId: string, characterId: string, name: string }) {
  const command: CharacterCommand = {
    updateName: {
      id: characterId,
      name,
    },
  };
  return await updateCharacter(encounterId, command);
}
