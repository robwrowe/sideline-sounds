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

  crossfadeDuration: AudioEngine["crossfadeDuration"];
  crossfadeActive: AudioEngine["crossfadeActive"];

  currentMetadata: AudioEngine["currentMetadata"];
  currentStartTime: AudioEngine["currentStartTime"];
  currentDuration: AudioEngine["currentDuration"];
  currentElapsed: AudioEngine["currentElapsed"];
  currentRemaining: AudioEngine["currentRemaining"];

  nextMetadata: AudioEngine["nextMetadata"];
  nextStartTime: AudioEngine["nextStartTime"];
  nextDuration: AudioEngine["nextDuration"];
  nextElapsed: AudioEngine["nextElapsed"];
  nextRemaining: AudioEngine["nextRemaining"];
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

  const [nextMetadata, setNextMetadata] = useState<AudioEngine["nextMetadata"]>(
    audioEngine.nextMetadata
  );
  const [nextStartTime, setNextStartTime] = useState<
    AudioEngine["nextStartTime"]
  >(audioEngine.nextStartTime);
  const [nextDuration, setNextDuration] = useState<AudioEngine["nextDuration"]>(
    audioEngine.nextDuration
  );
  const [nextElapsed, setNextElapsed] = useState<AudioEngine["nextElapsed"]>(
    audioEngine.nextElapsed
  );
  const [nextRemaining, setNextRemaining] = useState<
    AudioEngine["nextRemaining"]
  >(audioEngine.nextRemaining);

  const [isPlaying, setIsPlaying] = useState<boolean>(audioEngine.isPlaying);
  const [hasMedia, setHasMedia] = useState<boolean>(audioEngine.hasMedia);
  const [volume, setVolume] = useState<number>(audioEngine.volume);
  const [crossfadeDuration, setCrossfadeDuration] = useState<number>(
    audioEngine.crossfadeDuration
  );
  const [crossfadeActive, setCrossfadeActive] = useState<boolean>(
    audioEngine.crossfadeActive
  );

  useEffect(() => {
    // subscribe to metadata changes (or manually when data updates in AudioEngine)
    const updateMetadata = () => {
      setCurrentMetadata(audioEngine.currentMetadata);
      setCurrentStartTime(audioEngine.currentStartTime);
      setCurrentDuration(audioEngine.currentDuration);

      setNextMetadata(audioEngine.nextMetadata);
      setNextStartTime(audioEngine.nextStartTime);
      setNextDuration(audioEngine.nextDuration);
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

      setNextElapsed(audioEngine.nextElapsed);
      setNextRemaining(audioEngine.nextRemaining);

      setIsPlaying(audioEngine.isPlaying);
      setHasMedia(audioEngine.hasMedia);
      setCrossfadeDuration(audioEngine.crossfadeDuration);
      setCrossfadeActive(audioEngine.crossfadeActive);
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
        isPlaying,
        hasMedia,
        volume,

        crossfadeDuration,
        crossfadeActive,

        currentMetadata,
        currentStartTime,
        currentDuration,
        currentElapsed,
        currentRemaining,

        nextMetadata,
        nextStartTime,
        nextDuration,
        nextElapsed,
        nextRemaining,
      }}
    >
      {children}
    </AudioEngineContext.Provider>
  );
}
