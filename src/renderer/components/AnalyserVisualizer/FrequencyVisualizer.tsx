import React, { useRef, useEffect } from "react";
import {
  defaultVariantColorsResolver,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core";

import { getColorValue } from "../../lib";
import { useAudioEngineContext } from "../../hooks";
import { Output } from "../../../types";

type FrequencyVisualizerProps = {
  output: Output;
  width: number;
  height: number;
};

export default function FrequencyVisualizer({
  output,
  width,
  height,
}: FrequencyVisualizerProps) {
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

  const tickColor = getColorValue(
    resolvedStyles.color || color, // Use background if available, fallback to base color
    theme,
    colorScheme
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sampleRate = audioEngine.sampleRate;
    if (!sampleRate) return;

    let rafId: number | null = null; // Variable to store the latest animation frame ID

    // Define key frequencies for tick marks (in Hz)
    const tickFrequencies = [1000, 5000, 10000, 20000]; // Adjust as needed
    const nyquist = sampleRate / 2 > 20000 ? 20000 : sampleRate / 2; // Max frequency (e.g., 22050 Hz for 44100 sampleRate)

    const draw = () => {
      try {
        const dataArray = audioEngine.getFrequencyData(output);
        if (!dataArray) throw new Error("Missing frequency data");

        const bufferLength = dataArray.length;
        const barWidth = width / bufferLength;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // draw tick marks
        ctx.strokeStyle = tickColor;
        ctx.setLineDash([5, 5]); // [dash length, gap length] in pixels
        ctx.lineWidth = 1;
        // TODO: update font to match theme
        ctx.font = "12px Arial";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.textAlign = "center";

        for (const freq of tickFrequencies) {
          if (freq <= nyquist) {
            // Map frequency to x-position
            const x = (freq / nyquist) * width;
            // Draw tick mark (short vertical line from bottom)
            ctx.beginPath();
            ctx.moveTo(x, height);
            ctx.lineTo(x, 20); // 10px tall tick
            ctx.stroke();

            // Draw frequency label above the tick
            ctx.fillText(`${freq} Hz`, x, 15);
          }
        }

        // draw freq
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height;
          const frequency = (i * sampleRate) / (bufferLength * 2);
          const hue = (frequency / (sampleRate / 2)) * 360;

          ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
          ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
        }
      } catch (err) {
        console.warn("Error visualizing frequency", output, err);
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
  }, [audioEngine, backgroundColor, tickColor, height, output, width]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
