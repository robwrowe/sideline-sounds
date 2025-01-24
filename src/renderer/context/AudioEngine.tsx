import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AudioEngine } from "../classes";

type AudioEngineContextType = {
  audioEngine: AudioEngine;
  hasMedia: boolean;
  isPlaying: boolean;
  volume: number;
  currentMetadata: AudioEngine["currentMetadata"];
  currentStartTime: AudioEngine["currentStartTime"];
  currentDuration: AudioEngine["currentDuration"];
  currentElapsed: AudioEngine["currentElapsed"];
  currentRemaining: AudioEngine["currentRemaining"];
};

export const AudioEngineContext = createContext<null | AudioEngineContextType>(
  null
);

export default function AudioEngineProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioEngine = useMemo(() => new AudioEngine(), []);

  const [currentMetadata, setCurrentMetadata] = useState<
    AudioEngine["currentMetadata"]
  >(audioEngine.currentMetadata);
  const [currentStartTime, setCurrentStartTime] = useState<
    AudioEngine["currentStartTime"]
  >(audioEngine.currentStartTime);
  const [currentDuration, setCurrentDuration] = useState<
    AudioEngine["currentDuration"]
  >(audioEngine.currentDuration);
  const [currentElapsed, setCurrentElapsed] = useState<
    AudioEngine["currentElapsed"]
  >(audioEngine.currentElapsed);
  const [currentRemaining, setCurrentRemaining] = useState<
    AudioEngine["currentRemaining"]
  >(audioEngine.currentRemaining);
  const [isPlaying, setIsPlaying] = useState<boolean>(audioEngine.isPlaying);
  const [hasMedia, setHasMedia] = useState<boolean>(audioEngine.hasMedia);
  const [volume, setVolume] = useState<number>(audioEngine.volume);

  useEffect(() => {
    // subscribe to metadata changes (or manually when data updates in AudioEngine)
    const updateMetadata = () => {
      setCurrentMetadata(audioEngine.currentMetadata);
      setCurrentStartTime(audioEngine.currentStartTime);
      setCurrentDuration(audioEngine.currentDuration);
    };

    // optionally, listen to certain events or updates
    audioEngine.onMetadataChange = updateMetadata;

    return () => {
      // cleanup listeners
      audioEngine.onMetadataChange = null;
    };
  }, [audioEngine]);

  useEffect(() => {
    // subscribe to updates in RAF
    const updateRAF = () => {
      setCurrentElapsed(audioEngine.currentElapsed);
      setCurrentRemaining(audioEngine.currentRemaining);
      setIsPlaying(audioEngine.isPlaying);
      setHasMedia(audioEngine.hasMedia);
    };

    audioEngine.onRAFUpdate = updateRAF;

    return () => {
      audioEngine.onRAFUpdate = null;
    };
  }, [audioEngine]);

  useEffect(() => {
    const updateVolume = () => {
      setVolume(audioEngine.volume);
    };

    audioEngine.onVolumeUpdate = updateVolume;

    return () => {
      audioEngine.onVolumeUpdate = null;
    };
  }, [audioEngine]);

  return (
    <AudioEngineContext.Provider
      value={{
        audioEngine,
        currentMetadata,
        currentStartTime,
        currentDuration,
        currentElapsed,
        currentRemaining,
        isPlaying,
        hasMedia,
        volume,
      }}
    >
      {children}
    </AudioEngineContext.Provider>
  );
}
