import React from "react";
import { useColorScheme } from "@mantine/hooks";
import { ActionIcon, CloseButton, Grid, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import { ColorCombobox } from "../Combobox";
import { AudioFile } from "../../../types";

function RightSection({ onClick }: { onClick: () => void }) {
  const colorScheme = useColorScheme();
  return <CloseButton size="sm" onClick={onClick} />;
  // <ActionIcon
  //   size="input-sm"
  //   variant="transparent"
  //   color={colorScheme === "light" ? "black" : "gray"}
  //   tabIndex={-1}
  // >
  //   <IconX size={16} />
  // </ActionIcon>;
}

export type AddFileModalProps = {
  title: AudioFile["title"] | null;
  setTitle: (val: AudioFile["title"] | null) => void;

  artist: AudioFile["artist"] | null;
  setArtist: (val: AudioFile["artist"] | null) => void;

  album: AudioFile["album"] | null;
  setAlbum: (val: AudioFile["album"] | null) => void;

  year: AudioFile["year"] | null;
  setYear: (val: AudioFile["year"] | null) => void;

  color: AudioFile["color"] | null;
  setColor: (val: AudioFile["color"] | null) => void;
};

export default function AudioFileMetadataEditor({
  title,
  setTitle,
  artist,
  setArtist,
  album,
  setAlbum,
  year,
  setYear,
  color,
  setColor,
}: AddFileModalProps) {
  return (
    <Grid>
      <Grid.Col span={12}>
        <TextInput
          label="Title"
          value={title ?? ""}
          onChange={(evt) => setTitle(evt.currentTarget.value ?? null)}
          rightSection={
            title && <RightSection onClick={() => setTitle(null)} />
          }
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Artist"
          value={artist ?? ""}
          onChange={(evt) => setArtist(evt.currentTarget.value ?? null)}
          rightSection={
            artist && <RightSection onClick={() => setArtist(null)} />
          }
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Album"
          value={album ?? ""}
          onChange={(evt) => setAlbum(evt.currentTarget.value ?? null)}
          rightSection={
            album && <RightSection onClick={() => setAlbum(null)} />
          }
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Year"
          value={year ?? ""}
          onChange={(evt) => setYear(evt.currentTarget.value ?? null)}
          rightSection={year && <RightSection onClick={() => setYear(null)} />}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <ColorCombobox
          value={color ?? ""}
          setValue={(value) => setColor(value ?? null)}
        />
      </Grid.Col>
    </Grid>
  );
}
