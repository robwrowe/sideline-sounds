import React from "react";
import classNames from "classnames";
import {
  Box,
  Card,
  Image,
  Group,
  Stack,
  Text,
  ImageProps,
} from "@mantine/core";
import styles from "./index.module.scss";

import { useDarkModeClassNames } from "../../hooks";
import anAlbumCover from "../../assets/sample-album-cover.png";

export type SongCardProps = {
  /**
   * The title of the track
   */
  title?: string;

  /**
   * The name of the artist
   */
  artist?: string;

  /**
   * The run time for the track
   */
  duration?: string;

  /**
   * The image shown on the card
   * Typically the album cover
   */
  image?: ImageProps["src"];
};

export default function SongCard({
  title,
  artist,
  duration,
  image,
}: SongCardProps) {
  const darkModeStyles = useDarkModeClassNames(styles);
  return (
    <Card withBorder radius="md" padding="xs">
      <div className={classNames(styles.container)}>
        <div className={styles.imgContainer}>
          <Image
            src={anAlbumCover}
            alt="album cover"
            radius="sm"
            h={80}
            w={80}
          />
        </div>
        <div className={styles.infoContainer}>
          <Text fz="0.8rem" fw="bold">
            Soul Bossa Nova
          </Text>
          <Text fz="0.8rem">Quincy Jones</Text>
          <Text fz="0.8rem">3:34</Text>
        </div>
      </div>
    </Card>
  );
}
