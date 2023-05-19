import { ArrowBendRightDown } from "@phosphor-icons/react";
import { Accordion, AccordionControlProps, ActionIcon, Box, Paper } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterCharacter, ViewEncounter } from "~/services/encounter";
import { useEncounterContext } from "~/components/encounter/EncounterContext";

const ViewSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

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

function NextCharacterButton({ character }: { character: EncounterCharacter }) {
  const encounter = useEncounterContext();
  const inPlay = useWatchValueObserver(character.inPlayObserver);

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
