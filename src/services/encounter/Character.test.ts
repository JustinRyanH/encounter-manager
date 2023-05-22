import { afterEach, beforeEach, describe, expect, Mock, test, vi } from "vitest";

import { EncounterCharacter } from "./Character";
import { CombatEncounter } from "~/services/encounter/CombatEncounter";
import { updateCharacter } from "~/services/encounter/Commands";
import { buildMockCharacter } from "~/services/encounter/mocks";

vi.mock("@mantine/notifications");
vi.mock("~/services/encounter/Commands", async (importOriginal) => {
  const original = (await importOriginal()) as object;
  return {
    ...original,
    updateCharacter: vi.fn(),
  };
});

let encounter: CombatEncounter;
describe("EncounterCharacter", () => {
  beforeEach(() => {
    encounter = new CombatEncounter({ name: "Test", id: "test-id" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("constructor", () => {
    const character = new EncounterCharacter({
      encounter,
      id: "test-id",
      name: "Test",
      initiative: 10,
    });
    expect(character.name).toEqual("Test");
    expect(character.initiative).toEqual(10);
  });

  describe("update", () => {
    test("fails if the id is not the same as the character", () => {
      const character = new EncounterCharacter({
        encounter,
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      expect(() => character.update({ id: "bad-id" })).toThrow("Id Mismatch for character");
    });

    test("updates the name if it changes", () => {
      const observer = vi.fn();
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      character.nameObserver.add(observer);
      character.update({ id: "test-id", name: "New Name" });
      expect(character.name).toEqual("New Name");
      expect(observer).toHaveBeenCalledWith(expect.objectContaining({ newValue: "New Name" }));
    });

    test("updates the initiative", () => {
      const observer = vi.fn();
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      character.initiativeObserver.add(observer);
      character.update({ id: "test-id", initiative: 20 });
      expect(character.initiative).toEqual(20);
      expect(observer).toHaveBeenCalledWith(expect.objectContaining({ newValue: 20 }));
    });

    test("updates the current hit points", () => {
      const observer = vi.fn();
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
        hp: {
          total: 10,
          current: 10,
          temporary: 0,
        },
      });
      character.hp.currentObserver.add(observer);
      character.update({ id: "test-id", hp: { current: 5 } });
      expect(character.hp.current).toEqual(5);
      expect(observer).toHaveBeenCalledWith(expect.objectContaining({ newValue: 5 }));
    });

    test("updates the total hit points", () => {
      const observer = vi.fn();
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
        hp: {
          total: 10,
          current: 10,
          temporary: 0,
        },
      });
      character.hp.totalObserver.add(observer);
      character.update({ id: "test-id", hp: { total: 5 } });
      expect(character.hp.total).toEqual(5);
      expect(character.hp.current).toEqual(5);
      expect(observer).toHaveBeenCalledWith(expect.objectContaining({ newValue: 5 }));
    });

    test("updates the temp hit points", () => {
      const observer = vi.fn();
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
        hp: {
          total: 10,
          current: 10,
          temporary: 0,
        },
      });
      character.hp.tempObserver.add(observer);
      character.update({ id: "test-id", hp: { temporary: 5 } });
      expect(character.hp.temporary).toEqual(5);
      expect(observer).toHaveBeenCalledWith(expect.objectContaining({ newValue: 5 }));
    });

    test("no-ops if there are no differences", () => {
      const nameObserver = vi.fn();
      const initiativeObserver = vi.fn();
      const currentObserver = vi.fn();
      const totalObserver = vi.fn();
      const tempObserver = vi.fn();

      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
        hp: {
          total: 7,
          current: 10,
          temporary: 3,
        },
      });
      character.nameObserver.add(nameObserver);
      character.initiativeObserver.add(initiativeObserver);
      character.hp.currentObserver.add(currentObserver);
      character.hp.totalObserver.add(totalObserver);
      character.hp.tempObserver.add(tempObserver);

      character.update({
        id: "test-id",
        name: "Test",
        initiative: 10,
        hp: {
          total: 7,
          current: 10,
          temporary: 3,
        },
      });

      expect(nameObserver).not.toHaveBeenCalled();
      expect(initiativeObserver).not.toHaveBeenCalled();
      expect(currentObserver).not.toHaveBeenCalled();
      expect(totalObserver).not.toHaveBeenCalled();
      expect(tempObserver).not.toHaveBeenCalled();
    });
  });

  describe("name", () => {
    test("return the name", () => {
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      expect(character.name).toEqual("Test");
    });

    test("can set the name", () => {
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      character.name = "Test2";
      expect(character.name).toEqual("Test2");
    });

    test("can subscribe to name changes", () => {
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      const observer = vi.fn();
      character.nameObserver.add(observer);
      character.name = "Test2";
      expect(observer).toHaveBeenCalledWith({
        newValue: "Test2",
        oldValue: "Test",
      });
    });
  });

  describe("initiative", () => {
    test("return the initiative", () => {
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      expect(character.initiative).toEqual(10);
    });

    test("can set the initiative", () => {
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      character.initiative = 20;
      expect(character.initiative).toEqual(20);
    });

    test("can subscribe to initiative changes", () => {
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      const observer = vi.fn();
      character.initiativeObserver.add(observer);
      character.initiative = 20;
      expect(observer).toHaveBeenCalledWith({
        newValue: 20,
        oldValue: 10,
      });
    });
  });

  describe("inPlay", () => {
    test("defaults to  false", () => {
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      expect(character.inPlay).toEqual(false);
    });

    test("inPlay can be updated", () => {
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      character.inPlay = true;
      expect(character.inPlay).toEqual(true);
    });

    test("changing inPlay will notify observers", () => {
      const character = new EncounterCharacter({
        id: "test-id",
        name: "Test",
        initiative: 10,
      });
      const observer = vi.fn();
      character.inPlayObserver.add(observer);
      character.inPlay = true;
      expect(observer).toHaveBeenCalledWith({
        newValue: true,
        oldValue: false,
      });
    });
  });

  describe("external updates", () => {
    const baseCharacter = {
      id: "test-id",
      name: "Test",
      initiative: 10,
    };
    test("update the name", async () => {
      (updateCharacter as Mock).mockReturnValue({
        character: buildMockCharacter({
          id: "test-id",
          name: "New Name",
        }),
      });

      encounter.updateCharacters([baseCharacter]);
      const character = encounter.findCharacter("test-id") as EncounterCharacter;

      expect(character.name).toEqual("Test");
      await character.updateName("New Name");
      expect(character.name).toEqual("New Name");
    });

    test("update their initiative", async () => {
      (updateCharacter as Mock).mockReturnValue({
        character: buildMockCharacter({
          id: "test-id",
          initiative: 20,
        }),
      });

      encounter.updateCharacters([baseCharacter]);
      const character = encounter.findCharacter("test-id") as EncounterCharacter;

      expect(character.initiative).toEqual(10);
      await character.updateInitiative(20);
      expect(character.initiative).toEqual(20);
    });

    test("update current hp", async () => {
      (updateCharacter as Mock).mockReturnValue({
        character: buildMockCharacter({
          id: "test-id",
          current: 5,
        }),
      });

      encounter.updateCharacters([{ ...baseCharacter, hp: { total: 10, current: 10, temporary: 0 } }]);
      const character = encounter.findCharacter("test-id") as EncounterCharacter;

      expect(character.hp.current).toEqual(10);
      await character.updateCurrentHp(5);
      expect(character.hp.current).toEqual(5);
    });

    test("update total hp", async () => {
      (updateCharacter as Mock).mockReturnValue({
        character: buildMockCharacter({
          id: "test-id",
          total: 20,
        }),
      });

      encounter.updateCharacters([{ ...baseCharacter, hp: { total: 10, current: 10, temporary: 0 } }]);
      const character = encounter.findCharacter("test-id") as EncounterCharacter;

      expect(character.hp.total).toEqual(10);
      await character.updateTotalHp(20);
      expect(character.hp.total).toEqual(20);
    });

    test("update temp hp", async () => {
      (updateCharacter as Mock).mockReturnValue({
        character: buildMockCharacter({
          id: "test-id",
          temporary: 5,
        }),
      });

      encounter.updateCharacters([{ ...baseCharacter, hp: { total: 10, current: 10, temporary: 0 } }]);
      const character = encounter.findCharacter("test-id") as EncounterCharacter;

      expect(character.hp.temporary).toEqual(0);
      await character.updateTempHp(5);
      expect(character.hp.temporary).toEqual(5);
    });

    test("can heal", async () => {
      (updateCharacter as Mock).mockReturnValue({
        character: buildMockCharacter({
          id: "test-id",
          current: 10,
        }),
      });

      encounter.updateCharacters([{ ...baseCharacter, hp: { total: 10, current: 5, temporary: 0 } }]);
      const character = encounter.findCharacter("test-id") as EncounterCharacter;

      expect(character.hp.current).toEqual(5);
      await character.heal(5);
      expect(character.hp.current).toEqual(10);
    });

    test("can damage", async () => {
      (updateCharacter as Mock).mockReturnValue({
        character: buildMockCharacter({
          id: "test-id",
          current: 5,
        }),
      });

      encounter.updateCharacters([{ ...baseCharacter, hp: { total: 10, current: 10, temporary: 0 } }]);
      const character = encounter.findCharacter("test-id") as EncounterCharacter;

      expect(character.hp.current).toEqual(10);
      await character.damage(5);
      expect(character.hp.current).toEqual(5);
    });
  });
});
