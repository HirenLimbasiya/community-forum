"use client";

import { useEffect } from "react";
import TopicCard from "../components/TopicCard";
import { getAllTopics } from "../services/topicService";
import { setTopicsInStore } from "../slices/topicsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const TopicPage = () => {
  const { topics } = useAppSelector((state) => state.topics);
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token") || "";
  const payload = token.split(".")[1]; // Get the payload part of the JWT
  const decodedPayload = JSON.parse(atob(payload)); // Decode base64 and parse JSON

  const userId = decodedPayload.id;
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data } = await getAllTopics();
        dispatch(setTopicsInStore(data || []));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTopics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 overflow-y-auto">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Topics</h1>
        {topics.length === 0 ? (
          <p className="text-xl text-gray-500">Loading topics...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} loggedInUserId={userId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicPage;
