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
    closeTopicInStore(state, action: PayloadAction<string>) {
      const index = state.topics.findIndex(
        (topic) => topic.id === action.payload
      );
      if (index!== -1) {
        state.topics[index].is_closed = true;
      }
    }
  },
});

export const {
  setTopicsInStore,
  addTopicInStore,
  deleteTopicFromStore,
  closeTopicInStore,
} = topicsSlice.actions;
export default topicsSlice.reducer;
