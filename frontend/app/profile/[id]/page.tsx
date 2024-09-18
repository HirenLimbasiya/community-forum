"use client"
import Header from "@/app/components/Header";
import ProfileDetails from "@/app/components/ProfileDetails";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import UserTopics from "@/app/components/UserTopics";
import { useParams } from "next/navigation";
import React from "react";

const SelectedUserProfile: React.FC = () => {
  const params = useParams(); // Use 'params' to get route params
  const userId = params?.id as string | undefined; // Type inference, fallback to undefined

  return (
    <ProtectedRoute>
      <div>
        <Header />
        <ProfileDetails userId={userId} />
        <UserTopics userId={userId} />
      </div>
    </ProtectedRoute>
  );
};

export default SelectedUserProfile;
