import axios from "axios";

const getFavorites = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const addFavorite = async (landmark) => {
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
};

const deleteFavorite = async (landmark_id) => {
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
};

const favoriteServices = {
  getFavorites,
  addFavorite,
  deleteFavorite,
};

export default favoriteServices;
