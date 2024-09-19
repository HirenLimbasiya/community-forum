"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUserInStore } from "../slices/userSlice";
import { getLogdinUser, getUserById } from "../services/userService";
import Image from "next/image"; // Assuming you're using Next.js Image

interface ProfileDetailsProps {
  userId?: string; // Optional userId prop to fetch other user's data
}

const ProfileDetails = ({ userId }: ProfileDetailsProps) => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = userId
          ? await getUserById(userId) // Fetch other user's data if userId is provided
          : await getLogdinUser(); // Fetch logged-in user data

        dispatch(setUserInStore(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-48 flex items-center justify-center">
            <Image
              src="/avatar-placeholder.png" // Placeholder for user avatar
              alt="User Avatar"
              width={150}
              height={150}
              className="rounded-full border-4 border-white"
            />
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <h1 className="text-center text-4xl font-extrabold text-gray-800">
              {user?.name || "User Name"}
            </h1>
            <p className="text-center text-lg text-gray-500 mt-2">
              {user?.email || "user@example.com"}
            </p>

            {/* User Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Personal Information
                </h2>
                <p className="text-gray-600 mb-2">
                  <strong>Full Name:</strong> {user?.name || "John Doe"}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {user?.email || "john@example.com"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  About Me
                </h2>
                <p className="text-gray-600">
                  {user?.bio ||
                    "This user hasn't written anything about themselves yet."}
                </p>
              </div>
            </div>

            {/* Placeholder for more user details or actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Recent Activity
                </h2>
                <p className="text-gray-600">No recent activity available.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Settings
                </h2>
                <button className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
