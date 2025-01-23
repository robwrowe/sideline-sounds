import { useContext } from "react";
import { AudioEngineContext } from "../context";

export default function useAudioEngineContext() {
  const ctx = useContext(AudioEngineContext);

  if (!ctx)
    throw new Error(
      "useAudioReactContext must be used within an AudioReactContextProvider"
    );

  return ctx;
}
