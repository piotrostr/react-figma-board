import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface BoundingRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type BoundingRectsState = {
  boundingRects: Array<{
    id: string;
    boundingRect: BoundingRect;
  }>;
};

export type BoundingRectsPayload = {
  id: string;
  boundingRect: BoundingRect;
};

const initialState: BoundingRectsState = {
  boundingRects: [],
};

export const slice = createSlice({
  name: "boundingRects",
  initialState,
  reducers: {
    updateBoundingRects: (
      state,
      action: PayloadAction<BoundingRectsPayload>,
    ) => {
      //if any of the ids match return
      if (state.boundingRects.some((item) => item.id === action.payload.id)) {
        return state;
      }
      return {
        boundingRects: [...state.boundingRects, action.payload],
      };
    },
  },
});

export const { updateBoundingRects } = slice.actions;

export default slice.reducer;
