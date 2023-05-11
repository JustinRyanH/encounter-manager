import React from "react";
import { Accordion, AppShell, } from "@mantine/core";

import { AppHeader } from "~/components/AppHeader";

import "./App.css";
import { notifyErrors } from "~/services/notifications";
import { EncounterProvider } from "~/components/encounter/EncounterContext";
import { useEncounterManager } from "~/components/encounter/EncounterManagerProvider";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterPreview } from "~/components/encounter/EncounterPreview";

function EncounterList() {
  const encounterManager = useEncounterManager();
  const encounterIds = useWatchValueObserver(encounterManager.encountersObserver);
  const encounters = React.useMemo(() => encounterManager.encounters, [encounterIds]);
  React.useEffect(() => {
    encounterManager.refreshList().catch(notifyErrors);
  }, [encounterManager]);

  return (
    <Accordion>
      {encounters.map((encounter) => (<EncounterPreview encounter={encounter} key={encounter.id} />))}
    </Accordion>
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
