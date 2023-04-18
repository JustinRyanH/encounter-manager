import React from "react";
import { AppShell, Burger, Header, MediaQuery, Navbar, Stack, Title, rem } from "@mantine/core";

import "./App.css";
import { CharacterInInitiative } from "./components/CharacterInInitiative";
import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { Encounters } from "~/services/Encounters";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";

const MockCharacters = [
  { name: 'Frodo', initiative: 18, hp: 8 },
  { name: 'Sam', initiative: 19, hp: 6 },
  { name: 'Aragon', initiative: 10, hp: 20 },
  { name: 'Pippin', initiative: 1, hp: 4 },
  { name: 'Merry', initiative: 10, hp: 6 },
]

function App() {
  const [opened, setOpened] = React.useState(false);

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

  const encounter = React.useMemo(() => new Encounters({
    characters: MockCharacters.map((c) => new InitiativeCharacter(c)),
  }), []);

  const characters = useWatchValueObserver(encounter.charactersObserver);

  return (<AppShell navbar={navbar} header={header}>
    <Stack align="flex-start">
      {characters.map((c) => <CharacterInInitiative character={c} key={c.id} />)}
    </Stack>
  </AppShell>);
}

export default App;
