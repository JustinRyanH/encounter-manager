import { Flex, Paper, Skeleton } from "@mantine/core";

export function CharacterInInitative() {
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Flex gap="lg" align="center">
                <Skeleton height={50} width={30} animate={false} />
                <Skeleton height={50} circle animate={false} />
                <Skeleton height={50} width={100} animate={false} />
                <Skeleton height={50} width={100} animate={false} />
                <Skeleton height={50} width={100} animate={false} />
            </Flex>
        </Paper>
    );
}
