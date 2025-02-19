import React, { useState } from "react";
import {
  Button,
  Card,
  Fieldset,
  Group,
  Input,
  NumberInput,
  Slider,
  Stack,
  Title,
} from "@mantine/core";
import { IconBellSchool, IconVolume, IconVolume3 } from "@tabler/icons-react";
import styles from "./index.module.scss";

import { useAppSelector } from "../../../hooks";
import {
  AppFloatingIndicator,
  SearchableSelect,
  LogarithmicSlider,
} from "../../../components";

const WAVEFORM_TYPES = ["Sine", "Square", "Sawtooth", "Triangle"];
export default function DestinationsView() {
  const data = useAppSelector(({ outputDevices }) => outputDevices.available);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [frequency, setFrequency] = useState(440);
  const [frequencyPreset, setFrequencyPreset] = useState<string | null>(null);
  const [detune, setDetune] = useState(1200);
  const [activeType, setActiveType] = useState(0);

  return (
    <Stack>
      <Title order={3} hiddenFrom="sm">
        Destinations
      </Title>
      <Card withBorder>
        <Stack gap="sm">
          <SearchableSelect
            data={data.map((dvc) => ({
              label: dvc.label,
              value: dvc?.deviceId || "",
            }))}
            value={selectedDevice}
            setValue={setSelectedDevice}
            label="Program A"
            placeholder={
              data.find((item) => !item?.deviceId)?.label ??
              "Default Output Device"
            }
          />
          <Input.Wrapper w="100%" label="Volume">
            <Group
              w="100%"
              justify="center"
              gap="sm"
              className={styles.volumeGroup}
            >
              <IconVolume3 size={24} />
              <Slider min={0} max={100} className={styles.volumeSlider} />
              <IconVolume size={24} />
            </Group>
          </Input.Wrapper>
          <Button leftSection={<IconBellSchool size={24} />} variant="light">
            Play Test Sound
          </Button>

          <Fieldset legend="Oscillator" variant="filled">
            <Stack>
              <Input.Wrapper label="Waveform Type">
                <AppFloatingIndicator
                  data={WAVEFORM_TYPES}
                  active={activeType}
                  setActive={setActiveType}
                />
              </Input.Wrapper>

              <Input.Wrapper label="Frequency">
                <Stack gap="xs">
                  <LogarithmicSlider
                    value={frequency}
                    setValue={(value) => {
                      setFrequency(value);
                      setFrequencyPreset(null);
                    }}
                    min={20} // 20 Hz
                    max={20000} // 20 kHz
                    label={(val) =>
                      val >= 1000
                        ? `${(val / 1000).toFixed(2)} kHz`
                        : `${val} Hz`
                    }
                  />
                  <SearchableSelect
                    data={[
                      {
                        group: "Musical Notes",
                        items: [
                          { label: "C2", value: "65.41" },
                          { label: "C3", value: "130.81" },
                          { label: "C4 (Middle C)", value: "261.63" },
                          { label: "A4 (Standard Tuning)", value: "440.00" },
                          { label: "C5", value: "523.25" },
                          { label: "A5", value: "880.00" },
                          { label: "C6", value: "1046.50" },
                        ],
                      },
                      {
                        group: "Harmonic & Subharmonic",
                        items: [
                          { label: "Sub-bass", value: "40.00" },
                          { label: "Bass", value: "80.00" },
                          { label: "Mid", value: "500.00" },
                          { label: "Upper Mid", value: "2000.00" },
                          { label: "Presence", value: "4000.00" },
                          { label: "Air", value: "10000.00" },
                        ],
                      },
                      {
                        group: "Scientific & Sound Design",
                        items: [
                          {
                            label: "Theta Waves (Deep Relaxation)",
                            value: "4.00",
                          },
                          { label: "Alpha Waves (Meditation)", value: "10.00" },
                          {
                            label:
                              "Schumann Resonance (Earth’s Natural Frequency)",
                            value: "7.83",
                          },
                          { label: "Telephone Dial Tone", value: "480.00" },
                          { label: "FM Radio Pilot Tone", value: "19.00" },
                          { label: "Ultrasound Start", value: "18000.00" },
                        ],
                      },
                    ]}
                    value={frequencyPreset}
                    setValue={(value: string | null) => {
                      if (value) {
                        setFrequency(Number(value));
                      }

                      setFrequencyPreset(value);
                    }}
                    placeholder="Preset Frequencies"
                  />
                </Stack>
              </Input.Wrapper>

              <Input.Wrapper label="Detune" w="100%">
                <Button.Group>
                  <Button
                    variant="default"
                    onClick={() => setDetune((prev) => (prev += -10))}
                  >
                    -10 ¢
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setDetune((prev) => (prev += -1))}
                  >
                    -1 ¢
                  </Button>
                  <NumberInput
                    value={detune}
                    onChange={(val) => setDetune(Number(val))}
                    fw="bold"
                    w="6rem"
                  />
                  <Button
                    variant="default"
                    onClick={() => setDetune((prev) => (prev += 1))}
                  >
                    +1 ¢
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setDetune((prev) => (prev += 10))}
                  >
                    +10 ¢
                  </Button>
                </Button.Group>
              </Input.Wrapper>

              <Button variant="default">Start Oscillator</Button>
            </Stack>
          </Fieldset>
        </Stack>
      </Card>
    </Stack>
  );
}
