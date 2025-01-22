import React from "react";
import {
  Box,
  Burger,
  Group,
  Image,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import styles from "./index.module.scss";

import anAlbumCover from "../../assets/sample-album-cover.png";
import SongStatus from "./SongStatus";

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
        {/* Audio Status */}
        <SongStatus />
      </div>
    </>
  );
}
