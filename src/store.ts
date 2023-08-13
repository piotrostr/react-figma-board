import { configureStore } from "@reduxjs/toolkit";
import { slice as counter } from "./slice";

export const store = configureStore({
  reducer: {
    counter: counter.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
