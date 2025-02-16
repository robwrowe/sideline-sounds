import { ipcMain } from "electron";
import { mainWindow, libraryWindow } from "../windows";

ipcMain.on("broadcast-event", (event, channel, ...args) => {
  console.log("Broadcasting event", channel);

  const windows = [mainWindow, libraryWindow];

  for (const win of windows) {
    if (win && !win.isDestroyed()) {
      if (win.webContents.id !== event.sender.id) {
        win.webContents.send("event-from-other-renderer", channel, ...args);
      }
    }
  }
});
