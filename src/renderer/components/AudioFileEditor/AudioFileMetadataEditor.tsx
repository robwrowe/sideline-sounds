import React, { useCallback } from "react";
import { useColorScheme } from "@mantine/hooks";
import { ActionIcon, Grid, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import {
  AudioFileActionHandler,
  AudioFileAction,
  AudioFileState,
} from "../../hooks";
import { ColorCombobox } from "../Combobox";

function RightSection({ onClick }: { onClick: () => void }) {
  const colorScheme = useColorScheme();
  return (
    <ActionIcon
      size="input-sm"
      variant="transparent"
      color={colorScheme === "light" ? "black" : "gray"}
      onClick={onClick}
      tabIndex={-1}
    >
      <IconX size={16} />
    </ActionIcon>
  );
}

export type AddFileModalProps = {
  state: AudioFileState;
  dispatch: React.ActionDispatch<[action: AudioFileAction]>;
};

export default function AudioFileMetadataEditor({
  state,
  dispatch,
}: AddFileModalProps) {
  const handleChange = useCallback(
    (
      type: Exclude<
        AudioFileActionHandler["type"],
        "SET_SUBCLIPS" | "DELETE_SUBCLIP" | "UPDATE_SUBCLIP" | "ADD_SUBCLIP"
      >,
      value: string | null
    ) => {
      dispatch({ type, payload: value });
    },
    [dispatch]
  );

  return (
    <Grid>
      <Grid.Col span={12}>
        <TextInput
          label="Title"
          value={state.title ?? ""}
          onChange={(evt) =>
            handleChange("SET_TITLE", evt.currentTarget.value ?? null)
          }
          rightSection={
            state.title && (
              <RightSection onClick={() => handleChange("SET_TITLE", null)} />
            )
          }
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Artist"
          value={state.artist ?? ""}
          onChange={(evt) =>
            handleChange("SET_ARTIST", evt.currentTarget.value ?? null)
          }
          rightSection={
            state.artist && (
              <RightSection onClick={() => handleChange("SET_ARTIST", null)} />
            )
          }
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Album"
          value={state.album ?? ""}
          onChange={(evt) =>
            handleChange("SET_ALBUM", evt.currentTarget.value ?? null)
          }
          rightSection={
            state.album && (
              <RightSection onClick={() => handleChange("SET_ALBUM", null)} />
            )
          }
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Year"
          value={state.year ?? ""}
          onChange={(evt) =>
            handleChange("SET_YEAR", evt.currentTarget.value ?? null)
          }
          rightSection={
            state.year && (
              <RightSection onClick={() => handleChange("SET_YEAR", null)} />
            )
          }
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <ColorCombobox
          value={state.color ?? ""}
          setValue={(value) => handleChange("SET_COLOR", value ?? null)}
        />
      </Grid.Col>
    </Grid>
  );
}
