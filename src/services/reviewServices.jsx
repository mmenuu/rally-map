import axios from "axios";

const createReview = async (landmark_id, review) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, {
      landmark_id,
      ...review,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const reviewServices = {
  createReview,
};

export default reviewServices;