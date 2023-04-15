import { Center, Container, Divider, Paper, SimpleGrid, Skeleton, Stack, TextInput, Title } from "@mantine/core";
import React from "react";
import { InitiativeCharacter } from "../services/InititativeCharacter";
import { ValueObserver } from "../services/ValueObserver";
import { useWatchValueObserver } from "../hooks/watchValueObserver";

interface SimpleStringAttributeProps {
    title: string;
    observer: ValueObserver<string>
}

function SimpleStringAttribute({ title, observer }: SimpleStringAttributeProps): JSX.Element {
    const [isEditing, setIsEditng] = React.useState(false);
    const [value, setValue] = useWatchValueObserver(observer);
    return (<Stack spacing="sm">
        <Title order={3} align="center" transform="uppercase">{title}</Title>
        <Divider />
        <TextInput
            onDoubleClick={() => setIsEditng(true)}
            onBlur={() => setIsEditng(false)}
            aria-label={title}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder={title}
            radius="md"
            styles={{ input: { textAlign: "center" } }}
            readOnly={!isEditing}
        />
    </Stack>)
}

export function CharacterInInitative(): JSX.Element {
    const character = React.useMemo(() => new InitiativeCharacter({ name: 'Name', initiative: 10 }), []);
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Container>
                <SimpleGrid cols={4} spacing="md">
                    <Center>
                        <Skeleton height={50} circle animate={false} />
                    </Center>
                    <SimpleStringAttribute title="Name" observer={character.nameObserver} />
                </SimpleGrid>
            </Container>
        </Paper>
    );
}
