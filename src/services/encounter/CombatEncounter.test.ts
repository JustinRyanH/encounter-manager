import { beforeEach, describe, expect, test, vi } from "vitest";
import { CombatEncounter } from "~/services/encounter/CombatEncounter";
import { EncounterCharacter } from "~/services/encounter/Character";
import { buildMockCharacter } from "~/services/encounter/mocks";

const mockCharacterA = { id: "test-a", name: "A", initiative: 1 };
const mockCharacterB = { id: "test-b", name: "B", initiative: 2 };

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

  describe("current character", function () {
    test("starting with character on top of the initiative list", function () {
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

      encounter.nextCharacter();

      expect(encounter.activeCharacter?.id).toEqual(mockCharacterA.id);
    });

    test("moves to next character when nextCharacter is called", function () {
      const encounter = new CombatEncounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.updateCharacters([
        { ...mockCharacterA, initiative: 10 },
        { ...mockCharacterB, initiative: 5 },
      ]);

      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      const characterB = encounter.findCharacter("test-b") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterB).toBeTruthy();

      expect(encounter.activeCharacter).toEqual(null);

      encounter.nextCharacter();

      expect(encounter.activeCharacter).toEqual(characterA);

      encounter.nextCharacter();

      expect(encounter.activeCharacter).toEqual(characterB);
    });

    test("signaling when the current character changes", function () {
      const listener = vi.fn();

      const encounter = new CombatEncounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.updateCharacters([
        { ...mockCharacterA, initiative: 10 },
        { ...mockCharacterB, initiative: 5 },
      ]);

      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      const characterB = encounter.findCharacter("test-b") as EncounterCharacter;

      encounter.startEncounter();

      encounter.activeCharacterObserver.add(listener);

      encounter.nextCharacter();

      expect(listener).toHaveBeenCalledWith({
        oldValue: characterA.id,
        newValue: characterB.id,
      });
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

  describe("startEncounter", function () {
    test("no-ops if is a stub", () => {
      encounter = new CombatEncounter({ name: "Test Encounter", id: "encounter-a", isStub: true });
      expect(encounter.characters).toHaveLength(3);

      expect(encounter.activeCharacter).toEqual(null);

      encounter.startEncounter();

      expect(encounter.activeCharacter).toEqual(null);

      encounter.restartEncounter();

      expect(encounter.activeCharacter).toEqual(null);

      encounter.nextCharacter();

      expect(encounter.activeCharacter).toEqual(null);
    });

    test("sets the active character to the first character", function () {
      encounter.updateCharacters([
        { ...mockCharacterA, initiative: 10 },
        { ...mockCharacterB, initiative: 5 },
      ]);

      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      const characterB = encounter.findCharacter("test-b") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterB).toBeTruthy();

      encounter.stopEncounter();

      expect(encounter.activeCharacter).toEqual(null);

      encounter.startEncounter();

      expect(encounter.activeCharacter).toEqual(characterA);
    });

    test("no-ops if the character is already active character", function () {
      encounter.updateCharacters([
        { ...mockCharacterA, initiative: 10 },
        { ...mockCharacterB, initiative: 5 },
      ]);

      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      const characterB = encounter.findCharacter("test-b") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterB).toBeTruthy();

      encounter.startEncounter();
      encounter.nextCharacter();

      expect(encounter.activeCharacter).toEqual(characterB);

      encounter.startEncounter();

      expect(encounter.activeCharacter).toEqual(characterB);
    });

    test("no-ops if there are no characters", function () {
      expect(encounter.activeCharacter).toEqual(null);

      encounter.startEncounter();

      expect(encounter.activeCharacter).toEqual(null);
    });
  });

  describe("stopEncounter", function () {
    test("clears the active character", function () {
      encounter.updateCharacters([
        { ...mockCharacterA, initiative: 10 },
        { ...mockCharacterB, initiative: 5 },
      ]);

      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      const characterB = encounter.findCharacter("test-b") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterB).toBeTruthy();

      encounter.startEncounter();

      expect(encounter.activeCharacter).toEqual(characterA);

      encounter.stopEncounter();

      expect(encounter.activeCharacter).toEqual(null);
    });
  });

  describe("restartEncounter", function () {
    test("picks up encounter where it left off", function () {
      encounter.updateCharacters([
        { ...mockCharacterA, initiative: 10 },
        { ...mockCharacterB, initiative: 5 },
      ]);

      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      const characterB = encounter.findCharacter("test-b") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterB).toBeTruthy();

      encounter.startEncounter();
      encounter.nextCharacter();

      expect(encounter.activeCharacter).toEqual(characterB);

      encounter.stopEncounter();

      expect(encounter.activeCharacter).toEqual(null);

      encounter.restartEncounter();

      expect(encounter.activeCharacter).toEqual(characterB);
    });
  });
});