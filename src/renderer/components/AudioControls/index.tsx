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

  onClickBackwards?: () => void;
  onClickPlay?: () => void;
  onClickPause?: () => void;
  onClickStop?: () => void;
  onClickForwards?: () => void;

  togglePlayPause?: boolean;

  actionIconProps?: ActionIconProps;
  iconProps?: IconProps;
};

export default function AudioControls({
  isPlaying,
  hasMedia = true,
  crossfadeActive,
  onClickBackwards,
  onClickPlay,
  onClickPause,
  onClickStop,
  onClickForwards,
  togglePlayPause = true,
  actionIconProps,
  iconProps,
}: AudioControlsProps) {
  return (
    <ActionIconGroup>
      {/* skip backwards */}
      {onClickBackwards && (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Re-rack sound byte"
          {...actionIconProps}
          onClick={onClickBackwards}
          disabled={!hasMedia || crossfadeActive}
        >
          <IconPlayerSkipBackFilled size={ICON_SIZE} {...iconProps} />
        </ActionIcon>
      )}
      {/* toggle play/pause */}
      {onClickPause && onClickPlay && togglePlayPause ? (
        isPlaying ? (
          <ActionIcon
            size={ACTION_ICON_SIZE}
            variant={ACTION_ICON_VARIANT}
            color={ACTION_ICON_COLOR}
            aria-label="Pause sound"
            {...actionIconProps}
            onClick={onClickPause}
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
            onClick={onClickPlay}
            disabled={!hasMedia || crossfadeActive}
          >
            <IconPlayerPlayFilled size={ICON_SIZE} {...iconProps} />
          </ActionIcon>
        )
      ) : null}
      {/* play */}
      {onClickPlay && (!togglePlayPause || !onClickPause) && (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Play sound"
          {...actionIconProps}
          onClick={onClickPlay}
          disabled={!hasMedia || crossfadeActive || isPlaying}
        >
          <IconPlayerPlayFilled size={ICON_SIZE} {...iconProps} />
        </ActionIcon>
      )}
      {/* pause */}
      {onClickPause && (!togglePlayPause || !onClickPlay) && (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Pause sound"
          {...actionIconProps}
          onClick={onClickPause}
          disabled={!hasMedia || crossfadeActive || !isPlaying}
        >
          <IconPlayerPauseFilled size={ICON_SIZE} {...iconProps} />
        </ActionIcon>
      )}
      {/* stop */}
      {onClickStop && (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Stop sound byte"
          {...actionIconProps}
          onClick={onClickStop}
          disabled={!hasMedia}
        >
          <IconPlayerStopFilled size={ICON_SIZE} {...iconProps} />
        </ActionIcon>
      )}
      {/* skip forwards */}
      {onClickForwards && (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Go to the end of the sound byte"
          {...actionIconProps}
          onClick={onClickForwards}
          disabled={!hasMedia || crossfadeActive}
        >
          <IconPlayerSkipForwardFilled size={ICON_SIZE} {...iconProps} />
        </ActionIcon>
      )}
    </ActionIconGroup>
  );
}
