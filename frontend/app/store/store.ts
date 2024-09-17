// app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import repliesReducer from "../slices/repliesSlice";
import topicsResucer from "../slices/topicsSlice";
import userReducer from "../slices/userSlice";
import singleTopicReducer from "../slices/singleTopicSlice";

const store = configureStore({
  reducer: {
    replies: repliesReducer,
    topics: topicsResucer,
    user: userReducer,
    singleTopic: singleTopicReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
