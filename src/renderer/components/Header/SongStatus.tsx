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
      <Box>
        <Image src={anAlbumCover} alt="album cover" h={68} radius="sm" />
      </Box>
      <Box w={300} h={68}>
        <div className={styles.songInfoContainer}>
          <div className={styles.songMetaData}>
            <Text fz="0.75rem" fw="bold">
              Soul Bossa Nova
            </Text>
            <Text fz="0.75rem">Quincy Jones</Text>
          </div>
          {/* TODO: move these to <div/> with own styles */}
          <Stack gap="0" w="100%" p="0" m="0">
            <Group gap="0" justify="space-between">
              {/* TODO: monospace these numbers */}
              <Text fz="0.75rem">4:20</Text>
              <Text fz="0.75rem">1:09</Text>
            </Group>
            <Progress value={40} color="highlight" p="0" m="0" />
          </Stack>
        </div>
      </Box>
    </div>
  );
}
