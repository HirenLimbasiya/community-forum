"use client";
import { useEffect, useState } from "react";
import { createTopic, getTopicsByUserId, getUserTopics } from "../services/topicService";
import { addTopicInStore, setTopicsInStore } from "../slices/topicsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import TopicCard from "./TopicCard";
import UserTopicCard from "./UserTopicCard";
import Modal from "./Modal";
import { CreateTopic } from "../types/topic";

interface UserTopicsProps {
  userId?: string; // Optional userId prop to fetch topics for other users
}

const UserTopics = ({ userId }: UserTopicsProps) => {
  const dispatch = useAppDispatch();
  const { topics } = useAppSelector((state) => state.topics);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState<CreateTopic>({
    title: "",
    body: "",
  });

  useEffect(() => {
    const fetchUserTopics = async () => {
      try {
        const { data } = userId
          ? await getTopicsByUserId(userId)
          : await getUserTopics();
        dispatch(setTopicsInStore(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserTopics();
  }, [userId]);

  const handleAddTopic = async () => {
    try {
      const { data, message } = await createTopic(newTopic);
      dispatch(addTopicInStore(data));
      console.log("create topic response", data, message);
    } catch (error) {
      console.error(error);
    }
    setNewTopic({ title: "", body: "" }); // Reset the form
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Centered Heading with Light Color and Custom Underline */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-600 tracking-wide">
            {userId ? "User Topics" : "My Topics"}
          </h1>
          <div className="flex justify-center mt-2">
            <span className="inline-block w-16 h-1 bg-blue-500 rounded"></span>
          </div>
        </div>
        {!userId && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-md shadow transition duration-200 hover:bg-blue-600"
          >
            Add New Topic
          </button>
        )}
        {/* Grid Layout for Topics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userId
            ? topics?.map((topic) => <TopicCard key={topic.id} topic={topic} />)
            : topics?.map((topic) => (
                <UserTopicCard key={topic.id} {...topic} />
              ))}
        </div>
      </div>
      <Modal
        title="Add New Topic"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="flex flex-col">
          <label className="mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={newTopic.title}
            onChange={(e) =>
              setNewTopic({ ...newTopic, title: e.target.value })
            }
            className="mb-4 p-2 border border-gray-300 rounded"
            placeholder="Enter topic title"
          />
          <label className="mb-2" htmlFor="body">
            Body
          </label>
          <textarea
            id="body"
            value={newTopic.body}
            onChange={(e) => setNewTopic({ ...newTopic, body: e.target.value })}
            className="mb-4 p-2 border border-gray-300 rounded"
            placeholder="Enter topic body"
          />
          <button
            onClick={handleAddTopic}
            className="py-2 px-4 bg-blue-500 text-white rounded-md transition duration-200 hover:bg-blue-600"
          >
            Save Topic
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserTopics;
