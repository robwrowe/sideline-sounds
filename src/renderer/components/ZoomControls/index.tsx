import React from "react";
import { ActionIcon } from "@mantine/core";
import { IconZoomCancel, IconZoomIn, IconZoomOut } from "@tabler/icons-react";

export type ZoomControlsProps = {
  zoom: number;
  handleClickZoom: (delta: number, absolute?: boolean) => void;
};

export default function ZoomControls({
  zoom,
  handleClickZoom,
}: ZoomControlsProps) {
  return (
    <ActionIcon.Group>
      <ActionIcon
        size="lg"
        variant="default"
        onClick={() => handleClickZoom(-10)}
        disabled={zoom === 0}
      >
        <IconZoomOut />
      </ActionIcon>
      <ActionIcon
        size="lg"
        variant="default"
        onClick={() => handleClickZoom(0, true)}
        disabled={zoom === 0}
      >
        <IconZoomCancel />
      </ActionIcon>
      <ActionIcon
        size="lg"
        variant="default"
        onClick={() => handleClickZoom(10)}
      >
        <IconZoomIn />
      </ActionIcon>
    </ActionIcon.Group>
  );
}
