import { Encounters } from "~/services/Encounters";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Accordion } from "@mantine/core";
import { EncounterCharacter } from "~/components/EncounterCharacter";
import React from "react";

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

export function DisplayEncounter({ encounter }: { encounter: Encounters }) {
    const characters = useWatchValueObserver(encounter.charactersObserver);
    const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);

    const openedCharacters = React.useMemo(() => {
        if (!activeCharacter) return [];

        return [activeCharacter.id];
    }, [activeCharacter]);


    return (<Accordion multiple variant="separated" value={openedCharacters}>
        { characters.map((c) => <EncounterCharacter character={c} key={c.id}/>)}
    </Accordion>);
}