import React from "react";
import { Accordion } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterCharacter } from "~/components/encounter/EncounterCharacter";
import { useEncounterContext } from "~/components/encounter/EncounterContext";
import { useStyles } from "~/components/encounter/DisplayEncounter.styles";


export function DisplayEncounter() {
    const encounter = useEncounterContext();
    const characters = useWatchValueObserver(encounter.charactersObserver);
    const viewEncounter = React.useMemo(() => encounter.newViewEncounter, [encounter]);
    const ids = useWatchValueObserver(viewEncounter.openedCharactersObserver);

    const { classes } = useStyles();

    return (<Accordion value={ids} classNames={classes} chevronPosition="left" variant="separated" multiple>
        {characters.map((c) => <EncounterCharacter viewEncounter={viewEncounter} character={c} key={c.id} />)}
    </Accordion>);
}