import React, { useState, useCallback } from "react";
import { ActionIcon, ActionIconGroup, ActionIconProps } from "@mantine/core";
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerStopFilled,
  IconPlayerSkipBackFilled,
} from "@tabler/icons-react";

import { useAudioEngineContext } from "../../hooks";

const ACTION_ICON_SIZE: ActionIconProps["size"] = "xl";
const ACTION_ICON_VARIANT: ActionIconProps["variant"] = "subtle";
const ACTION_ICON_COLOR: ActionIconProps["color"] = "gray";
const ICON_SIZE = 24;

export default function AudioControls() {
  const [isPaused, setIsPaused] = useState(true);
  const audioEngine = useAudioEngineContext();

  // start playing the song in the context
  const handleClickPlay = useCallback(async () => {
    try {
      const fileBuffer: ArrayBuffer = await window.electron.ipcRenderer.invoke(
        "get-audio-file",
        "/Users/robwrowe/Documents/test-audio/Event Theme Disc 01/03 Open w Vamp.wav"
      );

      const blob = new Blob([fileBuffer]);
      const file = new File([blob], "03 Open w Vamp.wav", {
        type: "audio/wav",
      });

      const audioBuffer = await audioEngine.loadAudio(file);
      audioEngine.play(audioBuffer);
      setIsPaused(false);
    } catch (err) {
      console.error("Error playing file", err);
    }
  }, [audioEngine]);

  const handleClickPause = useCallback(async () => {
    try {
      audioEngine.stop();
      setIsPaused(true);
    } catch (err) {
      console.error("Error pausing file", err);
    }
  }, [audioEngine]);

  return (
    <ActionIconGroup>
      <ActionIcon
        size={ACTION_ICON_SIZE}
        variant={ACTION_ICON_VARIANT}
        color={ACTION_ICON_COLOR}
        aria-label="Re-rack sound byte"
      >
        <IconPlayerSkipBackFilled size={ICON_SIZE} />
      </ActionIcon>
      {isPaused ? (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Play sound"
          onClick={handleClickPlay}
        >
          <IconPlayerPlayFilled size={ICON_SIZE} />
        </ActionIcon>
      ) : (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Pause sound"
          onClick={handleClickPause}
        >
          <IconPlayerPauseFilled size={ICON_SIZE} />
        </ActionIcon>
      )}
      <ActionIcon
        size={ACTION_ICON_SIZE}
        variant={ACTION_ICON_VARIANT}
        color={ACTION_ICON_COLOR}
        aria-label="Stop sound byte"
        onClick={handleClickPause}
      >
        <IconPlayerStopFilled size={ICON_SIZE} />
      </ActionIcon>
    </ActionIconGroup>
  );
}
