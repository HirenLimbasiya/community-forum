import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Header from "../components/Header";
import ProfileDetails from "../components/ProfileDetails";
import UserTopics from "../components/UserTopics";

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
