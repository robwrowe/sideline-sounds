import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  ButtonProps,
  Group,
  ScrollAreaAutosize,
  Tabs,
} from "@mantine/core";
import { IconMusicUp } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";
import styles from "./index.module.scss";

import { AudioFile } from "../../../types";
import {
  AudioFileEditor,
  AudioFileMetadataEditor,
  AudioFileSubclip,
} from "../../components";
import { ContextModalProps } from "@mantine/modals";

export type AudioFileState = Omit<AudioFile, "id" | "title" | "filePath"> & {
  title: AudioFile["title"] | null;
  filePath: AudioFile["filePath"] | null;
  id: AudioFile["id"] | null;
};

export type AudioFileModalProps = {
  labels?: {
    confirm?: string;
    cancel?: string;
  };
  onCancel?: () => void;
  onConfirm?: (item: AudioFile, contextModalID?: string) => void;
  cancelButtonProps?: Omit<ButtonProps, "children">;
  confirmButtonProps?: Omit<ButtonProps, "children">;
  defaultValues?: Partial<Omit<AudioFileState, "filePath">>;
  filePath: AudioFile["filePath"];
};

export default function AudioFileModal({
  context,
  id: contextModalID,
  innerProps = { filePath: "" },
}: ContextModalProps<AudioFileModalProps>) {
  const {
    labels = {},
    onConfirm,
    onCancel,
    defaultValues = {},
    cancelButtonProps,
    confirmButtonProps,
    filePath,
  } = innerProps;
  const { confirm = "Import", cancel = "Cancel" } = labels;
  const {
    id = uuid(),
    title: defaultTitle = null,
    artist: defaultArtist = null,
    album: defaultAlbum = null,
    year: defaultYear = null,
    color: defaultColor = null,
    duration = null,
    subclips: defaultSubclips = [],
  } = defaultValues;

  const [idFallback] = useState(uuid());

  // section control
  const [selectedTab, setSelectedTab] = useState<string | null>("file");
  const [selectedSubclip, setSelectedSubclip] = useState<string | null>(null);

  // state
  const [title, setTitle] = useState<AudioFile["title"] | null>(defaultTitle);
  const [artist, setArtist] = useState<AudioFile["artist"] | null>(
    defaultArtist
  );
  const [album, setAlbum] = useState<AudioFile["album"] | null>(defaultAlbum);
  const [year, setYear] = useState<AudioFile["year"] | null>(defaultYear);
  const [color, setColor] = useState<AudioFile["color"] | null>(defaultColor);
  const [subclips, setSubclips] =
    useState<AudioFile["subclips"]>(defaultSubclips);
  const confirmDisabled = useMemo(() => !title || !filePath, [filePath, title]);

  const handleSubmit = useCallback(() => {
    if (onConfirm) {
      if (title && filePath) {
        // build out the payload for the database
        const item: AudioFile = {
          id: id ?? idFallback,
          title,
          artist,
          album,
          year,
          filePath,
          color,
          duration,
          subclips,
        };

        onConfirm(item, contextModalID);

        // close the modal
        context.closeContextModal(contextModalID);
      }
    }
  }, [
    album,
    artist,
    color,
    context,
    contextModalID,
    duration,
    filePath,
    id,
    idFallback,
    onConfirm,
    subclips,
    title,
    year,
  ]);

  // when the user changes in/out point, update the state
  const handleSetInPoint = useCallback(
    (value: number | null) => {
      if (selectedSubclip) {
        setSubclips((prev) =>
          prev.map((subclip) =>
            subclip.id === selectedSubclip
              ? { ...subclip, inPoint: value }
              : subclip
          )
        );
      } else {
        console.warn("Not setting in point. No subclip selected.");
      }
    },
    [selectedSubclip]
  );

  const handleSetOutPoint = useCallback(
    (value: number | null) => {
      if (selectedSubclip) {
        setSubclips((prev) =>
          prev.map((subclip) =>
            subclip.id === selectedSubclip
              ? { ...subclip, outPoint: value }
              : subclip
          )
        );
      } else {
        console.warn("Not setting out point. No subclip selected.");
      }
    },
    [selectedSubclip]
  );

  return (
    <AudioFileEditor
      file={{
        id: id ?? idFallback,
        title: title ?? "",
        artist: artist,
        album: album,
        year: year,
        filePath: filePath ?? "",
        color: color,
        subclips: subclips,
        duration: null,
      }}
      activeSubclip={selectedSubclip}
      onSetInPoint={handleSetInPoint}
      onSetOutPoint={handleSetOutPoint}
      disableInMarker={
        selectedTab !== "subclips" ||
        (selectedTab === "subclips" && selectedSubclip === null)
      }
      disableOutMarker={
        selectedTab !== "subclips" ||
        (selectedTab === "subclips" && selectedSubclip === null)
      }
    >
      {/* TODO: dynamically set scroll area height */}
      <ScrollAreaAutosize mah={450} scrollbars="y">
        <Tabs
          defaultValue="subclips"
          className={styles.tabs}
          value={selectedTab}
          onChange={(value) => setSelectedTab(value)}
        >
          <Tabs.List>
            <Tabs.Tab value="file">File</Tabs.Tab>
            <Tabs.Tab value="subclips">Subclips</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="file">
            <div className={styles.tabPanel}>
              <AudioFileMetadataEditor
                title={title}
                setTitle={setTitle}
                artist={artist}
                setArtist={setArtist}
                album={album}
                setAlbum={setAlbum}
                year={year}
                setYear={setYear}
                color={color}
                setColor={setColor}
              />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="subclips">
            <div className={styles.tabPanel}>
              <AudioFileSubclip
                selectedSubclip={selectedSubclip}
                setSelectedSubclip={setSelectedSubclip}
                subclips={subclips}
                setSubclips={setSubclips}
              />
            </div>
          </Tabs.Panel>
          {/* AudioFileSubclip */}
        </Tabs>
      </ScrollAreaAutosize>
      <Group justify="flex-start" style={{ width: "100%" }}>
        {onConfirm && (
          <Button
            onClick={() => handleSubmit()}
            leftSection={<IconMusicUp size={16} />}
            disabled={confirmDisabled}
            {...confirmButtonProps}
          >
            {confirm}
          </Button>
        )}
        <Button
          onClick={onCancel || (() => context.closeModal(contextModalID))}
          variant="outline"
          color="red"
          style={{ marginLeft: "auto" }}
          {...cancelButtonProps}
        >
          {cancel}
        </Button>
      </Group>
    </AudioFileEditor>
  );
}
