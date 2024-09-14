// ReplyInput.tsx
"use client";

import React, { useState } from "react";

interface ReplyInputProps {
  onSend: (content: string) => void; // Callback to send the reply
}

const ReplyInput = ({ onSend }: ReplyInputProps) => {
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (content.trim()) {
      onSend(content);
      setContent(""); // Clear the input after sending
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition duration-200"
      >
        Send
      </button>
    </div>
  );
};

export default ReplyInput;
