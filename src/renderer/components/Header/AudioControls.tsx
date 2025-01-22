import React, { useState } from "react";
import { ActionIcon, ActionIconGroup, ActionIconProps } from "@mantine/core";
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerStopFilled,
  IconPlayerSkipBackFilled,
} from "@tabler/icons-react";

const ACTION_ICON_SIZE: ActionIconProps["size"] = "xl";
const ACTION_ICON_VARIANT: ActionIconProps["variant"] = "subtle";
const ACTION_ICON_COLOR: ActionIconProps["color"] = "gray";
const ICON_SIZE = 24;

export default function AudioControls() {
  const [isPaused, setIsPaused] = useState(false);

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
          onClick={() => setIsPaused(false)}
        >
          <IconPlayerPlayFilled size={ICON_SIZE} />
        </ActionIcon>
      ) : (
        <ActionIcon
          size={ACTION_ICON_SIZE}
          variant={ACTION_ICON_VARIANT}
          color={ACTION_ICON_COLOR}
          aria-label="Pause sound"
          onClick={() => setIsPaused(true)}
        >
          <IconPlayerPauseFilled size={ICON_SIZE} />
        </ActionIcon>
      )}
      <ActionIcon
        size={ACTION_ICON_SIZE}
        variant={ACTION_ICON_VARIANT}
        color={ACTION_ICON_COLOR}
        aria-label="Stop sound byte"
      >
        <IconPlayerStopFilled size={ICON_SIZE} />
      </ActionIcon>
    </ActionIconGroup>
  );
}
