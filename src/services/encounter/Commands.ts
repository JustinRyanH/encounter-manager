import { invoke } from "@tauri-apps/api";

import {
  EncounterCommands,
  EncounterResponse,
  EncounterListType,
  CharacterCommand,
  CharacterType,
  CharacterResponse,
  UpdatedCharacter,
} from "~/types/EncounterTypes";
import { notifyErrors } from "~/services/notifications";

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
}: UpdateCharacterNameProps): Promise<UpdatedCharacter> {
  const command: CharacterCommand = {
    updateName: {
      id: characterId,
      name,
    },
  };
  const result = await updateCharacter(encounterId, command);
  if (!result.updatedCharacter) throw new Error("Bad Server Response");
  return result.updatedCharacter;
}
