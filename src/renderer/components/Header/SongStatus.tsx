import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Box, Group, Image, Progress, Stack, Text } from "@mantine/core";
import { IconMusic, IconMusicOff } from "@tabler/icons-react";
import styles from "./SongStatus.module.scss";

import { useAudioEngineContext, useDarkModeClassNames } from "../../hooks";
import { formatSecondsToTime } from "../../../utils";

export default function SongStatus() {
  const darkModeStyles = useDarkModeClassNames(styles);
  const { currentMetadata, currentDuration, currentElapsed, currentRemaining } =
    useAudioEngineContext();

  return (
    <div className={classNames(styles.parent, darkModeStyles)}>
      <Box p="2px">
        {currentMetadata?.image ? (
          <Image
            src={currentMetadata.image}
            alt={`${currentMetadata?.title || "Current Song"} album cover`}
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
              {currentMetadata?.title || ""}
            </Text>
            <Text fz="0.75rem">{currentMetadata?.artist || ""}</Text>
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
