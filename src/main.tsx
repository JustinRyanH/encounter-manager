import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from '@mantine/core';

import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
        <App />
    </MantineProvider>
  </React.StrictMode>
);
