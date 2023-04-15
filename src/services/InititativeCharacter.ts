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

    /**
     * The name of the character
     */
    get name(): string {
        return this.#name.value;
    }

    /**
     * Observer for the name of the character
     */
    get nameObserver(): ValueObserver<string> {
        return this.#name;
    }

    get initiative(): number {
        return this.#initiative.value;
    }

    get initiativeObserver(): ValueObserver<number> {
        return this.#initiative;
    }

    set name(name: string) {
        this.#name.value = name;
    }

    set initiative(initiative: number) {
        this.#initiative.value = initiative;
    }
}