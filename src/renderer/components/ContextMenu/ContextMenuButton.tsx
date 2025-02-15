import React from "react";
import { Box, Text, Button, useMantineColorScheme } from "@mantine/core";
import styles from "./ContextMenuButton.module.scss";

import { ContextMenuButton } from "../../../types";

export default function ContextMenuButton({
  color,
  label,
  onClick,
  Icon,
  hasIconPlaceholder = true,
  disabled,
}: ContextMenuButton) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Button
      className={styles.button}
      onClick={onClick}
      color={color ?? (colorScheme === "light" ? "black" : "gray")}
      variant="subtle"
      justify="flex-start"
      size="compact-sm"
      leftSection={
        Icon ? (
          <Icon size={14} />
        ) : hasIconPlaceholder ? (
          <Box w={14} />
        ) : undefined
      }
      disabled={disabled}
    >
      <Text className={styles.text} size="sm">
        {label}
      </Text>
    </Button>
  );
}
