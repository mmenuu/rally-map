import axios from "axios";

const login = async ({ username, password }) => {
  try {
    const res = await axios.post("http://localhost:5000/auth/login", new URLSearchParams({
      username,
      password,
    }
   ));

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const register = async ({ username, email, password }) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/auth/register",
      {
        username,
        email,
        password,
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const userServices = {
  login,
  register,
  getProfile,
};

export default userServices;
