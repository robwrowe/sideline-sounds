import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  ComboboxItem,
  Divider,
  Drawer,
  Select,
  Stack,
} from "@mantine/core";
import styles from "./index.module.scss";

import {
  useAppDispatch,
  useAppSelector,
  useAudioEngineContext,
} from "../../hooks";
import { fetchOutputDevices } from "../../features";

export type OutputDevicesProps = {
  opened: boolean;
  onClose: () => void;
};

// TODO: add test sound
export default function OutputDevices({ opened, onClose }: OutputDevicesProps) {
  const { audioEngine } = useAudioEngineContext();
  const dispatch = useAppDispatch();
  const devices = useAppSelector(
    ({ outputDevices }) => outputDevices.available
  );

  const [value, setValue] = useState<string | null>(null);
  const [options, setOptions] = useState<ComboboxItem[]>([]);

  // get the devices connected
  const handleFetchDevices = useCallback(async () => {
    try {
      await dispatch(fetchOutputDevices());
    } catch (err) {
      console.error("Error fetching audio output devices", err);
    }
  }, [dispatch]);

  useEffect(() => {
    handleFetchDevices();
  }, [handleFetchDevices]);

  // update the dropdown options
  useEffect(() => {
    setOptions(
      devices.map((dvc) => ({
        value: dvc.deviceId,
        label: dvc.label,
      }))
    );
  }, [devices]);

  // on load, set the last known device
  useEffect(() => {
    const value = localStorage.getItem("audio-engine:destination:programA");

    if (value) {
      setValue(JSON.parse(value));
    }
  }, []);

  const handleChange = useCallback((value: string | null) => {
    setValue(value);
    localStorage.setItem(
      "audio-engine:destination:programA",
      JSON.stringify(value)
    );
  }, []);

  // when the user is ready, stop all outputs and change destination
  const handleSwitch = useCallback(() => {
    audioEngine.stop();
    audioEngine.setDestinationProgramA(value);
  }, [audioEngine, value]);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      withCloseButton={false}
    >
      <Divider label="Output Devices" labelPosition="left" />
      <Stack>
        <Select
          label="Program A"
          data={options}
          value={value}
          onChange={handleChange}
        />
        <Button onClick={handleFetchDevices}>Re-Fetch Devices</Button>
        <Button onClick={handleSwitch}>Update Destination</Button>
      </Stack>
    </Drawer>
  );
}
