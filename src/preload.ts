// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    invoke: (channel: string, ...args: unknown[]) =>
      ipcRenderer.invoke(channel, ...args),
  },

  onNavigate: (callback: (route: string) => void) => {
    ipcRenderer.on("navigate", (_event, route) => callback(route));
  },
});
