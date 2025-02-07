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
    color: "highlight",
  };

  return (
    <div className={styles.parent} style={{ cursor: "inherit" }}>
      <TextInput
        readOnly
        defaultValue={value ?? undefined}
        label={label}
        tabIndex={-1}
        styles={{
          input: {
            cursor: "inherit",
          },
        }}
        rightSection={
          onClickClear && (
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
