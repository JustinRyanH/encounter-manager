import { Accordion, Center, Group, Paper, Skeleton, Text } from "@mantine/core";

import { EncounterCharacter } from "~/services/encounter/Character";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/systems/Attribute";
import { EditPopover } from "~/components/systems/EditPopover";
import { UpdateNumber } from "~/components/systems/UpdateAttribute";
import { ViewEncounter } from "~/services/encounter/ViewEncounter";

import { HpAttribute } from "../HpAttribute";
import { NameAttribute } from "../NameAttribute";
import { SummaryCharacterView } from "~/components/encounter/display/character/SummaryCharacterView";
import { ViewEncounterControl } from "~/components/encounter/display/character/ViewEncounterControl";

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

interface EncounterCharacterProps {
  character: EncounterCharacter;
  viewEncounter: ViewEncounter;
}
export function DisplayCharacter({ character, viewEncounter }: EncounterCharacterProps): JSX.Element {
  const activeCharacter = useWatchValueObserver(viewEncounter.encounter.activeCharacterObserver);
  const inPlay = activeCharacter?.id === character.id;
  return (
    <Accordion.Item data-in-play={inPlay} value={character.id}>
      <ViewEncounterControl character={character} view={viewEncounter}>
        <SummaryCharacterView character={character} />
      </ViewEncounterControl>
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
