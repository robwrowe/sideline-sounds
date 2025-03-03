import React, { useRef, useEffect } from "react";
import {
  defaultVariantColorsResolver,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";

import { getColorValue } from "../../lib";
import { useAudioEngineContext } from "../../hooks";
import { Output } from "../../../types";

type VolumeMeterProps = {
  output: Output;
  width: number;
  height: number;
};

// TODO: add support for multiple channels
// TODO: change to a standard "meter" look
export default function VolumeMeter({
  output,
  width,
  height,
}: VolumeMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioEngine } = useAudioEngineContext();

  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const color = colorScheme === "light" ? "gray" : "dark";

  // Get the resolved styles for the button variant
  const resolvedStyles = defaultVariantColorsResolver({
    color,
    theme,
    variant: "light",
  });

  // Resolve the background color from CSS variable to hex
  const backgroundColor = getColorValue(
    resolvedStyles.background || color, // Use background if available, fallback to base color
    theme,
    colorScheme
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number | null = null; // Variable to store the latest animation frame ID

    const draw = () => {
      try {
        const dataArray = audioEngine.getTimeDomainData(output);
        if (!dataArray) throw new Error("Missing time domain data");

        let rms = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const sample = (dataArray[i] - 128) / 128;
          rms += sample * sample;
        }

        rms = Math.sqrt(rms / dataArray.length);
        const volumeHeight = rms * height;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = volumeHeight > height * 0.8 ? "red" : "green";
        ctx.fillRect(0, height - volumeHeight, width, volumeHeight);
      } catch (err) {
        console.warn("Error drawing volume meter", output, err);
      } finally {
        rafId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [audioEngine, backgroundColor, height, output, width]);

  return <canvas ref={canvasRef} height={height} width={width} />;
}
