import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Topic } from "../types/topic";

interface SingleTopicState {
  topic: Topic;
  replies: string[];
}

const initialState: SingleTopicState = {
  topic: {
    id: "",
    title: "",
    body: "",
    is_closed: false,
    created_by: "",
  },
  replies: [],
};

const singleTopicSlice = createSlice({
  name: "singleTopic",
  initialState,
  reducers: {
    setSingleTopicInStore(state, action: PayloadAction<Topic>) {
      state.topic = action.payload;
    },
    setTopicRepliesInStore(state, action: PayloadAction<string[]>) {
      state.replies = action.payload;
    },
    addSingleTopicReplyToStore(state, action: PayloadAction<string>) {
      state.replies.push(action.payload);
    },
  },
});

export const {
  setSingleTopicInStore,
  setTopicRepliesInStore,
  addSingleTopicReplyToStore,
} = singleTopicSlice.actions;
export default singleTopicSlice.reducer;
