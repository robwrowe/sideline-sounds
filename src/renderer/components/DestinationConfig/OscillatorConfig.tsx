import React, { useCallback, useMemo, useState } from "react";
import { Button, Input, NumberInput, Stack } from "@mantine/core";

import { Output } from "../../../types";
import { useAppSelector, useAudioEngineContext } from "../../hooks";
import {
  AppFloatingIndicator,
  SearchableSelect,
  LogarithmicSlider,
} from "../../components";
import { toTitleCase } from "../../../utils";

const WAVEFORM_TYPES: OscillatorType[] = [
  "sine",
  "square",
  "sawtooth",
  "triangle",
];

export type OscillatorConfigProps = {
  output: Output;
};

export default function OscillatorConfig({ output }: OscillatorConfigProps) {
  const {
    setOscillatorDetune,
    setOscillatorFrequency,
    setOscillatorWaveform,
    startOscillator,
    stopOscillator,
  } = useAudioEngineContext();

  const oscillatorDetune = useAppSelector(
    ({ audioEngine }) => audioEngine[output].oscillator.detune
  );
  const oscillatorFrequency = useAppSelector(
    ({ audioEngine }) => audioEngine[output].oscillator.frequency
  );
  const oscillatorWaveform = useAppSelector(
    ({ audioEngine }) => audioEngine[output].oscillator.waveform
  );
  const oscillatorIsRunning = useAppSelector(
    ({ audioEngine }) => audioEngine[output].oscillator.isRunning
  );

  /**
   * Oscillator state
   */
  const [frequencyPreset, setFrequencyPreset] = useState<string | null>(null);
  const activeType = useMemo(
    () => WAVEFORM_TYPES.findIndex((item) => item === oscillatorWaveform),
    [oscillatorWaveform]
  );

  const handleSetWaveform = useCallback(
    (idx: number) => {
      const val = WAVEFORM_TYPES[idx];

      if (val) {
        setOscillatorWaveform(output, val);
      }
    },
    [output, setOscillatorWaveform]
  );

  return (
    <Stack>
      <Input.Wrapper label="Waveform Type">
        <AppFloatingIndicator
          data={WAVEFORM_TYPES.map((item) => toTitleCase(item))}
          active={activeType}
          setActive={handleSetWaveform}
        />
      </Input.Wrapper>

      <Input.Wrapper label="Frequency">
        <Stack gap="xs">
          <LogarithmicSlider
            value={oscillatorFrequency}
            setValue={(value) => {
              setOscillatorFrequency(output, value);
              setFrequencyPreset(null);
            }}
            min={20} // 20 Hz
            max={20000} // 20 kHz
            label={(val) =>
              val >= 1000 ? `${(val / 1000).toFixed(2)} kHz` : `${val} Hz`
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
                  {
                    label: "A4 (Standard Tuning)",
                    value: "440.00",
                  },
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
                  {
                    label: "Alpha Waves (Meditation)",
                    value: "10.00",
                  },
                  {
                    label: "Schumann Resonance (Earth’s Natural Frequency)",
                    value: "7.83",
                  },
                  {
                    label: "Telephone Dial Tone",
                    value: "480.00",
                  },
                  {
                    label: "FM Radio Pilot Tone",
                    value: "19.00",
                  },
                  {
                    label: "Ultrasound Start",
                    value: "18000.00",
                  },
                ],
              },
            ]}
            value={frequencyPreset}
            setValue={(value: string | null) => {
              if (value) {
                setOscillatorFrequency(output, Number(value));
              }

              setFrequencyPreset(value);
            }}
            placeholder="Preset Frequencies"
            searchPlaceholder="Search Frequencies"
          />
        </Stack>
      </Input.Wrapper>

      <Input.Wrapper label="Detune" w="100%">
        <Button.Group>
          <Button
            variant="default"
            onClick={() => setOscillatorDetune(output, oscillatorDetune + -12)}
          >
            -12 ¢
          </Button>
          <Button
            variant="default"
            onClick={() => setOscillatorDetune(output, oscillatorDetune + -1)}
          >
            -1 ¢
          </Button>
          <NumberInput
            value={oscillatorDetune}
            onChange={(val) => setOscillatorDetune(output, Number(val))}
            fw="bold"
            w="6rem"
          />
          <Button
            variant="default"
            onClick={() => setOscillatorDetune(output, oscillatorDetune + 1)}
          >
            +1 ¢
          </Button>
          <Button
            variant="default"
            onClick={() => setOscillatorDetune(output, oscillatorDetune + 12)}
          >
            +12 ¢
          </Button>
        </Button.Group>
      </Input.Wrapper>

      <Button
        variant="default"
        onClick={() => {
          if (oscillatorIsRunning) {
            stopOscillator(output);
          } else {
            // TODO: if there's an audio file playing, warn the user
            startOscillator(output);
          }
        }}
      >{`${oscillatorIsRunning ? "Stop" : "Start"} Oscillator`}</Button>
    </Stack>
  );
}
