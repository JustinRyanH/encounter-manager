import { describe, expect, test, vi } from 'vitest';
import { Encounter } from "~/services/encounter/Encounter";
import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";

describe('Encounter', function () {
    test('does not have any characters by default', function () {
        const encounters = new Encounter({ name: 'Test Encounter', id: 'encounter-a' });
        expect(encounters.characters).toEqual([]);
    });

    test('can be initialized with characters', function () {
        const characterA = new ActiveCharacter({ name: 'A', initiative: 1 });
        const characterB = new ActiveCharacter({ name: 'B', initiative: 2 });

        const encounters = new Encounter({
            name: 'Test Encounter',
            id: 'encounter-a',
            characters: [characterA, characterB]
        });

        expect(encounters.characters).toEqual([characterB, characterA]);
    });

    test('newCharacter', () => {
        const result = ActiveCharacter.newCharacter({ name: 'A', initiative: 1, hp: 10 });

        expect(result.name).toEqual('A');
        expect(result.initiative).toEqual(1);
        expect(result.hp.total).toEqual(10);
    });

    test('orders characters by initiative', function () {
        const characterA = new ActiveCharacter({ name: 'A', initiative: 1 });
        const characterB = new ActiveCharacter({ name: 'B', initiative: 2 });

        const encounters = new Encounter({
            name: 'Test Encounter',
            id: 'encounter-a',
            characters: [characterA, characterB]
        });

        expect(encounters.characters.map(c => c.name)).toEqual(['B', 'A']);
    });

    describe('addCharacter', function () {
        test('adds a character to the encounter', function () {
            const encounters = new Encounter({ name: 'Test Encounter', id: 'encounter-a' });

            encounters.addCharacter(new ActiveCharacter({ name: 'A', initiative: 1 }));

            expect(encounters.characters.map(c => c.name)).toEqual(['A']);
        });

        test('sorts the characters by initiative', function () {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 5 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 15 });

            const encounters = new Encounter({
                name: 'Test Encounter',
                id: 'encounter-a',
                characters: [characterA, characterB]
            });

            encounters.addCharacter(new ActiveCharacter({ name: 'C', initiative: 20 }));
            encounters.addCharacter(new ActiveCharacter({ name: 'D', initiative: 1 }));

            expect(encounters.characters.map(c => c.name)).toEqual(['C', 'B', 'A', 'D']);
        });

        test('notifies the `characterAdded` signal', function () {
            const observer = vi.fn();
            const characterA = new ActiveCharacter({ name: 'A', initiative: 5 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 15 });

            const encounters = new Encounter({
                name: 'Test Encounter',
                id: 'encounter-a',
                characters: [characterA, characterB]
            });
            encounters.onCharacterAdded(observer);


            const newCharacter = new ActiveCharacter({ name: 'C', initiative: 20 });
            encounters.addCharacter(newCharacter);

            expect(observer).toHaveBeenCalledWith({ character: newCharacter });
        });
    });

    describe('auto sorting characters', function () {
        test('sorts characters when initiative changes', function () {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounters = new Encounter({
                name: 'Test Encounter',
                id: 'encounter-a',
                characters: [characterA, characterB]
            });

            expect(encounters.characters.map(c => c.name)).toEqual(['A', 'B']);

            characterB.initiative = 20;

            expect(encounters.characters.map(c => c.name)).toEqual(['B', 'A']);
        });
    });

    describe('current character', function () {
        test('starting with character on top of the initiative list', function () {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounters = new Encounter({
                name: 'Test Encounter',
                id: 'encounter-a',
                characters: [characterA, characterB]
            });
            encounters.nextCharacter();

            expect(encounters.activeCharacter).toEqual(characterA);
            expect(characterA.inPlay).toEqual(true);
        });

        test('moves to next character when nextCharacter is called', function () {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounters = new Encounter({
                name: 'Test Encounter',
                id: 'encounter-a',
                characters: [characterA, characterB]
            });

            expect(encounters.activeCharacter).toEqual(null);
            expect(characterA.inPlay).toEqual(false);
            expect(characterB.inPlay).toEqual(false);

            encounters.nextCharacter();

            expect(encounters.activeCharacter).toEqual(characterA);
            expect(characterA.inPlay).toEqual(true);
            expect(characterB.inPlay).toEqual(false);

            encounters.nextCharacter();

            expect(encounters.activeCharacter).toEqual(characterB);
            expect(characterA.inPlay).toEqual(false);
            expect(characterB.inPlay).toEqual(true);
        });

        test('signaling when the current character changes', function () {
            const listener = vi.fn();
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounters = new Encounter({
                name: 'Test Encounter',
                id: 'encounter-a',
                characters: [characterA, characterB]
            });
            encounters.startEncounter();

            encounters.activeCharacterObserver.add(listener);

            encounters.nextCharacter();

            expect(listener).toHaveBeenCalledWith({ oldValue: characterA, newValue: characterB });
        });
    });

    describe('startEncounter', function () {
        test('sets the active character to the first character', function () {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounters = new Encounter({
                name: 'Test Encounter',
                id: 'encounter-a',
                characters: [characterA, characterB]
            });
            encounters.stopEncounter();

            expect(encounters.activeCharacter).toEqual(null);

            encounters.startEncounter();

            expect(encounters.activeCharacter).toEqual(characterA);
        });

        test('no-ops if the character is already active character', function () {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounters = new Encounter({
                name: 'Test Encounter',
                id: 'encounter-a',
                characters: [characterA, characterB]
            });
            encounters.startEncounter();
            encounters.nextCharacter();

            expect(encounters.activeCharacter).toEqual(characterB);

            encounters.startEncounter();

            expect(encounters.activeCharacter).toEqual(characterB);
        });

        test('no-ops if there are no characters', function () {
            const encounters = new Encounter({ name: 'Test Encounter', id: 'encounter-a' });

            expect(encounters.activeCharacter).toEqual(null);

            encounters.startEncounter();

            expect(encounters.activeCharacter).toEqual(null);
        });
    });

    describe('stopEncounter', function () {
        test('clears the active character', function () {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounters = new Encounter({
                name: 'Test Encounter',
                id: 'encounter-a',
                characters: [characterA, characterB]
            });
            encounters.startEncounter();

            expect(encounters.activeCharacter).toEqual(characterA);

            encounters.stopEncounter();

            expect(encounters.activeCharacter).toEqual(null);
        });
    });

    describe('restartEncounter', function () {
        test('picks up encounter where it left off', function () {
            const characterA = new ActiveCharacter({ name: 'A', initiative: 10 });
            const characterB = new ActiveCharacter({ name: 'B', initiative: 5 });

            const encounters = new Encounter({
                name: 'Test Encounter',
                id: 'encounter-a',
                characters: [characterA, characterB]
            });
            encounters.startEncounter();
            encounters.nextCharacter();

            expect(encounters.activeCharacter).toEqual(characterB);

            encounters.stopEncounter();

            expect(encounters.activeCharacter).toEqual(null);

            encounters.restartEncounter();

            expect(encounters.activeCharacter).toEqual(characterB);
        });
    });
});