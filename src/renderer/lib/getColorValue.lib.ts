// lib/getColorValue.ts
import { MantineTheme, parseThemeColor } from "@mantine/core";

type ColorScheme = "light" | "dark";

// Known special Mantine color variables and their default hex values
const specialColors: Record<string, Record<ColorScheme, string>> = {
  "dark-light": {
    light: "#C1C2C5", // Light variant of dark in light mode
    dark: "#5c5f66", // Light variant of dark in dark mode
  },
};

export default function getColorValue(
  color: string,
  theme: MantineTheme,
  colorScheme: ColorScheme
): string {
  // Handle CSS variables (e.g., "var(--mantine-color-gray-2)", "var(--mantine-color-dark-light)")
  if (color.startsWith("var(")) {
    const match = color.match(/var\(--mantine-color-([a-z]+)-([a-z0-9-]+)\)/i);
    console.log("****", "match", match, color);

    if (match) {
      const [, colorName, suffix] = match;

      // Handle numeric shades (e.g., "gray-2")
      if (/^\d+$/.test(suffix)) {
        const shade = parseInt(suffix, 10);
        return theme.colors[colorName][shade];
      }

      // Handle special suffixes (e.g., "dark-light")
      const specialKey = `${colorName}-${suffix}`;
      if (specialColors[specialKey] && specialColors[specialKey][colorScheme]) {
        return specialColors[specialKey][colorScheme];
      }

      // Fallback: Log and return a default if unrecognized
      console.warn(`Unrecognized Mantine color variable: ${color}`);
      return theme.colors[colorName][
        typeof theme.primaryShade === "number"
          ? theme.primaryShade
          : theme.primaryShade[colorScheme] || 0
      ];
    }

    console.warn(`Invalid CSS variable format: ${color}`);
    return "#000000"; // Default fallback
  }

  // Handle regular color strings (e.g., "gray", "gray.2", "#e0e0e0")
  const parsed = parseThemeColor({ color, theme });

  if (parsed.isThemeColor && parsed.shade !== undefined) {
    // Theme color with a specific shade, e.g., "gray.2"
    return theme.colors[parsed.color][parsed.shade];
  } else if (parsed.isThemeColor) {
    // Theme color without a shade, e.g., "gray"
    const shade =
      typeof theme.primaryShade === "number"
        ? theme.primaryShade
        : theme.primaryShade[colorScheme];
    return theme.colors[parsed.color][shade];
  } else {
    // Direct color, e.g., "#e0e0e0"
    return parsed.value;
  }
}
