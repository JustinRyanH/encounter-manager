import { describe, expect, test, vi } from "vitest";
import { ValueObserver } from "./ValueObserver";

describe("SingleValuePublisher", () => {
  test("should publish a value to a subscriber", () => {
    const observer = new ValueObserver(0);
    const subscriber = vi.fn();
    observer.add(subscriber);
    observer.updateValue(1);
    expect(subscriber).toHaveBeenCalledWith({ newValue: 1, oldValue: 0 });
  });

  test("can remove a subscriber", () => {
    const observer = new ValueObserver(0);
    const subscriber = vi.fn();
    observer.add(subscriber);
    observer.remove(subscriber);
    observer.updateValue(1);
    expect(subscriber).not.toBeCalled();
  });
});
