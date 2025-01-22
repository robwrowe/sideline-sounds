import React from "react";
import { Burger, Group, Slider } from "@mantine/core";
import { IconVolume, IconVolume3 } from "@tabler/icons-react";
import styles from "./VolumeControl.module.scss";

export default function VolumeControls() {
  return (
    <div className={styles.parent}>
      <IconVolume3 size={24} />
      <Slider color="gray" w="8rem" />
      <IconVolume size={24} />
    </div>
  );
}
