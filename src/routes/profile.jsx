import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";

import roadtripServices from "../services/roadtripServices";
import favoriteServices from "../services/favoriteServices";
import userServices from "../services/userServices";

import RoadtripCard from "../components/RoadtripCard";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [roadtrips, setRoadtrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

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
    await roadtripServices
      .deleteRoadtrip(id)
      .then((res) => {
        const newRoadtrips = roadtrips.filter((roadtrip) => roadtrip.id !== id);
        setRoadtrips(newRoadtrips);
        toast.success("Roadtrip deleted");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleCancelDelete = () => {
    setShowDialog(false);
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
      <div className="container mt-20 mx-auto max-w-3xl h-screen space-y-8 ">
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
                <li key={roadtrip.id}>
                  <RoadtripCard
                    roadtrip={roadtrip}
                    onRemoveRoadtrip={handleRemoveRoadtrip}
                    isOwner={userProfile.id === user.id}
                  />
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
