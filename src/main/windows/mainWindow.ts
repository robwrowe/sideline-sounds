import { app, BrowserWindow } from "electron";

export let mainWindow: BrowserWindow | null = null;

const createMainWindow = (): void => {
  // check if the window exists and if so, was it destroyed
  if (!mainWindow || mainWindow.isDestroyed()) {
    // cleanup listeners
    mainWindow?.removeAllListeners();
    mainWindow?.webContents.removeAllListeners();

    mainWindow = null;
  }

  if (!mainWindow) {
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

    mainWindow.on("ready-to-show", () => {
      if (app.isPackaged) {
        mainWindow?.show();
      }
    });

    // When the window is ready, tell React to navigate to the home page
    mainWindow.webContents.on("did-finish-load", () => {
      // mainWindow?.webContents.send(
      //   "navigate",
      //   "/main/show/419717fb-f85f-49fd-9bbf-ea69d43d3d55"
      // );
      // //
      // mainWindow?.webContents.send("navigate", "/main");
      // //
      // mainWindow?.webContents.send("navigate", "/main/show");
      // //
      // mainWindow?.webContents.send("navigate", "/library");
      // //
      mainWindow?.webContents.send("navigate", "/output/dest");
    });

    // TEMP: logging for context menu issues
    mainWindow.on("close", () =>
      console.log("Main Window", "Window is about to close")
    );
    mainWindow.on("closed", () => {
      console.log("Main Window", "Window was closed");
      mainWindow = null;
    });
    mainWindow.on("unresponsive", () =>
      console.log("Main Window", "Window was become unresponsive.")
    );
    mainWindow.on("resized", () =>
      console.log("Main Window", "Window was resized")
    );
    mainWindow.on("focus", () =>
      console.log("Main Window", "Window was focused")
    );
    mainWindow.on("blur", () =>
      console.log("Main Window", "Window lost focus")
    );

    mainWindow.webContents.on("render-process-gone", (event, details) => {
      console.log("Main Window", "Renderer process has gone:", details, event);
    });
  } else {
    console.warn("Main Window", "Window already exists, focusing.");
    mainWindow.focus();
  }
};

export default createMainWindow;
