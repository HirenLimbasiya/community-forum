"use client";

import { useRouter } from "next/navigation";
import { Topic, UserResponse } from "../types/topic";
import UserInfo from "./UserInfo";
import Chip from "./Chip";

interface TopicCardProps {
  topic: Topic;
}

const TopicCard = ({ topic }: TopicCardProps) => {
  const router = useRouter();
  const { created_by_data, title, is_closed, body, id } = topic;

  const token = localStorage.getItem("token") || "";
  const payload = token.split(".")[1]; // Get the payload part of the JWT
  const decodedPayload = JSON.parse(atob(payload)); // Decode base64 and parse JSON
  const userId = decodedPayload.id;

  const handleClick = () => {
    router.push(`/topic/${id}`); // Navigate to topic detail page
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:bg-gray-50"
    >
      {/* User Info */}
      <UserInfo
        user={created_by_data as UserResponse}
        isSender={userId === topic.created_by}
      />

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>

      {/* Body (truncated to 100 characters) */}
      <p className="text-gray-700 mb-4">
        {body.length > 100 ? `${body.substring(0, 100)}...` : body}
      </p>

      {/* Open/Closed Status Chip */}
      <div className="flex justify-between items-center">
        <Chip
          label={is_closed ? "Closed" : "Open"}
          color={is_closed ? "red" : "green"}
        />
      </div>
    </div>
  );
};

export default TopicCard;
