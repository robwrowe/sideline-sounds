import React from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";
import {
  Center,
  Group,
  Table,
  TableThProps,
  Text,
  UnstyledButton,
} from "@mantine/core";
import styles from "./TableTh.module.scss";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
  tableThProps?: TableThProps;
}

export default function TableTh({
  children,
  reversed,
  sorted,
  onSort,
  tableThProps,
}: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={styles.th} {...tableThProps}>
      <UnstyledButton onClick={onSort} className={styles.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={styles.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
