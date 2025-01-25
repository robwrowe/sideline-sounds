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
    };
  }

  interface HTMLAudioElement {
    setSinkId(deviceId: string): Promise<void>;
  }
}

export {}; // Ensure this file is treated as a module by TypeScript
