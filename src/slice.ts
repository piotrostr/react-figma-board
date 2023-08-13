import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export interface State {
  count: number;
}

const initialState: State = {
  count: 0,
};

export const slice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
  },
});

export const { increment } = slice.actions;

export const selectCount = (state: RootState) => state.counter.count;

export default slice.reducer;
