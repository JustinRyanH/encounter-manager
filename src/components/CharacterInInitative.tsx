import { Center, Container, Divider, Paper, SimpleGrid, Skeleton, Stack, Title } from "@mantine/core";

function AttributeSkeleton(): JSX.Element {
    return (<Stack spacing="sm">
        <Skeleton height={20} animate={false} />
        <Divider />
        <Skeleton height={20} animate={false} />
    </Stack>)
}

interface NameAttributeProps {
    title: string;
    value?: string;
}

function SimpleStringAttribute({ title }: NameAttributeProps): JSX.Element {
    return (<Stack spacing="sm">
        <Title order={3} align="center" transform="uppercase">{title}</Title>
        <Divider />
        <Skeleton height={20} animate={false} />
    </Stack>)
}

export function CharacterInInitative(): JSX.Element {
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Container>
                <SimpleGrid cols={4} spacing="md">
                    <Center>
                        <Skeleton height={50} circle animate={false} />
                    </Center>
                    <SimpleStringAttribute title="Name" />
                    <SimpleStringAttribute title="Initiative" />
                    <SimpleStringAttribute title="HP" />
                </SimpleGrid>
            </Container>
        </Paper>
    );
}
