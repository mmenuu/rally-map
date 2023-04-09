import axios from "axios";

const login = async ({ username, password }) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      new URLSearchParams({
        username,
        password,
      })
    );
    const token = res.headers.authorization;
    localStorage.setItem("token", token);
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};

const userServices = {
  login,
  register,
  logout,
  getProfile,
};

export default userServices;
