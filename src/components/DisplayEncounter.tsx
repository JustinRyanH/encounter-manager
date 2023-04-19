import { Encounters } from "~/services/Encounters";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Accordion } from "@mantine/core";
import { EncounterCharacter } from "~/components/EncounterCharacter";
import React from "react";

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