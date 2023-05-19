import { describe, expect, test } from "vitest";

import { EncounterCharacter } from "~/services/encounter/EncounterCharacter";
import { Encounter } from "~/services/encounter/Encounter";
import { ViewEncounter } from "~/services/encounter/ViewEncounter";

const mockCharacterA = { id: "test-a", name: "A", initiative: 1 };
const mockCharacterB = { id: "test-b", name: "B", initiative: 2 };

describe("ViewEncounter", () => {
  describe("openedCharacters", () => {
    test("returns the active character", () => {
      const encounter = new Encounter({
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

      const viewEncounter = new ViewEncounter({ encounter });

      encounter.startEncounter();
      expect(viewEncounter.openedCharacters).toEqual([characterA.id]);
    });

    test("returns an empty array if there is no active character", () => {
      const encounter = new Encounter({
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
      const viewEncounter = new ViewEncounter({ encounter });

      expect(encounter.activeCharacter).toEqual(null);
      expect(viewEncounter.openedCharacters).toEqual([]);
    });

    test("allows adding new characters be opened", () => {
      const encounter = new Encounter({
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
      const viewEncounter = new ViewEncounter({ encounter });

      expect(viewEncounter.openedCharacters).toEqual([]);
      viewEncounter.open(characterA.id);

      expect(viewEncounter.openedCharacters).toEqual([characterA.id]);

      viewEncounter.open(characterB.id);

      expect(viewEncounter.openedCharacters).toEqual([characterA.id, characterB.id]);
    });

    test("removes the previous character from opened when active character changes", () => {
      const encounter = new Encounter({
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
      const viewEncounter = new ViewEncounter({ encounter });

      encounter.startEncounter();
      expect(viewEncounter.openedCharacters).toEqual([characterA.id]);

      encounter.nextCharacter();
      expect(viewEncounter.openedCharacters).toEqual([characterB.id]);
    });

    test("allows closing a character", () => {
      const encounter = new Encounter({
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
      const viewEncounter = new ViewEncounter({ encounter });

      encounter.startEncounter();
      expect(viewEncounter.openedCharacters).toEqual([characterA.id]);

      viewEncounter.close(characterA.id);
      expect(viewEncounter.openedCharacters).toEqual([]);
    });

    test("allows toggling a character", () => {
      const encounter = new Encounter({ name: "Test Encounter", id: "encounter-a" });
      encounter.updateCharacters([
        { ...mockCharacterA, initiative: 10 },
        { ...mockCharacterB, initiative: 5 },
      ]);

      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      const characterB = encounter.findCharacter("test-b") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterB).toBeTruthy();
      const viewEncounter = new ViewEncounter({ encounter });

      viewEncounter.toggle(characterA.id);
      expect(viewEncounter.openedCharacters).toEqual([characterA.id]);

      viewEncounter.toggle(characterA.id);
      expect(viewEncounter.openedCharacters).toEqual([]);
    });
  });

  describe("isOpened", () => {
    test("returns true if the character is opened", () => {
      const encounter = new Encounter({ name: "Test Encounter", id: "encounter-a" });
      encounter.updateCharacters([
        { ...mockCharacterA, initiative: 10 },
        { ...mockCharacterB, initiative: 5 },
      ]);

      const characterA = encounter.findCharacter("test-a") as EncounterCharacter;
      const characterB = encounter.findCharacter("test-b") as EncounterCharacter;
      expect(characterA).toBeTruthy();
      expect(characterB).toBeTruthy();

      const viewEncounter = new ViewEncounter({ encounter });

      encounter.startEncounter();
      expect(viewEncounter.isOpened(characterA.id)).toEqual(true);
      expect(viewEncounter.isOpened(characterB.id)).toEqual(false);
    });
  });
});
