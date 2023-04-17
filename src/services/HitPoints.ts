import { ReadonlyValueObserver, ValueObserver } from "~/services/ValueObserver";

interface HitPointsProps {
    total?: number;
    current?: number;
    temp?: number;
}

/**
 * A class that represents a character's hit points.
 */
export class HitPoints {
    #total: ValueObserver<number> = new ValueObserver(0);
    #current: ValueObserver<number> = new ValueObserver(0);
    #temp: ValueObserver<number> = new ValueObserver<number>(0);

    constructor({ total = 0, current = 0, temp = 0 }: HitPointsProps = {}) {
        this.#total.value = total;
        this.#current.value = current;
        this.#temp.value = temp;
    }

    /**
     * Total hit points.
     */
    get total(): number {
        return this.#total.value;
    }


    /**
     * Update total hit points, and notify observers
     * @param total
     */
    set total(total: number) {
        this.#total.value = total;
    }

    /**
     * Observer for total hit points.
     */
    get totalObserver(): ReadonlyValueObserver<number> {
        return this.#total.readonly;
    }

    /**
     * Current hit points.
     */
    get current(): number {
        return this.#current.value;
    }

    /**
     * Update current hit points, and notify observers
     * @param current
     */
    set current(current: number) {
        this.#current.value = Math.min(current, this.total);
    }

    /**
     * Observer for current hit points.
     */
    get currentObserver(): ReadonlyValueObserver<number> {
        return this.#current.readonly;
    }

    /**
     * Temporary hit points.
     */
    get temp(): number {
        return this.#temp.value;
    }

    /**
     * Update temporary hit points, and notify observers
     * @param temp
     */
    set temp(temp: number) {
        this.#temp.value = temp;
    }

    /**
     * Observer for temporary hit points.
     */
    get tempObserver(): ReadonlyValueObserver<number> {
        return this.#temp.readonly;
    }

    /**
     * Update current hit points, and notify observers
     * @param value
     */
    setCurrent = (value: number) => {
        this.current = value;
    }

    /**
     * Update total hit points, and notify observers
     * @param value 
     */
    setTotal = (value: number) => {
        this.total = value;
    }

    /**
     * Update temporary hit points, and notify observers
     */
    setTemp = (value: number) => {
        this.temp = value;
    }

    /**
     * Damage the character and notify observers
     *
     * If the character has temporary hit points, damage those first then the current
     * @param amount
     */
    damage = (amount: number) => {
        const leftOver = this.temp - amount;
        if (leftOver >= 0) {
            this.temp -= amount;
            return;
        }

        this.temp = 0;
        this.current = Math.max(this.current - Math.abs(leftOver), 0);
    }

    /**
     * Heal the character but not above the total hit points and notify observers
     * @param amount
     */
    heal = (amount: number) => {
        this.current += amount;
    }
}