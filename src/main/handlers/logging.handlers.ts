import { ipcMain } from "electron";

// allow the renderer process to log in the main process
ipcMain.handle("log:log", (_, ...args: unknown[]) => console.log(...args));
ipcMain.handle("log:info", (_, ...args: unknown[]) => console.info(...args));
ipcMain.handle("log:warn", (_, ...args: unknown[]) => console.warn(...args));
ipcMain.handle("log:error", (_, ...args: unknown[]) => console.error(...args));
ipcMain.handle("log:debug", (_, ...args: unknown[]) => console.debug(...args));
ipcMain.handle("log:trace", (_, ...args: unknown[]) => console.trace(...args));
