import axios from "axios";

const getFavorites = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const addFavorite = async (landmark) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/favorites`,
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

const deleteFavorite = async (landmark_id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/favorites/${landmark_id}`,
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

const favoriteServices = {
  getFavorites,
  addFavorite,
  deleteFavorite,
};

export default favoriteServices;
