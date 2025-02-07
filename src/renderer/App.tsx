import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";

import { Library, Main } from "./views";

import { SubclipEditor } from "./components";
import { useMantineColorScheme } from "@mantine/core";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleColorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (window.electron) {
      window.electron.onNavigate((route: string) => {
        navigate(route);
      });
    }
  }, [navigate]);

  useEffect(() => {
    if (window.electron) {
      window.electron.toggleTheme(() => {
        toggleColorScheme();
      });
    }
  }, [toggleColorScheme]);

  useEffect(() => {
    console.log("Current route:", `"${location.pathname}"`);
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <SubclipEditor
            file={{
              id: "341ce6dd-bb92-4a05-aff3-2bcf8e469e54",
              title: "Vamp",
              artist: "ESPN",
              album: "College Football",
              year: null,
              filePath:
                "/Users/robwrowe/Documents/test-audio/Event Theme Disc 01/04 Vamp.wav",
              color: null,
              duration: 51.42666666666667,
              subClips: {},
            }}
          />
        }
      />
      <Route path="/main/*" element={<Main />} />
      <Route path="/library/*" element={<Library />} />
    </Routes>
  );
}
