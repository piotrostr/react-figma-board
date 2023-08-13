import { createSlice } from "@reduxjs/toolkit";

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

export default slice.reducer;
