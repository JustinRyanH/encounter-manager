import { Character as CharacterType, CharacterChangeMessages } from "~/encounterBindings";

interface MockCharacterProps {
  id?: string;
  name?: string;
  initiative?: number;
  initiativeModifier?: number;
  total?: number;
  current?: number;
  temporary?: number;
}

export function buildMockCharacter(props: MockCharacterProps): CharacterType {
  return {
    id: props.id || "100",
    name: props.name || "Test",
    initiative: props.initiative || 10,
    initiativeModifier: props.initiativeModifier || 0,
    hp: {
      current: props.current || 10,
      total: props.total || 10,
      temporary: props.temporary || 0,
    },
  };
}

interface MockEncounterProps {
  id?: string;
  name?: string;
  characters?: MockCharacterProps[];
}

export function buildMockEncounter(props: MockEncounterProps = {}) {
  return {
    id: props.id || "300",
    name: props.name || "Test",
    characters: props.characters || [],
  };
}

type CharacterChangeMessagesProps = {
  [K in keyof CharacterChangeMessages]?: CharacterChangeMessages[K];
};

export function buildMockChangeMessages(props: CharacterChangeMessagesProps = {}): CharacterChangeMessages {
  return {
    name: props.name || [],
    initiative: props.initiative || [],
    hp: props.hp || { current: [], total: [], temporary: [] },
  };
}
