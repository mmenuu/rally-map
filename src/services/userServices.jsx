import axios from "axios";

const login = async ({ username, password }) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      new URLSearchParams({
        username,
        password,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const token = res.headers.authorization;
    localStorage.setItem("token", token);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const register = async ({ username, email, password }) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        username,
        email,
        password,
      }
    );
    const token = res.headers.authorization;
    localStorage.setItem("token", token);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.detail);
  }
};

const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw new Error(error.response.data.detail);
  }
};

const getUserProfile = async (username) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/profile/${username}`,
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

const userServices = {
  login,
  register,
  logout,
  getProfile,
  getUserProfile,
};

export default userServices;