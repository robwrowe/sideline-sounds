import React from "react";
import classNames from "classnames";
import { Box, Progress, Text } from "@mantine/core";
import styles from "./SongStatus.module.scss";

import {
  useAppSelector,
  useDarkModeClassNames,
  useSongCardColorResolver,
} from "../../hooks";
import { formatSecondsToTime } from "../../../utils";
import { Output } from "../../../types";

export default function SongStatus() {
  const darkModeStyles = useDarkModeClassNames(styles);

  const currentDuration = useAppSelector(
    ({ audioEngine }) => audioEngine[Output.PGM_A].current.duration
  );

  const currentElapsed = useAppSelector(
    ({ audioEngine }) => audioEngine[Output.PGM_A].current.elapsed
  );

  const currentRemaining = useAppSelector(
    ({ audioEngine }) => audioEngine[Output.PGM_A].current.remaining
  );

  const currentMetadata = useAppSelector(
    ({ audioEngine }) => audioEngine[Output.PGM_A].current.metadata
  );

  const subclip = currentMetadata?.subclipID
    ? currentMetadata?.audioFile?.subclips?.find(
        (item) => item.id === currentMetadata.subclipID
      )
    : null;

  const color =
    currentMetadata?.button?.color ??
    subclip?.color ??
    currentMetadata?.audioFile?.color ??
    undefined;

  const { style } = useSongCardColorResolver({
    color,
  });

  const progressColor = color ?? "accent";
  const { resolvedColors } = useSongCardColorResolver({
    color: progressColor,
  });

  return (
    <div className={classNames(styles.parent, darkModeStyles)} style={style}>
      <Box p="2px">
        {/* TODO: Add support for album cover */}
        {/* {currentMetadata?.audioFile?.album ? (
          <Image
            src={currentMetadata?.audioFile?.album}
            alt={`${currentMetadata?.audioFile?.title || "Current Song"} album cover`}
            h={64}
            radius="xs"
          />
        ) : (
          <Box className={styles.imagePlaceholder} h={64} w={64}>
            <IconMusic size={32} color="gray" />
          </Box>
        )} */}
      </Box>
      <Box w={300} h={68}>
        <div className={styles.songInfoContainer}>
          <div className={styles.songMetaData}>
            <Text fz="0.75rem" fw="bold">
              {currentMetadata?.audioFile?.title || ""}
            </Text>
            <Text fz="0.75rem">{currentMetadata?.audioFile?.artist || ""}</Text>
          </div>
          <div className={styles.songProgressContainer}>
            <div className={styles.songTime}>
              <Text fz="0.75rem">
                {currentElapsed !== null
                  ? formatSecondsToTime(currentElapsed)
                  : ""}
              </Text>
              <Text fz="0.75rem">
                {currentRemaining !== null
                  ? formatSecondsToTime(currentRemaining)
                  : ""}
              </Text>
            </div>
            <Progress
              value={
                currentElapsed !== null
                  ? (currentElapsed / (currentDuration || 1)) * 100
                  : 0
              }
              color={
                progressColor === "accent" ? "accent" : resolvedColors?.color
              }
              p="0"
              m="0"
            />
          </div>
        </div>
      </Box>
    </div>
  );
}
