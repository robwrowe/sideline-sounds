import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AudioEngineState, Output } from "../../types";

type State = Record<Output, AudioEngineState>;

const initialState: State = {
  [Output.PGM_A]: {
    current: {
      elapsed: null,
      remaining: null,
      duration: null,
      metadata: null,
    },
    next: {
      elapsed: null,
      remaining: null,
      duration: null,
      metadata: null,
    },
    cued: { metadata: null },
    crossfadeDuration: null,
    crossfadeActive: null,
    isPlaying: null,
    volume: null,
    deviceId: null,
    oscillator: {
      isRunning: false,
      waveform: null,
      frequency: 440,
      detune: 0,
    },
  },
  [Output.PGM_B]: {
    current: {
      elapsed: null,
      remaining: null,
      duration: null,
      metadata: null,
    },
    next: {
      elapsed: null,
      remaining: null,
      duration: null,
      metadata: null,
    },
    cued: { metadata: null },
    crossfadeDuration: null,
    crossfadeActive: null,
    isPlaying: null,
    volume: null,
    deviceId: null,
    oscillator: {
      isRunning: false,
      waveform: null,
      frequency: 440,
      detune: 0,
    },
  },
  [Output.PFL]: {
    current: {
      elapsed: null,
      remaining: null,
      duration: null,
      metadata: null,
    },
    next: {
      elapsed: null,
      remaining: null,
      duration: null,
      metadata: null,
    },
    cued: { metadata: null },
    crossfadeDuration: null,
    crossfadeActive: null,
    isPlaying: null,
    volume: null,
    deviceId: null,
    oscillator: {
      isRunning: false,
      waveform: null,
      frequency: 440,
      detune: 0,
    },
  },
};

const audioEngineSlice = createSlice({
  name: "audioEngine",
  initialState,
  reducers: {
    setState(state, { payload }: PayloadAction<State>) {
      Object.assign(state, payload);
    },

    setOutput(
      state,
      { payload }: PayloadAction<{ output: Output; value: AudioEngineState }>
    ) {
      const { output, value } = payload;
      state[output] = value;
    },

    setVolume(
      state,
      { payload }: PayloadAction<{ output: Output; value: number }>
    ) {
      const { output, value } = payload;
      state[output].volume = value;
    },

    setCrossfadeDuration(
      state,
      { payload }: PayloadAction<{ output: Output; value: number }>
    ) {
      const { output, value } = payload;
      state[output].crossfadeDuration = value;
    },

    setDeviceId(
      state,
      { payload }: PayloadAction<{ output: Output; value: string | null }>
    ) {
      const { output, value } = payload;
      state[output].deviceId = value;
    },
  },
});

export const {
  setOutput,
  setVolume,
  setCrossfadeDuration,
  setDeviceId,
  setState: setAudioEngineState,
} = audioEngineSlice.actions;

// export action types for the main process
export type AudioEngineActions =
  | ReturnType<typeof setOutput>
  | ReturnType<typeof setVolume>
  | ReturnType<typeof setCrossfadeDuration>
  | ReturnType<typeof setDeviceId>
  | ReturnType<typeof setAudioEngineState>;

export default audioEngineSlice.reducer;
