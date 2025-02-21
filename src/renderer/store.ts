import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import audioEngineSlice from "./features/audioEngine.slice";
import banksSlice from "./features/banks.slice";
import outputDevicesSlice from "./features/outputDevices.slice";
import pagesSlice from "./features/pages.slice";
import showsSlice from "./features/shows.slice";
import audioFilesSlice from "./features/audioFiles.slice";
import contentButtonsSlice from "./features/contentButtons.slice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  reducer: {
    audioEngine: audioEngineSlice,
    outputDevices: outputDevicesSlice,
    pages: pagesSlice,
    shows: showsSlice,
    banks: banksSlice,
    audioFiles: audioFilesSlice,
    contentButtons: contentButtonsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
