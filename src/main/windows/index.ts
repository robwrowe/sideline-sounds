/* eslint-disable no-console */
import { app, BrowserWindow, session } from "electron";
import {
  installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

export let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      autoplayPolicy: "no-user-gesture-required",
    },
    show: !app.isPackaged,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  // add the devtools extension
  installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
    .then(async (extensions) => {
      setTimeout(() => {
        mainWindow?.reload();

        console.log(
          `Added Extensions: ${extensions.map((item) => item.name).join(", ")}`
        );
      }, 1000);
    })
    .catch((err) => console.log("An error occurred adding extensions: ", err));

  mainWindow.on("ready-to-show", () => {
    if (app.isPackaged) {
      mainWindow?.show();
    }
  });

  // When the window is ready, tell React to navigate to the home page
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow?.webContents.send(
      "navigate",
      "/main/show/419717fb-f85f-49fd-9bbf-ea69d43d3d55"
    );
    // //
    // mainWindow?.webContents.send("navigate", "/main");
    // //
    // mainWindow?.webContents.send("navigate", "/main/show");
    // //
    // mainWindow?.webContents.send("navigate", "/library");
  });

  // Modify HTTP headers to set CSP dynamically
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // Modify the headers to allow blob URLs for media
    const headers = details.responseHeaders ?? {};
    headers["Content-Security-Policy"] = [
      "default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    ];
    callback({ cancel: false, responseHeaders: headers });
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

export default createWindow;
