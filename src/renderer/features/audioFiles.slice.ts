import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseInitialStateThunk, ThunkStatus, AudioFile } from "../../types";
import { dbAudioFiles as db } from "../repos";

interface InitialState extends BaseInitialStateThunk {
  audioFiles: AudioFile[];
}

const initialState: InitialState = {
  status: ThunkStatus.IDLE,
  error: null,
  audioFiles: [],
};

export const fetchAudioFiles = createAsyncThunk<AudioFile[]>(
  "audioFiles/fetchAudioFiles",
  async () => {
    try {
      const data = await db.getItems();

      data.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });

      return data;
    } catch (err) {
      console.error("Error fetching audioFiles", err);
      throw err;
    }
  }
);

const audioFilesSlice = createSlice({
  name: "audioFiles",
  initialState,
  reducers: {
    addAudioFile(state, { payload: data }: { payload: AudioFile }) {
      state.audioFiles.push(data);
    },

    removeAudioFile(state, { payload: id }: { payload: string }) {
      const arr = state.audioFiles.filter((item) => item.id !== id);
      state.audioFiles = arr;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAudioFiles.pending, (state) => {
      state.status = ThunkStatus.PENDING;
      state.error = null;
    });

    builder.addCase(
      fetchAudioFiles.fulfilled,
      (state, { payload: data }: { payload: AudioFile[] }) => {
        state.status = ThunkStatus.SUCCEEDED;
        state.error = null;
        state.audioFiles = data;
      }
    );

    builder.addCase(fetchAudioFiles.rejected, (state, { error }) => {
      state.status = ThunkStatus.FAILED;
      state.error = error?.message || "Unknown error";
    });
  },
});

export const { addAudioFile, removeAudioFile } = audioFilesSlice.actions;
export default audioFilesSlice.reducer;
