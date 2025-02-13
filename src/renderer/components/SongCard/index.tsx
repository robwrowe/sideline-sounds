import React, { useCallback, useRef, useState } from "react";
import classNames from "classnames";
import { IconMusic } from "@tabler/icons-react";
import { Box, Card, Image, Text, ImageProps } from "@mantine/core";
import styles from "./index.module.scss";

import { ContextMenuItem } from "../../../types";

import ContextMenu, { ContextMenuProps } from "../ContextMenu";

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

// TODO: add style for "active"
// TODO: add style for "previously played"
// TODO: add style for "artist previously played"
export default function SongCard({
  title,
  artist,
  duration,
  image,
  onClick,
  onDoubleClick,
  contextMenu,
}: SongCardProps) {
  const [menu, setMenu] = useState<Pick<ContextMenuProps, "x" | "y"> | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement>(null);

  // needed to prevent the onClick from firing if the context menu needs to be closed
  const [lastInteraction, setLastInteraction] = useState<
    "left" | "right" | null
  >(null);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      console.log("context menu", menu);
      event.preventDefault();

      setLastInteraction("right");

      // if the menu is already opened, close it
      if (menu) {
        setMenu(null);
      } else {
        // otherwise, open the menu
        setMenu({ x: event.clientX, y: event.clientY });
      }
    },
    [menu]
  );

  const handleClick = useCallback(() => {
    console.log("click", menu);

    if (lastInteraction === "right") {
      setLastInteraction(null);
      return;
    }

    // if the context menu is opened, close it
    if (menu !== null) {
      console.log("click", "if");
      setMenu(null);
    } else if (onClick) {
      console.log("click", "else if");
      // otherwise, perform the normal action
      onClick();
    }

    setLastInteraction("left");
  }, [lastInteraction, menu, onClick]);

  const handleClose = useCallback(() => {
    console.log("closed");
    setMenu(null);
    setLastInteraction(null);
  }, []);

  return (
    <>
      <Card
        withBorder
        radius="md"
        padding="xs"
        onDoubleClick={onDoubleClick}
        className={classNames(styles.parent, {
          [styles.clickHandler]: onClick || onDoubleClick,
        })}
        //
        onContextMenu={handleContextMenu}
        onClick={handleClick}
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
      {menu && contextMenu && (
        <ContextMenu
          opened={Boolean(menu)}
          x={menu?.x}
          y={menu?.y}
          items={contextMenu}
          onClose={handleClose}
          onChange={(value: boolean) => {
            console.log("on change", value);
            if (!value) {
              setMenu(null);
            }
          }}
        />
      )}
    </>
  );
}
