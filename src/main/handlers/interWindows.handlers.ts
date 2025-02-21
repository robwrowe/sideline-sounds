import { ipcMain } from "electron";
import { mainWindow, libraryWindow, outputWindow } from "../windows";

ipcMain.on("broadcast-event", (event, channel, ...args) => {
  console.log("Broadcasting event", channel);

  const windows = [mainWindow, libraryWindow, outputWindow];

  for (const win of windows) {
    if (win && !win.isDestroyed()) {
      if (win.webContents.id !== event.sender.id) {
        win.webContents.send("event-from-other-renderer", channel, ...args);
      }
    }
  }
});

// messages for non-output window to trigger audio files
ipcMain.on("broadcast:audio:engine", (_, channel, ...args) => {
  console.log(`Broadcasting "audio:engine" event`, channel);

  if (outputWindow && !outputWindow.isDestroyed()) {
    outputWindow.webContents.send("audio:engine", channel, ...args);
  }
});

// messages from output window for metadata changes
ipcMain.on("broadcast:audio:status", (event, channel, ...args) => {
  console.log(`Broadcasting "audio:status" event`, channel);

  if (outputWindow?.webContents.id) {
    const windows = [mainWindow, libraryWindow];

    for (const win of windows) {
      if (win && !win.isDestroyed()) {
        if (win.webContents.id !== outputWindow.webContents.id) {
          win.webContents.send("audio:status", channel, ...args);
        }
      }
    }
  }
});
