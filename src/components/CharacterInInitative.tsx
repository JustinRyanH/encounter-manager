import { Center, Container, Divider, Paper, SimpleGrid, Skeleton, Stack } from "@mantine/core";

export function CharacterInInitative() {
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Container my="md">
                <SimpleGrid cols={5} spacing="md">
                    <Center>
                        <Skeleton height={50} circle animate={false} />
                    </Center>
                    <Stack spacing="sm">
                        <Skeleton height={20} animate={false} />
                        <Divider />
                        <Skeleton height={20} animate={false} />
                    </Stack>
                    <Stack spacing="sm">
                        <Skeleton height={20} animate={false} />
                        <Divider />
                        <Skeleton height={20} animate={false} />
                    </Stack>
                    <Stack spacing="sm">
                        <Skeleton height={20} animate={false} />
                        <Divider />
                        <Skeleton height={20} animate={false} />
                    </Stack>
                    <Stack spacing="sm">
                        <Skeleton height={20} animate={false} />
                        <Divider />
                        <Skeleton height={20} animate={false} />
                    </Stack>
                </SimpleGrid>
            </Container>
        </Paper>
    );
}
