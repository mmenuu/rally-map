import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import BaseLayout from "../components/BaseLayout";

import landmarkServices from "../services/landmarkServices";

export default function LandmarkPage() {
  const [landmark, setLandmark] = useState({});
  const { id } = useParams();

  const getLandmarkDetails = async (landmark_id) => {
    await landmarkServices
      .getLandmark(landmark_id)
      .then((res) => {
        setLandmark(res);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (id) {
      getLandmarkDetails(id);
    }
  }, []);

  return (
    <BaseLayout>
      <p>{JSON.stringify(landmark)}</p>
    </BaseLayout>
  );
}
