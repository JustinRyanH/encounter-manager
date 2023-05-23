import { ValueObserver } from "~/services";
import { CombatEncounter } from "~/services/encounter/CombatEncounter";

import * as Commands from "./Commands";

export class EncounterManager {
  #encounterMap = new Map<string, ValueObserver<CombatEncounter>>();
  #encounterList = new ValueObserver<string[]>([]);

  get encounters(): CombatEncounter[] {
    return this.#encounterList.value
      .map((id) => this.getEncounter(id))
      .filter((e) => e.value)
      .map((e) => e.value) as CombatEncounter[];
  }

  get encountersObserver() {
    return this.#encounterList.readonly;
  }

  getEncounter(id: string): ValueObserver<CombatEncounter> {
    const encounter = this.#encounterMap.get(id);
    if (encounter) return encounter;

    const observer = new ValueObserver<CombatEncounter>(CombatEncounter.StubEncounter(id));
    this.#encounterMap.set(id, observer);
    return observer;
  }

  async refreshList() {
    const encounters = await Commands.listEncounter();
    this.#encounterList.value = Object.values(encounters).map(({ id }) => id);
    Object.values(encounters).forEach((props) => {
      const { id, name, characters, lastActiveCharacter, activeCharacter } = props;
      const encounterObserver = this.getEncounter(id);
      if (encounterObserver.value.isStub) encounterObserver.value = this.createNewEncounter({ id, name });
      const encounter = encounterObserver.value;
      encounter.updateCharacters(characters);
      encounter.updateCombat(activeCharacter, lastActiveCharacter);
    });
  }

  private createNewEncounter({ id, name }: { id: string; name: string }) {
    return new CombatEncounter({ id, name });
  }
}
