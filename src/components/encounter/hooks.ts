import { useEncounterManager } from "~/components/encounter/EncounterManagerProvider";
import React from "react";
import { notifyErrors } from "~/services/notifications";

export function useRefreshEncounter() {
  const encounterManager = useEncounterManager();
  React.useEffect(() => {
    encounterManager.refreshList().catch(notifyErrors);
  }, [encounterManager]);
}