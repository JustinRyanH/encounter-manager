import {
  UpdateCharacterCommand,
  Encounter,
  encounter,
  EncounterStageCmd,
  updateEncounterCharacter,
  newCharacter,
  Character,
} from "~/encounterBindings";

interface EncounterList {
  [key: string]: Encounter;
}

export async function listEncounter(): Promise<EncounterList> {
  const result = await encounter("listEncounter");
  if ("encounterList" in result) return result.encounterList || {};
  throw new Error("Invalid EncounterCommandResponse");
}

export function getCommandId(cmd: UpdateCharacterCommand): string {
  if ("updateName" in cmd) return cmd.updateName.id;
  if ("updateInitiative" in cmd) return cmd.updateInitiative.id;
  if ("updateInitiativeModifier" in cmd) return cmd.updateInitiativeModifier.id;
  if ("updateCurrentHp" in cmd) return cmd.updateCurrentHp.id;
  if ("updateTotalHp" in cmd) return cmd.updateTotalHp.id;
  if ("updateTemporaryHp" in cmd) return cmd.updateTemporaryHp.id;
  if ("heal" in cmd) return cmd.heal.id;
  if ("damage" in cmd) return cmd.damage.id;
  throw new Error("Invalid UpdateCharacterCommand");
}

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

export async function updateCharacter(encounterId: string, command: UpdateCharacterCommand) {
  const result = await updateEncounterCharacter(encounterId, command);
  if (!result.updatedCharacter) throw new Error("Bad Server Response");
  return result.updatedCharacter;
}

export async function updateEncounterStage(id: string, command: EncounterStageCmd): Promise<Encounter> {
  const result = await encounter({ updateStage: { id, stage: command } });
  if ("encounterChanged" in result) return result.encounterChanged;
  throw new Error("Invalid EncounterCommandResponse");
}

export async function addCharacter(encounterId: string, character: Character) {
  const result = await encounter({ addCharacter: { id: encounterId, character } });
  if ("characterAdded" in result) return result.characterAdded;
  throw new Error("Invalid EncounterCommandResponse");
}

export async function buildCharacter() {
  return newCharacter();
}
