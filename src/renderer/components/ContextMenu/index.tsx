import React from "react";
import styles from "./index.module.scss";

export type ContextMenuItem = {
  label: string;
  onClick: () => void;
};

export type ContextMenuProps = {
  items: ContextMenuItem[];
  x: number;
  y: number;
  onClose: () => void;
};

export default function ContextMenu({
  items,
  x,
  y,
  onClose,
}: ContextMenuProps) {
  return (
    <ul
      style={{ top: y, left: x }}
      onClick={onClose}
      className={styles.contextMenu}
    >
      {items.map((item, idx) => (
        <li key={`${item.label}-${idx}`} onClick={item.onClick}>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
