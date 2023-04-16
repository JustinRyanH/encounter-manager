export interface ValueChangeMessageProps<T> {
    newValue: T;
    oldValue: T;
}

export type ValueChangeMessage<T> = (props: ValueChangeMessageProps<T>) => void;

/**
 * Watches a ValueObserver and prevents subscribers from modifying the value.
 */
export class ReadonlyValueObserver<T> {
    #observer: ValueObserver<T>;

    constructor(observer: ValueObserver<T>) {
        this.#observer = observer;
    }

    /**
     * The current value of the publisher.
     */
    get value(): T {
        return this.#observer.value;
    }

    /**
     * Sets the value of the publisher and notifies all subscribers. 
     */
    add(subscriber: ValueChangeMessage<T>): void {
        this.#observer.add(subscriber);
    }

    /**
     * Removes a subscriber from the publisher.
     * @param subscriber 
     */
    remove(subscriber: ValueChangeMessage<T>): void {
        this.#observer.remove(subscriber);
    }
}

/**
 * A class that can be used to publish a single value to multiple subscribers.
 */
export class ValueObserver<T> {
    #readonly: ReadonlyValueObserver<T>;
    #value: T;
    #subscribers: Array<ValueChangeMessage<T>> = [];

    constructor(value: T) {
        this.#value = value;
        this.#readonly = new ReadonlyValueObserver(this);
    }

    get readonly(): ReadonlyValueObserver<T> {
        return this.#readonly;
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
        this.#subscribers.forEach((subscriber) => subscriber({ newValue: value, oldValue }));
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