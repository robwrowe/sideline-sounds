import { useState, useEffect } from "react";
import classNames from "classnames";
import { useComputedColorScheme } from "@mantine/core";

export default function useDarkModeClassNames(styles: CSSModule) {
  const colorScheme = useComputedColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (colorScheme === "light") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  }, [colorScheme]);

  return classNames({
    [styles.dark]: isDarkMode,
    [styles.light]: !isDarkMode,
  });
}
