import React, { useCallback, useState } from "react";
import { useColorScheme } from "@mantine/hooks";
import {
  ActionIcon,
  Button,
  ColorInput,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconMusicPlus, IconX } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";

import { SWATCHES } from "../../../constants";
import {
  AudioFileActionHandler,
  AudioFileAction,
  AudioFileState,
  useAppDispatch,
} from "../../hooks";
import { dbAudioFiles } from "../../repos";
import { AudioFile } from "../../../types";
import { fetchAudioFiles } from "../../features";

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
  opened: boolean;
  onClose: () => void;
  state: AudioFileState;
  dispatch: React.ActionDispatch<[action: AudioFileAction]>;
};

export default function AddFileModal({
  opened,
  onClose,
  state,
  dispatch,
}: AddFileModalProps) {
  const [loading, setLoading] = useState(false);
  const appDispatch = useAppDispatch();

  const handleChange = useCallback(
    (type: AudioFileActionHandler["type"], value: string | null) => {
      dispatch({ type, payload: value });
    },
    [dispatch]
  );

  const handleSubmit = useCallback(async () => {
    try {
      const { title, artist, album, year, filePath, color, duration } = state;
      // confirm there's a title
      if (!title) {
        // prompt the user to add a title
        alert("Missing file title.");
        return;
      }

      // confirm there's a file path
      if (!filePath) {
        // prompt the user to select a valid file
        throw new Error("Missing file");
      }

      // set the UI to a loading state
      setLoading(true);

      // build out the payload for the database
      const id = uuid();
      const item: AudioFile = {
        id,
        title,
        artist,
        album,
        year,
        filePath,
        color,
        duration,
        subClips: {},
      };

      // add it to the database
      await dbAudioFiles.addItem(item);

      // update redux
      appDispatch(fetchAudioFiles());
    } catch (err) {
      console.error("Error adding new file", err);
      alert("An error occurred when attempting to add a file");
    }

    onClose();
    const timeout = setTimeout(() => setLoading(false), 2000);

    return () => clearTimeout(timeout);
  }, [appDispatch, onClose, state]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Import File"
      withCloseButton={false}
    >
      <Stack gap="sm">
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
        <ColorInput
          label="Color"
          value={state.color ?? ""}
          onChange={(value) => handleChange("SET_COLOR", value ?? null)}
          rightSection={
            state.color && (
              <RightSection onClick={() => handleChange("SET_COLOR", null)} />
            )
          }
          swatches={SWATCHES}
          withPicker={false}
          withEyeDropper={false}
          closeOnColorSwatchClick={true}
        />
        <Group justify="space-between">
          <Button
            onClick={handleSubmit}
            leftSection={<IconMusicPlus size={16} />}
            disabled={!state.filePath || !state.title}
          >
            Import
          </Button>
          <Button
            onClick={() => {
              onClose();
              dispatch({ type: "RESET" });
            }}
            variant="outline"
            color="red"
          >
            Cancel
          </Button>
        </Group>
      </Stack>
      <LoadingOverlay visible={loading} />
    </Modal>
  );
}
