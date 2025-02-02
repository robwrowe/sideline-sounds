import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseInitialStateThunk, ThunkStatus, Page } from "../../types";
import { dbPages as db } from "../repos";

interface InitialState extends BaseInitialStateThunk {
  pages: Page[];
  activePageID: string | null;
}

const initialState: InitialState = {
  status: ThunkStatus.IDLE,
  error: null,
  pages: [],
  activePageID: null,
};

type FetchPagesFilters = {
  showID?: string;
};

export const fetchPages = createAsyncThunk<
  Page[],
  FetchPagesFilters | undefined
>("pages/fetchPages", async (filters = {}) => {
  try {
    const data = await db.getItems();

    if (filters) {
      return data.filter((item) => item.showID === filters.showID);
    }

    return data;
  } catch (err) {
    console.error("Error fetching pages", err);
    throw err;
  }
});

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

    setActivePageID(state, { payload }: { payload: string | null }) {
      state.activePageID = payload;
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

export const { addPage, removePage, setActivePageID } = pagesSlice.actions;
export default pagesSlice.reducer;
