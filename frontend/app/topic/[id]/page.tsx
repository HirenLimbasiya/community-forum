"use client";

import RepliesContainer from "@/app/components/RepliesContainer";
import { getTopicById } from "@/app/services/topicService";
import { setSingleTopicInStore } from "@/app/slices/singleTopicSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TopicDetailPage = () => {
  const { topic } = useAppSelector((state) => state.singleTopic);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); // Extract topic ID from the URL
  const topicId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const { data } = await getTopicById(topicId);
        dispatch(setSingleTopicInStore(data))
      } catch (error) {
        setError("Failed to fetch topic details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id]);

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
            topic.is_closed
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {topic.is_closed ? "Closed" : "Open"}
        </span>
        <RepliesContainer topicId={topicId} />
      </div>
    </div>
  );
};

export default TopicDetailPage;
