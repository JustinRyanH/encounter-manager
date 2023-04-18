import React from "react";
import { Divider, Flex, Paper, Stack, Title } from "@mantine/core";

export function Attribute({ grow = undefined, title, children }: { grow?: number,  title: string, children: React.ReactNode }) {
    return (
        <Paper withBorder p="xs" style={{ flexGrow: grow }}>
            <Stack>
                <Title size="sm" align="center">{title}</Title>
                <Divider />
                <Flex justify="center" gap="sm">
                    {children}
                </Flex>
            </Stack>
        </Paper>
    );
}