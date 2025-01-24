import React, { useCallback } from "react";
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
  const { audioEngine, isPlaying, hasMedia } = useAudioEngineContext();

  const handleClickReRack = useCallback(() => {
    try {
      audioEngine.reRack();
    } catch (err) {
      console.error("Error restarting file", err);
    }
  }, [audioEngine]);

  // start playing the song in the context
  const handleClickPlay = useCallback(async () => {
    try {
      audioEngine.resume();
    } catch (err) {
      console.error("Error resuming file", err);
    }
  }, [audioEngine]);

  const handleClickPause = useCallback(async () => {
    try {
      audioEngine.pause();
    } catch (err) {
      console.error("Error pausing file", err);
    }
  }, [audioEngine]);

  const handleClickStop = useCallback(async () => {
    try {
      audioEngine.stop();
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
        onClick={handleClickReRack}
        disabled={!hasMedia}
      >
        <IconPlayerSkipBackFilled size={ICON_SIZE} />
      </ActionIcon>
      {isPlaying ? (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Pause sound"
          onClick={handleClickPause}
          disabled={!hasMedia}
        >
          <IconPlayerPauseFilled size={ICON_SIZE} />
        </ActionIcon>
      ) : (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Play sound"
          onClick={handleClickPlay}
          disabled={!hasMedia}
        >
          <IconPlayerPlayFilled size={ICON_SIZE} />
        </ActionIcon>
      )}
      <ActionIcon
        size={ACTION_ICON_SIZE}
        variant={ACTION_ICON_VARIANT}
        color={ACTION_ICON_COLOR}
        aria-label="Stop sound byte"
        onClick={handleClickStop}
        disabled={!hasMedia}
      >
        <IconPlayerStopFilled size={ICON_SIZE} />
      </ActionIcon>
    </ActionIconGroup>
  );
}
