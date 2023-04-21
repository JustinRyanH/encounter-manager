import { test, vi, describe, expect } from 'vitest';
import { HitPoints } from "~/services/HitPoints";

describe('HitPoints', () => {
    describe('total', () => {
        test('return the total', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 0,
            });
            expect(hitPoints.total).toEqual(10);
        });

        test('can set the total', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 0,
            });
            hitPoints.total = 20;
            expect(hitPoints.total).toEqual(20);
        });

        test('can subscribe to total changes', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 0,
            });
            const observer = vi.fn();
            hitPoints.totalObserver.add(observer);
            hitPoints.total = 20;
            expect(observer).toHaveBeenCalledWith({
                newValue: 20,
                oldValue: 10,
            });
        });

        test('if incoming total is null, ignore it', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 0,
            });
            hitPoints.setTotal(null);
            expect(hitPoints.total).toEqual(10);
        });
    });

    describe('current', () => {
        test('return the current', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 0,
            });
            expect(hitPoints.current).toEqual(10);
        });

        test('can set the current', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 0,
                temp: 0,
            });
            hitPoints.current = 10;
            expect(hitPoints.current).toEqual(10);
        });

        test('current does not go over total', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 0,
            });
            hitPoints.current = 20;
            expect(hitPoints.current).toEqual(10);
        });

        test('can subscribe to current changes', () => {
            const hitPoints = new HitPoints({
                total: 20,
                current: 10,
                temp: 0,
            });
            const observer = vi.fn();
            hitPoints.currentObserver.add(observer);
            hitPoints.current = 20;
            expect(observer).toHaveBeenCalledWith({
                newValue: 20,
                oldValue: 10,
            });
        });
    });

    describe('temp', () => {
        test('return the temp', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 0,
            });
            expect(hitPoints.temp).toEqual(0);
        });

        test('can set the temp', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 0,
            });
            hitPoints.temp = 20;
            expect(hitPoints.temp).toEqual(20);
        });

        test('can subscribe to temp changes', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 0,
            });
            const observer = vi.fn();
            hitPoints.tempObserver.add(observer);
            hitPoints.temp = 20;
            expect(observer).toHaveBeenCalledWith({
                newValue: 20,
                oldValue: 0,
            });
        });

        test('if incoming temp is null, ignore it', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 3,
            });
            hitPoints.setTemp(null);
            expect(hitPoints.temp).toEqual(3);
        });
    });

    describe('damage', () => {
        test('can damage current', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 0,
            });
            hitPoints.damage(5);
            expect(hitPoints.current).toEqual(5);
        });

        test('if temp is available, damage temp first', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 5,
            });
            hitPoints.damage(6);
            expect(hitPoints.current).toEqual(9);
            expect(hitPoints.temp).toEqual(0);
        });

        test('if damage is less than temp, only damage temp', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 10,
                temp: 5,
            });
            hitPoints.damage(3);
            expect(hitPoints.current).toEqual(10);
            expect(hitPoints.temp).toEqual(2);
        });
    });

    describe('heal', () => {
        test('can heal current', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 5,
                temp: 0,
            });
            hitPoints.heal(5);
            expect(hitPoints.current).toEqual(10);
        });

        test('if heal results in current being greater than total, set current to total', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 5,
                temp: 0,
            });
            hitPoints.heal(6);
            expect(hitPoints.current).toEqual(10);
        });

        test('heal does not affect temporary hit points', () => {
            const hitPoints = new HitPoints({
                total: 10,
                current: 5,
                temp: 5,
            });
            hitPoints.heal(6);
            expect(hitPoints.current).toEqual(10);
            expect(hitPoints.temp).toEqual(5);
        });
    });
});