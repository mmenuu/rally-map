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
    throw new Error("Failed to get favorites");
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
    throw new Error("Failed to add favorite");
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
    throw new Error("Failed to delete favorite");
  }
};

const favoriteServices = {
  getFavorites,
  addFavorite,
  deleteFavorite,
};

export default favoriteServices;
