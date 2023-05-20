import React from "react";
import { EncounterModals } from "~/components/encounter/EncounterModals";

import { CombatEncounter } from "~/services/encounter/CombatEncounter";

const EncounterContext = React.createContext<CombatEncounter | null>(null);

interface EncounterProviderProps {
  children: React.ReactNode;
  encounter?: CombatEncounter;
}

export function EncounterProvider({ children, encounter }: EncounterProviderProps): JSX.Element {
  return (
    <EncounterContext.Provider value={encounter || null}>
      <EncounterModals>{children}</EncounterModals>
    </EncounterContext.Provider>
  );
}

export function useEncounterContext(): CombatEncounter {
  const encounter = React.useContext(EncounterContext);
  if (!encounter) throw new Error("Encounter context not found");
  return encounter;
}
