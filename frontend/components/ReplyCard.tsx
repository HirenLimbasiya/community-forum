// ReplyCard.tsx
"use client";

import { useState } from "react";
import ReplyActions from "./ReplyActions";
import UserInfo from "./UserInfo"; // Import the new UserInfo component
import UserReaction from "./UserReaction";
import { Reaction, TopicReply, UserResponse } from "@/types/topic";
import { SocketSendMessage, sendSocketMessage } from "@/lib/socket";

interface ReplyCardProps {
  reply: TopicReply;
  loggedInUserId: string;
}
const ReplyCard = ({ reply, loggedInUserId }: ReplyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);

  const isSender = reply.sender_id === loggedInUserId;

  const handleReaction = (reaction: string) => {
    const message: SocketSendMessage = {
      type: "topic_reply_reaction",
      recipient_id: reply.id,
      data: {
        content: reaction,
        topic_id: reply.topic_id,
      },
    };
    sendSocketMessage(message);
  };

  const handleActionsReply = (actionType: string) => {
    switch (actionType) {
      case "delete":
        const deleteMessage: SocketSendMessage = {
          type: "delete_topic_reply",
          recipient_id: reply.id,
          data: {},
        };
        sendSocketMessage(deleteMessage);
        break;
      case "edit":
        setIsEditing(true);
        break;
      default:
        break;
    }
  };

  const handleSaveEdit = () => {
    const message: SocketSendMessage = {
      type: "edit_topic_reply",
      recipient_id: reply.id,
      data: {
        content: editContent,
      },
    };
    sendSocketMessage(message);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(reply.content);
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-md relative hover:bg-gray-50 transition duration-200 ease-in-out ${
        isSender ? "border-l-4 border-blue-500" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Use the new UserInfo component here */}
      <UserInfo user={reply.sender as UserResponse} isSender={isSender} />

      {reply.delete ? (
        <p className="text-gray-500 italic my-2">
          This message is no longer available.
        </p>
      ) : isEditing ? (
        <div>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mb-1"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex justify-end space-x-2 mb-1">
            <button
              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 text-sm rounded"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-sm rounded"
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className={`text-gray-800 my-2 ${isSender ? "font-semibold" : ""}`}>
          {reply.content}
        </p>
      )}

      {!reply.delete && (
        <>
          <div className="mt-2 flex items-center">
            <Reactions
              reactions={reply.reactions || []}
              loggedInUserId={loggedInUserId}
              onReactionChange={handleReaction}
            />
          </div>

          <div className="absolute bottom-2 right-2 flex items-center space-x-1 text-xs text-gray-400">
            <span>{new Date(reply.sent_time).toLocaleString()}</span>
            {reply.is_edited && (
              <span className="text-blue-500 italic">(Edited)</span>
            )}
          </div>

          {isHovered && !isEditing && (
            <ReplyActions isSender={isSender} onClick={handleActionsReply} />
          )}
        </>
      )}
    </div>
  );
};

interface ReactionsProps {
  reactions: Reaction[];
  onReactionChange: (reactionId: string) => void;
  loggedInUserId: string;
}

const Reactions = ({
  reactions,
  onReactionChange,
  loggedInUserId,
}: ReactionsProps) => {
  // Function to group reactions by emoji and calculate counts
  const groupedReactions = reactions.reduce((acc, reaction) => {
    const { reaction: emoji } = reaction;
    if (!acc[emoji]) {
      acc[emoji] = {
        reaction: emoji,
        count: 0,
        userReacted: false,
      };
    }
    acc[emoji].count += 1;
    if (reaction.user_id === loggedInUserId) {
      acc[emoji].userReacted = true;
    }
    return acc;
  }, {} as { [key: string]: { reaction: string; count: number; userReacted: boolean } });

  // Find the logged-in user's selected reaction
  const userSelectedReaction = reactions.find(
    (reaction) => reaction.user_id === loggedInUserId
  )?.reaction;

  return (
    <>
      {Object.keys(groupedReactions).length > 0 && (
        <div className="text-blue-600 rounded-full py-1 text-xs flex items-center">
          <div className="flex space-x-1">
            {Object.values(groupedReactions).map(
              ({ reaction, count, userReacted }) => (
                <span
                  key={reaction}
                  className={`rounded-full px-2 py-1 text-xs flex items-center ${
                    userReacted ? "bg-blue-300" : "bg-gray-200"
                  }`}
                >
                  {reaction} <span className="ml-1">{count}</span>{" "}
                  {/* Display the count */}
                </span>
              )
            )}
          </div>
        </div>
      )}
      <div className="mx-1">
        {/* Pass the user's selected reaction to the UserReaction component */}
        <UserReaction
          onReactionChange={onReactionChange}
          selectedReaction={userSelectedReaction} // Pass selected emoji for the logged-in user
        />
      </div>
    </>
  );
};



// const Reactions = ({ reactions, onReactionChange,  loggedInUserId }: ReactionsProps) => {
//   console.log(reactions, onReactionChange, loggedInUserId);
  
//   return (
//     <>
//       {reactions?.length > 0 && (
//         <div className="text-blue-600 rounded-full py-1 text-xs flex items-center">
//           <div className="flex space-x-1">
//             {reactions.map((reactionGroup) => (
//               <span
//                 key={reactionGroup.id}
//                 className={`rounded-full px-2 py-1 text-xs flex items-center ${
//                   reactionGroup.user_reacted.type
//                     ? "bg-blue-300"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 {reactionGroup.id}{" "}
//                 <span className="ml-1">{reactionGroup.count}</span>{" "}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}
//       <div className="mx-1">
//         <UserReaction onReactionChange={onReactionChange} />
//       </div>
//     </>
//   );
// };

export default ReplyCard;
