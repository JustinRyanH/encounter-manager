import React from "react";
import { Flex, Grid, Header, NumberInput, Paper, Skeleton, Text, TextInput, Title, rem } from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";

function HitPoints({ current, max, temporary }: { current: number, max: number, temporary: number }) {
    return (
        <Paper>
            <Grid>
                <Grid.Col span={4}><Title transform="uppercase" order={2} size="sm" >current</Title></Grid.Col>
                <Grid.Col span={3}><Title transform="uppercase" order={2} size="sm" >max</Title></Grid.Col>
                <Grid.Col span={5}><Title transform="uppercase" order={2} size="sm" align="center" >temp</Title></Grid.Col>
                <Grid.Col span={3}><Text ta="right">{current}</Text></Grid.Col>
                <Grid.Col span={1}><Text ta="right">/</Text></Grid.Col>
                <Grid.Col span={3}><Text ta="left"></Text>{max}</Grid.Col>
                <Grid.Col span={5}><Text ta="center">{temporary || '--'}</Text></Grid.Col>
            </Grid>
        </Paper>
    );
}


export function CharacterInInitiative(): JSX.Element {
    const character = React.useMemo(() => new InitiativeCharacter({ name: 'Temp Name', initiative: 10 }), []);
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Flex gap="sm" align="flex-end">
                <Skeleton radius="lg" width={50} height={50} animate={false} />
                <TextInput label="Name" styles={{ input: { textAlign: "center" } }} readOnly />
                <NumberInput label="Initiative" style={{ width: rem(70) }} readOnly />
                <HitPoints current={10} max={10} temporary={0} />
            </Flex>
        </Paper>
    );
}
