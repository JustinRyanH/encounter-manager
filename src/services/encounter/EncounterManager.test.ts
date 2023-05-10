import { describe, test, expect, vi, Mock } from "vitest";

import { EncounterManager } from "~/services/encounter/EncounterManager";
import * as Commands from './Commands';
import { Encounter } from "~/services/encounter/Encounter";

vi.mock('./Commands');

interface MockEncounterProps {
    id?: string;
    name?: string;
    characters?: any[],
}
function buildMockEncounter(props: MockEncounterProps = {}) {
    return {
        id: props.id || '300',
        name: props.name || 'Test' ,
        characters: props.characters || [],
    };
}

describe('EncounterManager', function () {
    test('starts with empty list of encounters', () => {
        const manager = new EncounterManager();
        expect(manager.encounters).toEqual([]);
    });

    describe('refreshList', function () {
        test('can refresh list of encounters', async () => {
            (Commands.listEncounter as Mock).mockResolvedValueOnce([buildMockEncounter()]);

            const manager = new EncounterManager();
            await manager.refreshList();
            expect(manager.encounters.map(e => e.id)).toEqual(['300']);
        });

        test('adds new encounters to the list', async () => {
            (Commands.listEncounter as Mock).mockResolvedValueOnce([buildMockEncounter()]);

            const manager = new EncounterManager();
            await manager.refreshList();

            const encounter_a = manager.getEncounter('300');
            expect(encounter_a?.id).toEqual('300');

            (Commands.listEncounter as Mock).mockResolvedValueOnce([
                buildMockEncounter({ id: '300', name: 'Test' }),
                buildMockEncounter({ id: '400', name: 'Test Two' }),
            ]);
            await manager.refreshList();

            const encounter_b = manager.getEncounter('400');
            expect(encounter_b?.id).toEqual('400');
            expect(manager.getEncounter('300')).toBe(encounter_a);
        });
    });

    describe('getEncounter', () => {
        test('get encounter', async () => {
            (Commands.listEncounter as Mock).mockResolvedValueOnce([
                buildMockEncounter({ id: '300', name: 'Test' }),
            ]);

            const manager = new EncounterManager();
            await manager.refreshList();

            expect(manager.getEncounter('300')).toBeInstanceOf(Encounter);
            expect(manager.getEncounter('301')).toBeNull();
        });
    });
});