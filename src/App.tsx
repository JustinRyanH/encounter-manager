import React from "react";
import { Accordion, AppShell, Burger, Divider, Header, MediaQuery, Navbar, Stack, Title } from "@mantine/core";

import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";
import { Encounter } from "~/services/encounter/Encounter";
import { DisplayEncounter } from "~/components/encounter/DisplayEncounter";
import { EncounterProvider } from "~/components/encounter/EncounterContext";
import { AddCharacterToEncounter } from "~/components/encounter/AddCharacterToEncounter";

import "./App.css";
import { ManageEncounter } from "~/components/encounter/ManageEncounter";

const MockCharacters = [
  { name: 'Frodo', initiative: 18, hp: 8 },
  { name: 'Sam', initiative: 19, hp: 6 },
  { name: 'Pippin', initiative: 5, hp: 4 },
  { name: 'Merry', initiative: 3, hp: 7 },
]

function App() {
  const [opened, setOpened] = React.useState(false);

  const encounter = React.useMemo(() => new Encounter({
    characters: MockCharacters.map((c) => new ActiveCharacter(c)),
  }), []);

  const navbar = (<Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 250, lg: 300 }}>
    <Navbar.Section>
      <Stack>
        <Title align="center" order={3}>Encounter Manager</Title>
        <Divider />
        <Accordion>
          <Accordion.Item value="Add Character">
            <Accordion.Control>Add Character</Accordion.Control>
            <Accordion.Panel>
              <AddCharacterToEncounter encounter={encounter} />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="Manager Encounter">
            <Accordion.Control>Manager Encounter</Accordion.Control>
            <Accordion.Panel>
              <ManageEncounter encounter={encounter} />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Navbar.Section>
  </Navbar>);

  const header = (<Header p="xs" height={{ base: '3rem', md: '4rem' }}>
    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
      <Burger opened={opened} onClick={() => setOpened(!opened)} size="sm" mr="xl" />
    </MediaQuery>
  </Header>)

  return (<AppShell navbar={navbar} header={header}>
    <EncounterProvider encounter={encounter}>
      <DisplayEncounter />
    </EncounterProvider>
  </AppShell>);
}

export default App;
