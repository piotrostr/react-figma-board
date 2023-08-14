import { createSlice } from "@reduxjs/toolkit";

export type SelectBoxState = HTMLDivElement[];

const initialState: SelectBoxState = [];

export const slice = createSlice({
  name: "draggableRefs",
  initialState,
  reducers: {
    updateDraggableRefs: (state, action) => {
      if (state.includes(action.payload)) {
        return state;
      }
      return [...state, action.payload];
    },
  },
});

export const { updateDraggableRefs } = slice.actions;

export default slice.reducer;
