import { app, Menu } from "electron";

// Custom menu for macOS
const menuTemplate: Array<
  Electron.MenuItemConstructorOptions | Electron.MenuItem
> = [
  // macOS app menu (first item is reserved for the app name)
  {
    label: app.name, // Automatically uses your app name
    submenu: [
      { label: "About", role: "about" },
      { type: "separator" },
      { label: "Quit", accelerator: "CmdOrCtrl+Q", click: () => app.quit() },
    ],
  },
  {
    label: "File",
    submenu: [
      {
        label: "Open",
        accelerator: "CmdOrCtrl+O",
        click: () => console.log("Open clicked"),
      },
      { label: "Close", role: "close" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { label: "Undo", role: "undo" },
      { label: "Redo", role: "redo" },
      { type: "separator" },
      { label: "Cut", role: "cut" },
      { label: "Copy", role: "copy" },
      { label: "Paste", role: "paste" },
      { label: "Select All", role: "selectAll" },
    ],
  },
  {
    label: "View",
    submenu: [
      { label: "Reload", role: "reload" },
      { label: "Toggle DevTools", role: "toggleDevTools" },
      { type: "separator" },
      { label: "Reset Zoom", role: "resetZoom" },
      { label: "Zoom In", role: "zoomIn" },
      { label: "Zoom Out", role: "zoomOut" },
    ],
  },
  {
    label: "Window",
    submenu: [
      { label: "Minimize", role: "minimize" },
      { label: "Close", role: "close" },
    ],
  },
];

// Build and apply the menu
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
