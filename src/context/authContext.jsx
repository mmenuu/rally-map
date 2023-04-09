import { createContext, useContext, useEffect, useState } from "react";
import userServices from "../services/userServices";

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await setUser((async () => await userServices.getProfile()) || null);
      }
    };

    getProfile();
  }, [isAuthenticated]);

  const login = async (user) => {
    try {
      await userServices.login(user);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error("Failed to login");
    }
  };

  const register = async (user) => {
    try {
      await userServices.register(user);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error("Failed to register");
    }
  };

  const logout = async () => {
    await userServices.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
