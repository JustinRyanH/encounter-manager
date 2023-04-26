import { describe, test, expect, vi } from 'vitest';
import { listen } from '@tauri-apps/api/event';

import {TauriConnection} from "~/services/TauriConnection";
describe('TauriConnection', function () {
    test('it initializes with a name', () => {
        const connection = new TauriConnection({ name: 'test' });
        expect(connection.name).toEqual('test');
    });

    describe('start', () => {
        test('the connection starts listening to the tauri event', async () => {
            vi.mock('@tauri-apps/api/event');
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
    });
});