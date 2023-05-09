interface HitPointType {
    current: number,
    max: number,
    temporary: number,
}

interface CharacterType {
    id: string,
    name: string,
    initiative: number,
    initiativeModifier: number,
    hitPoints: HitPointType,
}

export interface EncounterDescriptionType {
    id: string,
    name: string,
    characters: CharacterType[],
}

export interface EncounterType extends EncounterDescriptionType {
    characters: Array<CharacterType>,
}

export interface EncounterCommands {
    listEncounter: null,
}

export interface EncounterListType {
    [index: string]: EncounterDescriptionType
}

export interface EncounterResponse {
    encounterList: EncounterListType,
}