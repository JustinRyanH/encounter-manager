import { Encounters } from "~/services/Encounters";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Accordion, Stack } from "@mantine/core";
import { EncounterCharacter } from "~/components/EncounterCharacter";
import React from "react";

export function DisplayEncounter({ encounter }: { encounter: Encounters }) {
    const characters = useWatchValueObserver(encounter.charactersObserver);

    return <Stack align="flex-start">
        {
            characters.map((c) => <Accordion variant="separated" key={c.id}>
                <EncounterCharacter character={c} key={c.id}/>
            </Accordion>)
        }
    </Stack>;
}