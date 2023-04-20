import React from "react";
import { Accordion } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterCharacter } from "~/components/encounter/EncounterCharacter";
import { useEncounterContext } from "~/components/encounter/EncounterContext";
import { useStyles } from "~/components/encounter/DisplayEncounter.styles";

export function DisplayEncounter() {
    const encounter = useEncounterContext();
    const characters = useWatchValueObserver(encounter.charactersObserver);

    const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);

    const openedCharacters = React.useMemo(() => {
        if (!activeCharacter) return [];
        return [activeCharacter.id];
    }, [
        activeCharacter
    ]);

    const { classes } = useStyles();

    return (<Accordion value={openedCharacters} classNames={classes} chevronPosition="left" multiple variant="separated">
        {characters.map((c) => <EncounterCharacter character={c} key={c.id} />)}
    </Accordion>);
}