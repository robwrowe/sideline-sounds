import { Action } from "@reduxjs/toolkit";
import { AudioFileMetadata, DialogOpenOpts } from "../types";
import { modals } from "./modals";
import { RootState } from "../main/store";
import { AudioEngineActions } from "./features";

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
    };

    log: {
      log: (...args: unknown[]) => void;
      info: (...args: unknown[]) => void;
      warn: (...args: unknown[]) => void;
      error: (...args: unknown[]) => void;
      debug: (...args: unknown[]) => void;
      trace: (...args: unknown[]) => void;
    };

    broadcast: {
      sendEvent: (channel: string, ...args: unknown[]) => void;
      onEvent: (
        callback: (channel: string, ...args: unknown[]) => void
      ) => void;
    };

    audio: {
      fileBuffer: (filePath: string) => Promise<ArrayBuffer>;
      metadata: (filePath: string) => Promise<AudioFileMetadata>;

      sendAudioEngine: (channel: string, ...args: unknown[]) => void;
      onAudioEngine: (
        callback: (channel: string, ...args: unknown[]) => void
      ) => void;

      sendAction: (action: AudioEngineActions) => void;
      onStateUpdate: (callback: (state: RootState) => void) => void;
      removeStateListener: () => void;
    };
  }

  interface HTMLAudioElement {
    setSinkId(deviceId: string): Promise<void>;
  }
}

declare module "@mantine/modals" {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}

export {}; // Ensure this file is treated as a module by TypeScript
