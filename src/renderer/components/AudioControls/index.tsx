import React from "react";
import { ActionIcon, ActionIconGroup, ActionIconProps } from "@mantine/core";
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerStopFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconProps,
} from "@tabler/icons-react";

const ACTION_ICON_SIZE: ActionIconProps["size"] = "xl";
const ACTION_ICON_VARIANT: ActionIconProps["variant"] = "subtle";
const ACTION_ICON_COLOR: ActionIconProps["color"] = "gray";
const ICON_SIZE = 24;

export type AudioControlsProps = {
  isPlaying?: boolean;
  hasMedia?: boolean;
  crossfadeActive?: boolean;

  handleClickBackwards?: () => void;
  handleClickPlay?: () => void;
  handleClickPause?: () => void;
  handleClickStop?: () => void;
  handleClickForwards?: () => void;

  togglePlayPause?: boolean;

  actionIconProps?: ActionIconProps;
  iconProps?: IconProps;
};

export default function AudioControls({
  isPlaying,
  hasMedia = true,
  crossfadeActive,
  handleClickBackwards,
  handleClickPlay,
  handleClickPause,
  handleClickStop,
  handleClickForwards,
  togglePlayPause = true,
  actionIconProps,
  iconProps,
}: AudioControlsProps) {
  return (
    <ActionIconGroup>
      {/* skip backwards */}
      {handleClickBackwards && (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Re-rack sound byte"
          {...actionIconProps}
          onClick={handleClickBackwards}
          disabled={!hasMedia || crossfadeActive}
        >
          <IconPlayerSkipBackFilled size={ICON_SIZE} {...iconProps} />
        </ActionIcon>
      )}
      {/* toggle play/pause */}
      {handleClickPause && handleClickPlay && togglePlayPause ? (
        isPlaying ? (
          <ActionIcon
            size={ACTION_ICON_SIZE}
            variant={ACTION_ICON_VARIANT}
            color={ACTION_ICON_COLOR}
            aria-label="Pause sound"
            {...actionIconProps}
            onClick={handleClickPause}
            disabled={!hasMedia || crossfadeActive}
          >
            <IconPlayerPauseFilled size={ICON_SIZE} {...iconProps} />
          </ActionIcon>
        ) : (
          <ActionIcon
            size={ACTION_ICON_SIZE}
            variant={ACTION_ICON_VARIANT}
            color={ACTION_ICON_COLOR}
            aria-label="Play sound"
            {...actionIconProps}
            onClick={handleClickPlay}
            disabled={!hasMedia || crossfadeActive}
          >
            <IconPlayerPlayFilled size={ICON_SIZE} {...iconProps} />
          </ActionIcon>
        )
      ) : null}
      {/* play */}
      {handleClickPlay && (!togglePlayPause || !handleClickPause) && (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Play sound"
          {...actionIconProps}
          onClick={handleClickPlay}
          disabled={!hasMedia || crossfadeActive || isPlaying}
        >
          <IconPlayerPlayFilled size={ICON_SIZE} {...iconProps} />
        </ActionIcon>
      )}
      {/* pause */}
      {handleClickPause && (!togglePlayPause || !handleClickPlay) && (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Pause sound"
          {...actionIconProps}
          onClick={handleClickPause}
          disabled={!hasMedia || crossfadeActive || !isPlaying}
        >
          <IconPlayerPauseFilled size={ICON_SIZE} {...iconProps} />
        </ActionIcon>
      )}
      {/* stop */}
      {handleClickStop && (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Stop sound byte"
          {...actionIconProps}
          onClick={handleClickStop}
          disabled={!hasMedia}
        >
          <IconPlayerStopFilled size={ICON_SIZE} {...iconProps} />
        </ActionIcon>
      )}
      {/* skip forwards */}
      {handleClickForwards && (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Go to the end of the sound byte"
          {...actionIconProps}
          onClick={handleClickForwards}
          disabled={!hasMedia || crossfadeActive}
        >
          <IconPlayerSkipForwardFilled size={ICON_SIZE} {...iconProps} />
        </ActionIcon>
      )}
    </ActionIconGroup>
  );
}
