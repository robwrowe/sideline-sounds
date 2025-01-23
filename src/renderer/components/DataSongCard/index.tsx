import React, { useCallback } from "react";
import SongCard, { SongCardProps } from "../SongCard";
import { useAudioEngineContext } from "../../hooks";

export type DataSongCardProps = Pick<
  SongCardProps,
  "artist" | "title" | "duration" | "image"
> & {
  filePath: string;
};

export default function DataSongCard({
  filePath,
  artist,
  title,
  duration,
  image,
}: DataSongCardProps) {
  const audioEngine = useAudioEngineContext();

  const handleClick = useCallback(async () => {
    // play the song
    const fileBuffer: ArrayBuffer = await window.electron.ipcRenderer.invoke(
      "get-audio-file",
      filePath
    );

    const blob = new Blob([fileBuffer]);
    const file = new File([blob], "03 Open w Vamp.wav", {
      type: "audio/wav",
    });

    const audioBuffer = await audioEngine.loadAudio(file);
    audioEngine.play(audioBuffer);
  }, [audioEngine, filePath]);

  return (
    <SongCard
      artist={artist}
      title={title}
      duration={duration}
      image={image}
      onClick={handleClick}
    />
  );
}
