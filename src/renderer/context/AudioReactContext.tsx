import React, { createContext, ReactNode, useContext } from "react";

export const AudioReactContext = createContext<null | AudioContext>(null);

export default function AudioReactContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const ctx = new AudioContext();

  return (
    <AudioReactContext.Provider value={ctx}>
      {children}
    </AudioReactContext.Provider>
  );
}

export function useAudioReactContext() {
  const ctx = useContext(AudioReactContext);

  return ctx;
}
