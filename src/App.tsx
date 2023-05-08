import React from "react";
import { AppShell, List } from "@mantine/core";

import { AppHeader } from "~/components/AppHeader";
import { listEncounter } from "~/services/encounter";

import "./App.css";
import { notifyErrors } from "~/services/notifications";
import { EncounterProvider } from "~/components/encounter/EncounterContext";
import { useEncounterManager } from "~/components/encounter/EncounterManagerProvider";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";

listEncounter().then((encounter) => {
    console.log(encounter);
});

function EncounterList() {
    const encounterManager = useEncounterManager();
    const encounters = useWatchValueObserver(encounterManager.encountersObserver);
    React.useEffect(() => {
        encounterManager.refreshList().catch(notifyErrors);
    }, [encounterManager]);


    return (
        <List>
          {Object.values(encounters).map((encounter) => (<List.Item key={encounter.id}> {encounter.name} </List.Item>))}
        </List>
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
