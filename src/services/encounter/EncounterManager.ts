import { ValueObserver } from "~/services";
import { Encounter } from "~/services/encounter/Encounter";

import * as Commands from "./Commands";

export class EncounterManager {
  #encounterMap = new Map<string, ValueObserver<Encounter | null>>();
  #encounterList = new ValueObserver<string[]>([]);

  get encounters(): Encounter[] {
    return this.#encounterList.value
      .map((id) => this.getEncounter(id))
      .filter((e) => e.value)
      .map((e) => e.value) as Encounter[];
  }

  get encountersObserver() {
    return this.#encounterList.readonly;
  }

  getEncounter(id: string): ValueObserver<Encounter | null> {
    const encounter = this.#encounterMap.get(id);
    if (encounter) {
      return encounter;
    }
    const observer = new ValueObserver<Encounter | null>(null);
    this.#encounterMap.set(id, observer);
    return observer;
  }

  async refreshList() {
    const encounters = await Commands.listEncounter();
    console.log("refreshing list", { encounters });
    this.#encounterList.value = Object.values(encounters).map(({ id }) => id);
    Object.values(encounters).forEach(({ id, name, characters }) => {
      const encounterObserver = this.getEncounter(id);
      if (!encounterObserver.value) {
        encounterObserver.value = this.createNewEncounter({ id, name });
      }
      const encounter = encounterObserver.value;
      encounter.updateCharacters(characters);
    });
  }

  private createNewEncounter({ id, name }: { id: string; name: string }) {
    return new Encounter({ id, name });
  }
}
