// store/repliesSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TopicReply } from "../types/topic"; // Adjust the import path as needed

interface RepliesState {
  replies: TopicReply[]; // Array of replies
}

const initialState: RepliesState = {
  replies: [],
};

const repliesSlice = createSlice({
  name: "replies",
  initialState,
  reducers: {
    addReply(state, action: PayloadAction<TopicReply>) {
      state.replies.push(action.payload);
    },
    updateReply(state, action: PayloadAction<TopicReply>) {
      const index = state.replies.findIndex(
        (reply) => reply.id === action.payload.id
      );
      if (index !== -1) {
        state.replies[index] = action.payload;
      }
    },
    deleteReply(state, action: PayloadAction<string>) {
      state.replies = state.replies.filter(
        (reply) => reply.id !== action.payload
      );
    },
    setReplies(state, action: PayloadAction<TopicReply[]>) {
      state.replies = action.payload;
    },
  },
});

export const { addReply, updateReply, deleteReply, setReplies } =
  repliesSlice.actions;
export default repliesSlice.reducer;
