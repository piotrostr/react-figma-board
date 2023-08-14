import { createSlice } from "@reduxjs/toolkit";

export interface DragState {
  active: boolean;
}

const initialState: DragState = {
  active: false,
};

export const slice = createSlice({
  name: "drag",
  initialState,
  reducers: {
    setDragActive: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { setDragActive } = slice.actions;

export default slice.reducer;
