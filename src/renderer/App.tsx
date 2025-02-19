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

  // listen to events from other renderer processes
  useEffect(() => {
    window.broadcast.onEvent((channel, ...args) => {
      if (channel === "fetch") {
        const type = args?.[0];

        // check if there's a specific one to update
        if (type) {
          switch (type) {
            case "audioFiles":
              dispatch(fetchAudioFiles());
              break;

            case "banks":
              dispatch(fetchBanks());
              break;

            case "outputDevices":
              dispatch(fetchOutputDevices());
              break;

            case "pages":
              dispatch(fetchPages());
              break;

            case "shows":
              dispatch(fetchShows());
              break;

            case "contentButtons":
              dispatch(fetchContentButtons());
              break;

            default:
              window.log.error(
                "Unknown fetch event from other renderer process",
                type
              );

              console.error(
                "Unknown fetch event from other renderer process",
                type
              );
          }
        } else {
          // otherwise, fetch them all
          dispatch(fetchAudioFiles());
          dispatch(fetchBanks());
          dispatch(fetchOutputDevices());
          dispatch(fetchPages());
          dispatch(fetchShows());
          dispatch(fetchContentButtons());
        }
      }
    });
  }, [dispatch]);

  // TEMP: fetch all data when component mounts
  useEffect(() => {
    dispatch(fetchAudioFiles());
    dispatch(fetchBanks());
    dispatch(fetchOutputDevices());
    dispatch(fetchPages());
    dispatch(fetchShows());
    dispatch(fetchContentButtons());
  }, [dispatch]);

  return (
    <Routes>
      {/* TODO: add fallback route to select page */}
      {/* use this for inspo: https://ui.mantine.dev/category/features/ */}
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
