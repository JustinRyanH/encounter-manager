import React from "react";
import { AppShell, List } from "@mantine/core";

import { AppHeader } from "~/components/AppHeader";
import { DisplayEncounter } from "~/components/encounter/DisplayEncounter";
import { EncounterProvider } from "~/components/encounter/EncounterContext";
import { ActiveCharacter, Encounter, listEncounter } from "~/services/encounter";

import "./App.css";
import { notifyErrors } from "~/services/notifications";
import { EncounterListType, EncounterType } from "~/types/EncounterTypes";

const MockCharacters = [
  { name: 'Frodo', initiative: 18, hp: 8 },
  { name: 'Sam', initiative: 19, hp: 6 },
  { name: 'Pippin', initiative: 5, hp: 4 },
  { name: 'Merry', initiative: 3, hp: 7 },
]

listEncounter().then((encounter) => {
    console.log(encounter);
});

function EncounterList() {
  const [encounters, setEncounters] = React.useState<EncounterListType>([]);
    React.useEffect(() => {
        listEncounter()
            .then((encounters) => setEncounters(encounters))
            .catch(e => notifyErrors({ errors: e.toString(), title: "Failed to Load Encounters" }));
    }, []);

    return (
        <List>
          {encounters.map((encounter) => (<List.Item> {encounter.name} </List.Item>))}
        </List>
    );
}

function App() {
  const encounter = React.useMemo(() => new Encounter({
    characters: MockCharacters.map((c) => new ActiveCharacter(c)),
  }), []);

  return (<AppShell header={<AppHeader />}>
    <EncounterProvider encounter={encounter}>
      <EncounterList />
    </EncounterProvider>
  </AppShell>);
}

export default App;
