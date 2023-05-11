import { Accordion, ActionIcon, Drawer, Group, Header } from "@mantine/core";
import { BugBeetle } from "@phosphor-icons/react";
import { useDisclosure } from "@mantine/hooks";
import { DebugFileBrowser } from "~/components/files/DebugFileBrowser";

interface DebugDrawerProps {
  opened: boolean;
  onClose: () => void;
}

function DebugDrawer({ opened, onClose }: DebugDrawerProps) {
  return (
    <Drawer
      size="xs"
      position="right"
      opened={opened}
      onClose={onClose}
      title="Debug Panel"
    >
      <Accordion defaultValue="files">
        <Accordion.Item value="files">
          <Accordion.Control>Explore Files</Accordion.Control>
          <Accordion.Panel>
            <DebugFileBrowser />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Drawer>
  );
}

export function AppHeader() {
  const [opened, debugHandles] = useDisclosure(false);

  return (
    <>
      <DebugDrawer opened={opened} onClose={debugHandles.close} />
      <Header p="xs" height={{ base: "3rem", md: "4rem" }}>
        <Group position="right">
          <ActionIcon
            onClick={debugHandles.open}
            title="Debug Panel"
            variant="outline"
          >
            <BugBeetle />
          </ActionIcon>
        </Group>
      </Header>
    </>
  );
}
