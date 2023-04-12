import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { AppShell, Box, Container, Flex, Navbar, Paper, Skeleton, Stack, Title } from "@mantine/core";

import "./App.css";

function CharacterInInitative() {
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

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  const navbar = (<Navbar width={{ base: 250 }} p="xs">
    <Navbar.Section>
      <Title order={3}>Enounter Manager</Title>
    </Navbar.Section>
  </Navbar>);

  return (<AppShell navbar={navbar}>
    <h1>Encounters</ h1>
    <Stack align="flex-start">
      <CharacterInInitative />
      <CharacterInInitative />
      <CharacterInInitative />
      <CharacterInInitative />
      <CharacterInInitative />
      <CharacterInInitative />
    </Stack>
  </AppShell>);
}

export default App;
