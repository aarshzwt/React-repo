import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; 
import { FaPen } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null); 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const navigate= useNavigate();

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("users/profile"); 
      setUserProfile(response.data); 
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to fetch user profile");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Profile</h1>
          <button 
            className="text-gray-600 dark:text-white cursor-pointer p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => navigate('/users/profile/update')}
          >
            <FaPen size={24} />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300 font-semibold">First Name:</span>
              <span className="text-gray-800 dark:text-white">{userProfile.user.first_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300 font-semibold">Last Name:</span>
              <span className="text-gray-800 dark:text-white">{userProfile.user.last_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300 font-semibold">Email:</span>
              <span className="text-gray-800 dark:text-white">{userProfile.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300 font-semibold">Role:</span>
              <span className="text-gray-800 dark:text-white">{userProfile.user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
