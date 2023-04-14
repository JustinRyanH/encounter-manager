import { Center, Container, Divider, Paper, SimpleGrid, Skeleton, Stack } from "@mantine/core";

function AttributeSkeleton(): JSX.Element {
    return (<Stack spacing="sm">
        <Skeleton height={20} animate={false} />
        <Divider />
        <Skeleton height={20} animate={false} />
    </Stack>)
}

function NameAttribute(): JSX.Element {
    return (<Stack spacing="sm">
        <Skeleton height={20} animate={false} />
        <Divider />
        <Skeleton height={20} animate={false} />
    </Stack>)
}

export function CharacterInInitative(): JSX.Element {
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Container>
                <SimpleGrid cols={5} spacing="md">
                    <Center>
                        <Skeleton height={50} circle animate={false} />
                    </Center>
                    <NameAttribute />
                    <AttributeSkeleton />
                    <AttributeSkeleton />
                    <AttributeSkeleton />
                </SimpleGrid>
            </Container>
        </Paper>
    );
}
