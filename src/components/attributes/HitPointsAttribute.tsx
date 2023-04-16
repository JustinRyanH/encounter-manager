import {Divider, Flex, Grid, NumberInput, SimpleGrid, Stack, Title} from "@mantine/core";
import React from "react";

import {SimpleAttributeProps} from "./SimpleAttributeProps";
import {useAttribute, useEditableAttribute} from "~/hooks/UseAttribute";

export function HitPointsAttribute(): JSX.Element {
    return (<Stack spacing="sm">
        <Title order={3} align="center" transform="uppercase">Hitpoints</Title>
        <Flex gap="xs">
            <NumberInput
                aria-label="Current"
                placeholder="Current"
                radius="md"
                styles={{ input: { textAlign: "center" } }}
                readOnly />
            <NumberInput
                aria-label="Total"
                placeholder="Total"
                radius="md"
                styles={{ input: { textAlign: "center" } }}
                readOnly />
            <NumberInput
                aria-label="Temp"
                placeholder="Temp"
                radius="md"
                styles={{ input: { textAlign: "center" } }}
                readOnly />
        </Flex>
    </Stack>);
}
