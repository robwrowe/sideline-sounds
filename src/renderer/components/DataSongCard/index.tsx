import React, { useCallback } from "react";
import SongCard, { SongCardProps } from "../SongCard";
import { useAudioEngineContext } from "../../hooks";
import { getFileName, getAudioMimeType } from "../../../utils";

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
  const { audioEngine } = useAudioEngineContext();

  const handleClick = useCallback(async () => {
    // extract the file name from the path
    const fileName = getFileName(filePath) || "No Name Found";

    const fileBuffer = await window.electron.audio.fileBuffer(filePath);

    const blob = new Blob([fileBuffer]);

    const file = new File([blob], fileName, {
      type: getAudioMimeType(filePath),
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
