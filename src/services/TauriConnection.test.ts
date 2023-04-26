import { describe, test, expect, vi, afterEach, Mock } from 'vitest';
import { listen } from '@tauri-apps/api/event';

import {TauriConnection} from "~/services/TauriConnection";

vi.mock('@tauri-apps/api/event');

describe('TauriConnection', function () {
    const stopListening = vi.fn();
    afterEach(() => {
        vi.clearAllMocks();
        stopListening.mockClear();
        (listen as Mock).mockResolvedValue(stopListening);
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
});