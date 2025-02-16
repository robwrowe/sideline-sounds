/* eslint-disable no-console */
import { app, BrowserWindow, session } from "electron";
import {
  installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

import createMainWindow from "./mainWindow";
import createLibraryWindow from "./libraryWindow";

export * from "./mainWindow";
export * from "./libraryWindow";

export { createMainWindow, createLibraryWindow };

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createMainWindow();

  // Modify HTTP headers to set CSP dynamically
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // Modify the headers to allow blob URLs for media
    const headers = details.responseHeaders ?? {};
    headers["Content-Security-Policy"] = [
      "default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    ];
    callback({ cancel: false, responseHeaders: headers });
  });

  // add the devtools extension
  installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
    .then(async (extensions) => {
      setTimeout(() => {
        console.log(
          `Added Extensions: ${extensions.map((item) => item.name).join(", ")}`
        );
      }, 1000);
    })
    .catch((err) => console.log("An error occurred adding extensions: ", err));
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
