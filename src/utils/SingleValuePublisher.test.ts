import { describe, expect, test, vi } from 'vitest'
import { SingleValuePublisher } from './SingleValuePublisher';

describe('SingleValuePublisher', () => {
    test('should publish a value to a subscriber', () => {
        const publisher = new SingleValuePublisher(0);
        const subscriber = vi.fn();
        publisher.subscribe(subscriber);
        publisher.updateValue(1);
        expect(subscriber).toBeCalledWith({ publisher, newValue: 1, oldValue: 0 });
    });
});