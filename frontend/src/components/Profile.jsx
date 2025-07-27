import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4 text-center text-red-500">Failed to load profile.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">👤 Your Profile</h2>
      <div className="text-gray-700 mb-2"><strong>Name:</strong> {user.name}</div>
      <div className="text-gray-700 mb-2"><strong>Email:</strong> {user.email}</div>
      <div className="text-gray-700 mb-2"><strong>Joined:</strong> {new Date(user.joinedAt).toLocaleDateString()}</div>
      <div className="text-gray-700 mb-2"><strong>Favorites:</strong> {user.favorites}</div>
      <div className="text-gray-700"><strong>Playlists:</strong> {user.playlists}</div>
    </div>
  );
};

export default Profile;
