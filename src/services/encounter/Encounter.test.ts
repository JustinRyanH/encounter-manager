import { describe, expect, test, vi } from "vitest";
import { Encounter } from "~/services/encounter/Encounter";
import { EncounterCharacter } from "~/services/encounter/EncounterCharacter";
import { buildMockCharacter } from "~/services/encounter/mocks";

describe("Encounter", function () {
  test("does not have any characters by default", function () {
    const encounter = new Encounter({
      name: "Test Encounter",
      id: "encounter-a",
    });
    expect(encounter.characters).toEqual([]);
  });

  test("can be initialized with characters", function () {
    const characterA = new EncounterCharacter({
      id: "test-a",
      name: "A",
      initiative: 1,
    });
    const characterB = new EncounterCharacter({
      id: "test-b",
      name: "B",
      initiative: 2,
    });

    const encounter = new Encounter({
      name: "Test Encounter",
      id: "encounter-a",
    });
    encounter.addCharacter(characterA);
    encounter.addCharacter(characterB);

    expect(encounter.findCharacter("test-a")).toBe(characterA);
    expect(encounter.findCharacter("test-b")).toBe(characterB);
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

  describe("addCharacter", function () {
    test("adds a character to the encounter", function () {
      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });

      encounter.addCharacter(new EncounterCharacter({ id: "test-a", name: "A", initiative: 1 }));

      expect(encounter.characters.map((c) => c.name)).toEqual(["A"]);
    });

    test("notifies the `characterAdded` signal", function () {
      const observer = vi.fn();
      const characterA = new EncounterCharacter({
        id: "test-a",
        name: "A",
        initiative: 5,
      });
      const characterB = new EncounterCharacter({
        id: "test-b",
        name: "B",
        initiative: 15,
      });

      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.addCharacter(characterA);
      encounter.addCharacter(characterB);

      encounter.onCharacterAdded(observer);

      const newCharacter = new EncounterCharacter({
        id: "test-c",
        name: "C",
        initiative: 20,
      });
      encounter.addCharacter(newCharacter);

      expect(observer).toHaveBeenCalledWith({ character: newCharacter });
    });
  });

  describe("current character", function () {
    test("starting with character on top of the initiative list", function () {
      const characterA = new EncounterCharacter({
        id: "test-a",
        name: "A",
        initiative: 10,
      });
      const characterB = new EncounterCharacter({
        id: "test-b",
        name: "B",
        initiative: 5,
      });

      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.addCharacter(characterA);
      encounter.addCharacter(characterB);

      encounter.nextCharacter();

      expect(encounter.activeCharacter).toEqual(characterA);
      expect(characterA.inPlay).toEqual(true);
    });

    test("moves to next character when nextCharacter is called", function () {
      const characterA = new EncounterCharacter({
        id: "test-a",
        name: "A",
        initiative: 10,
      });
      const characterB = new EncounterCharacter({
        id: "test-b",
        name: "B",
        initiative: 5,
      });

      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.addCharacter(characterA);
      encounter.addCharacter(characterB);

      expect(encounter.activeCharacter).toEqual(null);
      expect(characterA.inPlay).toEqual(false);
      expect(characterB.inPlay).toEqual(false);

      encounter.nextCharacter();

      expect(encounter.activeCharacter).toEqual(characterA);
      expect(characterA.inPlay).toEqual(true);
      expect(characterB.inPlay).toEqual(false);

      encounter.nextCharacter();

      expect(encounter.activeCharacter).toEqual(characterB);
      expect(characterA.inPlay).toEqual(false);
      expect(characterB.inPlay).toEqual(true);
    });

    test("signaling when the current character changes", function () {
      const listener = vi.fn();
      const characterA = new EncounterCharacter({
        id: "test-a",
        name: "A",
        initiative: 10,
      });
      const characterB = new EncounterCharacter({
        id: "test-b",
        name: "B",
        initiative: 5,
      });

      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.addCharacter(characterA);
      encounter.addCharacter(characterB);

      encounter.startEncounter();

      encounter.activeCharacterObserver.add(listener);

      encounter.nextCharacter();

      expect(listener).toHaveBeenCalledWith({
        oldValue: characterA,
        newValue: characterB,
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
      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.updateCharacters([buildMockCharacter({ id: "test-a", name: "A", initiative: 1 })]);
      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterA.name).toEqual("A");
      expect(characterA.id).toEqual("test-a");
    });

    test("adds the encounter to the character", () => {
      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.updateCharacters([buildMockCharacter({ id: "test-a", name: "A", initiative: 1 })]);
      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      expect(characterA.encounter).toEqual(encounter);
    });

    test("keeps existing instances of characters if they exist", () => {
      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.updateCharacters([originalCharacterA]);
      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterA.initiative).toEqual(1);

      encounter.updateCharacters([updatedCharacterA]);
      const characterAReload = encounter.findCharacter("test-a");
      expect(characterAReload).toBe(characterA);
    });

    test("updates the active character if it is updated", () => {
      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.updateCharacters([originalCharacterA]);
      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterA.initiative).toEqual(1);

      encounter.updateCharacters([updatedCharacterA]);

      expect(characterA.initiative).toEqual(2);
    });
  });

  describe("startEncounter", function () {
    test("sets the active character to the first character", function () {
      const characterA = new EncounterCharacter({
        id: "test-a",
        name: "A",
        initiative: 10,
      });
      const characterB = new EncounterCharacter({
        id: "test-b",
        name: "B",
        initiative: 5,
      });

      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.addCharacter(characterA);
      encounter.addCharacter(characterB);

      encounter.stopEncounter();

      expect(encounter.activeCharacter).toEqual(null);

      encounter.startEncounter();

      expect(encounter.activeCharacter).toEqual(characterA);
    });

    test("no-ops if the character is already active character", function () {
      const characterA = new EncounterCharacter({
        id: "test-a",
        name: "A",
        initiative: 10,
      });
      const characterB = new EncounterCharacter({
        id: "test-b",
        name: "B",
        initiative: 5,
      });

      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.addCharacter(characterA);
      encounter.addCharacter(characterB);

      encounter.startEncounter();
      encounter.nextCharacter();

      expect(encounter.activeCharacter).toEqual(characterB);

      encounter.startEncounter();

      expect(encounter.activeCharacter).toEqual(characterB);
    });

    test("no-ops if there are no characters", function () {
      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });

      expect(encounter.activeCharacter).toEqual(null);

      encounter.startEncounter();

      expect(encounter.activeCharacter).toEqual(null);
    });
  });

  describe("stopEncounter", function () {
    test("clears the active character", function () {
      const characterA = new EncounterCharacter({
        id: "test-a",
        name: "A",
        initiative: 10,
      });
      const characterB = new EncounterCharacter({
        id: "test-b",
        name: "B",
        initiative: 5,
      });

      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.addCharacter(characterA);
      encounter.addCharacter(characterB);

      encounter.startEncounter();

      expect(encounter.activeCharacter).toEqual(characterA);

      encounter.stopEncounter();

      expect(encounter.activeCharacter).toEqual(null);
    });
  });

  describe("restartEncounter", function () {
    test("picks up encounter where it left off", function () {
      const characterA = new EncounterCharacter({
        id: "test-a",
        name: "A",
        initiative: 10,
      });
      const characterB = new EncounterCharacter({
        id: "test-b",
        name: "B",
        initiative: 5,
      });

      const encounter = new Encounter({
        name: "Test Encounter",
        id: "encounter-a",
      });
      encounter.addCharacter(characterA);
      encounter.addCharacter(characterB);

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
