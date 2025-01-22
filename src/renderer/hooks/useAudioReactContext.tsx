import { useContext } from "react";
import { AudioReactContext } from "../context";

export default function useAudioReactContext() {
  const ctx = useContext(AudioReactContext);

  if (!ctx)
    throw new Error(
      "useAudioReactContext must be used within an AudioReactContextProvider"
    );

  return ctx;
}
