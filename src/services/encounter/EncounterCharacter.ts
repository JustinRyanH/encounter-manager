import { v4 } from "uuid";

import { HitPoints } from "~/services/encounter/HitPoints";
import { ReadonlyValueObserver, StopObserving, ValueChangeMessage, ValueObserver } from "~/services/ValueObserver";
import { Encounter } from "~/services/encounter/CombatEncounter";
import { Character as CharacterProps, HitPoints as ServerHitPoints } from "~/encounterBindings";

type MajorCharacterProps = {
  [K in keyof CharacterProps]?: CharacterProps[K];
};

export type OptionalHitPoints = {
  [K in keyof ServerHitPoints]?: ServerHitPoints[K];
};

export interface OptionalCharacterProps extends Omit<MajorCharacterProps, "hp"> {
  hp?: OptionalHitPoints;
}

export interface EncounterCreateProps extends OptionalCharacterProps {
  id: string;
  name: string;
  initiative: number;
  encounter?: Encounter | null;
  isStub?: boolean;
}

interface EncounterCharacterUpdateProps extends OptionalCharacterProps {
  id: string;
  hp?: OptionalHitPoints;
}

export class Character {}

/**
 * A Tracked Character
 */
export class EncounterCharacter {
  static newCharacter(param: EncounterCreateProps): EncounterCharacter {
    return new EncounterCharacter(param);
  }

  static StubCharacter = (id: string) => new EncounterCharacter({ id, name: v4(), initiative: 0, isStub: true });
  #encounter: Encounter | null;
  readonly id: string;
  readonly isStub: boolean;
  readonly hp: HitPoints = new HitPoints();

  #name: ValueObserver<string>;
  #initiative: ValueObserver<number>;
  #inPlay: ValueObserver<boolean> = new ValueObserver<boolean>(false);

  constructor({ encounter, id, name, initiative, hp, isStub = false }: EncounterCreateProps) {
    this.#encounter = encounter || null;
    this.id = id;
    this.isStub = isStub;
    this.#initiative = new ValueObserver(initiative);
    this.#name = new ValueObserver(name);
    if (hp) {
      this.hp = new HitPoints(hp);
    }
  }

  /**
   * The encounter this character is a part of
   */
  get encounter() {
    return this.#encounter;
  }

  set encounter(value) {
    if (!value) throw new Error("Encounter cannot be null");
    this.#encounter = value;
  }

  /**
   * The name of the character
   */
  get name(): string {
    return this.#name.value;
  }

  /**
   * Update name of the character, and notify observers
   * @param name
   */
  set name(name: string) {
    this.#name.value = name;
  }

  /**
   * Observer for the name of the character
   */
  get nameObserver(): ReadonlyValueObserver<string> {
    return this.#name.readonly;
  }

  /**
   * if the character is in play
   */
  get inPlay(): boolean {
    return this.#inPlay.value;
  }

  /**
   * Update name of the character, and notify observers
   * @param newValue
   */
  set inPlay(newValue: boolean) {
    this.#inPlay.value = newValue;
  }

  /**
   * Observer for the initiative of the character
   */
  get inPlayObserver(): ReadonlyValueObserver<boolean> {
    return this.#inPlay.readonly;
  }

  /**
   * The initiative of the character
   */
  get initiative(): number {
    return this.#initiative.value;
  }

  /**
   * Update initiative of the character, and notify observers
   * @param initiative
   */
  set initiative(initiative: number) {
    this.#initiative.value = initiative;
  }

  /**
   * Observer for the initiative of the character
   */
  get initiativeObserver(): ReadonlyValueObserver<number> {
    return this.#initiative.readonly;
  }

  update(values: EncounterCharacterUpdateProps) {
    if (values.id !== this.id) throw new Error("Id Mismatch for character");
    if (values.name && values.name !== this.name) this.name = values.name;
    if (values.initiative && values.initiative !== this.initiative) this.initiative = values.initiative;
    if (values.hp) {
      const { current, total, temporary } = values.hp;
      if (current !== undefined && current !== this.hp.current) this.hp.current = current;
      if (total !== undefined && total !== this.hp.total) this.hp.total = total;
      if (temporary !== undefined && temporary !== this.hp.temporary) this.hp.temporary = temporary;
    }
  }

  /**
   * Update total hit points, and notify observers
   * @param initiative
   */
  updateInitiative = (initiative: number | null): void => {
    this.encounter?.updateCharacterInitiative(this.id, initiative || 0);
  };

  /**
   * Update total hit points, and notify observers
   * @param name
   */
  updateName = async (name: string) => {
    return this.encounter?.updateCharacterName(this.id, name);
  };

  updateTotalHp = async (total: number) => {
    return this.encounter?.updateCharacterTotalHp(this.id, total);
  };

  updateCurrentHp = async (current: number) => {
    return this.encounter?.updateCharacterCurrentHp(this.id, current);
  };

  updateTempHp = async (temp: number | null) => {
    return this.encounter?.updateCharacterTemporaryHp(this.id, temp || 0);
  };

  heal = async (amount: number) => {
    return this.encounter?.healCharacter(this.id, amount);
  };

  damage = async (amount: number) => {
    return this.encounter?.damageCharacter(this.id, amount);
  };
}
