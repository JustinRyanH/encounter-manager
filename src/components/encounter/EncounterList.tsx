import React from "react";
import { Accordion } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterPreview } from "~/components/encounter/EncounterPreview";
import { CombatEncounter } from "~/services/encounter";
import { useRefreshEncounter } from "~/components/encounter/hooks";

export function EncounterList() {
  const encounterManager = useRefreshEncounter();
  const encounterIds = useWatchValueObserver(encounterManager.encountersObserver);
  const encounters = React.useMemo(() => encounterManager.encounters, [encounterIds]);

  const formatPreview = (encounter: CombatEncounter) => <EncounterPreview encounter={encounter} key={encounter.id} />;
  const previews = encounters.map(formatPreview);

  return <Accordion> {previews} </Accordion>;
}
