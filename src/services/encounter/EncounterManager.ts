import { ValueObserver } from "~/services";
import { EncounterListType } from "~/types/EncounterTypes";
import { Encounter } from "~/services/encounter/Encounter";

import * as Commands from './Commands';


export class EncounterManager {
    #encounterMap = new Map<string, Encounter>();
    #encounterList = new ValueObserver<EncounterListType>({});

    get encounters() {
        return this.#encounterList.value;
    }

    get encountersObserver() {
        return this.#encounterList.readonly;
    }

    getEncounter(id: string) {
        return this.#encounterMap.get(id) || null;
    }

    async refreshList() {
        this.#encounterList.value = await Commands.listEncounter();
        Object.values(this.encounters).forEach((encounter) => {
            if (this.#encounterMap.has(encounter.id)) return;
            this.#encounterMap.set(encounter.id, new Encounter(encounter));
        });
        console.log(this.#encounterMap.values());
    }
}