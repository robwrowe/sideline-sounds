import { configureStore } from "@reduxjs/toolkit";
import outputDevicesSlice from "./features/outputDevices.slice";

export const store = configureStore({
  reducer: {
    outputDevices: outputDevicesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
