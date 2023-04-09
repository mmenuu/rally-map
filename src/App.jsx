import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./context/authContext";

import ErrorPage from "./routes/error";
import Loading from "./components/Loading";

const HomePage = lazy(() => import("./routes/home"));
const LoginPage = lazy(() => import("./routes/login"));
const RegisterPage = lazy(() => import("./routes/register"));
const MapPage = lazy(() => import("./routes/map"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <HomePage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/map",
    element: (
      <Suspense fallback={<Loading />}>
        <MapPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <LoginPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loading />}>
        <RegisterPage />
      </Suspense>
    ),
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
