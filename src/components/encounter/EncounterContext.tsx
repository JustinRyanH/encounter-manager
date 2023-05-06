import React from "react";
import { EncounterModals } from "~/components/encounter/EncounterModals";

import { Encounter } from "~/services/encounter/Encounter";

const EncounterContext = React.createContext(new Encounter())

interface EncounterProviderProps {
    children: React.ReactNode;
    encounter?: Encounter;
}

export function EncounterProvider({ children, encounter: initialEncounter }: EncounterProviderProps): JSX.Element {
    const encounter = React.useMemo(() => initialEncounter || new Encounter(), [initialEncounter]);

    return (<EncounterContext.Provider value={encounter}>
        <EncounterModals>
            {children}
        </EncounterModals>
    </EncounterContext.Provider>);
}

export function useEncounterContext(): Encounter {
    return React.useContext(EncounterContext);
}