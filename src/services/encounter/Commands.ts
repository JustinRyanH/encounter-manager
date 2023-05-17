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

function updateCharacterNameCommand(characterId: string, name: string) {
  const command: CharacterCommand = {
    updateName: {
      id: characterId,
      name,
    },
  };
  return command;
}

export async function updateCharacterName({
  encounterId,
  characterId,
  name,
}: UpdateCharacterNameProps): Promise<UpdatedCharacter> {
  const command = updateCharacterNameCommand(characterId, name);
  const result = await updateEncounterCharacter(encounterId, command);
  if (!result.updatedCharacter) throw new Error("Bad Server Response");
  return result.updatedCharacter;
}
