import React, { useCallback, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group, Title, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconVinyl } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";
import styles from "./index.module.scss";

import { AudioFilesTable } from "../../components";
import { SUPPORTED_AUDIO_FILE_TYPES } from "../../../constants";
import { fetchAudioFiles } from "../../features";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { dbAudioFiles } from "../../repos";
import { AudioFile, AudioFileState } from "../../../types";
import { getFileName } from "../../../utils";
import { openAudioFileModal } from "../../modals";

type LinksObject = {
  label: string;
  onClick: () => void;
};

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 32;

// TODO: check if file still exists on disk

export default function LibraryView() {
  const dispatch = useAppDispatch();
  const audioEngineState = useAppSelector(({ audioEngine }) => audioEngine);
  const audioFiles = useAppSelector(({ audioFiles }) => audioFiles.audioFiles);
  const status = useAppSelector(({ audioFiles }) => audioFiles.status);
  const error = useAppSelector(({ audioFiles }) => audioFiles.error);

  const [menuOpened, { toggle: toggleMenu }] = useDisclosure();

  const fetchData = useCallback(async () => {
    dispatch(fetchAudioFiles());
  }, [dispatch]);

  // when a file is imported, update the data
  const handleSubmit = useCallback(
    async (item: AudioFile, contextModalID?: string) => {
      try {
        // confirm there's a title
        if (!item?.title) {
          // prompt the user to add a title
          alert("Missing file title.");
          return;
        }

        // confirm there's a file path
        if (!item?.filePath) {
          // prompt the user to select a valid file
          throw new Error("Missing file");
        }

        // add it to the database
        await dbAudioFiles.addItem(item);

        // update redux
        dispatch(fetchAudioFiles());

        // update other renderer processes
        window.broadcast.sendEvent("fetch", "audioFiles");

        // if a context modal ID is provided, close the modal
        if (contextModalID) {
          modals.close(contextModalID);
        }
      } catch (err) {
        console.error("Error adding new file", err);
        alert("An error occurred when attempting to add a file");
      }
    },
    [dispatch]
  );

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
      // prompt the user for a file
      const file = await window.electron.dialog.showOpenDialog({
        title: "Import Audio File",
        buttonLabel: "Import",
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
        return;
      }

      const id = uuid();
      const filePath = file.filePaths[0];

      // get the metadata for this file
      const metadata = await window.audio.metadata(filePath);

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
      openAudioFileModal(filePath, {
        title: "Import Audio File",
        props: {
          defaultValues: fileInitialState,
          onConfirm: handleSubmit,
        },
      });
    } catch (err) {
      console.error("Error opening file", err);
    }
  }, [handleSubmit]);

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
      header={{ height: HEADER_HEIGHT }}
      footer={{ height: FOOTER_HEIGHT }}
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
            <Group justify="flex-start" align="center" gap="xs">
              <IconVinyl size={30} />
              <Title order={2}>Content Library</Title>
            </Group>
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

      <AppShell.Main
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <AudioFilesTable
          state={audioEngineState}
          data={audioFiles}
          status={status}
          error={error}
          fetchData={fetchData}
        />
      </AppShell.Main>

      <AppShell.Footer p="0"></AppShell.Footer>
    </AppShell>
  );
}
