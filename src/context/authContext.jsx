import { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await userServices.getProfile();
          setUser(res);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
    };
    fetchData();
  }, []);

  const login = async (user) => {
    try {
      const token = await userServices.login(user);
      localStorage.setItem("token", token);
      setUser(await userServices.getProfile());
    } catch (error) {
      throw new Error("Failed to login");
    } 
  };

  const register = async (user) => {
    try {
      const token = await userServices.register(user);
      localStorage.setItem("token", token);
      setUser(await userServices.getProfile());
    } catch (error) {
      throw new Error("Failed to register");
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
