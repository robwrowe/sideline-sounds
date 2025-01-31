import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseInitialStateThunk, ThunkStatus, Show } from "../../types";
import { dbShows as db } from "../repos";

interface InitialState extends BaseInitialStateThunk {
  shows: Show[];
}

const initialState: InitialState = {
  status: ThunkStatus.IDLE,
  error: null,
  shows: [],
};

export const fetchShows = createAsyncThunk<Show[]>(
  "shows/fetchShows",
  async () => {
    try {
      const data = db.getItems();

      return data;
    } catch (err) {
      console.error("Error fetching shows", err);
      throw err;
    }
  }
);

const showsSlice = createSlice({
  name: "shows",
  initialState,
  reducers: {
    addShow(state, { payload: data }: { payload: Show }) {
      state.shows.push(data);
    },

    removeShow(state, { payload: id }: { payload: string }) {
      const arr = state.shows.filter((item) => item.id !== id);
      state.shows = arr;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchShows.pending, (state) => {
      state.status = ThunkStatus.PENDING;
      state.error = null;
    });

    builder.addCase(
      fetchShows.fulfilled,
      (state, { payload: data }: { payload: Show[] }) => {
        state.status = ThunkStatus.SUCCEEDED;
        state.error = null;
        state.shows = data;
      }
    );

    builder.addCase(fetchShows.rejected, (state, { error }) => {
      state.status = ThunkStatus.FAILED;
      state.error = error?.message || "Unknown error";
    });
  },
});

export const { addShow, removeShow } = showsSlice.actions;
export default showsSlice.reducer;
