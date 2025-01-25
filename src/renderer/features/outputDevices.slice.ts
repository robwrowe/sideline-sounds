import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseInitialStateThunk, ThunkStatus } from "../../types";

type OutputDevice = {
  deviceId: string;
  kind: MediaDeviceKind;
  label: string;
  groupId: string;
};

interface InitialState extends BaseInitialStateThunk {
  available: OutputDevice[];
  preFadeListen: null | OutputDevice;
  programA: null | OutputDevice;
  programB: null | OutputDevice;
}

const initialState: InitialState = {
  status: ThunkStatus.IDLE,
  error: null,
  available: [],
  preFadeListen: null,
  programA: null,
  programB: null,
};

export const fetchOutputDevices = createAsyncThunk<OutputDevice[]>(
  "outputDevices/fetchOutputDevices",
  async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs: OutputDevice[] = deviceList
        .filter((dvc) => dvc.kind === "audiooutput")
        .map((dvc) => ({
          deviceId: dvc.deviceId,
          kind: dvc.kind,
          label: dvc.label || "Unknown Device",
          groupId: dvc.groupId,
        }));

      return audioOutputs;
    } catch (err) {
      console.error("Error fetching audio output devices", err);
      throw err;
    }
  }
);

const outputDevicesSlice = createSlice({
  name: "outputDevices",
  initialState,
  reducers: {
    setOutputPreFadeListen(
      state,
      { payload: data }: { payload: null | OutputDevice }
    ) {
      state.preFadeListen = data;
    },

    setOutputProgramA(
      state,
      { payload: data }: { payload: null | OutputDevice }
    ) {
      state.programA = data;
    },

    setOutputProgramB(
      state,
      { payload: data }: { payload: null | OutputDevice }
    ) {
      state.programB = data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOutputDevices.pending, (state) => {
      state.status = ThunkStatus.PENDING;
      state.error = null;
    });

    builder.addCase(
      fetchOutputDevices.fulfilled,
      (state, { payload: data }: { payload: OutputDevice[] }) => {
        state.status = ThunkStatus.SUCCEEDED;
        state.error = null;
        state.available = data;
      }
    );

    builder.addCase(fetchOutputDevices.rejected, (state, { error }) => {
      state.status = ThunkStatus.FAILED;
      state.error = error?.message || "Unknown error";
      state.available = [];
    });
  },
});

export const { setOutputPreFadeListen, setOutputProgramA, setOutputProgramB } =
  outputDevicesSlice.actions;

export default outputDevicesSlice.reducer;
