import { invoke } from "@tauri-apps/api";

import {
  EncounterCommands,
  EncounterResponse,
  EncounterListType,
  CharacterCommand,
  CharacterType,
  CharacterResponse,
} from "~/types/EncounterTypes";

export async function queryEncounter(command: EncounterCommands): Promise<EncounterResponse> {
  return await invoke("encounter", { command });
}

export async function listEncounter(): Promise<EncounterListType> {
  const result = await queryEncounter({ listEncounter: null });
  return result.encounterList || {};
}

export async function updateCharacter(encounterId: string, command: CharacterCommand): Promise<CharacterResponse> {
  return await invoke("update_encounter_character", { encounterId, command });
}

type UpdateCharacterNameProps = { encounterId: string; characterId: string; name: string };

export async function updateCharacterName({
  encounterId,
  characterId,
  name,
}: UpdateCharacterNameProps): Promise<CharacterType> {
  const command: CharacterCommand = {
    updateName: {
      id: characterId,
      name,
    },
  };
  const response = await updateCharacter(encounterId, command);
  return response.updatedCharacter as CharacterType;
}
