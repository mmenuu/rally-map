import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import roadtripServices from "../services/roadtripServices";
import favoriteServices from "../services/favoriteServices";

import userServices from "../services/userServices";
export default function ProfilePage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState({});
  const [roadtrips, setRoadtrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { username } = useParams();
  const navigate = useNavigate();

  const getUserProfile = async () => {
    const data = await userServices.getUserProfile(username);
    if (data) {
      setUserProfile(data);
      await roadtripServices.getRoadtripsByUser(username).then((res) => {
        setRoadtrips(res);
      });
      await favoriteServices.getFavorites().then((res) => {
        setFavorites(res);
      });
    }
  };

  const handleRemoveRoadtrip = async (id) => {
    await roadtripServices.deleteRoadtrip(id);
    const newRoadtrips = roadtrips.filter((roadtrip) => roadtrip.id !== id);
    setRoadtrips(newRoadtrips);
  };

  useEffect(() => {
    if (username === undefined) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        navigate(`/profile/${currentUser.username}`);
      }

      return;
    }
    getUserProfile();
  }, [username]);

  return (
    <>
      <div className="container mt-20 mx-auto max-w-3xl h-screen space-y-8">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-medium">Profile</h1>
          <p className="text-md">
            ID: <span className="font-bold">{userProfile.id}</span>
          </p>
          <p className="text-md">
            Username: <span className="font-bold">{userProfile.username}</span>
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-center text-2xl font-medium mt-8">Trips</h2>
          {roadtrips.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4">
              {roadtrips.map((roadtrip) => (
                <li
                  className="p-4 shadow-sm rounded-xl bg-blue-50 space-y-2 border border-blue-200"
                  key={roadtrip.id}
                >
                  <p>{roadtrip.title}</p>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                      <p className="font-light">
                        {roadtrip.waypoints.length} Places
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>

                      <p className="font-light">
                        {parseInt(roadtrip.total_time / 60)} min
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-gray-400"
                      >
                        <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                        <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                        <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                      </svg>

                      <p className="font-light">
                        {parseFloat(roadtrip.total_distance / 1000).toFixed(3)}{" "}
                        km
                      </p>
                    </div>
                  </div>

                  {roadtrip.author === user.id && (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleRemoveRoadtrip(roadtrip.id)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No roadtrips</p>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-center text-2xl font-medium mt-8">Favorites</h2>

          {(favorites.length > 0 && (
            <ul className="grid grid-cols-2 gap-4">
              {favorites.map((favorite) => (
                <li
                  className="p-4 shadow-sm rounded-xl bg-blue-50 space-y-2 border border-blue-200"
                  key={favorite.id}
                >
                  <p>{favorite.name}</p>
                </li>
              ))}
            </ul>
          )) || <p className="text-center">No favorites</p>}
        </div>
      </div>
    </>
  );
}
