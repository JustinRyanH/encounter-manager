import { describe, test, vi } from 'vitest';

import { InitiativeCharacter } from './InititativeCharacter';

describe('InitiativeCharacter', () => {
    test('constructor', () => {
        const character = new InitiativeCharacter({
            name: 'Test',
            initiative: 10,
        });
        expect(character.name).toEqual('Test');
        expect(character.initiative).toEqual(10);
    });

    describe('name', () => {
        test('return the name', () => {
            const character = new InitiativeCharacter({
                name: 'Test',
                initiative: 10,
            });
            expect(character.name).toEqual('Test');
        });

        it('can set the name', () => {
            const character = new InitiativeCharacter({
                name: 'Test',
                initiative: 10,
            });
            character.name = 'Test2';
            expect(character.name).toEqual('Test2');
        });

        it('can subscribe to name changes', () => {
            const character = new InitiativeCharacter({
                name: 'Test',
                initiative: 10,
            });
            const observer = vi.fn();
            character.nameObserver.add(observer);
            character.name = 'Test2';
            expect(observer).toHaveBeenCalledWith({
                observer: character.nameObserver,
                newValue: 'Test2',
                oldValue: 'Test',
            });
        });
    });

    describe('initiative', () => {
        test('return the initiative', () => {
            const character = new InitiativeCharacter({
                name: 'Test',
                initiative: 10,
            });
            expect(character.initiative).toEqual(10);
        });

        it('can set the initiative', () => {
            const character = new InitiativeCharacter({
                name: 'Test',
                initiative: 10,
            });
            character.initiative = 20;
            expect(character.initiative).toEqual(20);
        });

        it('can subscribe to initiative changes', () => {
            const character = new InitiativeCharacter({
                name: 'Test',
                initiative: 10,
            });
            const observer = vi.fn();
            character.initiativeObserver.add(observer);
            character.initiative = 20;
            expect(observer).toHaveBeenCalledWith({
                observer: character.initiativeObserver,
                newValue: 20,
                oldValue: 10,
            });
        });
    });
});