import { afterEach, describe, expect, test, vi } from 'vitest';

import { ActiveCharacter } from './ActiveCharacter';
import { notifications } from '@mantine/notifications';

vi.mock('@mantine/notifications');

describe('ActiveCharacter', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    test('constructor', () => {
        const character = new ActiveCharacter({
            id: 'test-id',
            name: 'Test',
            initiative: 10,
        });
        expect(character.name).toEqual('Test');
        expect(character.initiative).toEqual(10);
    });

    describe('update', () => {
        test('fails if the id is not the same as the character', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            expect(() => character.update({ id: 'bad-id' })).toThrow('Id Mismatch for character');
        });

        test('updates the name if it changes', () => {
            const observer = vi.fn();
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.nameObserver.add(observer);
            character.update({ id: 'test-id', name: 'New Name'});
            expect(character.name).toEqual('New Name');
            expect(observer).toHaveBeenCalledWith(expect.objectContaining({ newValue: 'New Name' }));
        });

        test('updates the initiative', () => {
            const observer = vi.fn();
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.initiativeObserver.add(observer);
            character.update({ id: 'test-id', initiative: 20});
            expect(character.initiative).toEqual(20);
            expect(observer).toHaveBeenCalledWith(expect.objectContaining({ newValue: 20 }));
        });

        test('updates the current hit points', () => {
            const observer = vi.fn();
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
                hp: {
                    total: 10,
                    current: 10,
                    temp: 0,
                }
            });
            character.hp.currentObserver.add(observer);
            character.update({ id: 'test-id', hp: { current: 5 }});
            expect(character.hp.current).toEqual(5);
            expect(observer).toHaveBeenCalledWith(expect.objectContaining({ newValue: 5 }));

        });

        test('updates the total hit points', () => {
            const observer = vi.fn();
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
                hp: {
                    total: 10,
                    current: 10,
                    temp: 0,
                }
            });
            character.hp.totalObserver.add(observer);
            character.update({ id: 'test-id', hp: { total: 5 }});
            expect(character.hp.total).toEqual(5);
            expect(character.hp.current).toEqual(5);
            expect(observer).toHaveBeenCalledWith(expect.objectContaining({ newValue: 5 }));
        });

        test('updates the temp hit points', () => {
            const observer = vi.fn();
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
                hp: {
                    total: 10,
                    current: 10,
                    temp: 0,
                }
            });
            character.hp.tempObserver.add(observer);
            character.update({ id: 'test-id', hp: { temp: 5 }});
            expect(character.hp.temp).toEqual(5);
            expect(observer).toHaveBeenCalledWith(expect.objectContaining({ newValue: 5 }));
        });

        test('no-ops if there are no differences', () => {
            const nameObserver = vi.fn();
            const initiativeObserver = vi.fn();
            const currentObserver = vi.fn();
            const totalObserver = vi.fn();
            const tempObserver = vi.fn();

            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
                hp: {
                    total: 7,
                    current: 10,
                    temp: 3,
                }
            });
            character.nameObserver.add(nameObserver);
            character.initiativeObserver.add(initiativeObserver);
            character.hp.currentObserver.add(currentObserver);
            character.hp.totalObserver.add(totalObserver);
            character.hp.tempObserver.add(tempObserver);

            character.update({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
                hp: {
                    total: 7,
                    current: 10,
                    temp: 3,
                }
            });

            expect(nameObserver).not.toHaveBeenCalled();
            expect(initiativeObserver).not.toHaveBeenCalled();
            expect(currentObserver).not.toHaveBeenCalled();
            expect(totalObserver).not.toHaveBeenCalled();
            expect(tempObserver).not.toHaveBeenCalled();
        });
    });

    describe('name', () => {
        test('return the name', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            expect(character.name).toEqual('Test');
        });

        test('can set the name', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.name = 'Test2';
            expect(character.name).toEqual('Test2');
        });

        test('can subscribe to name changes', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            const observer = vi.fn();
            character.nameObserver.add(observer);
            character.name = 'Test2';
            expect(observer).toHaveBeenCalledWith({
                newValue: 'Test2',
                oldValue: 'Test',
            });
        });
    });

    describe('initiative', () => {
        test('return the initiative', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            expect(character.initiative).toEqual(10);
        });

        test('can set the initiative', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.initiative = 20;
            expect(character.initiative).toEqual(20);
        });

        test('can subscribe to initiative changes', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            const observer = vi.fn();
            character.initiativeObserver.add(observer);
            character.initiative = 20;
            expect(observer).toHaveBeenCalledWith({
                newValue: 20,
                oldValue: 10,
            });
        });
    });

    describe('updateInitiative', () => {
        test('can update initiative', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.updateInitiative(20);
            expect(character.initiative).toEqual(20);
        });

        test('if the initiative is not a number, it does not update', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.updateInitiative(null);
            expect(character.initiative).toEqual(10);
        });

        test('if the initiative is not a number, it broadcasts a notification', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.updateInitiative(null);
            expect(notifications.show).toHaveBeenCalledWith({
                title: 'Invalid Initiative',
                message: 'Initiative cannot be empty',
                color: 'red',
            });
        });
    });

    describe('updateName', () => {
        test('can update name', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.updateName('Test2');
            expect(character.name).toEqual('Test2');
        });

        test('reverts name if empty', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.updateName('');
            expect(character.name).toEqual('Test');
        });

        test('notififies if name is empty', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.updateName('');
            expect(notifications.show).toHaveBeenCalledWith({
                title: 'Invalid Name',
                message: 'Name cannot be empty',
                color: 'red',
            });
        });
    });

    describe('observeInitiative', function () {
        test('can subscribe to initiative changes', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            const observer = vi.fn();
            character.observeInitiative(observer);
            character.initiative = 20;
            expect(observer).toHaveBeenCalledWith({
                newValue: 20,
                oldValue: 10,
            });
        });

        test('can unsubscribe from initiative changes', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            const observer = vi.fn();
            const unsubscribe = character.observeInitiative(observer);
            unsubscribe();
            character.initiative = 20;
            expect(observer).not.toHaveBeenCalled();
        });
    });

    describe('inPlay', () => {
        test('defaults to  false', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            expect(character.inPlay).toEqual(false);
        });

        test('inPlay can be updated', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            character.inPlay = true;
            expect(character.inPlay).toEqual(true);
        });

        test('changing inPlay will notify observers', () => {
            const character = new ActiveCharacter({
                id: 'test-id',
                name: 'Test',
                initiative: 10,
            });
            const observer = vi.fn();
            character.inPlayObserver.add(observer);
            character.inPlay = true;
            expect(observer).toHaveBeenCalledWith({
                newValue: true,
                oldValue: false,
            });
        });
    });
});