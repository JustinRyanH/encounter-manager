import { ArrowBendRightDown } from "@phosphor-icons/react";
import { Accordion, AccordionControlProps, ActionIcon, Box, MantineTheme, Paper } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterCharacter, ViewEncounter } from "~/services/encounter";
import { useEncounterContext } from "~/components/encounter/providers/EncounterProvider";

const ViewSx = (theme: MantineTheme) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing.xs,
});

const NextButtonSx = {
  "&[data-disabled]": {
    opacity: 0.2,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
};

interface EncounterControlProps extends AccordionControlProps {
  character: EncounterCharacter;
  view: ViewEncounter;
}

function useInPlayForEncounter(character: EncounterCharacter) {
  const encounter = useEncounterContext();
  const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);
  return activeCharacter?.id === character.id;
}

function NextCharacterButton({ character }: { character: EncounterCharacter }) {
  const encounter = useEncounterContext();
  const inPlay = useInPlayForEncounter(character);

  return (
    <ActionIcon
      color="dark"
      disabled={!inPlay}
      size="md"
      sx={NextButtonSx}
      variant="subtle"
      title="Next Turn"
      onClick={encounter.nextCharacter}
    >
      <ArrowBendRightDown size="1.75rem" />
    </ActionIcon>
  );
}

export function ViewEncounterControl({ view, character, ...props }: EncounterControlProps) {
  const isStub = character.isStub;
  const onClick = () => view.toggle(character.id);
  return (
    <Paper radius="md">
      <Box sx={ViewSx}>
        <Accordion.Control onClick={onClick} disabled={isStub} {...props} />
        <NextCharacterButton character={character} />
      </Box>
    </Paper>
  );
}
