import { app, BrowserWindow } from "electron";

export let outputWindow: BrowserWindow | null = null;

export const setOutputWindow = (val: BrowserWindow | null) =>
  (outputWindow = val);

const createOutputWindow = (show = false): void => {
  // check if the window exists and if so, was it destroyed
  if (!outputWindow || outputWindow.isDestroyed()) {
    // cleanup listeners
    outputWindow?.removeAllListeners();
    outputWindow?.webContents.removeAllListeners();

    outputWindow = null;
  }

  if (!outputWindow) {
    // Create the browser window.
    outputWindow = new BrowserWindow({
      height: 800,
      width: 940,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        autoplayPolicy: "no-user-gesture-required",
      },
      show: !app.isPackaged,
    });

    // and load the index.html of the app.
    outputWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    outputWindow.on("ready-to-show", () => {
      outputWindow?.setTitle(`${app.name} - Output Manager`);

      if (show) {
        outputWindow?.show();
      }
    });

    // When the window is ready, tell React to navigate to the home page
    outputWindow.webContents.on("did-finish-load", () => {
      outputWindow?.webContents.send("navigate", "/output/dest");
    });

    // TEMP: logging for context menu issues
    outputWindow.on("close", (evt) => {
      console.log("Output Window", "Window is about to close");

      evt.preventDefault();
      outputWindow?.hide();
    });
    outputWindow.on("closed", () => {
      console.log("Output Window", "Window was closed");
      outputWindow = null;
    });
    outputWindow.on("unresponsive", () =>
      console.log("Output Window", "Window was become unresponsive.")
    );
    outputWindow.on("resized", () =>
      console.log("Output Window", "Window was resized")
    );
    outputWindow.on("focus", () =>
      console.log("Output Window", "Window was focused")
    );
    outputWindow.on("blur", () =>
      console.log("Output Window", "Window lost focus")
    );

    outputWindow.on("show", () =>
      console.log("Output Window", "Window was shown.")
    );

    outputWindow.on("hide", () =>
      console.log("Output Window", "Window was hidden.")
    );

    outputWindow.webContents.on("render-process-gone", (event, details) => {
      console.log(
        "Output Window",
        "Renderer process has gone:",
        details,
        event
      );
    });
  } else {
    console.warn("Output Window", "Window already exists, focusing.");
    outputWindow.show();
    outputWindow.focus();
  }
};

export default createOutputWindow;
