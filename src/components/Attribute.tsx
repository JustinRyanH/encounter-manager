import React from "react";
import {Divider, Flex, Paper, Stack, Title} from "@mantine/core";

export function Attribute({title, children}: { title: string, children: React.ReactNode }) {
    return (
        <Paper withBorder p="xs">
            <Stack>
                <Title size="sm" align="center">{title}</Title>
                <Divider/>
                <Flex justify="center" gap="sm">
                    {children}
                </Flex>
            </Stack>
        </Paper>
    );
}