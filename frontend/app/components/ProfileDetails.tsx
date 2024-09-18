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
  }, [userId]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-semibold mb-6 text-darkBlue">Profile</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <p className="text-gray-700 mb-2">
          <strong>Name:</strong> {user?.name}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {user?.email}
        </p>
      </div>
    </div>
  );
};

export default ProfileDetails;
