import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import roadtripServices from "../services/roadtripServices";
import userServices from "../services/userServices";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [roadtrips, setRoadtrips] = useState([]);
  const { username } = useParams();
  const navigate = useNavigate();

  const getUserProfile = async () => {
    const user = await userServices.getUserProfile(username);
    if (user) {
      setUser(user);
      await roadtripServices.getRoadtripsByUser(username).then((res) => {
        setRoadtrips(res);
      });
    }
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
    <div>
      <h1>Profile</h1>
      <p>User Id: {username}</p>
      {roadtrips.length > 0 ? (
        <div>
          <h2>Roadtrips</h2>
          <ul className="grid grid-cols-2 gap-4 m-4">
            {roadtrips.map((roadtrip) => (
              <li
                className="p-4 shadow-sm rounded-xl bg-blue-50"
                key={roadtrip.id}
              >
                <p>id: {roadtrip.id}</p>
                <p>title: {roadtrip.title}</p>
                <p>subtitle: {roadtrip.sub_title}</p>
                <p>description: {roadtrip.description}</p>
                <p>category:{roadtrip.category}</p>
                <p>summary: {roadtrip.summary}</p>
                <ul className="mt-4">
                  {roadtrip.waypoints.map((waypoint) => (
                    <li className="underline" key={waypoint.id}>
                      {waypoint.name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No roadtrips</p>
      )}
    </div>
  );
}
