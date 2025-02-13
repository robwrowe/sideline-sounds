import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseInitialStateThunk, ThunkStatus, ContentButton } from "../../types";
import { dbContentButtons as db } from "../repos";

interface InitialState extends BaseInitialStateThunk {
  contentButtons: ContentButton[];
}

const initialState: InitialState = {
  status: ThunkStatus.IDLE,
  error: null,
  contentButtons: [],
};

export const fetchContentButtons = createAsyncThunk<ContentButton[]>(
  "banks/fetchContentButtons",
  async () => {
    try {
      const data = await db.getItems();

      return data;
    } catch (err) {
      console.error("Error fetching banks", err);
      throw err;
    }
  }
);

const contentButtonsSlice = createSlice({
  name: "contentButtons",
  initialState,
  reducers: {
    addContentButton(state, { payload: data }: { payload: ContentButton }) {
      state.contentButtons.push(data);
    },

    removeContentButton(
      state,
      {
        payload: { bankID, buttonNumber },
      }: { payload: Pick<ContentButton, "bankID" | "buttonNumber"> }
    ) {
      const arr = state.contentButtons.filter(
        (item) => item.bankID !== bankID && item.buttonNumber !== buttonNumber
      );
      state.contentButtons = arr;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContentButtons.pending, (state) => {
      state.status = ThunkStatus.PENDING;
      state.error = null;
    });

    builder.addCase(
      fetchContentButtons.fulfilled,
      (state, { payload: data }: { payload: ContentButton[] }) => {
        state.status = ThunkStatus.SUCCEEDED;
        state.error = null;
        state.contentButtons = data;
      }
    );

    builder.addCase(fetchContentButtons.rejected, (state, { error }) => {
      state.status = ThunkStatus.FAILED;
      state.error = error?.message || "Unknown error";
    });
  },
});

export const { addContentButton, removeContentButton } =
  contentButtonsSlice.actions;
export default contentButtonsSlice.reducer;
