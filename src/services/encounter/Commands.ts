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

function updateNameCommand(characterId: string, name: string) {
  return {
    updateName: {
      id: characterId,
      name,
    },
  };
}

function updateInitiative(characterId: string, initiative: number) {
  return {
    updateInitiative: { id: characterId, initiative },
  };
}

function updateInitiativeModifier(characterId: string, modifier: number) {
  return {
    updateInitiativeModifier: { id: characterId, modifier },
  };
}

function updateCurrentHp(characterId: string, hp: number) {
  return {
    updateCurrentHp: { id: characterId, hp },
  };
}

function updateTotalHp(characterId: string, hp: number) {
  return {
    updateTotalHp: { id: characterId, hp },
  };
}

function updateTemporaryHp(characterId: string, hp: number) {
  return {
    updateTemporaryHp: { id: characterId, hp },
  };
}

function healCharacter(characterId: string, hp: number) {
  return {
    heal: { id: characterId, hp },
  };
}

function damageCharacter(characterId: string, hp: number) {
  return {
    damage: { id: characterId, hp },
  };
}

export async function updateCharacterName({
  encounterId,
  characterId,
  name,
}: UpdateCharacterNameProps): Promise<UpdatedCharacter> {
  const command = updateNameCommand(characterId, name);
  const result = await updateEncounterCharacter(encounterId, command);
  if (!result.updatedCharacter) throw new Error("Bad Server Response");
  return result.updatedCharacter;
}
