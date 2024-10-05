import Header from "@/components/Header";
import ProfileDetails from "@/components/ProfileDetails";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserTopics from "@/components/UserTopics";
import React from "react";

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <div>
        <Header />
        <ProfileDetails />
        {/* No userId means it fetches the current logged-in user */}
        <UserTopics /> {/* Fetch topics for the logged-in user */}
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
