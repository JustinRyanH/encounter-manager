import { CombatEncounter } from "~/services/encounter/CombatEncounter";
import { EncounterCharacter } from "~/services/encounter/Character";
import { ReadonlyValueObserver, ValueChangeMessageProps, ValueObserver } from "~/services/ValueObserver";

export class ViewEncounter {
  #encounter: CombatEncounter;
  #openedCharacters = new ValueObserver<string[]>([]);

  constructor({ encounter }: { encounter: CombatEncounter }) {
    this.#encounter = encounter;
    this.#encounter.activeCharacterObserver.add(this.onChangeActiveCharacter);
  }

  get openedCharacters(): Array<string> {
    return this.#openedCharacters.value;
  }

  get openedCharactersObserver(): ReadonlyValueObserver<string[]> {
    return this.#openedCharacters.readonly;
  }

  open(characterId: string): void {
    const id = this.#encounter.characters.find((char) => char.id === characterId)?.id;
    if (id) {
      this.#openedCharacters.value = [...this.openedCharacters, id];
    }
  }

  close(characterId: string): void {
    this.#openedCharacters.value = this.openedCharacters.filter((character) => character !== characterId);
  }

  toggle(characterId: string): void {
    if (this.isOpened(characterId)) {
      this.close(characterId);
    } else {
      this.open(characterId);
    }
  }

  isOpened(characterId: string): boolean {
    return this.openedCharacters.some((character) => character === characterId);
  }

  private onChangeActiveCharacter = ({ oldValue, newValue }: ValueChangeMessageProps<EncounterCharacter | null>) => {
    let oldValues: Array<string> = this.openedCharacters;
    if (oldValue) {
      oldValues = oldValues.filter((character) => character !== oldValue.id);
    }
    if (newValue) {
      this.#openedCharacters.updateValue([newValue.id, ...oldValues]);
    } else {
      this.#openedCharacters.updateValue(oldValues);
    }
  };
}
