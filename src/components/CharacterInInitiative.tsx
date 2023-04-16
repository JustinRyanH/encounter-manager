import React from "react";
import { Center, Container, Grid, Paper, SimpleGrid, Skeleton } from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";

export function CharacterInInitiative(): JSX.Element {
    const character = React.useMemo(() => new InitiativeCharacter({ name: 'Temp Name', initiative: 10 }), []);
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Grid align="flex-end">
            </Grid>
        </Paper>
    );
}
