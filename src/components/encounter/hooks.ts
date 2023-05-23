import { useEncounterManager } from "~/components/encounter/providers/EncounterManagerProvider";
import React from "react";
import { notifyErrors } from "~/services/notifications";
import { EncounterCharacter } from "~/services/encounter";
import { useEncounterContext } from "~/components/encounter/providers/EncounterProvider";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";

export function useRefreshEncounter() {
  const encounterManager = useEncounterManager();
  React.useEffect(() => {
    encounterManager.refreshList().catch(notifyErrors);
  }, [encounterManager]);
  return encounterManager;
}

export function useInPlayForEncounter(character: EncounterCharacter) {
  const encounter = useEncounterContext();
  const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);
  return activeCharacter === character.id;
}
