// RepliesContainer.tsx
"use client";

import { useEffect } from "react";
import { SocketSendMessage, sendSocketMessage } from "../lib/socket";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import ReplyInput from "./ReplyInput";
import { CreateTopicReply } from "../types/topic";
import { getRepliesByTopicId } from "../services/topicService";
import { setTopicRepliesInStore } from "../slices/singleTopicSlice";
import RepliesList from "./RepliesList";

interface RepliesContainerProps {
  topicId: string;
}

const RepliesContainer = ({ topicId }: RepliesContainerProps) => {
  const dispatch = useAppDispatch(); // Use typed dispatch
  const { replies } = useAppSelector((state) => state.singleTopic); // Use typed selector
  // const [replies, setReplies] = useState<TopicReply[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token") || "";
  const payload = token.split(".")[1]; // Get the payload part of the JWT
  const decodedPayload = JSON.parse(atob(payload)); // Decode base64 and parse JSON

  const userId = decodedPayload.id;

  const handleSendReply = (content: string) => {
    const message: SocketSendMessage<CreateTopicReply> = {
      type: "send_topic_reply",
      recipient_id: topicId,
      data: {
        content: content,
      },
    };

    sendSocketMessage(message);
  };

  useEffect(() => {
    sendSocketMessage({
      type: "join_to_topic",
      recipient_id: topicId,
    });

    const fetchReplies = async () => {
      try {
        const { data } = await getRepliesByTopicId(topicId);
        dispatch(setTopicRepliesInStore(data || []));
      } catch (error) {
        console.error(error);
      }
    };

    fetchReplies();

    return () => {
      sendSocketMessage({
        type: "leave_from_topic",
        recipient_id: topicId,
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
      <RepliesList replies={replies} loggedInUserId={userId} />
      {/* {replies.map((reply) => (
        <div key={reply}>{reply}</div>
      ))} */}
      <ReplyInput onSend={handleSendReply} />
    </div>
  );
};

export default RepliesContainer;
