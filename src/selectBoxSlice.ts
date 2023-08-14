import { createSlice } from "@reduxjs/toolkit";

export interface SelectBoxState {
  width: number;
  height: number;
  x: number | undefined;
  y: number | undefined;
  active?: boolean;
}

const initialState: SelectBoxState = {
  x: undefined,
  y: undefined,
  width: 0,
  height: 0,
  active: false,
};

export const slice = createSlice({
  name: "selectBox",
  initialState,
  reducers: {
    updateSelectBox: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateSelectBox } = slice.actions;

export default slice.reducer;
