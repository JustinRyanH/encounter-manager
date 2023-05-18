import { HitPoints, HitPointsProps } from "~/services/encounter/HitPoints";
import { notifyErrors } from "~/services/notifications";
import { ReadonlyValueObserver, StopObserving, ValueChangeMessage, ValueObserver } from "~/services/ValueObserver";
import { Encounter } from "~/services/encounter/Encounter";

interface EncounterCharacterProps {
  id: string;
  encounter?: Encounter;
  name: string;
  initiative: number;
  totalHp?: number;
  tempHp?: number | null;
  hp?: HitPointsProps;
}

interface EncounterCharacterUpdateProps {
  id: string;
  name?: string;
  initiative?: number;
  totalHp?: number;
  tempHp?: number | null;
  hp?: HitPointsProps;
}

/**
 * A Tracked Character
 */
export class EncounterCharacter {
  static ValidateName = (name: string | null): string[] => {
    if (!name) return ["Name cannot be empty"];
    return [];
  };

  static ValidateInitiative(value: number | null) {
    if (!value) return ["Initiative cannot be empty"];
    return [];
  }

  static newCharacter(param: EncounterCharacterProps): EncounterCharacter {
    return new EncounterCharacter(param);
  }

  #encounter: Encounter | null;
  readonly id: string;
  readonly hp: HitPoints = new HitPoints();

  #name: ValueObserver<string>;
  #initiative: ValueObserver<number>;
  #inPlay: ValueObserver<boolean> = new ValueObserver<boolean>(false);

  constructor({ encounter, id, name, initiative, totalHp: totalHp = 10, hp }: EncounterCharacterProps) {
    this.#encounter = encounter || null;
    this.id = id;
    this.#initiative = new ValueObserver(initiative);
    this.#name = new ValueObserver(name);
    if (hp) {
      this.hp = new HitPoints(hp);
    } else {
      this.hp.total = totalHp;
      this.hp.current = totalHp;
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
    const errors = this.#validateName(name).join(", ");
    if (notifyErrors({ errors, title: "Invalid Name" })) return;

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
      const { current, total, temp } = values.hp;
      if (current !== undefined && current !== this.hp.current) this.hp.current = current;
      if (total !== undefined && total !== this.hp.total) this.hp.total = total;
      if (temp !== undefined && temp !== this.hp.temporary) this.hp.temporary = temp;
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

  /**
   * Observer for the initiative of the character
   * @param message
   * @return unsubscribe function
   */
  observeInitiative = (message: ValueChangeMessage<number>): StopObserving => {
    this.#initiative.add(message);
    return () => this.#initiative.remove(message);
  };

  #validateName = (name: string | null): string[] => EncounterCharacter.ValidateName(name);
  #validateInitiative = (value: number | null): string[] => EncounterCharacter.ValidateInitiative(value);
}
