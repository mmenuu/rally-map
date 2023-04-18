import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BaseLayout from "../components/BaseLayout";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

import roadtripServices from "../services/roadtripServices";

export default function RoadtripPage() {
  const [roadtrip, setRoadtrip] = useState({});
  const [editAble, setEditAble] = useState(false);
  const { user } = useAuth();
  const { id } = useParams();

  const getRoadtripDetails = async (roadtrip_id) => {
    try {
      const roadtrip = await roadtripServices.getRoadtrip(roadtrip_id);
      setRoadtrip(roadtrip);

      if (user && user.id === roadtrip.author) {
        console.log("user is the author");
        setEditAble(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getRoadtripDetails(id);
    }
  }, [id]);

  return (
    <BaseLayout>
      <header>
        <div
          className="w-full bg-cover bg-center overflow-hidden rounded-2xl"
          style={{
            height: "32rem",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80)",
          }}
        >
          <div className="flex items-center justify-center h-full w-full bg-gray-900 bg-opacity-50">
            <div className="text-center px-16">
              <h1 className="text-white text-6xl font-semibold uppercase">
                {roadtrip.title} 
              </h1>
              <p className="mt-2 text-gray-100 text-2xl">
                {roadtrip.sub_title} perspiciatis magnam dolore soluta! Eum aut obcaecati
              </p>
            </div>
          </div>
        </div>
      </header>
    </BaseLayout>
  );
}
