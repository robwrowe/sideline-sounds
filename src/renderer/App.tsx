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
      <Route path="/" element={<SubclipEditor />} />
      <Route path="/main/*" element={<Main />} />
      <Route path="/library/*" element={<Library />} />
    </Routes>
  );
}
