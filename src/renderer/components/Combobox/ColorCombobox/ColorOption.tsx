import React from "react";
import { Group, ColorSwatch, Text } from "@mantine/core";
import { ColorItem } from "../../../../types";
import { toTitleCase } from "../../../../utils";

export default function ColorOption({
  label,
  value,
}: Pick<ColorItem, "label" | "value">) {
  return (
    <Group gap="xs">
      <ColorSwatch color={`var(--mantine-color-${value}-5)`} size="1rem" />
      <Text>{label}</Text>
      <Text size="xs" opacity={0.6}>
        {toTitleCase(value)}
      </Text>
    </Group>
  );
}
