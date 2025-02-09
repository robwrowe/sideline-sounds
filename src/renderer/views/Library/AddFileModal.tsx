import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  ScrollAreaAutosize,
  Tabs,
} from "@mantine/core";
import { IconMusicPlus } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";
import styles from "./AddFileModal.module.scss";

import { AudioFileAction, AudioFileState, useAppDispatch } from "../../hooks";
import { dbAudioFiles } from "../../repos";
import { AudioFile, Subclip } from "../../../types";
import { fetchAudioFiles } from "../../features";
import {
  AudioFileEditor,
  AudioFileMetadataEditor,
  AudioFileSubclip,
} from "../../components";

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
  const [idFallback] = useState(uuid());

  // section control
  const [selectedTab, setSelectedTab] = useState<string | null>("file");
  const [selectedSubclip, setSelectedSubclip] = useState<string | null>(null);

  const handleClose = useCallback(
    () =>
      new Promise<void>((resolve) => {
        onClose();
        const timeout = setTimeout(() => {
          setLoading(false);
          dispatch({ type: "RESET" });
          resolve();
        }, 2000);

        return () => {
          clearTimeout(timeout);
        };
      }),
    [dispatch, onClose]
  );

  const handleSubmit = useCallback(
    async (closeAfterFinish = true) => {
      try {
        const { id, title, artist, album, year, filePath, color, duration } =
          state;

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
        const item: AudioFile = {
          id: id ?? idFallback,
          title,
          artist,
          album,
          year,
          filePath,
          color,
          duration,
          subclips: [],
        };

        // add it to the database
        await dbAudioFiles.addItem(item);

        // update redux
        appDispatch(fetchAudioFiles());

        if (closeAfterFinish) {
          handleClose();
        } else {
          // reset the state
          dispatch({ type: "RESET" });
          // prompt user for new file
        }
      } catch (err) {
        console.error("Error adding new file", err);
        alert("An error occurred when attempting to add a file");
      }
    },
    [appDispatch, dispatch, handleClose, idFallback, state]
  );

  // when the user changes in/out point, update the state
  const handleSetInPoint = useCallback(
    (value: number | null) => {
      if (selectedSubclip) {
        const subclip = state.subclips.find(
          (item) => item.id === selectedSubclip
        );

        if (subclip) {
          const payload: Subclip = { ...subclip, inPoint: value };
          dispatch({ type: "UPDATE_SUBCLIP", id: selectedSubclip, payload });
        } else {
          console.warn("Not setting in point. Cannot find matching subclip.");
        }
      } else {
        console.warn("Not setting in point. No subclip selected.");
      }
    },
    [dispatch, selectedSubclip, state.subclips]
  );

  const handleSetOutPoint = useCallback(
    (value: number | null) => {
      if (selectedSubclip) {
        const subclip = state.subclips.find(
          (item) => item.id === selectedSubclip
        );

        if (subclip) {
          const payload: Subclip = { ...subclip, outPoint: value };
          dispatch({ type: "UPDATE_SUBCLIP", id: selectedSubclip, payload });
        } else {
          console.warn("Not setting out point. Cannot find matching subclip.");
        }
      } else {
        console.warn("Not setting out point. No subclip selected.");
      }
    },
    [dispatch, selectedSubclip, state.subclips]
  );

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Import File"
      withCloseButton={false}
      size="60rem"
    >
      <AudioFileEditor
        file={{
          id: state.id ?? idFallback,
          title: state.title ?? "",
          artist: state.artist,
          album: state.album,
          year: state.year,
          filePath: state.filePath ?? "",
          color: state.color,
          subclips: state.subclips,
          duration: null,
        }}
        activeSubclip={selectedSubclip}
        onSetInPoint={handleSetInPoint}
        onSetOutPoint={handleSetOutPoint}
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
                <AudioFileMetadataEditor state={state} dispatch={dispatch} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="subclips">
              <div className={styles.tabPanel}>
                <AudioFileSubclip
                  state={state}
                  dispatch={dispatch}
                  selectedSubclip={selectedSubclip}
                  setSelectedSubclip={setSelectedSubclip}
                />
              </div>
            </Tabs.Panel>
            {/* AudioFileSubclip */}
          </Tabs>
        </ScrollAreaAutosize>
        <Group justify="flex-start" style={{ width: "100%" }}>
          <Button
            onClick={() => handleSubmit(true)}
            leftSection={<IconMusicPlus size={16} />}
            disabled={!state.filePath || !state.title}
          >
            Import
          </Button>
          <Button
            onClick={handleClose}
            variant="outline"
            color="red"
            style={{ marginLeft: "auto" }}
          >
            Cancel
          </Button>
        </Group>
      </AudioFileEditor>
      <LoadingOverlay visible={loading} />
    </Modal>
  );
}
