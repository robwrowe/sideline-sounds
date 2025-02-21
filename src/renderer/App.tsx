import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import { useMantineColorScheme } from "@mantine/core";

import { LibraryView, MainView, OutputView } from "./views";
import { useAppDispatch, useMainProcessStore } from "./hooks";

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

  // sync local store state with process updates
  useMainProcessStore();

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
      <Route path="/" element={<p>No route found</p>} />
      <Route path="/main/*" element={<MainView />} />
      <Route path="/library/*" element={<LibraryView />} />
      <Route path="/output/*" element={<OutputView />} />
    </Routes>
  );
}
