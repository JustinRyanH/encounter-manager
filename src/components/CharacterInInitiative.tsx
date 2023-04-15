import React from "react";
import { Center, Container, Paper, SimpleGrid, Skeleton } from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { ValueObserver } from "~/services/ValueObserver";

import { SimpleStringAttribute, SimpleNumberAttribute } from "./attributes";

export interface SimpleStringAttributeProps {
    title: string;
    observer: ValueObserver<string>
}

export function CharacterInInitiative(): JSX.Element {
    const character = React.useMemo(() => new InitiativeCharacter({ name: 'Name', initiative: 10 }), []);
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Container>
                <SimpleGrid cols={4} spacing="md">
                    <Center>
                        <Skeleton height={50} circle animate={false} />
                    </Center>
                    <SimpleStringAttribute title="Name" observer={character.nameObserver} />
                    <SimpleNumberAttribute title="Initiative" observer={character.initiativeObserver} cannotEdit />
                </SimpleGrid>
            </Container>
        </Paper>
    );
}
