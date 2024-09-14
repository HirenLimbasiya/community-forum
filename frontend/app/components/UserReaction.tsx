"use client";

import React, { useState, useRef } from "react";
import useOutsideClick from "../hooks/useOutsideClick";

const allowedEmojis = ["❤️", "👍", "😂", "😍", "😯", "😥", "🥳"];

interface UserReactionProps {
  userReaction: string; // Current user's reaction
  onReactionChange: (reaction: string) => void; // Callback for changing the reaction
}

const UserReaction = ({
  userReaction,
  onReactionChange,
}: UserReactionProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const reactionRef = useRef<HTMLDivElement>(null);

  useOutsideClick(reactionRef, () => setShowReactions(false)); // Close popover on outside click

  const handleReaction = (reaction: string) => {
    // Toggle reaction selection
    if (userReaction === reaction) {
      onReactionChange(""); 
    } else {
      onReactionChange(reaction); // Select new reaction
    }
    setShowReactions(false); // Close reactions popover
  };

  return (
    <div className="relative" ref={reactionRef}>
      <span
        className={`cursor-pointer bg-gray-200 rounded-full px-2 py-1 text-xs ${
          userReaction ? "text-blue-600" : "text-gray-500"
        } hover:text-blue-600 transition duration-200`}
        onClick={() => setShowReactions(!showReactions)}
      >
        {userReaction || "React"}
      </span>
      {showReactions && (
        <div className="absolute left-0 -mt-16 bg-white shadow-lg rounded-lg p-2 z-10 w-auto max-w-xs border border-gray-300 flex space-x-2">
          {allowedEmojis.map((reaction) => (
            <div
              key={reaction}
              className={`p-1 cursor-pointer hover:bg-gray-200 rounded-lg flex items-center transition duration-200 ${
                userReaction === reaction ? "bg-blue-100" : ""
              }`}
              onClick={() => handleReaction(reaction)}
            >
              <span className="mr-1">{reaction}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReaction;
