// RepliesList.tsx
"use client";

import { TopicReply } from "../types/topic";
import ReplyCard from "./ReplyCard"; // Adjust the import path

interface RepliesListProps {
  replies: TopicReply[];
  loggedInUserId: string; // Add logged-in user's ID
}

const RepliesList = ({ replies, loggedInUserId }: RepliesListProps) => {
  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          loggedInUserId={loggedInUserId} // Pass down the user's ID
        />
      ))}
    </div>
  );
};

export default RepliesList;
