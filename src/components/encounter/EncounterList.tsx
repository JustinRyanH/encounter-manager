import React from "react";
import { Accordion } from "@mantine/core";

import { useEncounterManager } from "~/components/encounter/EncounterManagerProvider";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { notifyErrors } from "~/services/notifications";
import { EncounterPreview } from "~/components/encounter/EncounterPreview";
import { Encounter } from "~/services/encounter";

export function EncounterList() {
  const encounterManager = useEncounterManager();
  const encounterIds = useWatchValueObserver(encounterManager.encountersObserver);
  const encounters = React.useMemo(() => encounterManager.encounters, [encounterIds]);
  React.useEffect(() => {
    encounterManager.refreshList().catch(notifyErrors);
  }, [encounterManager]);

  const formatPreview = (encounter: Encounter) => <EncounterPreview encounter={encounter} key={encounter.id} />;
  const previews = encounters.map(formatPreview);

  return <Accordion> {previews} </Accordion>;
}
