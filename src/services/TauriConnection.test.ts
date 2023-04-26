import { describe, test, expect } from 'vitest';

import {TauriConnection} from "~/services/TauriConnection";
describe('TauriConnection', function () {
    test('it initializes with a name', () => {
        const connection = new TauriConnection({ name: 'test' });
        expect(connection.name).toEqual('test');
    });
});