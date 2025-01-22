import React from "react";
import classNames from "classnames";
import { Box, Group, Image, Progress, Stack, Text } from "@mantine/core";
import styles from "./SongStatus.module.scss";

import anAlbumCover from "../../assets/sample-album-cover.png";
import { useDarkModeClassNames } from "../../hooks";

export default function SongStatus() {
  const darkModeStyles = useDarkModeClassNames(styles);

  return (
    <div className={classNames(styles.parent, darkModeStyles)}>
      <Box p="2px">
        <Image src={anAlbumCover} alt="album cover" h={64} radius="sm" />
      </Box>
      <Box w={300} h={68}>
        <div className={styles.songInfoContainer}>
          <div className={styles.songMetaData}>
            <Text fz="0.75rem" fw="bold">
              Soul Bossa Nova
            </Text>
            <Text fz="0.75rem">Quincy Jones</Text>
          </div>
          <div className={styles.songProgressContainer}>
            <div className={styles.songTime}>
              <Text fz="0.75rem">04:20</Text>
              <Text fz="0.75rem">01:09</Text>
            </div>
            <Progress value={40} color="highlight" p="0" m="0" />
          </div>
        </div>
      </Box>
    </div>
  );
}
