import React from "react";
import { Stack, Title } from "@mantine/core";
import { Encounters } from "~/services/Encounters";

export function AddCharacterToEncounter({ }: { encounter: Encounters; }) {
    return (<Stack>
        <Title order={4}>Add Character</Title>
    </Stack>);
}
