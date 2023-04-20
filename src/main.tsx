import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from '@mantine/core';

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
            colorScheme: 'dark',
            colors: {
                danger: [
                    'rgba(255, 36, 36, 0.1)',
                    'rgba(255, 36, 36, 0.2)',
                    'rgba(255, 36, 36, 0.4)',
                    'rgba(255, 36, 36, 0.6)',
                    'rgba(255, 36, 36, 0.8)',
                    'rgba(255, 36, 36, 1.0)',
                ],
                alphaDark: [
                    'rgba(26, 27, 30, 0.1)',
                    'rgba(26, 27, 30, 0.2)',
                    'rgba(26, 27, 30, 0.4)',
                    'rgba(26, 27, 30, 0.6)',
                    'rgba(26, 27, 30, 0.8)',
                    'rgba(26, 27, 30, 1.0)',
                ]
            },
    }}
    >
        <App />
    </MantineProvider>
  </React.StrictMode>
);
