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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {userId &&
        topics?.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
      {!userId &&
        topics?.map((topic) => <UserTopicCard key={topic.id} {...topic} />)}
    </div>
  );
};

export default UserTopics;
