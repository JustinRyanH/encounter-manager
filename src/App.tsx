import React from "react";
import { AppShell, Box, Burger, Header, MediaQuery, Navbar, rem, Title, Text, createStyles, keyframes } from "@mantine/core";

import "./App.css";
import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { Encounters } from "~/services/Encounters";
import { DisplayEncounter } from "~/components/DisplayEncounter";
import { EncounterProvider } from "~/components/EncounterContext";

const MockCharacters = [
  { name: 'Frodo', initiative: 18, hp: 8 },
  { name: 'Sam', initiative: 19, hp: 6 },
]

export const linearGradiantMove = keyframes({
  '100%': { backgroundPosition: '4px 0, -4px 100%, 0 -4px, 100% 4px' },
});

const useStyles = createStyles((theme) => ({
  animatedOrangeBorder: {
    background: '' +
      `linear-gradient(90deg, ${theme.colors.orange} 50%, transparent 0) repeat-x,` +
      `linear-gradient(90deg, ${theme.colors.orange} 50%, transparent 0) repeat-x,` +
      `linear-gradient(0deg, ${theme.colors.orange} 50%, transparent 0) repeat-y,` +
      `linear-gradient(0deg, ${theme.colors.orange} 50%, transparent 0) repeat-y`,
    backgroundSize: '4px 2px, 4px 2px, 2px 4px, 2px 4px',
    backgroundPosition: '0 0, 0 100%, 0 0, 100% 0',
    padding: '1rem',
    margin: '1rem',
    animation: `${linearGradiantMove} .3s linear infinite`,
  },
  '@keyframes linearGradiantMove': {
  },
}));

function App() {
  const { classes } = useStyles();

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

  return (<AppShell navbar={navbar} header={header}>
    <Box className={classes.animatedOrangeBorder}>
      <Text>Test</Text>
    </Box>
    <EncounterProvider encounter={encounter}>
      <DisplayEncounter />
    </EncounterProvider>
  </AppShell>);
}

export default App;
