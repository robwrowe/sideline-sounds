import { ipcMain } from "electron";

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
import fs from "fs/promises";
import path from "path";

ipcMain.handle("get-audio-file", async (_, relativePath) => {
  // const filePath = path.resolve(__dirname, relativePath);
  const filePath = path.resolve(relativePath);

  return fs.readFile(filePath);
});
