import { BrowserWindow, ipcMain } from "electron";
import { configureStore, Store } from "@reduxjs/toolkit";

import audioEngineSlice, {
  AudioEngineActions,
} from "../../renderer/features/audioEngine.slice";
import { AudioEngineState, Output } from "../../types";

// type for the redux store state
export type RootState = {
  audioEngine: Record<Output, AudioEngineState>;
};

export type StoreState = Store<RootState, AudioEngineActions>;

// create the redux store in the main process
const store: StoreState = configureStore({
  reducer: {
    audioEngine: audioEngineSlice,
  },
});

// function to broadcast state to all renderer windows
const broadcastState = () => {
  const state = store.getState();

  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("redux:state:update", state);
  });
};

// subscribe to store changes and broadcast them
store.subscribe(broadcastState);

// handle actions from the renderer process
ipcMain.on("redux:action", (_, action: AudioEngineActions) => {
  store.dispatch(action);
});

export default store;
