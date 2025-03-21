import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { createTheme, MantineProvider } from "@mantine/core";
import { store } from "./store";
import { Provider } from "react-redux";
import App from "./App";

import initDB, { stores } from "./repos";
import AppModalsProvider from "./modals";

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
    accent: [
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
    cued: [
      "#effde7",
      "#e1f8d4",
      "#c3efab",
      "#a2e67e",
      "#87de58",
      "#75d93f",
      "#6bd731",
      "#59be23",
      "#4da91b",
      "#3d920d",
    ],
    playing: [
      "#ffe8e9",
      "#ffd1d1",
      "#fba0a0",
      "#f76d6d",
      "#f44141",
      "#f22625",
      "#f21616",
      "#d8070b",
      "#c10007",
      "#a90003",
    ],
    played: [
      "#fff4e1",
      "#ffe8cc",
      "#fed09b",
      "#fdb766",
      "#fca13a",
      "#fc931d",
      "#fc8c0c",
      "#e17800",
      "#c86a00",
      "#af5a00",
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
        <AppModalsProvider>
          <App />
        </AppModalsProvider>
      </MantineProvider>
    </MemoryRouter>
  </Provider>
);
