import { ValueObserver } from "./ValueObserver";

interface InitiativeCharacterProps {
    name: string;
    initiative: number;
}

export class InitiativeCharacter {
    #name: ValueObserver<string>;
    #initiative: ValueObserver<number>;

    constructor({ name, initiative }: InitiativeCharacterProps) {
        this.#initiative = new ValueObserver(initiative);
        this.#name = new ValueObserver(name);
    }

    get name() {
        return this.#name.value;
    }

    get nameObserver() {
        return this.#name;
    }

    get initiative() {
        return this.#initiative.value;
    }

    get initiativeObserver() {
        return this.#initiative;
    }

    set name(name: string) {
        this.#name.value = name;
    }

    set initiative(initiative: number) {
        this.#initiative.value = initiative;
    }
}