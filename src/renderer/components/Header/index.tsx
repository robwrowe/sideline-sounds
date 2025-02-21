import React, { useCallback } from "react";
import { Burger } from "@mantine/core";
import styles from "./index.module.scss";

import AudioControls from "../AudioControls";
import SongStatus from "./SongStatus";
import VolumeControls from "./VolumeControl";
import { useAudioEngineContext } from "../../hooks";

export type HeaderProps = {
  burgerOpened: boolean;
  onBurgerClick: () => void;
};

export default function Header({ burgerOpened, onBurgerClick }: HeaderProps) {
  const { audioEngine } = useAudioEngineContext();

  const handleClickBackwards = useCallback(() => {
    try {
      // audioEngine.reRack();
    } catch (err) {
      console.error("Error restarting file", err);
    }
  }, [audioEngine]);

  // start playing the song in the context
  const handleClickPlay = useCallback(async () => {
    try {
      // audioEngine.resume();
    } catch (err) {
      console.error("Error resuming file", err);
    }
  }, [audioEngine]);

  const handleClickPause = useCallback(async () => {
    try {
      // audioEngine.pause();
    } catch (err) {
      console.error("Error pausing file", err);
    }
  }, [audioEngine]);

  const handleClickStop = useCallback(async () => {
    try {
      // audioEngine.stop();
    } catch (err) {
      console.error("Error pausing file", err);
    }
  }, [audioEngine]);

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
          // isPlaying={isPlaying}
          // hasMedia={hasMedia}
          // crossfadeActive={crossfadeActive}
          onClickBackwards={handleClickBackwards}
          onClickPlay={handleClickPlay}
          onClickPause={handleClickPause}
          onClickStop={handleClickStop}
        />
        {/* Audio Status */}
        <SongStatus />
        {/* Audio Volume */}
        <VolumeControls />
      </div>
    </>
  );
}
