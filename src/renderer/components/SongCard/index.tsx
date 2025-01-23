import React, { useCallback } from "react";
import classNames from "classnames";
import { IconMusic } from "@tabler/icons-react";
import { Box, Card, Image, Text, ImageProps } from "@mantine/core";
import styles from "./index.module.scss";

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

  /**
   * Function to call when the card is clicked once
   */
  onClick?: () => void;

  /**
   * Function to call when the card is clicked twice
   */
  onDoubleClick?: () => void;

  /**
   * Function to call when the card is right clicked
   */
  onRightClick?: () => void;
};

export default function SongCard({
  title,
  artist,
  duration,
  image,
  onClick,
  onDoubleClick,
  onRightClick,
}: SongCardProps) {
  return (
    <Card
      withBorder
      radius="md"
      padding="xs"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onRightClick}
      className={classNames(styles.parent, {
        [styles.clickHandler]: onClick || onDoubleClick || onRightClick,
      })}
    >
      <div className={styles.container}>
        <div className={styles.imgContainer}>
          {image ? (
            <Image
              src={image}
              alt={`${title} album cover`}
              radius="sm"
              h={80}
              w={80}
            />
          ) : (
            <Box className={styles.imagePlaceholder} h={80} w={80}>
              <IconMusic size={40} color="gray" />
            </Box>
          )}
        </div>
        <div className={styles.infoContainer}>
          <Text fz="0.8rem" fw="bold">
            {title}
          </Text>
          {artist && <Text fz="0.8rem">{artist}</Text>}
          {duration && <Text fz="0.8rem">{duration}</Text>}
        </div>
      </div>
    </Card>
  );
}
