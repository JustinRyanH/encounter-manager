interface HitPoints {
    current: number,
    max: number,
    temporary: number,
}

interface Character {
    id: string,
    name: string,
    initiative: number,
    initiativeModifier: number,
    hitPoints: HitPoints,
}

export interface EncounterDescription {
    id: string,
    name: string,
}

export interface Encounter extends EncounterDescription {
    characters: Array<Character>,
}

export interface EncounterCommands {
    listEncounter: null,
}

export type EncounterList = Array<EncounterDescription>;

export interface EncounterResponse {
    encounterList: EncounterList,
}