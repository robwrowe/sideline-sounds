import { Slider } from "@mantine/core";
import React, { useCallback, useMemo } from "react";

export type LogarithmicSliderProps = {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  label?: (value: number) => React.ReactNode;
};

// convert to log scale
const toLog = (val: number) => Math.log10(val);
const fromLog = (val: number) => Math.pow(10, val);

export default function LogarithmicSlider({
  value,
  setValue,
  min,
  max,
  label,
}: LogarithmicSliderProps) {
  // convert values to log scale
  const logMin = toLog(min);
  const logMax = toLog(max);

  // convert slider (0 - 100 range) to log scale
  const handleChange = useCallback(
    (sliderValue: number) => {
      const logValue = logMin + (logMax - logMin) * (sliderValue / 100);

      setValue(fromLog(logValue));
    },
    [logMax, logMin, setValue]
  );

  // convert frequency back to slider range
  const sliderValue = useMemo(
    () => ((toLog(value) - logMin) / (logMax - logMin)) * 100,
    [logMax, logMin, value]
  );

  return (
    <Slider
      value={sliderValue}
      onChange={handleChange}
      min={0}
      max={100}
      step={1}
      labelAlwaysOn
      label={(val) =>
        label
          ? label(Math.round(fromLog(logMin + (logMax - logMin) * (val / 100))))
          : Math.round(fromLog(logMin + (logMax - logMin) * (val / 100)))
      }
    />
  );
}
