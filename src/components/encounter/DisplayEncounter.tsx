import React from "react";
import { Accordion } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterCharacter } from "~/components/encounter/EncounterCharacter";
import { useEncounterContext } from "~/components/encounter/EncounterContext";
import { useStyles } from "~/components/encounter/DisplayEncounter.styles";

/**
 * A hook that returns the expanded characters and a function to update the expanded characters.
 * 
 * @returns [expanded, setExpanded]
 */
function useExpandedEncounter() {
    const encounter = useEncounterContext();

    const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);
    const [userOpenedCharacters, setUserOpenedCharacter] = React.useState<string[]>([]);

    const updateCharacters = React.useCallback((opended: string[]) => {
        if (!activeCharacter) return setUserOpenedCharacter(opended);
        if (!opended.includes(activeCharacter.id)) return setUserOpenedCharacter([activeCharacter.id, ...opended]);
        return setUserOpenedCharacter(opended);
    }, [activeCharacter]);

    React.useEffect(() => {
        if (activeCharacter) setUserOpenedCharacter([activeCharacter.id]);
    }, [activeCharacter]);


    return [userOpenedCharacters, updateCharacters] as const;
}

export function DisplayEncounter() {
    const encounter = useEncounterContext();
    const characters = useWatchValueObserver(encounter.charactersObserver);

    const [expanded, setExpanded] = useExpandedEncounter();
    const { classes } = useStyles();

    return (<Accordion value={expanded} onChange={setExpanded} classNames={classes} chevronPosition="left" variant="separated" multiple>
        {characters.map((c) => <EncounterCharacter character={c} key={c.id} />)}
    </Accordion>);
}