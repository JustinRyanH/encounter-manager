import React from 'react';
import { EncounterManager } from "~/services/encounter/EncounterManager";

const EncounterManagerContext = React.createContext(new EncounterManager());

export function useEncounterManager() {
    return React.useContext(EncounterManagerContext);
}

interface EncounterManagerProviderProps {
    manager: EncounterManager;
    children: React.ReactNode,
}

export function EncounterManagerProvider({ children, manager }: EncounterManagerProviderProps) {
    return <EncounterManagerContext.Provider value={manager}> {children} </EncounterManagerContext.Provider>;
}