import React from "react";
import { Accordion, Button, Group } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterCharacter } from "~/components/encounter/EncounterCharacter";
import { useEncounterContext } from "~/components/encounter/EncounterContext";
import { useStyles } from "~/components/encounter/DisplayEncounter.styles";

function ManageEncounter() {
    const encounter = useEncounterContext();
    const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);

    return (
        <Group p="1rem" align="center" position="apart">
            <Button disabled={Boolean(activeCharacter)} onClick={() => encounter.startEncounter()}> Start Encounter </Button>
            <Button disabled={Boolean(activeCharacter)} color="gray" onClick={() => encounter.restartEncounter()}> Restart Encounter </Button>
            <Button disabled={!activeCharacter} color="gray" onClick={() => encounter.stopEncounter()}> Stop Encounter </Button>
        </Group>
    )
}


export function DisplayEncounter() {
    const encounter = useEncounterContext();
    const characters = useWatchValueObserver(encounter.charactersObserver);
    const viewEncounter = React.useMemo(() => encounter.newViewEncounter, [encounter]);
    const ids = useWatchValueObserver(viewEncounter.openedCharactersObserver);

    const { classes } = useStyles();

    return (
        <>
            <ManageEncounter />
            <Accordion value={ids} classNames={classes} chevronPosition="left" variant="separated" multiple>
                {characters.map((c) => <EncounterCharacter viewEncounter={viewEncounter} character={c} key={c.id} />)}
            </Accordion>
        </>
    );
}