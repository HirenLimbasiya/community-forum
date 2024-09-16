"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Modal from "../components/Modal"; // Import the Modal component
import ProtectedRoute from "../components/ProtectedRoute";
import { UserTopicCard } from "../components/TopicCard"; // Import the TopicCard component
import {
  createTopic,
  deleteTopic,
  getUserTopics,
} from "../services/topicService";
import {
  addTopicInStore,
  deleteTopicFromStore,
  setTopicsInStore,
} from "../slices/topicsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { CreateTopic } from "../types/topic";
import { getLogdinUser } from "../services/userService";
import { setUserInStore } from "../slices/userSlice";

const ProfilePage = () => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState<CreateTopic>({
    title: "",
    body: "",
  });
  const dispatch = useAppDispatch();

  const handleAddTopic = async () => {
    try {
      const { data, message } = await createTopic(newTopic);
      dispatch(addTopicInStore(data));
      console.log("create topic response", data, message);
    } catch (error) {
      console.error(error);
    }
    console.log("New Topic:", newTopic);
    setNewTopic({ title: "", body: "" }); // Reset the form
    setIsModalOpen(false); // Close the modal
  };

  return (
    <ProtectedRoute>
      <div>
        <Header />
        <ProfileDetails />
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-md shadow transition duration-200 hover:bg-blue-600"
        >
          Add New Topic
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-darkBlue">
          Your Topics
        </h2>
        <UserTopics />
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
              onChange={(e) =>
                setNewTopic({ ...newTopic, body: e.target.value })
              }
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
    </ProtectedRoute>
  );
};

const UserTopics = () => {
  const dispatch = useAppDispatch();
  const { topics } = useAppSelector((state) => state.topics);

  const handleDelete = async (id: string) => {
    try {
      await deleteTopic(id);
      dispatch(deleteTopicFromStore(id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUserTopics = async () => {
      try {
        const { data, message } = await getUserTopics();
        dispatch(setTopicsInStore(data));
        console.log(data, message);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserTopics();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <UserTopicCard key={topic.id} {...topic} onDelete={handleDelete} />
      ))}
    </div>
  );
};

const ProfileDetails = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, message } = await getLogdinUser();
        dispatch(setUserInStore(data));
        console.log(data, message);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-semibold mb-6 text-darkBlue">Profile</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <p className="text-gray-700 mb-2">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
