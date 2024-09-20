"use client";
import { useEffect } from "react";
import { getTopicsByUserId, getUserTopics } from "../services/topicService";
import { setTopicsInStore } from "../slices/topicsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import TopicCard from "./TopicCard";
import UserTopicCard from "./UserTopicCard";

interface UserTopicsProps {
  userId?: string; // Optional userId prop to fetch topics for other users
}

const UserTopics = ({ userId }: UserTopicsProps) => {
  const dispatch = useAppDispatch();
  const { topics } = useAppSelector((state) => state.topics);

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

        {/* Grid Layout for Topics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userId
            ? topics?.map((topic) => <TopicCard key={topic.id} topic={topic} />)
            : topics?.map((topic) => (
                <UserTopicCard key={topic.id} {...topic} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default UserTopics;
