import { ValueObserver } from "~/services";
import { CharacterType, EncounterListType, EncounterType } from "~/types/EncounterTypes";
import { Encounter } from "~/services/encounter/Encounter";

import * as Commands from './Commands';
import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";


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
        Object.values(this.encounters).forEach(({ id, name, characters }) => {
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