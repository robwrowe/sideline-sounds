import React from "react";
import { Stack, Text } from "@mantine/core";
import { AudioFile, Subclip } from "../../../../types";
import { formatSecondsToTime } from "../../../../utils";

type AudioFileItem = Pick<Subclip, "name"> &
  Partial<Pick<AudioFile, "duration">> &
  Partial<Pick<Subclip, "inPoint" | "outPoint">>;

export default function SubclipOption({
  name,
  duration,
  inPoint,
  outPoint,
}: AudioFileItem) {
  const start = inPoint || 0;
  const end = outPoint || duration;

  return (
    <Stack gap="0.25rem" mih={44}>
      <Text fz="sm">{name}</Text>
      {end !== undefined && end !== null && (
        <Text fz="xs" opacity={0.6}>
          {formatSecondsToTime(start)} - {formatSecondsToTime(end)} [
          {formatSecondsToTime(end - start)}]
        </Text>
      )}
    </Stack>
  );
}
