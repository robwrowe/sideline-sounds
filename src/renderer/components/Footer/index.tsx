import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Menu } from "@mantine/core";
import { IconAdjustmentsCog } from "@tabler/icons-react";
import styles from "./index.module.scss";

export default function Footer() {
  const [, { toggle }] = useDisclosure(false);
  return (
    <>
      <div className={styles.parent}>
        <Menu withArrow>
          <Menu.Target>
            <ActionIcon
              className={styles.icon}
              size="xs"
              variant="transparent"
              c="gray"
            >
              <IconAdjustmentsCog size={20} />
            </ActionIcon>
          </Menu.Target>
          {/*  */}

          <Menu.Dropdown>
            <Menu.Label>Audio Settings</Menu.Label>
            <Menu.Item onClick={toggle}>Destinations</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  );
}
