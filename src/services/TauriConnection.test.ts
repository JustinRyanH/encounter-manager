import { describe, test, expect, vi, afterEach, Mock, beforeEach } from 'vitest';
import { listen } from '@tauri-apps/api/event';

import { TauriConnection } from "~/services/TauriConnection";

vi.mock('@tauri-apps/api/event');

describe('TauriConnection', function () {
    const stopListening = vi.fn();
    beforeEach(() => {
        (listen as Mock).mockResolvedValue(stopListening);
    });

    afterEach(() => {
        vi.clearAllMocks();
        stopListening.mockClear();
    });

    test('it initializes with a name', () => {
        const connection = new TauriConnection({ name: 'test' });
        expect(connection.name).toEqual('test');
    });

    describe('start', () => {
        test('the connection starts listening to the tauri event', async () => {
            const connection = new TauriConnection({ name: 'test' });
            await connection.start();

            expect(listen).toHaveBeenCalledWith('test', expect.any(Function));
        });

        test('will only call the listen function once', async () => {
            const connection = new TauriConnection({ name: 'test' });
            await connection.start();
            await connection.start();

            expect(listen).toHaveBeenCalledTimes(1);
        });

        test('sets up a stopListening function', async () => {
            const connection = new TauriConnection({ name: 'test' });
            await connection.start();

            expect(connection.isWatching).toEqual(true);
            expect(connection.isAbleToStop).toEqual(true);
        });
    });

    describe('stop', () => {
        beforeEach(() => {
            vi.useFakeTimers()
        });

        afterEach(() => {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        });

        test('stop listening to the tauri event', async () => {
            vi.useFakeTimers();
            const connection = new TauriConnection({ name: 'test' });
            await connection.start();

            expect(connection.isWatching).toEqual(true);
            expect(connection.isAbleToStop).toEqual(true);

            const result = connection.stop();
            vi.runAllTimers();
            await expect(result).resolves.toBeUndefined();

            expect(stopListening).toHaveBeenCalled();
        });
    });

    describe('addConnection', function () {
        test('pushing changes from tauri to the connection callback', () => {
            const connection = new TauriConnection({ name: 'test' });
            const callback = vi.fn();
            connection.addConnection(callback);
        });
    });

    describe('removeConnection', function () {
        interface TestEvent {
            payload: string;
        }

        test('stop pushing changes from tauri to the connection callback', async () => {
            let outerCallback: (message: TestEvent) => void = () => { };
            (listen as Mock).mockImplementation((_name, cb) => {
                outerCallback = cb;
                return stopListening;
            });
            const connection = new TauriConnection<string>({ name: 'test' });
            await connection.start();
            const callback = vi.fn();

            connection.addConnection(callback);

            expect(outerCallback).toBeDefined();
            outerCallback({ payload: 'test' });

            expect(callback).toHaveBeenCalledWith('test');
        });
    });
});