import React from "react";

import { Encounters } from "~/services/Encounters";

const EncounterContext = React.createContext(new Encounters())

interface EncounterProviderProps {
    children: React.ReactNode;
    encounter?: Encounters;
}

export function EncounterProvider({ children, encounter: initialEncounter }: EncounterProviderProps): JSX.Element {
    const encounter = React.useMemo(() => initialEncounter || new Encounters(), [initialEncounter]);

    return (<EncounterContext.Provider value={encounter}>
        {children}
    </EncounterContext.Provider>);
}

export function useEncounterContext(): Encounters {
    return React.useContext(EncounterContext);
}