import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseInitialStateThunk, ThunkStatus, Bank } from "../../types";
import { dbBanks as db } from "../repos";

interface InitialState extends BaseInitialStateThunk {
  banks: Bank[];
}

const initialState: InitialState = {
  status: ThunkStatus.IDLE,
  error: null,
  banks: [],
};

export const fetchBanks = createAsyncThunk<Bank[]>(
  "banks/fetchBanks",
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
    addBank(state, { payload: data }: { payload: Bank }) {
      state.banks.push(data);
    },

    removeBank(state, { payload: id }: { payload: string }) {
      const arr = state.banks.filter((item) => item.id !== id);
      state.banks = arr;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBanks.pending, (state) => {
      state.status = ThunkStatus.PENDING;
      state.error = null;
    });

    builder.addCase(
      fetchBanks.fulfilled,
      (state, { payload: data }: { payload: Bank[] }) => {
        state.status = ThunkStatus.SUCCEEDED;
        state.error = null;
        state.banks = data;
      }
    );

    builder.addCase(fetchBanks.rejected, (state, { error }) => {
      state.status = ThunkStatus.FAILED;
      state.error = error?.message || "Unknown error";
    });
  },
});

export const { addBank, removeBank } = banksSlice.actions;
export default banksSlice.reducer;
