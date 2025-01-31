import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseInitialStateThunk, ThunkStatus, ContentButton } from "../../types";
import { dbContentButtons as db } from "../repos";

interface InitialState extends BaseInitialStateThunk {
  banks: ContentButton[];
}

const initialState: InitialState = {
  status: ThunkStatus.IDLE,
  error: null,
  banks: [],
};

export const fetchContentButtons = createAsyncThunk<ContentButton[]>(
  "banks/fetchContentButtons",
  async () => {
    try {
      const data = db.getItems();

      return data;
    } catch (err) {
      console.error("Error fetching banks", err);
      throw err;
    }
  }
);

const banksSlice = createSlice({
  name: "banks",
  initialState,
  reducers: {
    addContentButton(state, { payload: data }: { payload: ContentButton }) {
      state.banks.push(data);
    },

    removeContentButton(
      state,
      {
        payload: { bankID, buttonNumber },
      }: { payload: Pick<ContentButton, "bankID" | "buttonNumber"> }
    ) {
      const arr = state.banks.filter(
        (item) => item.bankID !== bankID && item.buttonNumber !== buttonNumber
      );
      state.banks = arr;
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
        state.banks = data;
      }
    );

    builder.addCase(fetchContentButtons.rejected, (state, { error }) => {
      state.status = ThunkStatus.FAILED;
      state.error = error?.message || "Unknown error";
    });
  },
});

export const { addContentButton, removeContentButton } = banksSlice.actions;
export default banksSlice.reducer;
