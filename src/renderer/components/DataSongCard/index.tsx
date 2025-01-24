import React, { useCallback } from "react";
import SongCard, { SongCardProps } from "../SongCard";
import { useAudioEngineContext } from "../../hooks";

export type DataSongCardProps = Pick<
  SongCardProps,
  "artist" | "title" | "duration" | "image"
> & {
  filePath: string;
};

function getFileName(path: string): string | null {
  const regex = /([^/\\]+)(?=\.[^/\\]+$)/;
  const match = path.match(regex);
  return match ? match[0] : null;
}

export default function DataSongCard({
  filePath,
  artist,
  title,
  duration,
  image,
}: DataSongCardProps) {
  const { audioEngine } = useAudioEngineContext();

  const handleClick = useCallback(async () => {
    // extract the file name from the path
    const fileName = getFileName(filePath) || "No Name Found";

    // play the song
    const fileBuffer: ArrayBuffer = await window.electron.ipcRenderer.invoke(
      "get-audio-file",
      filePath
    );

    const blob = new Blob([fileBuffer]);

    const file = new File([blob], fileName, {
      type: "audio/wav",
    });

    const audioBuffer = await audioEngine.loadAudio(file);
    audioEngine.play(audioBuffer, { title, artist, image });
  }, [artist, audioEngine, filePath, image, title]);

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
