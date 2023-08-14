import { configureStore } from "@reduxjs/toolkit";
import { slice as counter } from "./slice";
import { slice as selectBox } from "./selectBoxSlice";
import { slice as boundingRects } from "./boundingRectsSlice";
import { slice as delta } from "./deltaSlice";
import { slice as selectedItems } from "./selectedItemsSlice";
import { slice as drag } from "./dragSlice";
import { slice as coordinates } from "./coordinatesSlice";

export const store = configureStore({
  reducer: {
    counter: counter.reducer,
    selectBox: selectBox.reducer,
    boundingRects: boundingRects.reducer,
    delta: delta.reducer,
    selectedItems: selectedItems.reducer,
    drag: drag.reducer,
    coordinates: coordinates.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
