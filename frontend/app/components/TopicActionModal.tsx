"use client";
import { FC } from "react";

interface TopicActionModalProps {
  onDelete: () => void;
  onToggleStatus: () => void;
  isClosed: boolean;
}

const TopicActionModal: FC<TopicActionModalProps> = ({
  onDelete,
  onToggleStatus,
  isClosed,
}) => {
  return (
    <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-semibold text-lg">
            Delete Topic
          </span>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out shadow-sm"
          >
            Delete
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-semibold text-lg">
            {isClosed
              ? "This topic is closed and cannot be reopened."
              : "Close Topic"}
          </span>
          <button
            onClick={onToggleStatus}
            disabled={isClosed} // Disable button if the topic is closed
            className={`${
              isClosed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            } text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out shadow-sm`}
          >
            {isClosed ? "Closed" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicActionModal;
