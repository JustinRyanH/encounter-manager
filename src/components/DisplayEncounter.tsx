import { Encounters } from "~/services/Encounters";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Stack } from "@mantine/core";
import { CharacterInInitiative } from "~/components/CharacterInInitiative";
import React from "react";

export function DisplayEncounter({ encounter }: { encounter: Encounters }) {
    const characters = useWatchValueObserver(encounter.charactersObserver);

    return (<Stack align="flex-start">
        {characters.map((c) => <CharacterInInitiative character={c} key={c.id}/>)}
    </Stack>);
}