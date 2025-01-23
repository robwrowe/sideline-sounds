import React, { createContext, ReactNode } from "react";
import { AudioEngine } from "../classes";

export const AudioEngineContext = createContext<null | AudioEngine>(null);

export default function AudioEngineProvider({
  children,
}: {
  children: ReactNode;
}) {
  const ctx = new AudioEngine();

  return (
    <AudioEngineContext.Provider value={ctx}>
      {children}
    </AudioEngineContext.Provider>
  );
}
