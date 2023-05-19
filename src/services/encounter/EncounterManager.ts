import { ValueObserver } from "~/services";
import { Encounter } from "~/services/encounter/Encounter";

import * as Commands from "./Commands";

export class EncounterManager {
  #encounterMap = new Map<string, ValueObserver<Encounter>>();
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

  getEncounter(id: string): ValueObserver<Encounter> {
    const encounter = this.#encounterMap.get(id);
    if (encounter) return encounter;

    const observer = new ValueObserver<Encounter>(Encounter.StubEncounter(id));
    this.#encounterMap.set(id, observer);
    return observer;
  }

  async refreshList() {
    const encounters = await Commands.listEncounter();
    this.#encounterList.value = Object.values(encounters).map(({ id }) => id);
    Object.values(encounters).forEach(({ id, name, characters }) => {
      const encounterObserver = this.getEncounter(id);
      if (encounterObserver.value.isStub) encounterObserver.value = this.createNewEncounter({ id, name });
      const encounter = encounterObserver.value;
      console.log({ encounterName: encounter.name });
      encounter.updateCharacters(characters);
    });
  }

  private createNewEncounter({ id, name }: { id: string; name: string }) {
    return new Encounter({ id, name });
  }
}
