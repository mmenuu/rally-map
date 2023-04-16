import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await userServices
          .getProfile()
          .then((profile) => {
            setUser(profile);
            toast.success("Welcome back!");
          })
          .catch((error) => {
            toast.error(error.message);
            logout();
          });
      }
    };

    getProfile();
  }, [isAuthenticated]);

  const login = async (user) => {
    try {
      await userServices.login(user);
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const register = async (user) => {
    try {
      await userServices.register(user);
      setIsAuthenticated(true);
      toast("Welcome to Rally!", {
        autoClose: 2400,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    await userServices.logout();
    setIsAuthenticated(false);
    setUser(null);
    toast("See you soon!", {
      position: "top-center",
      autoClose: 2400,
      hideProgressBar: false,
      closeOnClick: true,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
