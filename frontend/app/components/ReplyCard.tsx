// ReplyCard.tsx
"use client";

import React, { useState } from "react";
import ReplyActions from "./ReplyActions"; // Import the new ReplyActions component
import { TopicReply } from "../types/topic";
import UserReaction from "./UserReaction";

interface ReplyCardProps {
  reply: TopicReply;
  loggedInUserId: string; // Add prop for logged-in user's ID
}

const ReplyCard = ({
  reply,
  loggedInUserId,
}: ReplyCardProps) => {
  
  
  const [isHovered, setIsHovered] = useState(false); // State to manage hover
  const [userReaction, setUserReaction] = useState(reply.user_reacted?.reaction || ""); // Track user reaction
  const isSender = reply.sender_id === loggedInUserId; // Check if the logged-in user is the sender
  
  const handleReaction = (reaction: string) => {
    setUserReaction(reaction);
    // Here you would also call a function to handle the reaction in the backend
  };

  
  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-md relative hover:bg-gray-50 transition duration-200 ease-in-out ${
        isSender ? "border-l-4 border-blue-500" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)} // Set hover state on enter
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <h4
        className={`font-bold text-sm mb-1 ${
          isSender ? "text-blue-600" : "text-gray-800"
        }`}
      >
        {reply.sender.name}
      </h4>
      <p className={`text-gray-800 mb-2 ${isSender ? "font-semibold" : ""}`}>
        {reply.content}
      </p>

      <div className="absolute left-2 -bottom-2 flex items-center space-x-2">
        <UserReaction
          userReaction={userReaction}
          onReactionChange={handleReaction}
        />
      </div>

      <div className="mt-2 flex items-center">
        {reply.reaction_count > 0 && (
          <span className=" text-blue-600 rounded-full py-1 text-xs flex items-center">
            {reply.reaction_count} reaction{reply.reaction_count > 1 ? "s" : ""}
            <div className="flex space-x-1 ml-2">
              {reply.top_reactions?.map((reaction, index) => (
                <span
                  key={index}
                  className="bg-gray-200 rounded-full px-2 py-1 text-xs"
                >
                  {reaction}
                </span>
              ))}
            </div>
          </span>
        )}
      </div>

      <span className="absolute bottom-2 right-2 text-gray-400 text-xs">
        {new Date(reply.sent_time).toLocaleString()}
        
      </span>
      {isHovered && <ReplyActions isSender={isSender} />}
    </div>
  );
};

export default ReplyCard;
