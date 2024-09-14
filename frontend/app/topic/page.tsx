"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopicCard from "../components/TopicCard";
import { Topic } from "../types/topic";

const TopicPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/register");
    } else {
      const fetchTopics = async () => {
        const fetchedTopics: Topic[] = [
          {
            id: "1",
            title: "First Topic",
            body: "This is the body of the first topic.",
            isClosed: false,
          },
          {
            id: "2",
            title: "Second Topic",
            body: "This is the body of the second topic.",
            isClosed: true,
          },
        ];
        setTopics(fetchedTopics);
      };
      fetchTopics();
    }
  }, [router]);

  return (
    <div className="p-6 bg-light min-h-screen">
      <h1 className="text-3xl font-semibold text-darkBlue mb-6">Topics</h1>
      {topics.length === 0 ? (
        <p className="text-navy">Loading topics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={topic.title}
              body={topic.body}
              isClosed={topic.isClosed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicPage;
