import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { createTheme, MantineProvider, Button } from "@mantine/core";

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
  },
  primaryColor: "app",
});

const root = createRoot(document.body);

root.render(
  <MemoryRouter>
    <MantineProvider theme={theme}>
      <h2>Hello from React!</h2>
      <Button>Hello, World!</Button>
    </MantineProvider>
  </MemoryRouter>
);
