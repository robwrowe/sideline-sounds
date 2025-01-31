import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseInitialStateThunk, ThunkStatus, Page } from "../../types";
import { dbPages as db } from "../repos";

interface InitialState extends BaseInitialStateThunk {
  pages: Page[];
}

const initialState: InitialState = {
  status: ThunkStatus.IDLE,
  error: null,
  pages: [],
};

export const fetchPages = createAsyncThunk<Page[]>(
  "pages/fetchPages",
  async () => {
    try {
      const data = db.getItems();

      return data;
    } catch (err) {
      console.error("Error fetching pages", err);
      throw err;
    }
  }
);

const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    addPage(state, { payload: data }: { payload: Page }) {
      state.pages.push(data);
    },

    removePage(state, { payload: id }: { payload: string }) {
      const arr = state.pages.filter((item) => item.id !== id);
      state.pages = arr;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPages.pending, (state) => {
      state.status = ThunkStatus.PENDING;
      state.error = null;
    });

    builder.addCase(
      fetchPages.fulfilled,
      (state, { payload: data }: { payload: Page[] }) => {
        state.status = ThunkStatus.SUCCEEDED;
        state.error = null;
        state.pages = data;
      }
    );

    builder.addCase(fetchPages.rejected, (state, { error }) => {
      state.status = ThunkStatus.FAILED;
      state.error = error?.message || "Unknown error";
    });
  },
});

export const { addPage, removePage } = pagesSlice.actions;
export default pagesSlice.reducer;
