import { describe, expect, test } from 'vitest';
import { Encounters } from "~/services/Encounters";
import { InitiativeCharacter } from "~/services/InititativeCharacter";

describe('Encounters', function () {
    test('does not have any characters by default', function () {
        const encounters = new Encounters();
        expect(encounters.characters).toEqual([]);
    });

    test('can be initialized with characters', function () {
        const characterA = new InitiativeCharacter({ name: 'A', initiative: 1 });
        const characterB = new InitiativeCharacter({ name: 'B', initiative: 2 });

        const encounters = new Encounters({ characters: [characterA, characterB] });

        expect(encounters.characters).toEqual([characterB, characterA]);
    });

    test('orders characters by initiative', function () {
        const characterA = new InitiativeCharacter({ name: 'A', initiative: 1 });
        const characterB = new InitiativeCharacter({ name: 'B', initiative: 2 });

        const encounters = new Encounters({ characters: [characterA, characterB] });

        expect(encounters.characters.map(c => c.name)).toEqual(['B', 'A']);
    });
});