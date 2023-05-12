import { describe, expect, Mock, test, vi } from "vitest";

import { EncounterManager } from "~/services/encounter/EncounterManager";
import * as Commands from "./Commands";
import { Encounter } from "~/services/encounter/Encounter";
import { buildMockCharacter, buildMockEncounter } from "~/services/encounter/mocks";

vi.mock("./Commands");

describe("EncounterManager", function () {
  test("starts with empty list of encounters", () => {
    const manager = new EncounterManager();
    expect(manager.encounters).toEqual([]);
  });

  describe("refreshList", function () {
    test("can refresh list of encounters", async () => {
      (Commands.listEncounter as Mock).mockResolvedValueOnce([buildMockEncounter()]);

      const manager = new EncounterManager();
      await manager.refreshList();
      expect(manager.encounters.map((e) => e.id)).toEqual(["300"]);
    });

    test("adds new encounters to the list", async () => {
      (Commands.listEncounter as Mock).mockResolvedValueOnce([buildMockEncounter()]);

      const manager = new EncounterManager();
      await manager.refreshList();

      const encounter_a = manager.getEncounter("300");
      expect(encounter_a?.id).toEqual("300");

      (Commands.listEncounter as Mock).mockResolvedValueOnce([
        buildMockEncounter({ id: "300", name: "Test" }),
        buildMockEncounter({ id: "400", name: "Test Two" }),
      ]);
      await manager.refreshList();

      const encounter_b = manager.getEncounter("400");
      expect(encounter_b?.id).toEqual("400");
      expect(manager.getEncounter("300")).toBe(encounter_a);
    });

    test("adds characters", async () => {
      const mockCharacterA = buildMockCharacter({ id: "100", name: "Test A" });
      const mockCharacterB = buildMockCharacter({ id: "200", name: "Test B" });
      (Commands.listEncounter as Mock).mockResolvedValueOnce([
        buildMockEncounter({ characters: [mockCharacterA, mockCharacterB] }),
      ]);

      const manager = new EncounterManager();
      await manager.refreshList();

      expect(manager.getEncounter("300")?.characters.map((c) => c.id)).toEqual(["100", "200"]);
    });

    test("updates characters", async () => {
      const mockCharacterA = buildMockCharacter({
        id: "100",
        name: "Test A",
        current: 5,
      });
      const mockCharacterB = buildMockCharacter({ id: "200", name: "Test B" });
      (Commands.listEncounter as Mock).mockResolvedValueOnce([
        buildMockEncounter({ characters: [mockCharacterA, mockCharacterB] }),
      ]);

      const manager = new EncounterManager();
      await manager.refreshList();

      expect(manager.getEncounter("300")?.characters.map((c) => c.id)).toEqual(["100", "200"]);

      (Commands.listEncounter as Mock).mockResolvedValueOnce([buildMockEncounter({ characters: [mockCharacterA] })]);
      await manager.refreshList();

      expect(manager.getEncounter("300")?.characters.map((c) => c.id)).toEqual(["100"]);
    });
  });

  describe("getEncounter", () => {
    test("get encounter", async () => {
      (Commands.listEncounter as Mock).mockResolvedValueOnce([buildMockEncounter({ id: "300", name: "Test" })]);

      const manager = new EncounterManager();
      await manager.refreshList();

      expect(manager.getEncounter("300")).toBeInstanceOf(Encounter);
      expect(manager.getEncounter("301")).toBeNull();
    });
  });
});
