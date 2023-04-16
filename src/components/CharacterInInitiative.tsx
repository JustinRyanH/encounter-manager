import React from "react";
import {Center, Container, Grid, Paper, SimpleGrid, Skeleton} from "@mantine/core";

import {InitiativeCharacter} from "~/services/InititativeCharacter";

import {SimpleStringAttribute, SimpleNumberAttribute} from "./attributes";
import {HitPointsAttribute} from "~/components/attributes/HitPointsAttribute";

export function CharacterInInitiative(): JSX.Element {
    const character = React.useMemo(() => new InitiativeCharacter({name: 'Temp Name', initiative: 10}), []);
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Grid align="flex-end">
                <Grid.Col span="content">
                    <Skeleton height={50} circle animate={false}/>
                </Grid.Col>
                <Grid.Col span={2}>
                    <SimpleStringAttribute title="Name" observer={character.nameObserver}/>
                </Grid.Col>
                <Grid.Col span="content">
                    <SimpleNumberAttribute
                        width={50}
                        title="Initiative"
                        observer={character.initiativeObserver}
                        cannotEdit
                    />
                </Grid.Col>
                <Grid.Col span="auto">
                    <HitPointsAttribute/>
                </Grid.Col>
            </Grid>
        </Paper>
    );
}
