import React from "react";
import { EncounterModals } from "~/components/encounter/EncounterModals";

import { Encounter } from "~/services/encounter/Encounter";

const EncounterContext = React.createContext<Encounter | null>(null);

interface EncounterProviderProps {
  children: React.ReactNode;
  encounter?: Encounter;
}

export function EncounterProvider({
  children,
  encounter,
}: EncounterProviderProps): JSX.Element {
  return (
    <EncounterContext.Provider value={encounter || null}>
      <EncounterModals>{children}</EncounterModals>
    </EncounterContext.Provider>
  );
}

export function useEncounterContext(): Encounter {
  const encounter = React.useContext(EncounterContext);
  if (!encounter) throw new Error("Encounter context not found");
  return encounter;
}
