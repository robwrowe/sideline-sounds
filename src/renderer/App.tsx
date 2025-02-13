import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import { useMantineColorScheme } from "@mantine/core";

import { Library, Main } from "./views";
import { AudioFileEditor } from "./components";
import { useAppDispatch } from "./hooks";

import {
  fetchAudioFiles,
  fetchBanks,
  fetchContentButtons,
  fetchOutputDevices,
  fetchPages,
  fetchShows,
} from "./features";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleColorScheme } = useMantineColorScheme();
  const dispatch = useAppDispatch();

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

  // TEMP: fetch all data when component mounts
  useEffect(() => {
    dispatch(fetchAudioFiles());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOutputDevices());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPages());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchContentButtons());
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AudioFileEditor
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
              subclips: [],
            }}
          />
        }
      />
      <Route path="/main/*" element={<Main />} />
      <Route path="/library/*" element={<Library />} />
    </Routes>
  );
}
