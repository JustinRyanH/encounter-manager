import {
  Accordion,
  ActionIcon,
  Button,
  Drawer,
  Group,
  Header,
} from "@mantine/core";
import { BugBeetle } from "@phosphor-icons/react";
import { useDisclosure } from "@mantine/hooks";
import { DebugFileBrowser } from "~/components/files/DebugFileBrowser";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [opened, debugHandles] = useDisclosure(false);

  const disabledBack = location.pathname === "/";

  return (
    <>
      <DebugDrawer opened={opened} onClose={debugHandles.close} />
      <Header p="xs" height={{ base: "3rem", md: "4rem" }}>
        <Group position="apart" align="center" h="100%">
          <Button
            size="xs"
            disabled={disabledBack}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Group position="right" align="center">
            <ActionIcon
              onClick={debugHandles.open}
              title="Debug Panel"
              variant="outline"
            >
              <BugBeetle />
            </ActionIcon>
          </Group>
        </Group>
      </Header>
    </>
  );
}
