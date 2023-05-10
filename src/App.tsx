import React from "react";
import { AppShell, List } from "@mantine/core";

import { AppHeader } from "~/components/AppHeader";

import "./App.css";
import { notifyErrors } from "~/services/notifications";
import { EncounterProvider } from "~/components/encounter/EncounterContext";
import { useEncounterManager } from "~/components/encounter/EncounterManagerProvider";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";

function EncounterList() {
    const encounterManager = useEncounterManager();
    const encounterIds = useWatchValueObserver(encounterManager.encountersObserver);
    const encounters = React.useMemo(() => encounterManager.encounters, [encounterIds]);
    React.useEffect(() => {
        encounterManager.refreshList().catch(notifyErrors);
    }, [encounterManager]);



    return (
        <List>
          {encounters.map((encounter) => (<List.Item key={encounter.id}> {encounter.name} </List.Item>))}
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
