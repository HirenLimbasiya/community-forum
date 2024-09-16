"use client";

import { useEffect, useState } from "react";
import TopicCard from "../components/TopicCard";
import { Topic } from "../types/topic";

const TopicPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const fetchedTopics: Topic[] = [
        {
          id: "1",
          title: "First Topic",
          body: "This is the body of the first topic.",
          is_closed: false,
          created_by: "",
        },
        {
          id: "2",
          title: "Second Topic",
          body: "This is the body of the second topic.",
          is_closed: true,
          created_by: "",
        },
      ];
      setTopics(fetchedTopics);
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
