"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAllTopics } from "@/services/topicService";
import { setTopicsInStore } from "@/slices/topicsSlice";
import TopicCard from "@/components/TopicCard";

const TopicPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { topics } = useAppSelector((state) => state.topics);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const { data } = await getAllTopics();
        dispatch(setTopicsInStore(data || []));
        setError(null);
      } catch (err) {
        setError("Failed to load topics. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-600 tracking-wide">
            Explore Topics
          </h1>
          <div className="flex justify-center mt-2">
            <span className="inline-block w-16 h-1 bg-blue-500 rounded"></span>
          </div>
        </div>

        {loading ? (
          <p className="text-xl text-gray-500 text-center">Loading topics...</p>
        ) : error ? (
          <p className="text-xl text-red-500 text-center">{error}</p>
        ) : topics?.length === 0 ? (
          <p className="text-xl text-gray-500 text-center">
            No topics available.
          </p>
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
