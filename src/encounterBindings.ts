// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

declare global {
    interface Window {
        __TAURI_INVOKE__<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
    }
}

const invoke = window.__TAURI_INVOKE__;

export function encounter(command: EncounterCommands) {
    return invoke<EncounterCommandResponse>("encounter", { command })
}

export function updateEncounterCharacter(encounterId: string, command: CharacterCommand) {
    return invoke<CharacterCommandResponse>("update_encounter_character", { encounterId,command })
}

export type EncounterStageCmd = "start" | "restart" | "pause" | "stop" | "next"
export type EncounterCommands = "listEncounter" | { updateStage: UpdateStageCommand }
export type FrontendMessageType = "success" | "error"
export type UpdateStageCommand = { id: string; stage: EncounterStageCmd }
export type Character = { id: string; name: string; hp: HitPoints; initiative: number; initiativeModifier: number }
export type Encounter = { id: string; name: string; characters: Character[]; active_character: string | null; last_active_character: string | null }
export type FrontendMessage = { type: FrontendMessageType; message: string }
export type EncounterCommandResponse = { encounterList: { [key: string]: Encounter } } | { encounterChanged: Encounter }
export type CharacterCommand = { updateName: { id: string; name: string } } | { updateInitiative: { id: string; initiative: number } } | { updateInitiativeModifier: { id: string; modifier: number } } | { updateCurrentHp: { id: string; hp: number } } | { updateTotalHp: { id: string; hp: number } } | { updateTemporaryHp: { id: string; hp: number } } | { heal: { id: string; hp: number } } | { damage: { id: string; hp: number } }
export type CharacterCommandResponse = { updatedCharacter: { character: Character; messages: CharacterChangeMessages } }
export type CharacterChangeMessages = { name: FrontendMessage[] | null; initiative: FrontendMessage[] | null; hp: FrontendMessage[] | null }
export type HitPoints = { current: number; total: number; temporary: number }
