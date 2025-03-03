import React, { useState, useEffect } from "react";
import { Stack, Text } from "@mantine/core";
import { useAudioEngineContext } from "../../hooks";
import { Output } from "../../../types";

type AudioStatsProps = {
  output: Output;
};

// TODO: clear the values after a timeout
// TODO: reduce sample interval (maybe?)

export default function AudioStats({ output }: AudioStatsProps) {
  const [peak, setPeak] = useState(0);
  const [sampleRate, setSampleRate] = useState(0);
  const [clipping, setClipping] = useState(false);

  const { audioEngine } = useAudioEngineContext();

  useEffect(() => {
    let rafId: number | null = null;
    const sampleRate = audioEngine.sampleRate;

    if (!sampleRate) return;

    setSampleRate(sampleRate);

    const updateStats = () => {
      try {
        const timeData = audioEngine.getTimeDomainData(output);
        if (!timeData) throw new Error("Missing time domain data");

        const newPeak = Math.max(...timeData) / 255; // normalize 0-1
        const newClipping = peak > 0.9; // arbitrary threshold for clipping

        setPeak(newPeak);
        setClipping(newClipping);
      } catch (err) {
        console.warn("Error getting audio stats", output, err);
      } finally {
        rafId = requestAnimationFrame(updateStats);
      }
    };

    updateStats();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [audioEngine, output, peak]);

  return (
    <Stack>
      <Text>Peak Level: {(peak * 100).toFixed(2)}%</Text>
      <Text>Sample Rate: {sampleRate} Hz</Text>
      <Text>Clipping: {clipping ? "Yes" : "No"}</Text>
    </Stack>
  );
}
