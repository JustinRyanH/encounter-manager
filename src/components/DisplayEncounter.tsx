import React from "react";
import { Accordion } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterCharacter } from "~/components/EncounterCharacter";
import { useEncounterContext } from "~/components/EncounterContext";

export function DisplayEncounter() {
    const encounter = useEncounterContext();
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