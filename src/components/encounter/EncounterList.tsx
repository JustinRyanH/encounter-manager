import { useEncounterManager } from "~/components/encounter/EncounterManagerProvider";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import React from "react";
import { notifyErrors } from "~/services/notifications";
import { Accordion } from "@mantine/core";
import { EncounterPreview } from "~/components/encounter/EncounterPreview";

export function EncounterList() {
  const encounterManager = useEncounterManager();
  const encounterIds = useWatchValueObserver(
    encounterManager.encountersObserver
  );
  const encounters = React.useMemo(
    () => encounterManager.encounters,
    [encounterIds]
  );
  React.useEffect(() => {
    encounterManager.refreshList().catch(notifyErrors);
  }, [encounterManager]);

  return (
    <Accordion>
      {encounters.map((encounter) => (
        <EncounterPreview encounter={encounter} key={encounter.id} />
      ))}
    </Accordion>
  );
}
