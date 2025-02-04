import { MIME_TYPES } from "../constants";

export default function getAudioMimeType(filePath: string): string {
  const extension = filePath.split(".").pop()?.toLowerCase();

  return extension && MIME_TYPES[extension]
    ? MIME_TYPES[extension]
    : "audio/wav";
}
