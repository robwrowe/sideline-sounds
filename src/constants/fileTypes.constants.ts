export const MIME_TYPES: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  flac: "audio/flac",
  ogg: "audio/ogg",
  aac: "audio/aac",
  m4a: "audio/mp4",
  opus: "audio/opus",
  webm: "audio/webm",
};

export const SUPPORTED_AUDIO_FILE_TYPES = Object.keys(MIME_TYPES).map((item) =>
  item.toUpperCase()
);
