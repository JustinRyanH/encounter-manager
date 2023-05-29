import React from "react";

import { ContextModalProps } from "@mantine/modals";
import { Button, Flex, Group, Loader, NumberInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { Encounter } from "~/services/encounter/CombatEncounter";
import { BaseCharacter } from "~/services/encounter/Character";
import { CharacterChangeMessages } from "~/encounterBindings";

function anyErrors(changeMessages: CharacterChangeMessages): boolean {
  if (changeMessages.initiative.length > 0) return true;
  if (changeMessages.name.length > 0) return true;
  if (changeMessages.hp.current.length > 0) return true;
  if (changeMessages.hp.temporary.length > 0) return true;
  if (changeMessages.hp.total.length > 0) return true;

  return false;
}

interface NewCharacterFormProps {
  character: BaseCharacter;
  encounter: Encounter;
  closeModal: () => void;
}
export function NewCharacterForm({ encounter, character, closeModal }: NewCharacterFormProps) {
  const form = useForm({
    initialValues: {
      name: character.name,
      initiative: character.initiative,
      currentHp: character.hp.current,
      totalHp: character.hp.total,
      tempHp: character.hp.temporary,
    },
  });

  const onSubmit = form.onSubmit((values) => {
    character.name = values.name;
    character.initiative = values.initiative;

    encounter.addOrUpdateCharacter(character.character).then((messages) => {
      if (messages.initiative.length > 0) {
        form.setFieldError("initiative", messages.initiative.map((m) => m.message).join(", "));
      }
      if (messages.name.length > 0) {
        const nameErrors = messages.name.map((m) => m.message).join(", ");
        console.log(nameErrors);
        form.setFieldError("name", nameErrors);
      }
      if (anyErrors(messages)) return;
      closeModal();
    });
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack spacing="md">
          <TextInput placeholder="Character Name" label="Character Name" withAsterisk {...form.getInputProps("name")} />
          <NumberInput placeholder="Initiative" label="Initiative" {...form.getInputProps("initiative")} />
          <Flex align="center" gap="xs" wrap="nowrap">
            <NumberInput
              hideControls
              placeholder="Current HP"
              label="Current HP"
              {...form.getInputProps("currentHp")}
            />
            <NumberInput hideControls placeholder="Total HP" label="Total HP" {...form.getInputProps("totalHp")} />
            <NumberInput hideControls placeholder="Temp HP" label="Temp HP" {...form.getInputProps("tempHp")} />
          </Flex>
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
