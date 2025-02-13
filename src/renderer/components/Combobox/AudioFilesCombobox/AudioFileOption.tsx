import React from "react";
import { Stack, Text } from "@mantine/core";
import { AudioFile } from "../../../../types";
import { formatArtist } from "../../../../utils";

type AudioFileItem = Pick<AudioFile, "title"> &
  Partial<Pick<AudioFile, "artist" | "album" | "duration">>;

export default function AudioFileOption({
  title,
  artist,
  album,
  duration,
}: AudioFileItem) {
  const bottomRow = formatArtist({ artist, album, duration });

  return (
    <Stack gap="0" mih={44}>
      <Text fz="sm">{title}</Text>
      {bottomRow && (
        <Text fz="xs" opacity={0.6}>
          {bottomRow}
        </Text>
      )}
    </Stack>
  );
}
