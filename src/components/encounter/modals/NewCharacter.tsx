import React from "react";

import { ContextModalProps } from "@mantine/modals";
import { Button, Group, Input, Loader, NumberInput, Stack, TextInput } from "@mantine/core";

import { Encounter } from "~/services/encounter/CombatEncounter";
import { BaseCharacter } from "~/services/encounter/Character";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";

export function NewCharacterForm({ character, encounter }: { character: BaseCharacter; encounter: Encounter }) {
  const name = useWatchValueObserver(character.nameObserver);
  const initiative = useWatchValueObserver(character.initiativeObserver);
  const updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    character.name = event.target.value;
  };

  const updateInitiative = (value: number | "") => {
    character.initiative = value !== "" ? value : 0;
  };
  return (
    <>
      <TextInput placeholder="Character Name" label="Character Name" value={name} onChange={updateName} withAsterisk />
      <NumberInput
        placeholder="Initiative"
        label="Initiative"
        value={initiative}
        onChange={updateInitiative}
        withAsterisk
      />
    </>
  );
}

export const NewCharacter = ({ id, context, innerProps }: ContextModalProps<{ encounter: Encounter }>) => {
  const { encounter } = innerProps;
  const [character, setCharacter] = React.useState<BaseCharacter | null>(null);
  React.useEffect(() => {
    encounter.newCharacter().then(setCharacter);
  }, [encounter]);

  return (
    <>
      <Stack spacing="md">
        {character ? <NewCharacterForm character={character} encounter={encounter} /> : <Loader />}
        <Group>
          <Button onClick={() => context.closeModal(id)}>Cancel</Button>
        </Group>
      </Stack>
    </>
  );
};
