import { ArrowBendRightDown } from "@phosphor-icons/react";
import { Accordion, AccordionControlProps, ActionIcon, Box, Paper } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Encounter, EncounterCharacter, ViewEncounter } from "~/services/encounter";
import { useEncounterContext } from "~/components/encounter/EncounterContext";

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

function NextCharacterButton({ inPlay }: { inPlay: boolean }) {
  const encounter = useEncounterContext();

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
  const onClick = () => view.toggle(character.id);
  const inPlay = useWatchValueObserver(character.inPlayObserver);

  return (
    <Paper radius="md">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Accordion.Control onClick={onClick} {...props} />
        <NextCharacterButton inPlay={inPlay} />
      </Box>
    </Paper>
  );
}
