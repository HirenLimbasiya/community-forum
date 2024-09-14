// app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../slices/counterSlice"
import repliesReducer from "../slices/repliesSlice"
const store = configureStore({
  reducer: {
    counter: counterReducer,
    replies: repliesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
