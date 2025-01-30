import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Menu, Title } from "@mantine/core";
import { IconAdjustmentsCog } from "@tabler/icons-react";
import styles from "./index.module.scss";

import OutputDevices from "../OutputDevices";

export default function Footer() {
  const [showAdjustments, { toggle }] = useDisclosure(false);
  return (
    <div className={styles.container}>
      <div></div>
      <div>
        <Title order={6} className={styles.copyright}>
          Copyright © Rob W. Rowe
        </Title>
      </div>
      <div className={styles.parent}>
        <Menu withArrow>
          <Menu.Target>
            <ActionIcon
              className={styles.icon}
              size="sm"
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
      <OutputDevices opened={showAdjustments} onClose={toggle} />
    </div>
  );
}
