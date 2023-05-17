import { Signal, SignalConnection } from "typed-signals";

import { EncounterCharacter } from "~/services/encounter/EncounterCharacter";
import { ReadonlyValueObserver, ValueObserver } from "~/services/ValueObserver";
import { ViewEncounter } from "~/services/encounter/ViewEncounter";
import { updateNameCommand, updateCharacter } from "~/services/encounter/Commands";
import { handleError } from "~/services/notifications";
import { Character as CharacterType } from "~/encounterBindings";

type CharacterAddedMessage = ({ character }: { character: EncounterCharacter }) => void;

interface EncounterProps {
  characters?: Array<EncounterCharacter>;
  name: string;
  id: string;
}

export class Encounter {
  readonly id: string;
  #name: ValueObserver<string> = new ValueObserver<string>("");
  #lastActiveCharacter: EncounterCharacter | null = null;
  #activeCharacter: ValueObserver<EncounterCharacter | null> = new ValueObserver<EncounterCharacter | null>(null);
  #characters: ValueObserver<Array<EncounterCharacter>> = new ValueObserver<Array<EncounterCharacter>>([]);
  #characterAddedSignal = new Signal<CharacterAddedMessage>();

  constructor({ name, id }: EncounterProps) {
    this.id = id;
    this.#name.value = name;
  }

  get newViewEncounter() {
    return new ViewEncounter({ encounter: this });
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

  /**
   * Adds a character to the encounter and sorts the characters by initiative.
   * @param character
   */
  addCharacter = (character: EncounterCharacter) => {
    this.setCharacters([...this.characters, character]);
    this.addEncounterToCharacters();
    this.#characterAddedSignal.emit({ character: character });
  };

  updateCharacters = (characters: CharacterType[]) => {
    this.setCharacters(characters.map(this.updateOrCreateCharacter));
  };

  /**
   * Sets the active character to the next character in the initiative order.
   */
  nextCharacter = () => {
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
    if (this.activeCharacter) return;
    if (!this.characters.length) return;
    this.setActiveCharacter(this.characters[0]);
  };

  /**
   * Stops the encounter
   */
  stopEncounter = () => {
    this.setActiveCharacter(null);
  };

  /**
   * Signals when a new character is added to the encounter.
   * @param observer
   */
  onCharacterAdded(observer: CharacterAddedMessage): SignalConnection {
    return this.#characterAddedSignal.connect(observer);
  }

  async updateCharacterName(id: string, name: string) {
    const existingCharacter = this.findCharacter(id);
    if (!existingCharacter) return;
    try {
      const cmd = updateNameCommand(id, name);
      const { character } = await updateCharacter(this.id, cmd);
      existingCharacter.name = character.name;
    } catch (error: unknown) {
      handleError({ error, title: "Failed to update Character Name" });
    }
  }

  private setCharacters = (characters: Array<EncounterCharacter>) => {
    this.#characters.value = [...characters];
    this.addEncounterToCharacters();
  };

  private setActiveCharacter = (character: EncounterCharacter | null) => {
    this.#lastActiveCharacter = this.activeCharacter;
    this.#activeCharacter.value = character;
    if (character) {
      character.inPlay = true;
    }
    this.characters.forEach((character) => {
      if (character !== this.activeCharacter) character.inPlay = false;
    });
  };

  private updateOrCreateCharacter = (character: CharacterType) => {
    const existingCharacter = this.findCharacter(character.id);
    if (!existingCharacter) return EncounterCharacter.newCharacter(character);
    existingCharacter.update(character);
    return existingCharacter;
  };

  private addEncounterToCharacters = () => {
    this.characters.filter((c) => !c.encounter).forEach((c) => (c.encounter = this));
  };
}
