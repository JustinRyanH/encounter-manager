import React from "react";
import { Encounters } from "~/services/Encounters";

const EncounterContext = React.createContext(new Encounters())

interface EncounterProviderProps {
    children: React.ReactNode;
    encounters?: Encounters;
}

export function EncounterProvider({ children, encounters: initialEncounter }: EncounterProviderProps): JSX.Element {
    const encounters = React.useMemo(() => initialEncounter || new Encounters(), [initialEncounter]);

    return (<EncounterContext.Provider value={encounters}>
        {children}
    </EncounterContext.Provider>);
}

export function useEncounterContext(): Encounters {
    return React.useContext(EncounterContext);
}