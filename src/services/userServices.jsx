import axios from "axios";

const login = async ({ username, password }) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/auth/login",
      new URLSearchParams({
        username,
        password,
      })
    );
    const token = res.headers.authorization;
    localStorage.setItem("token", token);
  } catch (error) {
    throw new Error("Failed to login");
  }
};

const register = async ({ username, email, password }) => {
  try {
    const res = await axios.post("http://localhost:5000/auth/register", {
      username,
      email,
      password,
    });
    const token = res.headers.authorization;
    localStorage.setItem("token", token);
  } catch (error) {
    throw new Error("Failed to register");
  }
};

const logout = async () => {
  localStorage.removeItem("token");
}

const getProfile = async (token) => {
  try {
    const res = await axios.get("http://localhost:5000/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to get profile");
  }
};

const userServices = {
  login,
  register,
  logout,
  getProfile,
};

export default userServices;
