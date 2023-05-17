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

function updateInitiativeCmd(characterId: string, initiative: number) {
  return {
    updateInitiative: { id: characterId, initiative },
  };
}

function updateInitiativeModifierCmd(characterId: string, modifier: number) {
  return {
    updateInitiativeModifier: { id: characterId, modifier },
  };
}

function updateCurrentHpCmd(characterId: string, hp: number) {
  return {
    updateCurrentHp: { id: characterId, hp },
  };
}

function updateTotalHpCmd(characterId: string, hp: number) {
  return {
    updateTotalHp: { id: characterId, hp },
  };
}

function updateTemporaryHpCmd(characterId: string, hp: number) {
  return {
    updateTemporaryHp: { id: characterId, hp },
  };
}

function healCharacterCmd(characterId: string, hp: number) {
  return {
    heal: { id: characterId, hp },
  };
}

function damageCharacterCmd(characterId: string, hp: number) {
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
