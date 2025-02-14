import React from "react";
import { ActionIcon, ActionIconProps, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import styles from "./index.module.scss";

export type InOutPointProps = {
  value: string | null;
  label?: string;
  onClickClear?: () => void;
};

export default function InOutPointLabel({
  label,
  value,
  onClickClear,
}: InOutPointProps) {
  const actionIconProps: ActionIconProps = {
    size: "md",
    variant: "transparent",
    color: "accent",
  };

  return (
    <div className={styles.parent} style={{ cursor: "inherit" }}>
      <TextInput
        readOnly
        value={value ?? ""}
        label={label}
        tabIndex={-1}
        style={{ width: "100%" }}
        styles={{
          input: {
            cursor: "inherit",
          },
        }}
        rightSection={
          onClickClear &&
          value && (
            <ActionIcon
              {...actionIconProps}
              onClick={onClickClear}
              disabled={value === null}
            >
              <IconX />
            </ActionIcon>
          )
        }
      />
    </div>
  );
}
