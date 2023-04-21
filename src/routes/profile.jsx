import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import BaseLayout from "../components/BaseLayout";

import roadtripServices from "../services/roadtripServices";
import userServices from "../services/userServices";
import reviewServices from "../services/reviewServices";

import RoadtripCard from "../components/RoadtripCard";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({});
  const [roadtrips, setRoadtrips] = useState([]);
  const [reviews, setReviews] = useState([]);

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
      await reviewServices.getReviewsByUsername(username).then((res) => {
        setReviews(res);
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

  const handleEditRoadtrip = async (id, newRoadtripDetails) => {
    await roadtripServices
      .updateRoadtrip(id, newRoadtripDetails)
      .then((res) => {
        const newRoadtrips = roadtrips.map((roadtrip) => {
          if (roadtrip.id === id) {
            return newRoadtripDetails;
          }
          return roadtrip;
        });
        setRoadtrips(newRoadtrips);
        toast.success("Roadtrip updated");
      });
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
    <BaseLayout>
      <div className="grid space-y-4 mb-16">
        <h1 className="text-4xl font-medium text-center">Profile</h1>
        <div className="flex flex-col md:flex-row justify-between text-md">
          <p>
            ID: <span className="font-bold">{userProfile.id}</span>
          </p>
          <p>
            Username: <span className="font-bold">{userProfile.username}</span>
          </p>
        </div>
      </div>
      <div className="space-y-16 pb-8">
        <div className="space-y-8">
          <h2 className="text-center text-2xl font-medium mt-8">Trips</h2>
          {roadtrips.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadtrips.map((roadtrip) => (
                <li key={roadtrip.id}>
                  <RoadtripCard
                    roadtrip={roadtrip}
                    onRemoveTrip={handleRemoveRoadtrip}
                    onEditTrip={handleEditRoadtrip}
                    isOwner={userProfile.id === user.id}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No roadtrips</p>
          )}
        </div>

        <div className="space-y-8">
          <h2 className="text-center text-2xl font-medium mt-8">Reviews</h2>
          {reviews.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <li key={review.id}>
                  <div className="flex flex-col justify-between p-4 border border-gray-300 rounded-md">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <h3
                          onClick={() =>
                            navigate(`/landmark/${review.landmark_id}`)
                          }
                          className="text-lg font-medium cursor-pointer hover:underline"
                        >
                          {review.landmark_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {review.review_text}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <span
                            key={value}
                            className={`text-2xl ${
                              value <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No reviews</p>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
