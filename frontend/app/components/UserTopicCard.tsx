"use client";
import { useState } from "react";
import Modal from "@/app/components/Modal"; // Importing your Modal component
import { FiMoreHorizontal } from "react-icons/fi";
import { Topic } from "../types/topic";
import { useAppDispatch } from "../store/hooks";
import { deleteTopic } from "../services/topicService";
import { deleteTopicFromStore } from "../slices/topicsSlice";
import { useRouter } from "next/navigation";

interface TopicCardWithManagebaleProps extends Topic {
  onDelete?: (id: string) => void;
}

const UserTopicCard = ({
  id,
  title,
  body,
  is_closed,
}: TopicCardWithManagebaleProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    router.push(`/topic/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTopic(id);
      dispatch(deleteTopicFromStore(id));
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer bg-white rounded-lg p-6 shadow-lg transition-all hover:shadow-xl hover:bg-gray-50 duration-200 ease-in-out relative"
      >
        <h3 className="text-2xl font-semibold text-darkBlue mb-2">{title}</h3>
        <p className="text-navy mb-4">
          {body.length > 100 ? `${body.substring(0, 100)}...` : body}
        </p>
        <div className="flex justify-end">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold transition-all ${
              is_closed
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {is_closed ? "Closed" : "Open"}
          </span>
        </div>

        {isHovered && (
          <FiMoreHorizontal
            onClick={handleIconClick}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 cursor-pointer"
            size={24}
          />
        )}

        {/* Modal */}
      </div>
      <Modal
        title="Manage Topic"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-md animate-fade-in">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold text-lg">
              Delete Topic
            </span>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out shadow-sm"
            >
              Delete
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold text-lg">
              {is_closed ? "Open Topic" : "Close Topic"}
            </span>
            <button
              className={`${is_closed ? "bg-green-500" : "bg-red-500"} hover:${
                is_closed ? "bg-green-600" : "bg-red-600"
              } 
              text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out shadow-sm`}
            >
              {is_closed ? "Open" : "Close"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserTopicCard;
