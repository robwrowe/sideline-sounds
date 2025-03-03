// DestinationNode.tsx
import React, { useEffect, useState } from "react";
import { useAudioEngineContext } from "../../hooks";
import { Output, PlaybackChannelStatus } from "../../../types";
import styles from "./AudioVisualizer.module.scss";

interface DestinationNodeProps {
  output: Output; // e.g., "PGM_A", "PGM_B", "PFL"
}

const DestinationNode: React.FC<DestinationNodeProps> = ({ output }) => {
  const { audioEngine } = useAudioEngineContext();
  const [status, setStatus] = useState<PlaybackChannelStatus | null>(null);

  // Subscribe to playback updates
  useEffect(() => {
    audioEngine.setOnChangeUpdate(output, (newStatus) => setStatus(newStatus));
    setStatus(audioEngine.getStatus(output)); // Initial status

    return () => {
      audioEngine.setOnChangeUpdate(output, null); // Cleanup
    };
  }, [audioEngine, output]);

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    audioEngine.setVolume(output, newVolume);
  };

  if (!status) return <div>Loading...</div>;

  return (
    <div className={styles.destinationNode}>
      <h3>{output} Destination</h3>
      <div className={styles.deviceInfo}>
        <span>Device: {status.deviceId || "Default"}</span>
      </div>
      <div className={styles.volumeControl}>
        <label>Volume: {(status.volume * 100).toFixed(0)}%</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={status.volume}
          onChange={handleVolumeChange}
        />
      </div>
      <div className={styles.playbackStatus}>
        <span>Status: {status.isPlaying ? "Playing" : "Stopped"}</span>
        {status.current.duration && (
          <span>
            {status.current.elapsed?.toFixed(1)} /{" "}
            {status.current.duration.toFixed(1)}s
          </span>
        )}
      </div>
    </div>
  );
};

export default DestinationNode;
