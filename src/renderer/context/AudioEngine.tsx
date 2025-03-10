import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import AudioEngine from "../classes/AudioEngine";
import {
  AudioEnginePlayMetadata,
  Output,
  PlaybackChannelStatus,
} from "../../types";
import { getAudioMimeType, getFileName } from "../../utils";

type AudioEngineContextType = {
  audioEngine: AudioEngine;
  setVolume: (output: Output, volume: number) => void;
  setDevice: (output: Output, newDeviceId: string | null) => Promise<void>;
  testOutput: (
    output: Output,
    filePath: string,
    delay?: number
  ) => Promise<void>;

  setOscillatorWaveform: (output: Output, waveform: OscillatorType) => void;
  setOscillatorFrequency: (output: Output, frequency: number) => void;
  setOscillatorDetune: (output: Output, detune: number) => void;
  startOscillator: (output: Output) => void;
  stopOscillator: (output: Output) => void;
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

  /**
   * When this is initialized, set the redux state
   */
  const fetchAndSetPgmA = useCallback(() => {
    const statePgmA = audioEngine.getStatus(Output.PGM_A);

    if (statePgmA) {
      window.audio.sendAction({
        type: "audioEngine/setOutput",
        payload: { output: Output.PGM_A, value: statePgmA },
      });
    }
  }, [audioEngine]);

  const fetchAndSetPgmB = useCallback(() => {
    const statePgmB = audioEngine.getStatus(Output.PGM_B);

    if (statePgmB) {
      window.audio.sendAction({
        type: "audioEngine/setOutput",
        payload: { output: Output.PGM_B, value: statePgmB },
      });
    }
  }, [audioEngine]);

  const fetchAndSetPfl = useCallback(() => {
    const statePfl = audioEngine.getStatus(Output.PFL);

    if (statePfl) {
      window.audio.sendAction({
        type: "audioEngine/setOutput",
        payload: { output: Output.PFL, value: statePfl },
      });
    }
  }, [audioEngine]);

  const fetchAndSetState = useCallback(() => {
    fetchAndSetPgmA();
    fetchAndSetPgmB();
    fetchAndSetPfl();
  }, [fetchAndSetPfl, fetchAndSetPgmA, fetchAndSetPgmB]);

  useEffect(() => {
    fetchAndSetState();
  }, [fetchAndSetState]);

  /**
   * When the state changes, update it in redux
   */
  const handleChangeUpdate = useCallback(
    (output: Output, value: PlaybackChannelStatus) => {
      window.audio.sendAction({
        type: "audioEngine/setOutput",
        payload: { output, value },
      });
    },
    []
  );

  useEffect(() => {
    audioEngine.setOnChangeUpdate(Output.PGM_A, (payload) =>
      handleChangeUpdate(Output.PGM_A, payload)
    );
    audioEngine.setOnChangeUpdate(Output.PGM_B, (payload) =>
      handleChangeUpdate(Output.PGM_B, payload)
    );
    audioEngine.setOnChangeUpdate(Output.PFL, (payload) =>
      handleChangeUpdate(Output.PFL, payload)
    );

    return () => {
      audioEngine.setOnChangeUpdate(Output.PGM_A, null);
      audioEngine.setOnChangeUpdate(Output.PGM_B, null);
      audioEngine.setOnChangeUpdate(Output.PFL, null);
    };
  }, [audioEngine, handleChangeUpdate]);

  /**
   * Takes a file path and readies it for playback
   */
  const getAudioBuffer = useCallback(
    async (filePath: string) => {
      // extract the file name from the path
      const fileName = getFileName(filePath) || "No Name Found";

      const fileBuffer = await window.audio.fileBuffer(filePath);

      const blob = new Blob([fileBuffer]);

      const file = new File([blob], fileName, {
        type: getAudioMimeType(filePath),
      });

      const audioBuffer = await audioEngine.loadAudio(file);

      return audioBuffer;
    },
    [audioEngine]
  );

  /**
   * Allows the user to set the volume for the destination
   */
  const setVolume = useCallback(
    (output: Output, volume: number) => {
      audioEngine.setVolume(output, volume);
    },
    [audioEngine]
  );

  /**
   * Allows the user to change the destination output
   */
  const setDevice = useCallback(
    async (output: Output, newDeviceId: string | null) => {
      await audioEngine.setDevice(output, newDeviceId);
    },
    [audioEngine]
  );

  /**
   * Allows the user to change the oscillator waveform type
   */
  const setOscillatorWaveform = useCallback(
    (output: Output, waveform: OscillatorType) => {
      audioEngine.setOscillatorWaveform(output, waveform);
    },
    [audioEngine]
  );

  /**
   * Allows the user to change the oscillator frequency
   */
  const setOscillatorFrequency = useCallback(
    (output: Output, frequency: number) => {
      audioEngine.setOscillatorFrequency(output, frequency);
    },
    [audioEngine]
  );

  /**
   * Allows the user to change the oscillator detune
   */
  const setOscillatorDetune = useCallback(
    (output: Output, detune: number) => {
      audioEngine.setOscillatorDetune(output, detune);
    },
    [audioEngine]
  );

  /**
   * Start the oscillator
   */
  const startOscillator = useCallback(
    (output: Output) => {
      audioEngine.startOscillator(output);
    },
    [audioEngine]
  );

  /**
   * Stop the oscillator
   */
  const stopOscillator = useCallback(
    (output: Output) => {
      audioEngine.stopOscillator(output);
    },
    [audioEngine]
  );

  /**
   * Stops all sound and plays the test file without crossfade
   */
  const testOutput = useCallback(
    async (output: Output, filePath: string, delay?: number) => {
      const audioBuffer = await getAudioBuffer(filePath);

      audioEngine.testOutput(output, audioBuffer, delay);
    },
    [audioEngine, getAudioBuffer]
  );

  // TODO: add support for button metadata
  const play = useCallback(
    async (filePath: string, metadata?: AudioEnginePlayMetadata) => {
      const audioBuffer = await getAudioBuffer(filePath);

      audioEngine.play(audioBuffer, metadata);
    },
    [audioEngine, getAudioBuffer]
  );

  // listen for play events from other processes
  useEffect(() => {
    window.audio.onAudioEngine((channel, ...args) => {
      switch (channel) {
        case "play":
          play(
            args[0] as string,
            (args[1] as AudioEnginePlayMetadata) ?? undefined
          );
          break;

        case "stop":
          audioEngine.stop();
          break;

        case "pause":
          audioEngine.pause();
          break;

        case "resume":
          audioEngine.resume();
          break;

        case "reRack":
          audioEngine.reRack((args[0] as number) ?? undefined);
          break;

        default:
          console.warn("Received unhandled audio engine event.");
      }
    });
  }, [audioEngine, play]);

  return (
    <AudioEngineContext.Provider
      value={{
        audioEngine,
        setVolume,
        setDevice,
        testOutput,
        setOscillatorWaveform,
        setOscillatorFrequency,
        setOscillatorDetune,
        startOscillator,
        stopOscillator,
      }}
    >
      {children}
    </AudioEngineContext.Provider>
  );
}
