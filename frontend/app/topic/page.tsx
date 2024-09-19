"use client";

import { useEffect } from "react";
import TopicCard from "../components/TopicCard";
import { getAllTopics } from "../services/topicService";
import { setTopicsInStore } from "../slices/topicsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const TopicPage = () => {
  const { topics } = useAppSelector((state) => state.topics);
  const dispatch = useAppDispatch();

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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Centered Heading with Light Color and Custom Underline */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-600 tracking-wide">
            Explore Topics
          </h1>
          <div className="flex justify-center mt-2">
            <span className="inline-block w-16 h-1 bg-blue-500 rounded"></span>
          </div>
        </div>

        {/* Conditionally render based on topics */}
        {topics?.length === 0 ? (
          <p className="text-xl text-gray-500 text-center">Loading topics...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topics?.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicPage;
