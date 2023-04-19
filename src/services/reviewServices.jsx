import axios from "axios";

const getReviewsByUsername = async (username) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews?user=${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
}

const createReview = async (landmark_id, review) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/reviews`,
      {
        landmark_id,
        ...review,
      },
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

const removeReview = async (review_id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/reviews/${review_id}`,
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

const updateReview = async (review_id, review) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/reviews/${review_id}`,
      {
        review_text: review.review_text,
        rating: review.rating,
      },
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

const reviewServices = {
  getReviewsByUsername,
  createReview,
  updateReview,
  removeReview,
};

export default reviewServices;
