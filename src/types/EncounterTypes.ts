export interface FrontendMessage {
  type: string;
  message: string;
}

export interface HitPointType {
  current: number;
  total: number;
  temporary: number;
}

export interface CharacterType {
  id: string;
  name: string;
  initiative: number;
  initiativeModifier: number;
  hitPoints: HitPointType;
}

export interface EncounterType {
  id: string;
  name: string;
  characters: CharacterType[];
}

export interface EncounterCommands {
  listEncounter: null;
}

export interface EncounterListType {
  [index: string]: EncounterType;
}

export interface EncounterResponse {
  encounterList: EncounterListType;
}

export interface BaseCharacterCommand {
  id: string;
}

export interface CharacterChangeMessagesType {
  name?: CharacterType;
  initiative?: CharacterType;
  hp?: CharacterType;
}

export interface UpdateCharacterName extends BaseCharacterCommand {
  name: string;
}
export interface CharacterCommand {
  updateName?: UpdateCharacterName;
}

export interface UpdatedCharacter {
  character: CharacterType,
  messages: CharacterChangeMessagesType,
}

export interface CharacterResponse {
  updatedCharacter?: UpdatedCharacter;
}
