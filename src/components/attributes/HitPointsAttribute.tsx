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
                styles={{ input: { textAlign: "center" } }}
                step={1}
                min={-1000}
                max={1000}
            />
            <NumberInput
                aria-label="Total"
                placeholder="Total"
                styles={{ input: { textAlign: "center" } }}
                step={1}
                min={0}
                max={1000}
            />
            <NumberInput
                aria-label="Temp"
                placeholder="Temp"
                styles={{ input: { textAlign: "center" } }}
                step={1}
                min={0}
                max={1000}
            />
        </Flex>
    </Stack>);
}
