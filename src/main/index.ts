/* eslint-disable no-console */
import { app } from "electron";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// ensure audio permission is granted
app.commandLine.appendSwitch("enable-features", "AudioServiceSandbox");

// create main window
import "./windows";

// listen to events
import "./handlers";
