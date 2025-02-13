import React from "react";
import { Box, Divider, Popover, Text } from "@mantine/core";
import styles from "./index.module.scss";

import { ContextMenuItem } from "../../../types";

import ContextMenuButton from "./ContextMenuButton";

export type ContextMenuProps = {
  opened: boolean;
  onChange: (value: boolean) => void;
  onClose: () => void;
  items: ContextMenuItem[];
  x: number;
  y: number;
};

export default function ContextMenu({
  opened,
  onChange,
  onClose,
  items,
  x,
  y,
}: ContextMenuProps) {
  // determine if icon spacing is needed
  const hasIcon = items.some(
    (item) => (item.type === undefined || item.type === "button") && item.Icon
  );

  return (
    <Popover opened={opened} onChange={onChange} styles={{}}>
      <Popover.Target>
        <Box
          className={styles.target}
          style={{
            top: y,
            left: x,
          }}
          onClick={onClose}
        />
      </Popover.Target>

      <Popover.Dropdown p="0">
        <div className={styles.dropdownContainer}>
          {items.map((item, idx) => {
            if (item.type === "divider") {
              return (
                <Divider
                  key={`divider-${idx}`}
                  className={styles.divider}
                  color={item.color}
                />
              );
            }

            if (item.type === "label") {
              return (
                <Text
                  key={`label-${item.label}`}
                  className={styles.label}
                  c={item.color || "dimmed"}
                  size="sm"
                >
                  {item.label}
                </Text>
              );
            }

            return (
              <ContextMenuButton
                key={`${item.label}-${idx}`}
                hasIconPlaceholder={hasIcon}
                {...item}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
              />
            );
          })}
        </div>
        {/* <Stack gap="4px" p="2px 0px" m={0}></Stack> */}
      </Popover.Dropdown>
    </Popover>
  );
}
