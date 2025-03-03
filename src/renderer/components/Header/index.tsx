import React, { useCallback } from "react";
import { Burger } from "@mantine/core";
import styles from "./index.module.scss";

import AudioControls from "../AudioControls";
import SongStatus from "./SongStatus";
import { useAppSelector } from "../../hooks";
// import VolumeControls from "./VolumeControl";

export type HeaderProps = {
  burgerOpened: boolean;
  onBurgerClick: () => void;
};

export default function Header({ burgerOpened, onBurgerClick }: HeaderProps) {
  const isPlaying = useAppSelector(
    ({ audioEngine }) => audioEngine.pgmA.isPlaying
  );

  const currentRemaining = useAppSelector(
    ({ audioEngine }) => audioEngine.pgmA.current.remaining
  );

  const crossfadeActive = useAppSelector(
    ({ audioEngine }) => audioEngine.pgmA.crossfadeActive
  );

  const handleClickBackwards = useCallback(() => {
    try {
      window.audio.sendAudioEngine("reRack");
    } catch (err) {
      console.error("Error restarting file", err);
    }
  }, []);

  // start playing the song in the context
  const handleClickPlay = useCallback(async () => {
    try {
      window.audio.sendAudioEngine("resume");
    } catch (err) {
      console.error("Error resuming file", err);
    }
  }, []);

  const handleClickPause = useCallback(async () => {
    try {
      window.audio.sendAudioEngine("pause");
    } catch (err) {
      console.error("Error pausing file", err);
    }
  }, []);

  const handleClickStop = useCallback(async () => {
    try {
      window.audio.sendAudioEngine("stop");
    } catch (err) {
      console.error("Error pausing file", err);
    }
  }, []);

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
        <AudioControls
          isPlaying={isPlaying ?? undefined}
          hasMedia={currentRemaining && currentRemaining > 0 ? true : false}
          crossfadeActive={crossfadeActive ?? undefined}
          onClickBackwards={handleClickBackwards}
          onClickPlay={handleClickPlay}
          onClickPause={handleClickPause}
          onClickStop={handleClickStop}
        />
        {/* Audio Status */}
        <div style={{ justifySelf: "center" }}>
          <SongStatus />
        </div>
        {/* Audio Volume */}
        <div />
        {/* <VolumeControls /> */}
      </div>
    </>
  );
}
