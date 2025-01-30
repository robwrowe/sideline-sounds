import { configureStore } from "@reduxjs/toolkit";
import outputDevicesSlice from "./features/outputDevices.slice";
import showsSlice from "./features/shows.slice";

export const store = configureStore({
  reducer: {
    outputDevices: outputDevicesSlice,
    shows: showsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
