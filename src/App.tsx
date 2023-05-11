import React from "react";
import { Accordion, AppShell, Avatar, Badge, Group, } from "@mantine/core";

import { AppHeader } from "~/components/AppHeader";

import "./App.css";
import { notifyErrors } from "~/services/notifications";
import { EncounterProvider } from "~/components/encounter/EncounterContext";
import { useEncounterManager } from "~/components/encounter/EncounterManagerProvider";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { ActiveCharacter, Encounter } from "~/services/encounter";

function EncounterPreviewCharacter({ character }: { character: ActiveCharacter }) {
  const name = useWatchValueObserver(character.nameObserver);
  const avatar = <Avatar size={32} radius="xl" />;

  return <Badge leftSection={avatar} size="lg"> {name} </Badge >;
}

function EncounterPreview({ encounter }: { encounter: Encounter }) {
  const name = useWatchValueObserver(encounter.nameObserver);
  const characters = useWatchValueObserver(encounter.charactersObserver);
  const listedCharacters = characters.map((character) => <EncounterPreviewCharacter character={character} key={character.id} />);
  return <div>
    <Accordion.Item value={encounter.id}>
      <Accordion.Control>{name}</Accordion.Control>
      <Accordion.Panel>
        <Group spacing="xs">
          {listedCharacters}
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  </div>
}

function EncounterList() {
  const encounterManager = useEncounterManager();
  const encounterIds = useWatchValueObserver(encounterManager.encountersObserver);
  const encounters = React.useMemo(() => encounterManager.encounters, [encounterIds]);
  React.useEffect(() => {
    encounterManager.refreshList().catch(notifyErrors);
  }, [encounterManager]);

  return (
    <Accordion>
      {encounters.map((encounter) => (<EncounterPreview encounter={encounter} key={encounter.id} />))}
    </Accordion>
  );
}

function App() {
  return (<AppShell header={<AppHeader />}>
    <EncounterProvider>
      <EncounterList />
    </EncounterProvider>
  </AppShell>);
}

export default App;
