import React, { useMemo } from "react";
import {
  IconPencil,
  IconPlayerStopFilled,
  IconPlayerPlayFilled,
  IconTrashFilled,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Checkbox,
  Table,
  useComputedColorScheme,
} from "@mantine/core";
import styles from "./TableTr.module.scss";

import { AudioFile } from "../../../types";
import { formatSecondsToTime } from "../../../utils";
import { useSongCardColorResolver } from "../../hooks";

export type AudioFileTableTrProps = {
  row: AudioFile;
  isPlaying?: boolean;
  onClickPlay?: () => void;
  onClickStop?: () => void;
  onClickDelete?: () => void;
  onClickEdit?: () => void;
  hideActions?: boolean;
  hideCheckbox?: boolean;
};

export default function AudioFileTableTr({
  row,
  isPlaying = false,
  onClickPlay,
  onClickStop,
  onClickDelete,
  onClickEdit,
  hideActions = false,
  hideCheckbox = false,
}: AudioFileTableTrProps) {
  const colorScheme = useComputedColorScheme();
  const actionIconColor = useMemo(
    () => (colorScheme === "light" ? "black" : "gray"),
    [colorScheme]
  );
  // extract the color if provided
  const { style, parsedColor } = useSongCardColorResolver({
    color: row.color ?? undefined,
  });

  const tableStyle = row.color
    ? {
        backgroundColor: style.backgroundColor,
        color: style.color,
      }
    : undefined;

  return (
    <Table.Tr key={row.id} style={tableStyle}>
      {!hideCheckbox && (
        <Table.Td>
          <Checkbox />
        </Table.Td>
      )}
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>{row.artist}</Table.Td>
      <Table.Td>{row.album}</Table.Td>
      <Table.Td w={hideActions ? 96 : 176}>
        <div className={styles.durationActions}>
          {row.duration !== null ? formatSecondsToTime(row.duration) : "-:--"}
          {!hideActions && (
            <div className={styles.actionContainer}>
              {onClickPlay && !isPlaying && (
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  color={row.color ? parsedColor.value : actionIconColor}
                  onClick={onClickPlay}
                  disabled={!row.filePath}
                >
                  <IconPlayerPlayFilled size={16} />
                </ActionIcon>
              )}
              {onClickStop && isPlaying && (
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  color={row.color ? parsedColor.value : actionIconColor}
                  onClick={onClickStop}
                  disabled={!row.filePath}
                >
                  <IconPlayerStopFilled size={16} />
                </ActionIcon>
              )}
              {onClickEdit && (
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  color={row.color ? parsedColor.value : actionIconColor}
                  onClick={onClickEdit}
                >
                  <IconPencil size={16} />
                </ActionIcon>
              )}
              {onClickDelete && (
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  color={row.color ? parsedColor.value : actionIconColor}
                  onClick={onClickDelete}
                >
                  <IconTrashFilled size={16} />
                </ActionIcon>
              )}
            </div>
          )}
        </div>
      </Table.Td>
    </Table.Tr>
  );
}
