import { AudioFileMetadata, DialogOpenOpts } from "../types";

declare module "*.scss";

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: <T>(channel: string, ...args: unknown[]) => Promise<T>;
      };

      onNavigate: (callback: (route: string) => void) => void;

      toggleTheme: (callback: () => void) => void;

      dialog: {
        showOpenDialog: (
          opts: DialogOpenOpts
        ) => Promise<Electron.OpenDialogReturnValue>;
      };

      audio: {
        fileBuffer: (filePath: string) => Promise<ArrayBuffer>;
        metadata: (filePath: string) => Promise<AudioFileMetadata>;
      };
    };
  }

  interface HTMLAudioElement {
    setSinkId(deviceId: string): Promise<void>;
  }
}

export {}; // Ensure this file is treated as a module by TypeScript
