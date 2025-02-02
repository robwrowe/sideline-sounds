import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseInitialStateThunk, ThunkStatus, Bank } from "../../types";
import { dbBanks as db } from "../repos";
import { RootState } from "../store";

interface InitialState extends BaseInitialStateThunk {
  banks: Bank[];
  activeBankID: string | null;
}

const initialState: InitialState = {
  status: ThunkStatus.IDLE,
  error: null,
  banks: [],
  activeBankID: null,
};

type FetchBanksFilters = {
  showID?: string;
  pageID?: string;
};

export const fetchBanks = createAsyncThunk<
  Bank[],
  FetchBanksFilters | undefined
>("banks/fetchBanks", async (filters = {}, thunkAPI) => {
  try {
    const data = await db.getItems();

    if (filters) {
      const showID = filters?.showID;
      const pageID = filters?.pageID;
      const state = thunkAPI.getState() as RootState;
      const availablePageIDs: string[] = [];

      for (const page of state.pages.pages) {
        if (page.showID === showID) {
          availablePageIDs.push(page.id);
        }
      }

      return data.filter((item) => {
        if (pageID && item.pageID === pageID) {
          return true;
        }

        if (availablePageIDs.indexOf(item.pageID) >= 0) {
          return true;
        }

        return false;
      });
    }

    return data;
  } catch (err) {
    console.error("Error fetching banks", err);
    throw err;
  }
});

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

    setActiveBankID(state, { payload }: { payload: string | null }) {
      state.activeBankID = payload;
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

export const { addBank, removeBank, setActiveBankID } = banksSlice.actions;
export default banksSlice.reducer;
