import { useState, useEffect } from "react";
import userServices from "../services/userServices";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      userServices.getProfile().then((res) => {
        setUser(res);
      });
    }
  }, [token]);

  const login = async (user) => {
    await userServices
      .login(user)
      .then((res) => {
        localStorage.setItem("token", res.access_token);
        setToken(res.access_token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const register = async (user) => {
    await userServices
      .register(user)
      .then((res) => {
        localStorage.setItem("token", res.access_token);
        setToken(res.access_token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return {
    user,
    login,
    register,
    logout,
  };
};

export default useAuth;
