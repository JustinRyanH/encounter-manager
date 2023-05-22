import { v4 as uuid } from "uuid";

import { EncounterCharacter, EncounterCreateProps } from "~/services/encounter/Character";
import { ReadonlyValueObserver, ValueObserver } from "~/services/ValueObserver";
import { ViewEncounter } from "~/services/encounter/ViewEncounter";
import {
  getCommandId,
  updateCharacter,
  updateNameCommand,
  updateInitiativeCmd,
  updateTotalHpCmd,
  updateCurrentHpCmd,
  updateTemporaryHpCmd,
  healCharacterCmd,
  damageCharacterCmd,
} from "~/services/encounter/Commands";
import { handleError } from "~/services/notifications";
import { CharacterCommand, Encounter as ServerEncounter } from "~/encounterBindings";

type OptionalEncounters = {
  [k in keyof ServerEncounter]?: ServerEncounter[k];
};
interface EncounterProps extends OptionalEncounters {
  name: string;
  id: string;
  isStub?: boolean;
}
export class Encounter {
  readonly id: string;
  readonly isStub: boolean;

  #name: ValueObserver<string> = new ValueObserver<string>("");
  #characters: ValueObserver<Array<EncounterCharacter>> = new ValueObserver<Array<EncounterCharacter>>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  constructor({ id, isStub = false, name }: EncounterProps) {
    this.id = id;
    this.isStub = isStub;
    this.#name.value = name;
  }

  /**
   * Returns the characters in the encounter.
   */
  get characters(): Array<EncounterCharacter> {
    return this.#characters.value;
  }

  set characters(value: Array<EncounterCharacter>) {
    this.setCharacters(value);
  }

  /**
   * Returns a readonly observer for the characters.
   */
  get charactersObserver(): ReadonlyValueObserver<Array<EncounterCharacter>> {
    return this.#characters.readonly;
  }

  get name() {
    return this.#name.value;
  }

  get nameObserver() {
    return this.#name.readonly;
  }

  /**
   * Returns a character from the list of characters in the encounter.
   * @param id
   */
  findCharacter(id: string) {
    return this.characters.find((c) => c.id === id) || null;
  }

  updateCharacters = (characters: EncounterCreateProps[]) => {
    this.setCharacters(characters.map(this.updateOrCreateCharacter));
  };

  async updateCharacterName(id: string, name: string) {
    return await this.updateCharacter(updateNameCommand(id, name));
  }

  async updateCharacterInitiative(id: string, initiative: number) {
    return await this.updateCharacter(updateInitiativeCmd(id, initiative));
  }

  async updateCharacterTotalHp(id: string, totalHp: number) {
    return await this.updateCharacter(updateTotalHpCmd(id, totalHp));
  }

  async updateCharacterCurrentHp(id: string, currentHp: number) {
    return await this.updateCharacter(updateCurrentHpCmd(id, currentHp));
  }

  async updateCharacterTemporaryHp(id: string, temporaryHp: number) {
    return await this.updateCharacter(updateTemporaryHpCmd(id, temporaryHp));
  }

  async healCharacter(id: string, amount: number) {
    return await this.updateCharacter(healCharacterCmd(id, amount));
  }

  async damageCharacter(id: string, amount: number) {
    return await this.updateCharacter(damageCharacterCmd(id, amount));
  }

  protected setCharacters = (characters: Array<EncounterCharacter>) => {
    this.#characters.value = [...characters];
    this.addEncounterToCharacters();
  };

  protected updateOrCreateCharacter = (character: EncounterCreateProps) => {
    const existingCharacter = this.findCharacter(character.id);
    if (!existingCharacter) return EncounterCharacter.newCharacter(character);
    existingCharacter.update(character);
    return existingCharacter;
  };

  protected addEncounterToCharacters = () => {
    this.characters.filter((c) => !c.encounter).forEach((c) => (c.encounter = this));
  };

  protected updateCharacter = async (cmd: CharacterCommand) => {
    const id = getCommandId(cmd);
    const existingCharacter = this.findCharacter(id);
    if (!existingCharacter) return;
    try {
      const { character } = await updateCharacter(this.id, cmd);
      existingCharacter.name = character.name;
      existingCharacter.initiative = character.initiative;
      existingCharacter.hp.current = character.hp.current;
      existingCharacter.hp.total = character.hp.total;
      existingCharacter.hp.temporary = character.hp.temporary;
    } catch (error: unknown) {
      handleError({ error, title: "Failed to update Character" });
    }
  };
}

export class CombatEncounter extends Encounter {
  #lastActiveCharacter: EncounterCharacter | null = null;
  #activeCharacter: ValueObserver<EncounterCharacter | null> = new ValueObserver<EncounterCharacter | null>(null);

  static StubEncounter = (id: string) => new CombatEncounter({ name: uuid(), id, isStub: true });

  constructor(props: EncounterProps) {
    super(props);
    if (this.isStub) {
      this.setCharacters([
        EncounterCharacter.StubCharacter(uuid()),
        EncounterCharacter.StubCharacter(uuid()),
        EncounterCharacter.StubCharacter(uuid()),
      ]);
    }
  }

  get newViewEncounter() {
    return new ViewEncounter({ encounter: this });
  }

  /**
   * The active character in the encounter.
   */
  get activeCharacter(): EncounterCharacter | null {
    return this.#activeCharacter.value;
  }

  /**
   * Returns a readonly observer for the active character.
   */
  get activeCharacterObserver(): ReadonlyValueObserver<EncounterCharacter | null> {
    return this.#activeCharacter.readonly;
  }

  /**
   * Sets the active character to the next character in the initiative order.
   */
  nextCharacter = () => {
    if (this.isStub) return;

    if (!this.characters.length) return;
    if (!this.activeCharacter) {
      this.setActiveCharacter(this.characters[0]);
      return;
    }

    const activeCharacterIndex = this.characters.indexOf(this.activeCharacter);
    if (activeCharacterIndex === -1) return;

    const nextCharacterIndex = activeCharacterIndex + 1 === this.characters.length ? 0 : activeCharacterIndex + 1;
    this.setActiveCharacter(this.characters[nextCharacterIndex]);
  };

  /**
   * Sets the active character to the previous character
   * in the initiative order when the encounter has been stopped.
   */
  restartEncounter = () => {
    if (this.isStub) return;

    if (!this.#lastActiveCharacter) {
      this.startEncounter();
      return;
    }
    if (this.activeCharacter) return;
    this.setActiveCharacter(this.#lastActiveCharacter);
  };

  /**
   * Sets the active character to first character in the initiative order if not already active.
   */
  startEncounter = () => {
    if (this.isStub) return;

    if (this.activeCharacter) return;
    if (!this.characters.length) return;
    this.setActiveCharacter(this.characters[0]);
  };

  /**
   * Stops the encounter
   */
  stopEncounter = () => {
    if (this.isStub) return;

    this.setActiveCharacter(null);
  };

  private setActiveCharacter = (character: EncounterCharacter | null) => {
    this.#lastActiveCharacter = this.activeCharacter;
    this.#activeCharacter.value = character;
  };
}
