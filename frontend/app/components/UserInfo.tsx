import React from "react";
import { UserResponse } from "../types/topic";

interface UserInfoProps {
  user: UserResponse;
  isSender: boolean; // To style the name differently if the user is the sender
  onClick?: (userId: string) => void; // Optional onClick prop
}

const UserInfo = ({ user, isSender, onClick }: UserInfoProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(user.id); // Call the onClick function with the user ID
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className="w-6 h-6 flex items-center justify-center bg-gray-300 rounded-full text-xs font-bold cursor-pointer"
        onClick={handleClick}
      >
        {user.name.charAt(0).toUpperCase()}
      </div>
      <span
        className={`font-bold text-sm mb-1 ${
          isSender ? "text-blue-600" : "text-gray-800"
        } cursor-pointer hover:underline`} // Added hover:underline
        onClick={handleClick}
      >
        {user.name}
      </span>
    </div>
  );
};

export default UserInfo;
