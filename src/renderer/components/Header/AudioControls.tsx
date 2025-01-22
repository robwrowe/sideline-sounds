import React, { useState } from "react";
import { ActionIcon, ActionIconGroup } from "@mantine/core";
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerStopFilled,
  IconPlayerSkipBackFilled,
} from "@tabler/icons-react";

export default function Header() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <ActionIconGroup>
      <ActionIcon variant="subtle" color="gray" aria-label="Re-rack sound byte">
        <IconPlayerSkipBackFilled size={20} />
      </ActionIcon>
      {isPaused ? (
        <ActionIcon
          variant="subtle"
          color="gray"
          aria-label="Play sound"
          onClick={() => setIsPaused(false)}
        >
          <IconPlayerPlayFilled size={20} />
        </ActionIcon>
      ) : (
        <ActionIcon
          variant="subtle"
          color="gray"
          aria-label="Pause sound"
          onClick={() => setIsPaused(true)}
        >
          <IconPlayerPauseFilled size={20} />
        </ActionIcon>
      )}
      <ActionIcon variant="subtle" color="gray" aria-label="Stop sound byte">
        <IconPlayerStopFilled size={20} />
      </ActionIcon>
    </ActionIconGroup>
  );
}
