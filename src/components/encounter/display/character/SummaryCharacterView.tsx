import { EncounterCharacter } from "~/services/encounter";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { useDisclosure } from "@mantine/hooks";
import { Center, Group, Popover, SimpleGrid, Skeleton, Text } from "@mantine/core";

export function SummaryCharacterView({ character }: { character: EncounterCharacter }): JSX.Element {
  const name = useWatchValueObserver(character.nameObserver);
  const current = useWatchValueObserver(character.hp.currentObserver);
  const total = useWatchValueObserver(character.hp.totalObserver);
  const temp = useWatchValueObserver(character.hp.tempObserver);

  const [opened, { close, open }] = useDisclosure(false);

  const hasTemp = temp !== 0;
  const color = hasTemp ? "blue" : undefined;

  const nameComponent = (
    <Text fz="lg" weight={700}>
      {name}
    </Text>
  );

  return (
    <Group spacing="sm">
      <Center maw={75}>
        <Skeleton circle width={25} height={25} animate={false} />
      </Center>
      {nameComponent}
      <Group spacing="xs">
        <Popover position="top" opened={opened}>
          <Popover.Target>
            <Text onMouseEnter={() => temp && open()} onMouseLeave={close} color={color}>
              {current + temp}
            </Text>
          </Popover.Target>
          <Popover.Dropdown>
            <SimpleGrid verticalSpacing="xs" cols={2}>
              <Text size="xs" align="right">
                Current:
              </Text>
              <Text size="xs">{current}</Text>
              <Text size="xs" align="right">
                Temp:
              </Text>
              <Text color="blue" size="xs">
                {temp}
              </Text>
            </SimpleGrid>
          </Popover.Dropdown>
        </Popover>
        <Text>/</Text>
        <Text>{total}</Text>
      </Group>
    </Group>
  );
}
