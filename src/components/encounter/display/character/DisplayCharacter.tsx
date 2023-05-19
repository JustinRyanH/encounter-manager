import { Accordion, AccordionControlProps, ActionIcon, Box, Center, Group, Paper, Skeleton, Text } from "@mantine/core";
import { ArrowBendRightDown } from "@phosphor-icons/react";

import { EncounterCharacter } from "~/services/encounter/EncounterCharacter";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/systems/Attribute";
import { EditPopover } from "~/components/systems/EditPopover";
import { UpdateNumber } from "~/components/systems/UpdateAttribute";
import { useEncounterContext } from "~/components/encounter/EncounterContext";
import { ViewEncounter } from "~/services/encounter/ViewEncounter";

import { HpAttribute } from "../HpAttribute";
import { NameAttribute } from "../NameAttribute";
import { SummaryCharacterView } from "~/components/encounter/display/character/SummaryCharacterView";

function InitiativeAttribute({ character }: { character: EncounterCharacter }) {
  const initiative = useWatchValueObserver(character.initiativeObserver);

  return (
    <Attribute title="INITIATIVE">
      <EditPopover titleComponent={<Text size="sm">{initiative}</Text>}>
        <UpdateNumber placeholder="Initiative" updateAttribute={character.updateInitiative} />
      </EditPopover>
    </Attribute>
  );
}

const NextButtonSx = {
  "&[data-disabled]": {
    opacity: 0.2,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
};

interface EncounterControlProps extends AccordionControlProps {
  inPlay: boolean;
  nextTurn: () => void;
}

function CharacterControl({ inPlay, nextTurn, ...props }: EncounterControlProps) {
  return (
    <Paper radius="md">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Accordion.Control {...props} />
        <ActionIcon
          color="dark"
          disabled={!inPlay}
          size="md"
          sx={NextButtonSx}
          variant="subtle"
          title="Next Turn"
          onClick={nextTurn}
        >
          <ArrowBendRightDown size="1.75rem" />
        </ActionIcon>
      </Box>
    </Paper>
  );
}

interface EncounterCharacterProps {
  character: EncounterCharacter;
  viewEncounter: ViewEncounter;
}

export function DisplayCharacter({ character, viewEncounter }: EncounterCharacterProps): JSX.Element {
  const encounter = useEncounterContext();

  const inPlay = useWatchValueObserver(character.inPlayObserver);
  return (
    <Accordion.Item data-in-play={inPlay} value={character.id}>
      <CharacterControl
        onClick={() => viewEncounter.toggle(character.id)}
        inPlay={inPlay}
        nextTurn={encounter.nextCharacter}
      >
        <SummaryCharacterView character={character} />
      </CharacterControl>
      <Accordion.Panel sx={{ padding: 0 }}>
        <Paper radius="md" p="sm">
          <Group spacing="sm">
            <Center maw={75}>
              <Skeleton radius="lg" width={50} height={50} animate={false} />
            </Center>
            <NameAttribute character={character} />
            <InitiativeAttribute character={character} />
            <HpAttribute character={character} />
          </Group>
        </Paper>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
