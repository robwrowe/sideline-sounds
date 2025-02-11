import React, { useCallback, useRef, useState } from "react";
import classNames from "classnames";
import { IconMusic } from "@tabler/icons-react";
import { Box, Card, Image, Text, ImageProps } from "@mantine/core";
import styles from "./index.module.scss";

import ContextMenu, { ContextMenuItem, ContextMenuProps } from "../ContextMenu";

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
   * Options to present if the user right-clicks on the card
   */
  contextMenu?: ContextMenuItem[];
};

export default function SongCard({
  title,
  artist,
  duration,
  image,
  onClick,
  onDoubleClick,
}: SongCardProps) {
  const [menu, setMenu] = useState<Pick<ContextMenuProps, "x" | "y"> | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY });
  }, []);

  const handleCloseMenu = useCallback(() => setMenu(null), []);

  return (
    <>
      <Card
        withBorder
        radius="md"
        padding="xs"
        // onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={classNames(styles.parent, {
          [styles.clickHandler]: onClick || onDoubleClick,
        })}
        //
        onContextMenu={handleContextMenu}
        onClick={handleCloseMenu}
        ref={menuRef}
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
      {menu && (
        <ContextMenu
          items={[
            {
              label: "Edit",
              onClick: () => console.log("edit"),
            },
            {
              label: "Delete",
              onClick: () => console.log("delete"),
            },
          ]}
          x={menu.x}
          y={menu.y}
          onClose={handleCloseMenu}
        />
      )}
    </>
  );
}
