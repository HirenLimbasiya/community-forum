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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Topics</h1>
        {topics.length === 0 ? (
          <p className="text-xl text-gray-500">Loading topics...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                id={topic.id}
                title={topic.title}
                body={topic.body}
                is_closed={topic.is_closed}
                created_by=""
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicPage;
