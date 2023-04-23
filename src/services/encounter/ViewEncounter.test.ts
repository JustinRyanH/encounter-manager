import { describe, expect, test } from 'vitest';

import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";
import { Encounter } from "~/services/encounter/Encounter";
import { ViewEncounter } from "~/services/encounter/ViewEncounter";


describe('ViewEncounter', () => {
    describe('openedCharacters', () => {
        test('returns the active character', () => {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounter = new Encounter({ characters: [characterA, characterB] })
            const viewEncounter = new ViewEncounter({ encounter });

            encounter.startEncounter();
            expect(viewEncounter.openedCharacters).toEqual([characterA]);
        });

        test('returns an empty array if there is no active character', () => {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounter = new Encounter({ characters: [characterA, characterB] })
            const viewEncounter = new ViewEncounter({ encounter });

            expect(encounter.activeCharacter).toEqual(null);
            expect(viewEncounter.openedCharacters).toEqual([]);
        });

        it('allows adding new characters be opened', () => {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounter = new Encounter({ characters: [characterA, characterB] })
            const viewEncounter = new ViewEncounter({ encounter });

            expect(viewEncounter.openedCharacters).toEqual([]);
            viewEncounter.open(characterA.id);

            expect(viewEncounter.openedCharacters).toEqual([characterA]);

            viewEncounter.open(characterB.id);

            expect(viewEncounter.openedCharacters).toEqual([characterA, characterB]);
        });
    });
});