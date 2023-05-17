import {
  Character,
  CharacterChangeMessages,
  CharacterCommand,
  Encounter,
  encounter,
  updateEncounterCharacter,
} from "~/encounterBindings";

interface UpdatedCharacter {
  character: Character;
  messages: CharacterChangeMessages;
}

interface EncounterList {
  [key: string]: Encounter;
}

export async function listEncounter(): Promise<EncounterList> {
  const result = await encounter("listEncounter");
  return result.encounterList || {};
}

type UpdateCharacterNameProps = { encounterId: string; characterId: string; name: string };

export function updateNameCommand(characterId: string, name: string) {
  return {
    updateName: {
      id: characterId,
      name,
    },
  };
}

export function updateInitiativeCmd(characterId: string, initiative: number) {
  return {
    updateInitiative: { id: characterId, initiative },
  };
}

export function updateInitiativeModifierCmd(characterId: string, modifier: number) {
  return {
    updateInitiativeModifier: { id: characterId, modifier },
  };
}

export function updateCurrentHpCmd(characterId: string, hp: number) {
  return {
    updateCurrentHp: { id: characterId, hp },
  };
}

export function updateTotalHpCmd(characterId: string, hp: number) {
  return {
    updateTotalHp: { id: characterId, hp },
  };
}

export function updateTemporaryHpCmd(characterId: string, hp: number) {
  return {
    updateTemporaryHp: { id: characterId, hp },
  };
}

export function healCharacterCmd(characterId: string, hp: number) {
  return {
    heal: { id: characterId, hp },
  };
}

export function damageCharacterCmd(characterId: string, hp: number) {
  return {
    damage: { id: characterId, hp },
  };
}

export async function updateCharacter(encounterId: string, command: { updateName: { name: string; id: string } }) {
  const result = await updateEncounterCharacter(encounterId, command);
  if (!result.updatedCharacter) throw new Error("Bad Server Response");
  return result.updatedCharacter;
}
