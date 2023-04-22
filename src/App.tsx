import React from "react";
import { AppShell, Burger, Header, MediaQuery, Navbar, rem, Title } from "@mantine/core";

import "./App.css";
import { ActiveCharacter } from "~/services/ActiveCharacter";
import { Encounters } from "~/services/Encounters";
import { DisplayEncounter } from "~/components/encounter/DisplayEncounter";
import { EncounterProvider } from "~/components/encounter/EncounterContext";

const MockCharacters = [
  { name: 'Frodo', initiative: 18, hp: 8 },
  { name: 'Sam', initiative: 19, hp: 6 },
  { name: 'Pippin', initiative: 5, hp: 4 },
  { name: 'Merry', initiative: 3, hp: 7 },
]

function App() {
  const [opened, setOpened] = React.useState(false);

  const encounter = React.useMemo(() => new Encounters({
    characters: MockCharacters.map((c) => new ActiveCharacter(c)),
  }), []);

  const navbar = (<Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 250, lg: 300 }}>
    <Navbar.Section>
      <Title align="center" order={3}>Encounter Manager</Title>
    </Navbar.Section>
  </Navbar>);

  const header = (<Header p="xs" height={{ base: rem(50), md: rem(70) }}>
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
