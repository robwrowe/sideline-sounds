import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import AudioEngine from "../classes/AudioEngine";
import { Output, PlaybackChannelStatus } from "../../types";
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
   * When the state changes, update other renderer processes
   */

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
    async (filePath: string) => {
      const audioBuffer = await getAudioBuffer(filePath);

      audioEngine.play(audioBuffer);
    },
    [audioEngine, getAudioBuffer]
  );

  // listen for play events from other processes
  useEffect(() => {
    window.audio.onAudioEngine((channel, ...args) => {
      switch (channel) {
        case "play":
          play(args[0] as string);
          break;

        default:
          console.warn("Received unhandled audio engine event.");
      }
    });
  }, [play]);

  return (
    <AudioEngineContext.Provider
      value={{ audioEngine, setVolume, setDevice, testOutput }}
    >
      {children}
    </AudioEngineContext.Provider>
  );
}
