import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Topic, TopicReply } from "../types/topic";

interface SingleTopicState {
  topic: Topic;
  replies: TopicReply[];
}

const initialState: SingleTopicState = {
  topic: {
    id: "",
    title: "",
    body: "",
    is_closed: false,
    created_by: "",
    created_by_data: {
      id: "",
      name: "",
      email: "",
    },
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
    setTopicRepliesInStore(state, action: PayloadAction<TopicReply[]>) {
      state.replies = action.payload;
    },
    addSingleTopicReplyToStore(state, action: PayloadAction<TopicReply>) {
      state.replies.push(action.payload);
    },
    updateSingleTopicReplyToStore(state, action: PayloadAction<TopicReply>) {
      const index = state.replies.findIndex(
        (reply) => reply.id === action.payload.id
      );
      if (index !== -1) {
        state.replies[index] = action.payload;
      }
    },
  },
});

export const {
  setSingleTopicInStore,
  setTopicRepliesInStore,
  addSingleTopicReplyToStore,
  updateSingleTopicReplyToStore,
} = singleTopicSlice.actions;
export default singleTopicSlice.reducer;
