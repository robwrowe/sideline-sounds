import React, { useCallback } from "react";
import { Slider } from "@mantine/core";
import { IconVolume, IconVolume3 } from "@tabler/icons-react";
import styles from "./VolumeControl.module.scss";
import { useAudioEngineContext } from "../../hooks";

export default function VolumeControls() {
  const { audioEngine, volume } = useAudioEngineContext();

  const handleChange = useCallback(
    (value: number) => {
      audioEngine.volume = value / 100;
    },
    [audioEngine]
  );

  return (
    <div className={styles.parent}>
      <IconVolume3 size={24} />
      <Slider
        defaultValue={volume * 100}
        color="gray"
        w="8rem"
        onChangeEnd={handleChange}
        label={(value) => `${value}%`}
      />
      <IconVolume size={24} />
    </div>
  );
}
