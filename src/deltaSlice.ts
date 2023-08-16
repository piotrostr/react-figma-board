import { createSlice } from "@reduxjs/toolkit";

export interface DeltaState {
  x: number;
  y: number;
}

const initialState: DeltaState = {
  x: 0,
  y: 0,
};

export const slice = createSlice({
  name: "delta",
  initialState,
  reducers: {
    setDelta: (_, action) => {
      return { ...action.payload };
    },
  },
});

export const { setDelta } = slice.actions;

export default slice.reducer;
