import { useContext } from "react";
import { AudioEngineContext } from "../context/AudioEngineV2";

export default function useAudioEngineContext() {
  const audioEngine = useContext(AudioEngineContext);

  if (!audioEngine)
    throw new Error(
      "useAudioReactContext must be used within an AudioReactContextProvider"
    );

  return audioEngine;
}
