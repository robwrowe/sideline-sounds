import React, { useCallback, useMemo } from "react";
import { Accordion, Button, Group, Input, Slider, Stack } from "@mantine/core";
import { IconBellSchool, IconVolume, IconVolume3 } from "@tabler/icons-react";
import styles from "./index.module.scss";

import { Output } from "../../../types";
import { useAppSelector, useAudioEngineContext } from "../../hooks";
import { SearchableSelect } from "../../components";

import OscillatorConfig from "./OscillatorConfig";

import {
  AudioStats,
  FrequencyVisualizer,
  VolumeMeter,
} from "../AnalyserVisualizer";

export type DestinationConfigProps = {
  output: Output;
};

// TODO: set values for device and volume based on local storage on mount
export default function DestinationConfig({ output }: DestinationConfigProps) {
  const { testOutput, setVolume, setDevice } = useAudioEngineContext();

  const availableDevices = useAppSelector(
    ({ outputDevices }) => outputDevices.available
  );
  const selectedDevice = useAppSelector(
    ({ audioEngine }) => audioEngine[output].deviceId
  );
  const volume = useAppSelector(
    ({ audioEngine }) => audioEngine[output].volume
  );

  const isDisabled = useMemo(
    () => !selectedDevice && output !== Output.PGM_A,
    [output, selectedDevice]
  );

  const setSelectedDevice = useCallback(
    (value: string | null) => {
      setDevice(output, value);
    },
    [output, setDevice]
  );

  // play audio on first click
  const handleClick = useCallback(async () => {
    // TODO: change this to the extra resources folder
    const filePath =
      "/Users/robwrowe/Repos/sideline-sounds/extraResources/chime-and-chomp-84419.mp3";

    testOutput(output, filePath);
  }, [output, testOutput]);

  return (
    <Stack gap="sm">
      <SearchableSelect
        data={availableDevices.map((dvc) => ({
          label: dvc.label,
          value: dvc?.deviceId || "",
        }))}
        value={selectedDevice}
        setValue={setSelectedDevice}
        label="Output"
        placeholder={
          availableDevices.find((item) => !item?.deviceId)?.label ??
          "Default Output Device"
        }
        searchPlaceholder="Search Devices"
      />
      <Input.Wrapper w="100%" label="Volume">
        <Group
          w="100%"
          justify="center"
          gap="sm"
          className={styles.volumeGroup}
        >
          <IconVolume3 size={24} />
          <Slider
            min={0}
            max={100}
            className={styles.volumeSlider}
            value={volume !== null ? volume * 100 : undefined}
            onChange={(value) => setVolume(output, value / 100)}
            label={(val) => `${Math.round(val)}%`}
            disabled={isDisabled}
          />
          <IconVolume size={24} />
        </Group>
      </Input.Wrapper>
      {/* TODO: add confirmation dialog if file is already playing */}
      <Button
        leftSection={<IconBellSchool size={24} />}
        variant="light"
        onClick={handleClick}
        disabled={isDisabled}
      >
        Play Test Sound
      </Button>

      <Accordion variant="contained" multiple defaultValue={["osc"]}>
        <Accordion.Item value="osc">
          <Accordion.Control disabled={isDisabled}>
            Oscillator
          </Accordion.Control>
          <Accordion.Panel>
            <OscillatorConfig output={output} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="visualizer">
          <Accordion.Control>Waveform</Accordion.Control>
          <Accordion.Panel>
            <Group>
              <FrequencyVisualizer output={output} height={100} width={800} />
              <VolumeMeter output={output} height={200} width={48} />
              <AudioStats output={output} />
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
