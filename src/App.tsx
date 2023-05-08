import React from "react";
import { AppShell, List } from "@mantine/core";

import { AppHeader } from "~/components/AppHeader";
import { listEncounter } from "~/services/encounter";

import "./App.css";
import { notifyErrors } from "~/services/notifications";
import { EncounterListType } from "~/types/EncounterTypes";

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
  return (<AppShell header={<AppHeader />}>
    <EncounterList />
  </AppShell>);
}

export default App;
