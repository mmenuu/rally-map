import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import userServices from "../services/userServices";

export const AuthContext = createContext({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
