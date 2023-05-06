import React from "react";
import { Accordion, AppShell, Burger, Divider, Header, MediaQuery, Navbar, Stack, Title } from "@mantine/core";

import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";
import { Encounter } from "~/services/encounter/Encounter";
import { DisplayEncounter } from "~/components/encounter/DisplayEncounter";
import { EncounterProvider } from "~/components/encounter/EncounterContext";
import { AddCharacterToEncounter } from "~/components/encounter/AddCharacterToEncounter";
import { FileExperiment } from "~/components/files/FileExperiment";

import "./App.css";
import { AppHeader } from "~/components/AppHeader";

const MockCharacters = [
  { name: 'Frodo', initiative: 18, hp: 8 },
  { name: 'Sam', initiative: 19, hp: 6 },
  { name: 'Pippin', initiative: 5, hp: 4 },
  { name: 'Merry', initiative: 3, hp: 7 },
]

function App() {
  const encounter = React.useMemo(() => new Encounter({
    characters: MockCharacters.map((c) => new ActiveCharacter(c)),
  }), []);

  return (<AppShell header={<AppHeader />}>
    <EncounterProvider encounter={encounter}>
      <DisplayEncounter />
    </EncounterProvider>
  </AppShell>);
}

export default App;
