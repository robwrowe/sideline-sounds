import { app, Menu } from "electron";
import { mainWindow, createLibraryWindow, libraryWindow } from "../windows";

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
        label: "Toggle Theme",
        click: () => {
          mainWindow?.webContents.send("theme:toggle");
          libraryWindow?.webContents.send("theme:toggle");
        },
      },
      { label: "Close", role: "close" },
    ],
  },
  {
    label: "Library",
    submenu: [
      {
        label: "Open Library",
        click: () => createLibraryWindow(),
      },
      {
        label: "Open Library Dev Tools",
        click: () => libraryWindow?.webContents.openDevTools(),
      },
      {
        label: "Reload Library Window",
        click: () => libraryWindow?.reload(),
      },
    ],
  },
  {
    label: "Testing",
    submenu: [
      {
        label: "Navigate to Test Show",
        click: () =>
          mainWindow?.webContents.send(
            "navigate",
            "/main/show/419717fb-f85f-49fd-9bbf-ea69d43d3d55"
          ),
      },
    ],
  },
  //
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
