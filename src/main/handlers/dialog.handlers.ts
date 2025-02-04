import { ipcMain, dialog } from "electron";
import { DialogOpenOpts } from "../../types";

// present the file dialog
ipcMain.handle(
  "dialog:showOpenDialog",
  async (_, opts: DialogOpenOpts = {}) => {
    const response = await dialog.showOpenDialog({ ...opts });
    
    return response;
  }
);
