// ReplyActions.tsx
"use client";

import { FiEdit, FiTrash2, 
  // FiFlag 
} from "react-icons/fi";

interface ReplyActionsProps {
  isSender: boolean;
  onClick: (type: string) => void; // Callback to send the reply
}

const ReplyActions = ({ isSender, onClick }: ReplyActionsProps) => {
  return (
    <div className="absolute top-2 right-2 flex space-x-2">
      {isSender ? (
        <>
          <button
            aria-label="Edit"
            className="text-gray-600 hover:text-blue-500"
            onClick={() => onClick("edit")}
          >
            <FiEdit />
          </button>
          <button
            aria-label="Delete"
            className="text-gray-600 hover:text-red-500"
            onClick={() => onClick("delete")}
          >
            <FiTrash2 />
          </button>
        </>
      ) : (
        // <button
        //   aria-label="Report"
        //   className="text-gray-600 hover:text-red-500"
        //   onClick={() => onClick("report")}
        // >
        //   <FiFlag />
        // </button>
        <></>
      )}
    </div>
  );
};

export default ReplyActions;
