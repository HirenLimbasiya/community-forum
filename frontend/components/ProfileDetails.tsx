"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUserInStore } from "../slices/userSlice";
import { getLogdinUser, getUserById } from "../services/userService";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getInitial = (name: string | undefined) => {
    if (!name) return "U"; // Default to 'U' if no name is provided
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-10">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-purple-500 to-blue-600 h-36">
          <div className="absolute inset-0 flex justify-center items-center -bottom-12">
            <div className="relative w-24 h-24 rounded-full bg-indigo-500 border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-bold">
              {getInitial(user?.name)}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="pt-16 pb-8 px-8">
          <div className="bg-gray-100 rounded-lg p-6 shadow-inner text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Personal Information
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>Full Name:</strong> {user?.name}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
