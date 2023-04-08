import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthContext } from "./context/authContext";
import useAuth from "./hooks/useAuth";

import HomePage from "./routes/home";
import LoginPage from "./routes/login";
import RegisterPage from "./routes/register";
import MapPage from "./routes/map";
import ErrorPage from "./routes/error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/map",
    element: <MapPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  const { user, login, register, logout } = useAuth();
  return (
    <AuthContext.Provider
      value={{ user, login, register, logout }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}
