import React, { useCallback, useEffect, useState } from "react";
import { Slider } from "@mantine/core";
import { IconVolume, IconVolume3 } from "@tabler/icons-react";
import styles from "./VolumeControl.module.scss";
import { useAudioEngineContext } from "../../hooks";

export default function VolumeControls() {
  const { audioEngine } = useAudioEngineContext();
  const [volumeState, setVolumeState] = useState(audioEngine.volume);

  // when local volume changes, update the class
  useEffect(() => {
    audioEngine.volume = volumeState;
  }, [audioEngine, volumeState]);

  // on load, setup volume
  useEffect(() => {
    // set values from local storage
    const volume = localStorage.getItem("audio-engine:volume");

    if (volume) {
      setVolumeState(JSON.parse(volume) as number);
    }
  }, []);

  const handleChange = useCallback((value: number) => {
    const newVolume = value / 100;
    setVolumeState(newVolume);
    localStorage.setItem("audio-engine:volume", JSON.stringify(newVolume));
  }, []);

  return (
    <div className={styles.parent}>
      <IconVolume3
        size={24}
        className={styles.icon}
        onClick={() => handleChange(0)}
      />
      <Slider
        value={volumeState * 100}
        color="gray"
        w="8rem"
        onChange={handleChange}
        label={(value) => `${Math.round(value)}%`}
      />
      <IconVolume
        size={24}
        className={styles.icon}
        onClick={() => handleChange(100)}
      />
    </div>
  );
}
