// RepliesContainer.tsx
"use client";

import { useEffect, useState } from "react";
import { TopicReply } from "../types/topic";
import RepliesList from "./RepliesList";
import ReplyInput from "./ReplyInput";
import { setReplies } from "../slices/repliesSlice"; // Adjust the import path if necessary
import { useAppDispatch, useAppSelector } from "../store/hooks";

interface RepliesContainerProps {
  topicId: string;
}

const RepliesContainer = ({ topicId }: RepliesContainerProps) => {
  const dispatch = useAppDispatch(); // Use typed dispatch
  const {replies} = useAppSelector((state) => state.replies); // Use typed selector
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const handleSendReply = (content: string) => {
    // Get the token from local storage
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the token using atob
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the payload
      console.log("Decoded Token:", decodedToken);
    } else {
      console.error("No token found in local storage.");
    }

    // Placeholder for send reply logic
    console.log("Reply sent:", content);
  };

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        // Replace with your actual API call
        const fetchedReplies: TopicReply[] = [
          {
            id: "1",
            topicId: topicId,
            senderId: "user_id_1",
            sentTime: new Date(),
            content: "This is the first reply.",
            sender: {
              id: "user_id_1",
              name: "User One",
              email: "userone@example.com",
            },
            topReactions: ["👍", "❤️"],
            reactionCount: 2,
            userReacted: {
              id: "reaction_id_1",
              sourceId: "user_id_1",
              reaction: "👍",
              type: "like",
              userId: "user_id_1",
              reactedAt: new Date(),
            },
            isReacted: true,
          },
          {
            id: "2",
            topicId: topicId,
            senderId: "user_id_2",
            sentTime: new Date(),
            content: "This is the second reply.",
            sender: {
              id: "user_id_2",
              name: "User Two",
              email: "usertwo@example.com",
            },
            topReactions: [],
            reactionCount: 0,
            userReacted: {
              id: "reaction_id_2",
              sourceId: "user_id_2",
              reaction: "",
              type: "",
              userId: "user_id_2",
              reactedAt: new Date(),
            },
            isReacted: false,
          },
        ];
        dispatch(setReplies(fetchedReplies)); // Dispatch action to set replies in the store
      } catch (error) {
        setError("Failed to fetch replies.");
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [topicId, dispatch]); // Include dispatch in the dependency array

  if (loading) {
    return <p className="text-navy">Loading replies...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="flex flex-col h-full">
      <RepliesList replies={replies} loggedInUserId="user_id_2" />
      <ReplyInput onSend={handleSendReply} />
    </div>
  );
};

export default RepliesContainer;
