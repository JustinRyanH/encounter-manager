import { ValueObserver } from "~/services";
import { EncounterType } from "~/types/EncounterTypes";
import { Encounter } from "~/services/encounter/Encounter";

import * as Commands from './Commands';
import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";

export class EncounterManager {
    #encounterMap = new Map<string, Encounter>();
    #encounterList = new ValueObserver<string[]>([]);

    get encounters(): Encounter[] {
        return this.#encounterList.value
            .map((id) => this.#encounterMap.get(id))
            .filter((e) => e !== undefined) as Encounter[];
    }

    get encountersObserver() {
        return this.#encounterList.readonly;
    }

    getEncounter(id: string) {
        return this.#encounterMap.get(id) || null;
    }

    async refreshList() {
        const encounters = await Commands.listEncounter();
        this.#encounterList.value = Object.values(encounters).map(({ id }) => id);
        Object.values(encounters).forEach(({ id, name, characters }) => {
            if (this.#encounterMap.has(id)) return;
            this.createNewEncounter({ id, name, characters });
        });
    }

    private createNewEncounter({ id, name, characters }: EncounterType) {
        const encounter = new Encounter({ id, name });
        this.#encounterMap.set(id, encounter);
        encounter.characters = characters.map((serverChar) => ActiveCharacter.newCharacter(serverChar));
    }
}