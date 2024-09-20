"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { closeTopicById, deleteTopic } from "../services/topicService";
import { closeTopicInStore, deleteTopicFromStore } from "../slices/topicsSlice";
import { useAppDispatch } from "../store/hooks";
import { Topic } from "../types/topic";
import Chip from "./Chip";
import TopicActionModal from "./TopicActionModal";
import Modal from "./Modal";

interface TopicCardWithManageableProps extends Topic {
  onDelete?: (id: string) => void;
}

const UserTopicCard = ({
  id,
  title,
  body,
  is_closed,
}: TopicCardWithManageableProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    router.push(`/topic/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteTopic(id);
      dispatch(deleteTopicFromStore(id));
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async () => {
    if (!is_closed) {
      try {
        // Implement toggle status functionality
        await closeTopicById(id);
        dispatch(closeTopicInStore(id));
        setIsModalOpen(false);
      } catch (error) {
        console.error(error);
      }
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
        className="cursor-pointer bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out relative overflow-hidden"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">
          {body.length > 100 ? `${body.substring(0, 100)}...` : body}
        </p>

        <div className="flex justify-between items-center">
          <Chip
            label={is_closed ? "Closed" : "Open"}
            color={is_closed ? "red" : "green"}
          />
        </div>

        {isHovered && (
          <FiMoreHorizontal
            onClick={handleIconClick}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 cursor-pointer"
            size={24}
          />
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TopicActionModal
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          isClosed={is_closed}
        />
      </Modal>
    </>
  );
};

export default UserTopicCard;
