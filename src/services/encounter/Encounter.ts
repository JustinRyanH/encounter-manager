import { Signal, SignalConnection } from "typed-signals";

import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";
import { ReadonlyValueObserver, StopObserving, ValueObserver } from "~/services/ValueObserver";
import { ViewEncounter } from "~/services/encounter/ViewEncounter";

const sortInitiative = (a: ActiveCharacter, b: ActiveCharacter) => b.initiative - a.initiative;

type CharacterAddedMessage = ({ character }: { character: ActiveCharacter }) => void;

interface EncounterProps {
    characters?: Array<ActiveCharacter>;
    name: string,
    id: string,
}

export class Encounter {
    #id: string;
    #name: ValueObserver<string> = new ValueObserver<string>('');
    #lastActiveCharacter: ActiveCharacter | null = null;
    #initiativeMap: Map<string, StopObserving> = new Map();
    #activeCharacter: ValueObserver<ActiveCharacter | null> = new ValueObserver<ActiveCharacter | null>(null);
    #characters: ValueObserver<Array<ActiveCharacter>> = new ValueObserver<Array<ActiveCharacter>>([]);
    #characterAddedSignal = new Signal<CharacterAddedMessage>();

    constructor({ name, id, characters = [] }: EncounterProps) {
        this.#id = id;
        this.#name.value = name;
        if (characters) this.setCharacters(characters);
    }

    get newViewEncounter() {
        return new ViewEncounter({ encounter: this });
    }

    /**
     * Returns the characters in the encounter.
     */
    get characters(): Array<ActiveCharacter> {
        return this.#characters.value;
    }

    set characters(value: Array<ActiveCharacter>) {
        this.setCharacters(value);
    }

    /**
     * Returns a readonly observer for the characters.
     */
    get charactersObserver(): ReadonlyValueObserver<Array<ActiveCharacter>> {
        return this.#characters.readonly;
    }

    /**
     * The active character in the encounter.
     */
    get activeCharacter(): ActiveCharacter | null {
        return this.#activeCharacter.value;
    }

    /**
     * Returns a readonly observer for the active character.
     */
    get activeCharacterObserver(): ReadonlyValueObserver<ActiveCharacter | null> {
        return this.#activeCharacter.readonly;
    }

    get name() {
        return this.#name.value;
    }

    get id() {
        return this.#id;
    }


    /**
     * Adds a character to the encounter and sorts the characters by initiative.
     * @param initiativeCharacter
     */
    addCharacter = (initiativeCharacter: ActiveCharacter) => {
        this.setCharacters([...this.characters, initiativeCharacter]);
        this.#characterAddedSignal.emit({ character: initiativeCharacter });
    }

    /**
     * Sets the active character to the next character in the initiative order.
     */
    nextCharacter = () => {
        if (!this.characters.length) return;
        if (!this.activeCharacter) {
            this.setActiveCharacter(this.characters[0]);
            return;
        }

        const activeCharacterIndex = this.characters.indexOf(this.activeCharacter);
        if (activeCharacterIndex === -1) return;

        const nextCharacterIndex = activeCharacterIndex + 1 === this.characters.length ? 0 : activeCharacterIndex + 1;
        this.setActiveCharacter(this.characters[nextCharacterIndex]);
    };


    /**
     * Sets the active character to the previous character
     * in the initiative order when the encounter has been stopped.
     */
    restartEncounter = () => {
        console.log("Restart");
        if (!this.#lastActiveCharacter) {
            this.startEncounter();
            return;
        }
        if (this.activeCharacter) return;
        this.setActiveCharacter(this.#lastActiveCharacter);
    }

    /**
     * Sets the active character to first character in the initiative order if not already active.
     */
    startEncounter = () => {
        if (this.activeCharacter) return;
        if (!this.characters.length) return;
        this.setActiveCharacter(this.characters[0]);
    }

    /**
     * Stops the encounter
     */
    stopEncounter = () => {
        this.setActiveCharacter(null);
    }

    /**
     * Signals when a new character is added to the encounter.
     * @param observer
     */
    onCharacterAdded(observer: CharacterAddedMessage): SignalConnection {
        return this.#characterAddedSignal.connect(observer);
    }

    private setCharacters = (characters: Array<ActiveCharacter>) => {
        this.#characters.value = [...characters];
    }

    private resortCharacters = () => {
        this.#characters.value = [...this.characters].sort(sortInitiative);
    }

    private setActiveCharacter = (character: ActiveCharacter | null) => {
        this.#lastActiveCharacter = this.activeCharacter;
        this.#activeCharacter.value = character;
        if (character) {
            character.inPlay = true;
        }
        this.characters.forEach((character) => {
            if (character !== this.activeCharacter) character.inPlay = false;
        });
    }
}