export interface HitPointType {
    current: number,
    max: number,
    temporary: number,
}

export interface CharacterType {
    id: string,
    name: string,
    initiative: number,
    initiativeModifier: number,
    hitPoints: HitPointType,
}

export interface EncounterType {
    id: string,
    name: string,
    characters: CharacterType[],
}

export interface EncounterCommands {
    listEncounter: null,
}

export interface EncounterListType {
    [index: string]: EncounterType
}

export interface EncounterResponse {
    encounterList: EncounterListType,
}