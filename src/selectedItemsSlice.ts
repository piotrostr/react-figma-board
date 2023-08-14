import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SelectedItemsState = {
  selectedItems: Array<string>;
};

export type SelectedItemsPayload = {
  items: Array<string>;
};

const initialState: SelectedItemsState = {
  selectedItems: [],
};

export const slice = createSlice({
  name: "selectedItems",
  initialState,
  reducers: {
    selectItems: (state, action: PayloadAction<SelectedItemsPayload>) => {
      state.selectedItems.push(...action.payload.items);
    },
    deselectItems: (state, action: PayloadAction<SelectedItemsPayload>) => {
      // TODO(piotrostr@) not sure if this is right
      state.selectedItems = state.selectedItems.filter(
        (item) => !action.payload.items.includes(item),
      );
    },
    clearSelectedItems: (state) => {
      state.selectedItems = [];
    },
  },
});

export const { selectItems, deselectItems, clearSelectedItems } = slice.actions;

export default slice.reducer;
