import { Group, Paper, Skeleton } from "@mantine/core";

export function CharacterInInitative() {
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Group>
                <Skeleton height={50} circle animate={false} />
                <Skeleton height={50} width={100} animate={false} />
                <Skeleton height={50} width={100} animate={false} />
                <Skeleton height={50} width={100} animate={false} />
            </Group>
        </Paper>
    );
}
