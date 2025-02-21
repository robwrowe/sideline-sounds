import React, { useEffect } from "react";
import classNames from "classnames";
import { Box, Image, Progress, Text } from "@mantine/core";
import { IconMusic } from "@tabler/icons-react";
import styles from "./SongStatus.module.scss";

import { useAppSelector, useDarkModeClassNames } from "../../hooks";
import { formatSecondsToTime } from "../../../utils";
import { Output } from "../../../types";

// TODO: add color support
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

  useEffect(() => {
    console.log("song status", "currentDuration", currentDuration);
  }, [currentDuration]);

  useEffect(() => {
    console.log("song status", "currentElapsed", currentElapsed);
  }, [currentElapsed]);

  useEffect(() => {
    console.log("song status", "currentRemaining", currentRemaining);
  }, [currentRemaining]);

  useEffect(() => {
    console.log("song status", "currentMetadata", currentMetadata);
  }, [currentMetadata]);

  return (
    <div className={classNames(styles.parent, darkModeStyles)}>
      <Box p="2px">
        {currentMetadata?.audioFile?.album ? (
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
        )}
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
              color="accent"
              p="0"
              m="0"
            />
          </div>
        </div>
      </Box>
    </div>
  );
}
