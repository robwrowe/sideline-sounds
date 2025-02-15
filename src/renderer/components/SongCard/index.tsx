import React, { useCallback, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import {
  IconCircleCheckFilled,
  IconCircleDashedCheck,
  IconMusic,
  IconPlayerPlayFilled,
  IconPlayerSkipForwardFilled,
  IconProgressCheck,
} from "@tabler/icons-react";
import {
  Box,
  Card,
  Image,
  Text,
  ImageProps,
  useMantineTheme,
  MantineFontSize,
  Tooltip,
  rgba,
} from "@mantine/core";
import styles from "./index.module.scss";

import { ContextMenuItem, SongState } from "../../../types";
import { useSongCardColorResolver } from "../../hooks";

import ContextMenu, { ContextMenuProps } from "../ContextMenu";

export type SongCardSize = "sm" | "md" | "lg" | undefined;

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

  /**
   * Allows the user to set a custom color.
   */
  color?: string;

  /**
   * Allows the button to be colored based on playback state
   */
  state?: SongState | null;

  /**
   * When true, this artist has been played, but not this track
   */
  artistHasBeenPlayed?: boolean;

  /**
   * The size of the card
   */
  size?: SongCardSize;

  /**
   * The size of the font for the title
   */
  titleSize?: MantineFontSize;

  /**
   * The size of the font for the details (e.g. artist, duration)
   */
  detailsSize?: MantineFontSize;
};

// TODO: if displaying a subclip, have the name be in the title
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
  color,
  state,
  artistHasBeenPlayed,
  size,
  titleSize = size ?? "sm",
  detailsSize = "xs",
}: SongCardProps) {
  const theme = useMantineTheme();
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

  // extract the color if provided
  const { style, setIsHovered, parsedColor, resolvedColors } =
    useSongCardColorResolver({
      color,
      state,
    });

  const handleSetHover = useCallback(
    (value: boolean) => {
      if (title) {
        setIsHovered(value);
      } else {
        setIsHovered(false);
      }
    },
    [setIsHovered, title]
  );

  // determine the height of the card
  const cardHeight = useMemo(() => {
    const borderSize =
      (state && state !== SongState.SUBCLIP_PLAYED ? 1 : 4) * theme.scale;

    switch (size) {
      case "lg":
        return 176 - borderSize;

      case "md":
        return 128 - borderSize;

      case "sm":
        return 96 - borderSize;

      default:
        return undefined;
    }
  }, [size, state, theme.scale]);

  const iconSize = useMemo(() => {
    switch (size) {
      case "lg":
        return 24;

      case "md":
        return 20;

      case "sm":
        return 16;

      default:
        return undefined;
    }
  }, [size]);

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
        onMouseEnter={() => handleSetHover(true)}
        onMouseLeave={() => handleSetHover(false)}
        ref={menuRef}
        style={style}
        h={cardHeight}
      >
        <div className={styles.container}>
          {image && (
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
          )}
          <div className={styles.infoContainer}>
            <Text
              style={{
                color: style?.color,
                fontWeight: style?.fontWeight,
                fontStyle: style?.fontStyle,
              }}
              fz={titleSize}
              fw="bold"
            >
              {title}
            </Text>
            {artist && (
              <Text
                style={{
                  color: style?.color,
                  fontWeight: style?.fontWeight,
                  fontStyle: style?.fontStyle,
                }}
                fz={detailsSize}
              >
                {artist}
              </Text>
            )}
            {duration && (
              <Text
                style={{
                  color: style?.color,
                  fontWeight: style?.fontWeight,
                  fontStyle: style?.fontStyle,
                }}
                fz={detailsSize}
              >
                {duration}
              </Text>
            )}
          </div>
          {(state || artistHasBeenPlayed) && (
            <div className={styles.iconWrapper}>
              {artistHasBeenPlayed && (
                <Tooltip
                  openDelay={200}
                  label={
                    artist
                      ? `A track by ${artist} has been played, but not this track`
                      : "A track by this artist has been played, but not this track"
                  }
                >
                  <IconCircleDashedCheck
                    size={iconSize}
                    color={parsedColor.value}
                  />
                </Tooltip>
              )}
              {state === SongState.CUED && (
                <Tooltip
                  openDelay={200}
                  label={`"${title}" is cued to play next`}
                >
                  <IconPlayerSkipForwardFilled
                    size={iconSize}
                    color={parsedColor.value}
                  />
                </Tooltip>
              )}
              {state === SongState.PLAYING && (
                <Tooltip
                  openDelay={200}
                  label={`"${title}" is currently playing`}
                >
                  <IconPlayerPlayFilled
                    size={iconSize}
                    color={parsedColor.value}
                  />
                </Tooltip>
              )}
              {state === SongState.PLAYED && (
                <Tooltip
                  openDelay={200}
                  label={`"${title}" has been previously played`}
                >
                  <IconCircleCheckFilled
                    size={iconSize}
                    color={parsedColor.value}
                  />
                </Tooltip>
              )}
              {state === SongState.SUBCLIP_PLAYED && (
                <Tooltip
                  openDelay={200}
                  label={`A related subclip has been played, but not this specific one`}
                >
                  <IconProgressCheck
                    size={iconSize}
                    color={rgba(resolvedColors.color, 0.5)}
                  />
                </Tooltip>
              )}
            </div>
          )}
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
