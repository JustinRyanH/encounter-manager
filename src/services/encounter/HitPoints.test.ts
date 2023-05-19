import { afterEach, describe, expect, test, vi } from "vitest";

import { HitPoints } from "~/services/encounter/HitPoints";

vi.mock("@mantine/notifications");

describe("HitPoints", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("current", () => {
    test("return the current", () => {
      const hitPoints = new HitPoints({
        total: 10,
        current: 10,
        temporary: 0,
      });
      expect(hitPoints.current).toEqual(10);
    });

    test("can set the current", () => {
      const hitPoints = new HitPoints({
        total: 10,
        current: 0,
        temporary: 0,
      });
      hitPoints.current = 10;
      expect(hitPoints.current).toEqual(10);
    });

    test("current does not go over total", () => {
      const hitPoints = new HitPoints({
        total: 10,
        current: 10,
        temporary: 0,
      });
      hitPoints.current = 20;
      expect(hitPoints.current).toEqual(10);
    });

    test("can subscribe to current changes", () => {
      const hitPoints = new HitPoints({
        total: 20,
        current: 10,
        temporary: 0,
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

  describe("temp", () => {
    test("return the temp", () => {
      const hitPoints = new HitPoints({
        total: 10,
        current: 10,
        temporary: 0,
      });
      expect(hitPoints.temporary).toEqual(0);
    });

    test("can set the temp", () => {
      const hitPoints = new HitPoints({
        total: 10,
        current: 10,
        temporary: 0,
      });
      hitPoints.temporary = 20;
      expect(hitPoints.temporary).toEqual(20);
    });

    test("can subscribe to temp changes", () => {
      const hitPoints = new HitPoints({
        total: 10,
        current: 10,
        temporary: 0,
      });
      const observer = vi.fn();
      hitPoints.tempObserver.add(observer);
      hitPoints.temporary = 20;
      expect(observer).toHaveBeenCalledWith({
        newValue: 20,
        oldValue: 0,
      });
    });
  });
});
