import { configureStore } from "@reduxjs/toolkit";
import banksSlice from "./features/banks.slice";
import outputDevicesSlice from "./features/outputDevices.slice";
import pagesSlice from "./features/pages.slice";
import showsSlice from "./features/shows.slice";
import audioFilesSlice from "./features/audioFiles.slice";

export const store = configureStore({
  reducer: {
    outputDevices: outputDevicesSlice,
    pages: pagesSlice,
    shows: showsSlice,
    banks: banksSlice,
    audioFiles: audioFilesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
