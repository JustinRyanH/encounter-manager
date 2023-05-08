import { invoke } from "@tauri-apps/api";

import { EncounterCommands, EncounterResponse, EncounterList } from '~/types/EncounterTypes';

export async function queryEncounter(command: EncounterCommands): Promise<EncounterResponse> {
    return await invoke('encounter', { command });
}

export async function listEncounter(): Promise<EncounterList> {
    const result = await queryEncounter({ listEncounter: null });
    return result.encounterList || [];
}