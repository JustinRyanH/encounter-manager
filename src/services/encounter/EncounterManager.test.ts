import { describe, test, expect, vi, Mock } from "vitest";

import { EncounterManager } from "~/services/encounter/EncounterManager";
import * as Commands from './Commands';
import { Encounter } from "~/services/encounter/Encounter";

vi.mock('./Commands');

describe('EncounterManager', function () {
    test('starts with empty list of encounters', () => {
        const manager = new EncounterManager();
        expect(manager.encounters).toEqual({});
    });

    test('can refresh list of encounters', async () => {
        (Commands.listEncounter as Mock).mockResolvedValueOnce([{ id: '300', name: 'Test' }]);

        const manager = new EncounterManager();
        await manager.refreshList();
        expect(manager.encounters).toEqual([{ id: '300', name: 'Test' }]);
    });

    test('adds new encounters to the list', async () => {
        (Commands.listEncounter as Mock).mockResolvedValueOnce([{ id: '300', name: 'Test' }]);

        const manager = new EncounterManager();
        await manager.refreshList();

        const encounter_a = manager.getEncounter('300');
        expect(encounter_a?.id).toEqual('300');

        (Commands.listEncounter as Mock).mockResolvedValueOnce([
            { id: '300', name: 'Test' },
            { id: '400', name: 'Test Two' },
        ]);
        await manager.refreshList();

        const encounter_b = manager.getEncounter('400');
        expect(encounter_b?.id).toEqual('400');
        expect(manager.getEncounter('300')).toBe(encounter_a);
    });

    test('get encounter', async () => {
        (Commands.listEncounter as Mock).mockResolvedValueOnce([{ id: '300', name: 'Test' }]);

        const manager = new EncounterManager();
        await manager.refreshList();

        expect(manager.getEncounter('300')).toBeInstanceOf(Encounter);
        expect(manager.getEncounter('301')).toBeNull();
    });
});