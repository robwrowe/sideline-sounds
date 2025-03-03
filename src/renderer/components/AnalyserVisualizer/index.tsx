// AudioStats.tsx
import React, { useState, useEffect } from "react";
import { useAudio } from "./AudioContext";

interface AudioStatsProps {
  output: string;
}

const AudioStats: React.FC<AudioStatsProps> = ({ output }) => {
  const [stats, setStats] = useState({
    peak: 0,
    sampleRate: 0,
    clipping: false,
  });
  const audioEngine = useAudio();

  useEffect(() => {
    const channel = audioEngine.channels[output];
    if (!channel) return;

    const updateStats = () => {
      const timeData = channel.getTimeDomainData();
      const peak = Math.max(...timeData) / 255; // Normalize to 0-1
      const clipping = peak > 0.9; // Arbitrary threshold for clipping
      setStats({
        peak,
        sampleRate: channel.sampleRate,
        clipping,
      });
      requestAnimationFrame(updateStats);
    };

    updateStats();
  }, [audioEngine, output]);

  return (
    <div>
      <p>Peak Level: {(stats.peak * 100).toFixed(2)}%</p>
      <p>Sample Rate: {stats.sampleRate} Hz</p>
      <p>Clipping: {stats.clipping ? "Yes" : "No"}</p>
    </div>
  );
};

export default AudioStats;
