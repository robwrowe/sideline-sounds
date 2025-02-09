import React, { useCallback, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group, Title, UnstyledButton } from "@mantine/core";
import { v4 as uuid } from "uuid";
import styles from "./index.module.scss";

import { AudioFilesTable } from "../../components";
import { SUPPORTED_AUDIO_FILE_TYPES } from "../../../constants";
import {
  AudioFileState,
  useAppDispatch,
  useAppSelector,
  useAudioFileReducer,
} from "../../hooks";
import { getFileName } from "../../../utils";

import AddFileModal from "./AddFileModal";
import { fetchAudioFiles } from "../../features";

type LinksObject = {
  label: string;
  onClick: () => void;
};

// TODO: check if file still exists on disk

export default function Library() {
  const dispatch = useAppDispatch();
  const audioFiles = useAppSelector(({ audioFiles }) => audioFiles.audioFiles);
  const status = useAppSelector(({ audioFiles }) => audioFiles.status);
  const error = useAppSelector(({ audioFiles }) => audioFiles.error);

  const [state, localDispatch] = useAudioFileReducer();
  const [menuOpened, { toggle: toggleMenu, close: closeMenu }] =
    useDisclosure();
  const [importFile, { open: openImportFile, close: closeImportFile }] =
    useDisclosure(false);

  // when the page mounts, update the data in redux
  const fetchAndSetData = useCallback(() => {
    dispatch(fetchAudioFiles());
  }, [dispatch]);

  useEffect(() => {
    fetchAndSetData();
    // disabled as it should only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickImportFile = useCallback(async () => {
    try {
      openImportFile();
      // prompt the user for a file
      const file = await window.electron.dialog.showOpenDialog({
        title: "Import Audio File",
        buttonLabel: "import",
        filters: [
          {
            name: "Audio",
            extensions: SUPPORTED_AUDIO_FILE_TYPES,
          },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      // if the user canceled, close the modal
      if (file.canceled || file.filePaths.length <= 0) {
        closeImportFile();
        return;
      }

      const id = uuid();
      const filePath = file.filePaths[0];

      // get the metadata for this file
      const metadata = await window.electron.audio.metadata(filePath);

      // build out the initial value
      const fileInitialState: AudioFileState = {
        id,
        title: metadata.common.title ?? getFileName(filePath),
        artist: metadata.common.artist ?? null,
        album: metadata.common.album ?? null,
        year: metadata.common.year ? String(metadata.common.year) : null,
        filePath,
        color: null,
        duration: metadata.format.duration ?? null,
        subclips: [],
      };

      // update the reducer
      localDispatch({ type: "SET", payload: fileInitialState });
    } catch (err) {
      console.error("Error opening file", err);
    }
  }, [closeImportFile, localDispatch, openImportFile]);

  const LINKS: LinksObject[] = [
    {
      label: "Import File",
      onClick: handleClickImportFile,
    },
    // TODO: add ability to import directory or multiple files
    // {
    //   label: "Import Folder",
    //   onClick: openImportFolder,
    // },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 32 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !menuOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={menuOpened}
            onClick={toggleMenu}
            hiddenFrom="sm"
            size="sm"
          />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Title order={2}>Content Library</Title>
            <Group ml="xl" gap={0} visibleFrom="sm">
              {LINKS.map((item) => (
                <UnstyledButton
                  key={item.label}
                  className={styles.control}
                  onClick={item.onClick}
                >
                  {item.label}
                </UnstyledButton>
              ))}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        {LINKS.map((item) => (
          <UnstyledButton
            key={item.label}
            className={styles.control}
            onClick={item.onClick}
          >
            {item.label}
          </UnstyledButton>
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <AudioFilesTable data={audioFiles} status={status} error={error} />
        <AddFileModal
          opened={importFile}
          onClose={() => {
            closeImportFile();
            closeMenu();
          }}
          state={state}
          dispatch={localDispatch}
        />
      </AppShell.Main>

      <AppShell.Footer p="0"></AppShell.Footer>
    </AppShell>
  );
}
