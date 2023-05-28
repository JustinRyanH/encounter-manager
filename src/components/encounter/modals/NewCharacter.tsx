import React from "react";

import { ContextModalProps } from "@mantine/modals";
import { Button, FocusTrap, Group, Loader, NumberInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { Encounter } from "~/services/encounter/CombatEncounter";
import { BaseCharacter } from "~/services/encounter/Character";

interface NewCharacterFormProps {
  character: BaseCharacter;
  encounter: Encounter;
  closeModal: () => void;
}
export function NewCharacterForm({ character, closeModal }: NewCharacterFormProps) {
  const form = useForm({
    initialValues: {
      name: character.name,
      initiative: character.initiative,
    },
  });

  const onSubmit = form.onSubmit((values) => {
    character.name = values.name;
    character.initiative = values.initiative;
    closeModal();
  });

  return (
    <>
      <form onSubmit={onSubmit}>
          <Stack spacing="md">
            <TextInput
              placeholder="Character Name"
              label="Character Name"
              withAsterisk
              {...form.getInputProps("name")}
            />
            <NumberInput placeholder="Initiative" label="Initiative" {...form.getInputProps("initiative")} />
            <Group position="apart">
              <Button variant="outline" color="gray" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </Group>
          </Stack>
      </form>
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
      {character ? (
        <NewCharacterForm character={character} encounter={encounter} closeModal={() => context.closeModal(id)} />
      ) : (
        <Loader />
      )}
    </>
  );
};
