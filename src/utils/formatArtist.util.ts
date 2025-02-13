import { AudioFile } from "../types";
import formatSecondsToTime from "./formatSecondsToTime.util";

export default function formatArtist({
  artist,
  album,
  duration,
}: Pick<Partial<AudioFile>, "artist" | "album" | "duration">) {
  const bottomRow: string[] = [];

  if (artist) {
    bottomRow.push(artist);
  }

  if (album) {
    if (bottomRow.length > 0) {
      bottomRow.push("•");
    }

    bottomRow.push(album);
  }

  if (duration !== undefined && duration !== null) {
    bottomRow.push(`(${formatSecondsToTime(duration)})`);
  }

  return bottomRow.join(" ");
}
