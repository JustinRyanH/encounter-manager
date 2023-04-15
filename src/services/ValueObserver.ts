export interface ValueChangeMessageProps<T> {
    observer: ValueObserver<T>;
    newValue: T;
    oldValue: T;
}

export type ValueChangeMessage<T> = (props: ValueChangeMessageProps<T>) => void;

/**
 * A class that can be used to publish a single value to multiple subscribers.
 */
export class ValueObserver<T> {
    #value: T;
    #subscribers: Array<ValueChangeMessage<T>> = [];

    constructor(value: T) {
        this.#value = value;
    }

    /**
     * The current value of the publisher.
     */
    get value(): T {
        return this.#value;
    }

    /**
     * Sets the value of the publisher and notifies all subscribers.
     */
    set value(value: T) {
        const oldValue = this.#value;
        this.#value = value;
        this.#subscribers.forEach((subscriber) => subscriber({ observer: this, newValue: value, oldValue }));
    }

    /**
     * Sets the value to the given value and notifies all subscribers.
     * 
     * An alias for `value = value`.
     * @alias value = value
     * @param {T} value 
     */
    updateValue(value: T): void {
        this.value = value;
    }

    /**
     * Adds a subscriber to the publisher.
     * @param {ValueChangeMessage<T>} subscriber 
     */
    add(subscriber: ValueChangeMessage<T>): void {
        this.#subscribers.push(subscriber);
    }

    /**
     * Removes a subscriber from the publisher.
     * @param {ValueChangeMessage<T>} subscriber 
     */
    remove(subscriber: ValueChangeMessage<T>): void {
        this.#subscribers = this.#subscribers.filter((s) => s !== subscriber);
    }
}