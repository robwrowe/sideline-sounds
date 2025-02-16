import { app, BrowserWindow } from "electron";

export let libraryWindow: BrowserWindow | null = null;

const createLibraryWindow = (): void => {
  // check if the window exists and if so, was it destroyed
  if (!libraryWindow || libraryWindow.isDestroyed()) {
    // cleanup listeners
    libraryWindow?.removeAllListeners();
    libraryWindow?.webContents.removeAllListeners();

    libraryWindow = null;
  }

  if (!libraryWindow) {
    // Create the browser window.
    libraryWindow = new BrowserWindow({
      height: 800,
      width: 940,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        autoplayPolicy: "no-user-gesture-required",
      },
      show: !app.isPackaged,
      title: `${app.name} - Content Library`,
    });

    // and load the index.html of the app.
    libraryWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    if (!app.isPackaged) {
      libraryWindow.webContents.openDevTools();
    }

    libraryWindow.on("ready-to-show", () => {
      if (app.isPackaged) {
        libraryWindow?.show();
      }
    });

    // When the window is ready, tell React to navigate to the home page
    libraryWindow.webContents.on("did-finish-load", () => {
      libraryWindow?.webContents.send("navigate", "/library");
    });

    // TEMP: logging for context menu issues
    libraryWindow.on("close", () =>
      console.log("Library Window", "Window is about to close")
    );
    libraryWindow.on("closed", () => {
      console.log("Library Window", "Window was closed");
      libraryWindow = null;
    });
    libraryWindow.on("unresponsive", () =>
      console.log("Library Window", "Window was become unresponsive.")
    );
    libraryWindow.on("resized", () =>
      console.log("Library Window", "Window was resized")
    );
    libraryWindow.on("focus", () =>
      console.log("Library Window", "Window was focused")
    );
    libraryWindow.on("blur", () =>
      console.log("Library Window", "Window lost focus")
    );

    libraryWindow.webContents.on("render-process-gone", (event, details) => {
      console.log(
        "Library Window",
        "Renderer process has gone:",
        details,
        event
      );
    });
  } else {
    console.warn("Library Window", "Window already exists, focusing.");
    libraryWindow.focus();
  }
};

export default createLibraryWindow;
