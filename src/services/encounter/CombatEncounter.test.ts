import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import { CombatEncounter } from "~/services/encounter/CombatEncounter";
import { BaseCharacter, EncounterCharacter } from "~/services/encounter/Character";
import { buildMockCharacter } from "~/services/encounter/mocks";
import { updateEncounterStage } from "~/services/encounter/Commands";

const mockCharacterA = { id: "test-a", name: "A", initiative: 1 };
const mockCharacterB = { id: "test-b", name: "B", initiative: 2 };

vi.mock("~/services/encounter/Commands", async (importOriginal) => {
  const original = (await importOriginal()) as object;
  return {
    ...original,
    updateEncounterStage: vi.fn(),
  };
});

let encounter: CombatEncounter;
describe("Encounter", function () {
  beforeEach(() => {
    encounter = new CombatEncounter({ name: "Test Encounter", id: "encounter-a" });
  });

  test("does not have any characters by default", function () {
    expect(encounter.characters).toEqual([]);
  });

  test("encounters do not default as stub", () => {
    expect(encounter.isStub).toEqual(false);
  });

  test("creates a new unique stub encounter", () => {
    const stubEncounterA = CombatEncounter.StubEncounter("test-a");
    const stubEncounterB = CombatEncounter.StubEncounter("test-b");

    expect(stubEncounterA.isStub).toEqual(true);
    expect(stubEncounterB.isStub).toEqual(true);

    expect(stubEncounterA.id).not.toEqual(stubEncounterB.id);
    expect(stubEncounterA.name).not.toEqual(stubEncounterB.name);
  });

  test("can be initialized with characters", function () {
    encounter.updateCharacters([mockCharacterA, mockCharacterB]);

    expect(encounter.findCharacter("test-a")).not.toBeNull();
    expect(encounter.findCharacter("test-b")).not.toBeNull();
    expect(encounter.findCharacter("test-a")?.id).toEqual("test-a");
    expect(encounter.findCharacter("test-b")?.id).toEqual("test-b");
  });

  test("newCharacter", () => {
    const result = EncounterCharacter.newCharacter({
      id: "test-a",
      name: "A",
      initiative: 1,
    });

    expect(result.name).toEqual("A");
    expect(result.initiative).toEqual(1);
  });

  describe("current character", () => {
    test("starting with character on top of the initiative list", async () => {
      (updateEncounterStage as Mock).mockResolvedValue({ activeCharacter: mockCharacterA.id });
      const encounter = new CombatEncounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.updateCharacters([
        { ...mockCharacterA, initiative: 10 },
        { ...mockCharacterB, initiative: 5 },
      ]);

      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      expect(characterA).toBeTruthy();

      await encounter.nextCharacter();

      expect(encounter.activeCharacter?.id).toEqual(mockCharacterA.id);
      expect(updateEncounterStage).toHaveBeenCalledWith(encounter.id, "next");
    });
  });

  describe("updateCharacters", () => {
    const originalCharacterA = buildMockCharacter({
      id: "test-a",
      name: "A",
      initiative: 1,
    });
    const updatedCharacterA = buildMockCharacter({
      id: "test-a",
      name: "A",
      initiative: 2,
    });

    test("loads in characters from server", () => {
      encounter.updateCharacters([buildMockCharacter({ id: "test-a", name: "A", initiative: 1 })]);
      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterA.name).toEqual("A");
      expect(characterA.id).toEqual("test-a");
    });

    test("adds the encounter to the character", () => {
      const encounter = new CombatEncounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.updateCharacters([buildMockCharacter({ id: "test-a", name: "A", initiative: 1 })]);
      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      expect(characterA.encounter).toEqual(encounter);
    });

    test("keeps existing instances of characters if they exist", () => {
      encounter.updateCharacters([originalCharacterA]);
      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterA.initiative).toEqual(1);

      encounter.updateCharacters([updatedCharacterA]);
      const characterAReload = encounter.findCharacter("test-a");
      expect(characterAReload).toBe(characterA);
    });

    test("updates the active character if it is updated", () => {
      encounter.updateCharacters([originalCharacterA]);
      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterA.initiative).toEqual(1);

      encounter.updateCharacters([updatedCharacterA]);

      expect(characterA.initiative).toEqual(2);
    });
  });

  describe("encounter commands", function () {
    test("no-ops if is a stub", async () => {
      encounter = new CombatEncounter({ name: "Test Encounter", id: "encounter-a", isStub: true });
      expect(encounter.characters).toHaveLength(3);

      expect(encounter.activeCharacter).toEqual(null);

      await encounter.startEncounter();
      await encounter.restartEncounter();
      await encounter.nextCharacter();

      expect(updateEncounterStage).not.toHaveBeenCalled();
    });

    test("triggers encounter commands to the server", async () => {
      (updateEncounterStage as Mock).mockResolvedValue({ activeCharacter: mockCharacterA.id });
      encounter.updateCharacters([
        { ...mockCharacterA, initiative: 10 },
        { ...mockCharacterB, initiative: 5 },
      ]);

      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      const characterB = encounter.findCharacter("test-b") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterB).toBeTruthy();

      await encounter.startEncounter();
      await encounter.restartEncounter();
      await encounter.nextCharacter();

      expect(updateEncounterStage).toHaveBeenCalledWith(encounter.id, "start");
      expect(updateEncounterStage).toHaveBeenCalledWith(encounter.id, "restart");
      expect(updateEncounterStage).toHaveBeenCalledWith(encounter.id, "next");
    });
  });

  test("create a new encounter stub", async () => {
    const character = await encounter.newCharacter();
    expect(character).toBeInstanceOf(BaseCharacter);
    expect(character.isStub).toEqual(true);
  });
});
