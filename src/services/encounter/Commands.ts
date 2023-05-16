import {
  Character,
  CharacterChangeMessages,
  CharacterCommand,
  CharacterCommandResponse,
  Encounter,
  encounter,
  EncounterCommandResponse,
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

export async function updateCharacterName({
  encounterId,
  characterId,
  name,
}: UpdateCharacterNameProps): Promise<UpdatedCharacter> {
  const command: CharacterCommand = {
    updateName: {
      id: characterId,
      name,
    },
  };
  const result = await updateEncounterCharacter(encounterId, command);
  if (!result.updatedCharacter) throw new Error("Bad Server Response");
  return result.updatedCharacter;
}
