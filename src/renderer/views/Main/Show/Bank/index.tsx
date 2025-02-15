import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import styles from "./index.module.scss";

import { SongCard } from "../../../../components";
import { fetchContentButtons, setActiveBankID } from "../../../../features";
import {
  useAppDispatch,
  useAppSelector,
  useAudioEngineContext,
} from "../../../../hooks";
import { ContentButtonModalConfirmArgs } from "../../../../modals";
import {
  AudioFile,
  ButtonActionType,
  ContextMenuItem,
  ShowParams,
  SongState,
} from "../../../../../types";
import {
  formatArtist,
  formatSecondsToTime,
  getAudioMimeType,
  getFileName,
} from "../../../../../utils";
import { dbContentButtons } from "../../../../repos";

import openContentButtonModal from "./ContentModal";
import openContentButtonDeleteModal from "./ContentModalDelete";
import { SongCardSize } from "../../../../components/SongCard";

export default function ShowBank() {
  const { bankID, showID, pageID } = useParams<ShowParams>();
  const dispatch = useAppDispatch();

  const allBanks = useAppSelector(({ banks }) => banks.banks);
  const bank = useMemo(
    () => allBanks.find((item) => item.id === bankID),
    [allBanks, bankID]
  );
  const allButtons = useAppSelector(
    ({ contentButtons }) => contentButtons.contentButtons
  );
  const buttons = useMemo(
    () => allButtons.filter((btn) => btn.bankID === bankID),
    [allButtons, bankID]
  );

  const audioFiles = useAppSelector(({ audioFiles }) => audioFiles.audioFiles);
  const [cards, setCards] = useState<React.JSX.Element[]>([]);
  const { audioEngine } = useAudioEngineContext();

  const numOfRows = bank?.numOfRows || 7;
  const numOfCols = bank?.numOfCols || 4;
  const cardSize: SongCardSize =
    numOfRows > 8 ? "sm" : numOfRows > 6 ? "md" : "lg";

  useEffect(() => {
    if (bankID) {
      dispatch(setActiveBankID(bankID));
    } else {
      dispatch(setActiveBankID(null));
    }

    // on dismount, clear selection
    return () => {
      dispatch(setActiveBankID(null));
    };
  }, [dispatch, bankID]);

  // update local storage for future reference
  useEffect(() => {
    if (showID && pageID) {
      localStorage.setItem(
        `bank-selection:show:${showID}:page:${pageID}`,
        JSON.stringify(bankID)
      );
    }
  }, [bankID, pageID, showID]);

  const handleFetchButtons = useCallback(() => {
    // update redux
    dispatch(fetchContentButtons());
  }, [dispatch]);

  // context menu - confirm button
  const handleClickAssign = useCallback(
    async (value: ContentButtonModalConfirmArgs, buttonNumber: number) => {
      try {
        if (bankID) {
          // update the database
          await dbContentButtons.updateItem({
            bankID,
            buttonNumber,
            color: value.color,
            hotkey: null,
            type: ButtonActionType.FILE,
            contentID: value.fileID,
            subclipID: value.subclipID,
          });

          // update redux
          handleFetchButtons();
        }
      } catch (err) {
        alert("An error occurred when attempting to add the button.");
        console.error(
          "An error occurred when attempting to add the button.",
          err
        );
      }
    },
    [bankID, handleFetchButtons]
  );

  const handleClickDelete = useCallback(
    async (buttonNumber: number) => {
      if (bankID) {
        await dbContentButtons.deleteItem([bankID, buttonNumber]);

        // update redux
        handleFetchButtons();
      }
    },
    [bankID, handleFetchButtons]
  );

  // play audio on first click
  const handleClick = useCallback(
    async (obj: AudioFile) => {
      const { filePath, title, artist, album } = obj;
      // extract the file name from the path
      const fileName = getFileName(filePath) || "No Name Found";

      const fileBuffer = await window.electron.audio.fileBuffer(filePath);

      const blob = new Blob([fileBuffer]);

      const file = new File([blob], fileName, {
        type: getAudioMimeType(filePath),
      });

      const audioBuffer = await audioEngine.loadAudio(file);

      audioEngine.play(audioBuffer, {
        title,
        artist: formatArtist({ artist, album }),
      });
    },
    [audioEngine]
  );

  // build out the song cards
  useEffect(() => {
    const result: React.JSX.Element[] = [];
    const numOfButtons = numOfCols * numOfRows;

    for (let i = 0; i < numOfButtons; i++) {
      const btn = buttons.find((btn) => btn.buttonNumber === i);

      // TODO: build out options
      // [ ] Assign Content
      // [ ] Remove Content
      // [ ] Edit Content
      // [ ] Assign B-Side PGM
      // [ ] Edit button color
      // [ ] Edit hot key
      const contextMenu: ContextMenuItem[] = [
        {
          label: "Assign Button",
          onClick: () =>
            openContentButtonModal({
              title: "Add Content Button",
              props: {
                onConfirm: (val) => handleClickAssign(val, i),
                labels: { confirm: "Add Button" },
              },
            }),
        },
        {
          label: "Edit Button",
          disabled: !btn,
          onClick: () =>
            openContentButtonModal({
              title: "Edit Content Button",
              props: {
                onConfirm: (val) => handleClickAssign(val, i),
                labels: { confirm: "Save Changes" },
                defaultValues: {
                  color: btn?.color,
                  contentID:
                    btn?.type === ButtonActionType.FILE && btn?.contentID
                      ? btn.contentID
                      : undefined,
                  subclipID:
                    btn?.type === ButtonActionType.FILE && btn?.subclipID
                      ? btn.subclipID
                      : undefined,
                },
              },
            }),
        },
        {
          label: "Delete Button",
          onClick: () =>
            openContentButtonDeleteModal({
              title: "Remove Content Button",
              props: {
                onConfirm: () => handleClickDelete(i),
              },
            }),
        },
        { type: "divider" },
        {
          label: "Edit Content",
          onClick: () => console.log("clicked edit content"),
        },
      ];

      if (btn) {
        if (btn.type === ButtonActionType.FILE) {
          const file = audioFiles.find((item) => item.id === btn.contentID);

          if (file) {
            result.push(
              <SongCard
                key={`song-card-${i}`}
                title={file.title}
                artist={formatArtist({
                  artist: file.artist,
                  album: file.album,
                })}
                duration={
                  file?.duration
                    ? formatSecondsToTime(file.duration)
                    : undefined
                }
                contextMenu={contextMenu}
                onClick={() => handleClick(file)}
                color={btn?.color ?? undefined}
                size={cardSize}
              />
            );
            continue;
          }
        }
      }

      result.push(
        <SongCard
          key={`song-card-${i}`}
          contextMenu={contextMenu}
          size={cardSize}
        />
      );
    }

    setCards(result);
  }, [
    audioFiles,
    buttons,
    cardSize,
    handleClick,
    handleClickAssign,
    handleClickDelete,
    numOfCols,
    numOfRows,
  ]);

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: Array(numOfCols).fill("1fr").join(" "),
        gridTemplateRows: Array(numOfRows).fill("1fr").join(" "),
      }}
    >
      {cards}
    </div>
  );
}
