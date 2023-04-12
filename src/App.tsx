import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { AppShell, Navbar, Title } from "@mantine/core";

import "./App.css";

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

  return (<AppShell navbar={navbar}> <h1> Tauri APP</ h1> </AppShell>);
}

export default App;
