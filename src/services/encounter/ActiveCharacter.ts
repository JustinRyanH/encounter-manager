import { HitPoints } from "~/services/encounter/HitPoints";
import { ReadonlyValueObserver, StopObserving, ValueChangeMessage, ValueObserver } from "../ValueObserver";
import { notifyErrors } from "~/services/notifications";

interface InitiativeCharacterProps {
    id: string,
    name: string;
    initiative: number;
    maxHp?: number;
    tempHp?: number | null;
}

/**
 * A Tracked Character
 */
export class ActiveCharacter {
    static ValidateName = (name: string | null): string[] => {
        if (!name) return ['Name cannot be empty'];
        return [];
    }

    static ValidateInitiative(value: number | null) {
        if (!value) return ['Initiative cannot be empty'];
        return [];
    }

    static newCharacter(param: InitiativeCharacterProps): ActiveCharacter {
        return new ActiveCharacter(param);
    }

    #id: string;
    #name: ValueObserver<string>;
    #initiative: ValueObserver<number>;
    #hp: HitPoints = new HitPoints();
    #inPlay: ValueObserver<boolean> = new ValueObserver<boolean>(false);

    constructor({ id, name, initiative, maxHp = 10 }: InitiativeCharacterProps) {
        this.#id = id;
        this.#initiative = new ValueObserver(initiative);
        this.#name = new ValueObserver(name);
        this.#hp.total = maxHp;
        this.#hp.current = maxHp;
    }

    /**
     * Returns a globally unique identifier for this character instance
     */
    get id() {
        return this.#id;
    }

    /**
     * The name of the character
     */
    get name(): string {
        return this.#name.value;
    }

    /**
     * Update name of the character, and notify observers
     * @param name
     */
    set name(name: string) {
        const errors = this.#validateName(name).join(', ');
        if (notifyErrors({ errors, title: 'Invalid Name' })) return;

        this.#name.value = name;
    }

    /**
     * Observer for the name of the character
     */
    get nameObserver(): ReadonlyValueObserver<string> {
        return this.#name.readonly;
    }

    /**
     * if the character is in play
     */
    get inPlay(): boolean {
        return this.#inPlay.value;
    }

    /**
     * Update name of the character, and notify observers
     * @param newValue
     */
    set inPlay(newValue: boolean) {
        this.#inPlay.value = newValue;
    }

    /**
     * Observer for the initiative of the character
     */
    get inPlayObserver(): ReadonlyValueObserver<boolean> {
        return this.#inPlay.readonly;
    }

    /**
     * The initiative of the character
     */
    get initiative(): number {
        return this.#initiative.value;
    }

    /**
     * Update initiative of the character, and notify observers
     * @param initiative
     */
    set initiative(initiative: number) {
        this.#initiative.value = initiative;
    }

    /**
     * Observer for the initiative of the character
     */
    get initiativeObserver(): ReadonlyValueObserver<number> {
        return this.#initiative.readonly;
    }

    /**
     * The hit points of the character
     */
    get hp(): HitPoints {
        return this.#hp;
    }

    /**
     * Update total hit points, and notify observers
     * @param initiative
     */
    updateInitiative = (initiative: number | null): void => {
        const errors = this.#validateInitiative(initiative).join(', ');
        if (notifyErrors({ errors, title: 'Invalid Initiative' })) return;
        this.initiative = initiative || 0;
    };

    /**
     * Update total hit points, and notify observers
     * @param name
     */
    updateName = (name: string) => {
        this.name = name;
    }

    /**
     * Observer for the initiative of the character
     * @param message
     * @return unsubscribe function
     */
    observeInitiative = (message: ValueChangeMessage<number>): StopObserving => {
        this.#initiative.add(message);
        return () => this.#initiative.remove(message);
    }

    #validateName = (name: string | null): string[] => ActiveCharacter.ValidateName(name)
    #validateInitiative = (value: number | null): string[] => ActiveCharacter.ValidateInitiative(value)
}