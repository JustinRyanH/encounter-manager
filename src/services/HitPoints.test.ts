import {test, vi, describe} from 'vitest';
import {HitPoints} from "~/services/HitPoints";

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
                observer: hitPoints.totalObserver,
                newValue: 20,
                oldValue: 10,
            });
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
                observer: hitPoints.currentObserver,
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
                observer: hitPoints.tempObserver,
                newValue: 20,
                oldValue: 0,
            });
        });
    });
});