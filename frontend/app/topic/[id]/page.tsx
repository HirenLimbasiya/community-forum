"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Topic } from "@/app/types/topic";
import RepliesContainer from "@/app/components/RepliesContainer";

const TopicDetailPage = () => {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); // Extract topic ID from the URL
  const router = useRouter();
  const topicId = Array.isArray(id) ? id[0] : id; // Take the first value if it's an array

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Ensure id is a string

    // Simulate fetching topic data
    const fetchTopic = async () => {
      try {
        // Simulated fetch - replace with actual fetch logic
        const fetchedTopic = {
          id: topicId,
          title: "Sample Topic Title",
          body: "This is the detailed body of the topic with ID " + topicId,
          isClosed: false,
        };
        setTopic(fetchedTopic);
      } catch (error) {
        setError("Failed to fetch topic details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id, router]);

  // Centered loading message
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light h-screen">
        <p className="text-navy">Loading topic details...</p>
      </div>
    );
  }

  // Centered error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light h-screen">
        <p className="text-red-600">Topic not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-light">
      <div className="relative bg-white rounded-lg p-6 shadow-lg h-full w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-darkBlue mb-4">
          {topic.title}
        </h1>
        <p className="text-navy mb-6">{topic.body}</p>
        <span
          className={`absolute top-4 right-4 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            topic.isClosed
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {topic.isClosed ? "Closed" : "Open"}
        </span>
        <RepliesContainer topicId={topicId} />
      </div>
    </div>
  );
};

export default TopicDetailPage;
