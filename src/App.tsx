import React from "react";
import { AppShell, Burger, Header, MediaQuery, Navbar, Stack, Title, rem } from "@mantine/core";

import "./App.css";
import { CharacterInInitiative } from "./components/CharacterInInitiative";

function App() {
  const [opened, setOpened] = React.useState(false);

  const navbar = (<Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 250, lg: 300 }}>
    <Navbar.Section>
      <Title align="center" order={3}>Enounter Manager</Title>
    </Navbar.Section>
  </Navbar>);

  const header = (<Header p="xs" height={{ base: rem(50), md: rem(70) }}>
    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
      <Burger opened={opened} onClick={() => setOpened(!opened)} size="sm" mr="xl" />

    </MediaQuery>
  </Header>)

  return (<AppShell navbar={navbar} header={header}>
    <Stack align="flex-start">
      <CharacterInInitiative />
      <CharacterInInitiative />
      <CharacterInInitiative />
      <CharacterInInitiative />
      <CharacterInInitiative />
      <CharacterInInitiative />
    </Stack>
  </AppShell>);
}

export default App;
