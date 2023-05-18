import { ReadonlyValueObserver, ValueObserver } from "~/services/ValueObserver";
import { HitPoints as ServerHitPoints } from "~/encounterBindings";

export type HitPointsProps = {
  [K in keyof ServerHitPoints]?: ServerHitPoints[K];
};

/**
 * A class that represents a character's hit points.
 */
export class HitPoints {
  #total: ValueObserver<number> = new ValueObserver(0);
  #current: ValueObserver<number> = new ValueObserver(0);
  #temp: ValueObserver<number> = new ValueObserver<number>(0);

  constructor({ total = 0, current = 0, temporary = 0 }: HitPointsProps = {}) {
    this.#total.value = total;
    this.#current.value = current;
    this.#temp.value = temporary;
  }

  /**
   * Total hit points.
   */
  get total(): number {
    return this.#total.value;
  }

  /**
   * Update total hit points, and notify observers
   * @param total
   */
  set total(total: number) {
    this.#total.value = total;
    if (this.current > total) {
      this.current = total;
    }
  }

  /**
   * Observer for total hit points.
   */
  get totalObserver(): ReadonlyValueObserver<number> {
    return this.#total.readonly;
  }

  /**
   * Current hit points.
   */
  get current(): number {
    return this.#current.value;
  }

  /**
   * Update current hit points, and notify observers
   * @param current
   */
  set current(current: number) {
    this.#current.value = Math.min(current, this.total);
  }

  /**
   * Observer for current hit points.
   */
  get currentObserver(): ReadonlyValueObserver<number> {
    return this.#current.readonly;
  }

  /**
   * Temporary hit points.
   */
  get temporary(): number {
    return this.#temp.value;
  }

  /**
   * Update temporary hit points, and notify observers
   * @param temp
   */
  set temporary(temp: number) {
    this.#temp.value = temp;
  }

  /**
   * Observer for temporary hit points.
   */
  get tempObserver(): ReadonlyValueObserver<number> {
    return this.#temp.readonly;
  }
}
