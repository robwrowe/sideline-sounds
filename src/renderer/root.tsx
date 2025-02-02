import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { createTheme, MantineProvider } from "@mantine/core";
import { store } from "./store";
import { Provider } from "react-redux";
import App from "./App";
import { AudioEngineProvider } from "./context";

import initDB, { stores } from "./repos";

// core styles are required for all packages
import "@mantine/core/styles.css";

const theme = createTheme({
  colors: {
    app: [
      "#f0f9fa",
      "#e3f0f0",
      "#c1e0e2",
      "#9cd0d3",
      "#7ec2c6",
      "#6cbabe",
      "#60b6bb",
      "#509fa5",
      "#428e93",
      "#2d7b80",
    ],
    highlight: [
      "#fff3e3",
      "#ffe6cd",
      "#ffcc9c",
      "#feb066",
      "#fe9839",
      "#fe891d",
      "#fe810d",
      "#e36f00",
      "#cb6100",
      "#b05200",
    ],
  },
  primaryColor: "app",
});

// when this mounts for the first time, initialize the database
initDB(stores);

const root = createRoot(document.body);

root.render(
  <Provider store={store}>
    <MemoryRouter>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <AudioEngineProvider>
          <App />
        </AudioEngineProvider>
      </MantineProvider>
    </MemoryRouter>
  </Provider>
);
