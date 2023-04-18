import axios from "axios";

const getLandmarks = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/landmarks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const getLandmark = async (landmark_id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/landmarks/${landmark_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const createLandmark = async (landmark) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/landmarks`,
      landmark,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const landmarkServices = {
  getLandmarks,
  getLandmark,
  createLandmark,
};

export default landmarkServices;