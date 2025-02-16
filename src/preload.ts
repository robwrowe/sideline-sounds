// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { DialogOpenOpts } from "./types";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    invoke: (channel: string, ...args: unknown[]) =>
      ipcRenderer.invoke(channel, ...args),
  },

  onNavigate: (callback: (route: string) => void) => {
    ipcRenderer.on("navigate", (_event, route) => callback(route));
  },

  toggleTheme: (callback: () => void) => {
    ipcRenderer.on("theme:toggle", () => callback());
  },

  dialog: {
    showOpenDialog: (opts: DialogOpenOpts = {}) =>
      ipcRenderer.invoke("dialog:showOpenDialog", opts),
  },

  audio: {
    fileBuffer: (filePath: string) =>
      ipcRenderer.invoke("audio:fileBuffer", filePath),
    metadata: (filePath: string) =>
      ipcRenderer.invoke("audio:metadata", filePath),
  },
});

contextBridge.exposeInMainWorld("log", {
  log: (...args: unknown[]) => ipcRenderer.invoke("log:log", ...args),
  info: (...args: unknown[]) => ipcRenderer.invoke("log:info", ...args),
  warn: (...args: unknown[]) => ipcRenderer.invoke("log:warn", ...args),
  error: (...args: unknown[]) => ipcRenderer.invoke("log:error", ...args),
  debug: (...args: unknown[]) => ipcRenderer.invoke("log:debug", ...args),
  trace: (...args: unknown[]) => ipcRenderer.invoke("log:trace", ...args),
});

contextBridge.exposeInMainWorld("broadcast", {
  sendEvent: (channel: string, ...args: unknown[]) => {
    console.log("received sendEvent", channel, ...args);
    ipcRenderer.send("broadcast-event", channel, ...args);
  },

  onEvent: (callback: (channel: string, ...args: unknown[]) => void) => {
    ipcRenderer.on("event-from-other-renderer", (_, channel, ...args) => {
      console.log("received event from other renderer", channel, ...args);
      callback(channel, ...args);
    });
  },
});
