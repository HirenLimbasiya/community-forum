// RepliesContainer.tsx
"use client";

import { useEffect } from "react";
import { sendSocketMessage } from "../lib/socket";
import { useAppSelector } from "../store/hooks";
import ReplyInput from "./ReplyInput";

interface RepliesContainerProps {
  topicId: string;
}

const RepliesContainer = ({ topicId }: RepliesContainerProps) => {
  // const dispatch = useAppDispatch(); // Use typed dispatch
  const { replies } = useAppSelector((state) => state.singleTopic); // Use typed selector
  // const [replies, setReplies] = useState<TopicReply[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token") || "";
  const payload = token.split(".")[1]; // Get the payload part of the JWT
  const decodedPayload = JSON.parse(atob(payload)); // Decode base64 and parse JSON

  const userId = decodedPayload.id;
  const handleSendReply = (content: string) => {
    sendSocketMessage({
      type: "message", // Message type
      sender_id: userId,
      recipient_id: topicId, // Topic ID as the recipient
      content: {
        message: content, // Message content
      },
    });
  };
  console.log(topicId);

  useEffect(() => {
    sendSocketMessage({
      type: "join_to_topic",
      sender_id: userId,
      recipient_id: topicId,
      content: {
        message: "",
      },
    });
    return () => {
      sendSocketMessage({
        type: "leave_from_topic",
        sender_id: userId,
        recipient_id: topicId,
        content: {
          message: "",
        },
      });
    };
  }, []);

  // if (loading) {
  //   return <p className="text-navy">Loading replies...</p>;
  // }

  // if (error) {
  //   return <p className="text-red-600">{error}</p>;
  // }

  return (
    <div className="flex flex-col h-full">
      {/* <RepliesList replies={replies} loggedInUserId="user_id_2" /> */}
      {replies.map((reply) => (
        <div key={reply}>{reply}</div>
      ))}
      <ReplyInput onSend={handleSendReply} />
    </div>
  );
};

export default RepliesContainer;
