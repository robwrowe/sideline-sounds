import { useEffect, useMemo, useState } from "react";
import {
  useComputedColorScheme,
  defaultVariantColorsResolver,
  useMantineTheme,
  parseThemeColor,
  rgba,
} from "@mantine/core";

import { SongState } from "../../types";

export type UseSongCardColorResolverProps = {
  /**
   * Allows the user to set a custom color.
   */
  color?: string;

  /**
   * Allows the button to be colored based on playback state
   */
  state?: SongState | null;
};

/**
 * Determines the color/theme to use for a <SongCard /> element
 */
export default function useSongCardColorResolver({
  color,
  state,
}: UseSongCardColorResolverProps) {
  const [isHovered, setIsHovered] = useState(false);

  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();

  // extract the color if provided
  // otherwise, default to app's preference
  const baseColorSchemeColor = colorScheme === "light" ? "gray" : "dark";
  const [themeColor, setThemeColor] = useState(baseColorSchemeColor);

  useEffect(() => {
    if (state) {
      switch (state) {
        case SongState.CUED:
          setThemeColor("cued");
          return;

        case SongState.PLAYING:
          setThemeColor("playing");
          return;

        case SongState.PLAYED:
          setThemeColor("played");
          return;
      }
    }

    if (color) {
      setThemeColor(color);
      return;
    }

    setThemeColor(baseColorSchemeColor);
  }, [baseColorSchemeColor, color, state]);

  const defaultResolvedColors = defaultVariantColorsResolver({
    color: themeColor,
    theme,
    variant:
      color || (state && state !== SongState.SUBCLIP_PLAYED)
        ? "light"
        : "default",
  });

  const defaultResolvedColorsBorder = defaultVariantColorsResolver({
    color: themeColor,
    theme,
    variant:
      color || (state && state !== SongState.SUBCLIP_PLAYED)
        ? "outline"
        : "default",
  });

  const parsedColor = parseThemeColor({
    color: themeColor,
    theme,
    colorScheme,
  });

  const parsedColorBorder = parseThemeColor({
    color:
      state && state === SongState.PLAYED ? baseColorSchemeColor : themeColor,
    theme,
    colorScheme,
  });

  const backgroundColor = useMemo(
    () =>
      defaultResolvedColors
        ? `${isHovered ? defaultResolvedColors.hover : defaultResolvedColors.background} !important`
        : undefined,
    [isHovered, defaultResolvedColors]
  );

  const textColor = useMemo(
    () =>
      defaultResolvedColors
        ? `${isHovered ? defaultResolvedColors?.hoverColor : defaultResolvedColors?.color} !important`
        : undefined,
    [isHovered, defaultResolvedColors]
  );

  const border = useMemo(
    () =>
      defaultResolvedColorsBorder
        ? `${defaultResolvedColorsBorder?.border} !important`
        : undefined,
    [defaultResolvedColorsBorder]
  );

  const style: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    border,
  };

  // if this is based on a state, adjust the border width
  if (state) {
    if (state !== SongState.SUBCLIP_PLAYED) {
      style["border"] =
        `calc(0.25rem * var(--mantine-scale)) solid var(${parsedColorBorder.variable}) !important`;
    }

    if (state === SongState.PLAYED || state === SongState.SUBCLIP_PLAYED) {
      style["color"] = rgba(
        colorScheme === "light" ? theme.black : theme.white,
        0.5
      );
    } else {
      style["color"] =
        `${colorScheme === "light" ? theme.black : theme.white} !important`;
    }
  }

  return {
    style,
    setIsHovered,
    parsedColor,
    resolvedColors: defaultResolvedColors,
  };
}
