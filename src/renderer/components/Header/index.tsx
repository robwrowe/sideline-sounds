import React from "react";
import { Burger } from "@mantine/core";
import styles from "./index.module.scss";

import AudioControls from "./AudioControls";
import SongStatus from "./SongStatus";
import VolumeControls from "./VolumeControl";

export type HeaderProps = {
  burgerOpened: boolean;
  onBurgerClick: () => void;
};

export default function Header({ burgerOpened, onBurgerClick }: HeaderProps) {
  return (
    <>
      <Burger
        opened={burgerOpened}
        onClick={onBurgerClick}
        hiddenFrom="md"
        size="sm"
      />
      <div className={styles.parent}>
        {/* Audio Controls */}
        <AudioControls />
        {/* Audio Status */}
        <SongStatus />
        {/* Audio Volume */}
        <VolumeControls />
      </div>
    </>
  );
}
