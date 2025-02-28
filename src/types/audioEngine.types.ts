import { AudioFile } from "./content.types";
import { ContentButton } from "./contentButtons.types";

export type AudioEnginePlayMetadata = {
  crossfadeDuration?: number;
  audioFile?: AudioFile;
  subclipID?: string;
  button?: ContentButton;
};

export type AudioEnginePlayPgmOpts = AudioEnginePlayMetadata & {
  bufferB?: AudioBuffer;
};

export type AudioEnginePlaySfxOpts = AudioEnginePlayMetadata & {
  bufferB?: AudioBuffer;
  volumeDelta?: number;
};

export enum Output {
  PGM_A = "pgmA",
  PGM_B = "pgmB",
  PFL = "pfl",
}

export type PlaybackSourceState = {
  elapsed: number | null;
  remaining: number | null;
  duration: number | null;
  metadata: AudioEnginePlayMetadata | null;
};

export type PlaybackSourceOscillator = {
  isRunning: boolean;
  frequency: number;
  waveform: OscillatorType | null;
  detune: number;
};

export type PlaybackChannelStatus = {
  current: PlaybackSourceState;
  next: PlaybackSourceState;
  cued: Pick<PlaybackSourceState, "metadata">;

  oscillator: PlaybackSourceOscillator;

  crossfadeDuration: number;
  crossfadeActive: boolean;

  isPlaying: boolean;

  volume: number;
  deviceId: string | null;
};

export type AudioEngineState = Omit<
  PlaybackChannelStatus,
  "crossfadeDuration" | "crossfadeActive" | "isPlaying" | "volume"
> & {
  crossfadeDuration: PlaybackChannelStatus["crossfadeDuration"] | null;
  crossfadeActive: PlaybackChannelStatus["crossfadeActive"] | null;
  isPlaying: PlaybackChannelStatus["isPlaying"] | null;
  volume: PlaybackChannelStatus["volume"] | null;
};
