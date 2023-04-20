import React from "react";
import { Accordion } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterCharacter } from "~/components/EncounterCharacter";
import { useEncounterContext } from "~/components/EncounterContext";

export function DisplayEncounter() {
    const encounter = useEncounterContext();
    const characters = useWatchValueObserver(encounter.charactersObserver);

    return (<Accordion chevronPosition="left" multiple variant="separated">
        {characters.map((c) => <EncounterCharacter character={c} key={c.id} />)}
    </Accordion>);
}