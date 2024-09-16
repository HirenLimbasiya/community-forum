import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Topic } from "../types/topic";

interface TopicState {
  topics: Topic[];
}

const initialState: TopicState = {
  topics: [],
};

const topicsSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {
    setTopicsInStore(state, action: PayloadAction<Topic[]>) {
      state.topics = action.payload;
    },
    addTopicInStore(state, action: PayloadAction<Topic>) {
      state.topics.push(action.payload);
    },
    deleteTopicFromStore(state, action: PayloadAction<string>) {
      state.topics = state.topics.filter(
        (topic) => topic.id !== action.payload
      );
    },
  },
});

export const { setTopicsInStore, addTopicInStore, deleteTopicFromStore } =
  topicsSlice.actions;
export default topicsSlice.reducer;
