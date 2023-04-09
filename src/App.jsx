import React, { lazy, Suspense, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/authContext";

import ErrorPage from "./routes/error";
import Loading from "./components/Loading";

const HomePage = lazy(() => import("./routes/home"));
const LoginPage = lazy(() => import("./routes/login"));
const RegisterPage = lazy(() => import("./routes/register"));
const MapPage = lazy(() => import("./routes/map"));

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/map"
              element={<ProtectedRoute element={<MapPage />} />}
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
