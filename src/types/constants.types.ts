import { MantineColor } from "@mantine/core";

export type ColorItem = {
  value: MantineColor;
  label: string;
  group: "default" | "user";
};
