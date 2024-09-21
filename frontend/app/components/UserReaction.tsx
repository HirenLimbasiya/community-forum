"use client";

import { useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import useOutsideClick from "../hooks/useOutsideClick";

const allowedEmojis = ["❤️", "👍", "😂", "😍", "😯", "😥", "🥳"];

interface UserReactionProps {
  onReactionChange: (reaction: string) => void; // Callback for changing the reaction
  selectedReaction?: string; // Selected emoji
}

const UserReaction = ({
  onReactionChange,
  selectedReaction,
}: UserReactionProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const reactionRef = useRef<HTMLDivElement>(null);

  useOutsideClick(reactionRef, () => setShowReactions(false)); // Close popover on outside click

  const handleReaction = (reaction: string) => {
    onReactionChange(reaction);
    setShowReactions(false);
  };

  return (
    <div className="relative" ref={reactionRef}>
      <span
        className={`cursor-pointer bg-gray-200 rounded-full px-2 py-2 text-xs text-gray-800 hover:bg-gray-300 hover:text-blue-600 transition duration-200 flex items-center justify-center`}
        onClick={() => setShowReactions(!showReactions)}
      >

          <>
            <HiOutlineEmojiHappy />
            <GoPlus />
          </>
      </span>

      {showReactions && (
        <div className="absolute left-0 -mt-16 bg-white shadow-lg rounded-lg p-2 z-10 w-auto max-w-xs border border-gray-300 flex space-x-2">
          {allowedEmojis.map((reaction) => (
            <div
              key={reaction}
              className={`p-1 cursor-pointer hover:bg-gray-200 rounded-lg flex items-center transition duration-200 ${
                selectedReaction === reaction ? "bg-blue-200" : "" // Highlight selected emoji
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
