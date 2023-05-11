import { invoke } from "@tauri-apps/api";

import {
  EncounterCommands,
  EncounterResponse,
  EncounterListType,
} from "~/types/EncounterTypes";

export async function queryEncounter(
  command: EncounterCommands
): Promise<EncounterResponse> {
  return await invoke("encounter", { command });
}

export async function listEncounter(): Promise<EncounterListType> {
  const result = await queryEncounter({ listEncounter: null });
  return result.encounterList || {};
}
