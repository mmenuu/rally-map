import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./context/authContext";

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
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
