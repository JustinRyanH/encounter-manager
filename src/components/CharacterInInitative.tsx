import { Center, Container, Divider, Paper, SimpleGrid, Skeleton, Stack } from "@mantine/core";

function Attribute(): JSX.Element {
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
                    <Attribute />
                    <Attribute />
                    <Attribute />
                    <Attribute />
                </SimpleGrid>
            </Container>
        </Paper>
    );
}
