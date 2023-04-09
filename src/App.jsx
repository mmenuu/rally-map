import React, { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/authContext";

import ErrorPage from "./routes/error";
import Loading from "./components/Loading";

const HomePage = lazy(() => import("./routes/home"));
const LoginPage = lazy(() => import("./routes/login"));
const RegisterPage = lazy(() => import("./routes/register"));
const MapPage = lazy(() => import("./routes/map"));

const ProtectedRoute = () => {
  const { user } = useAuth();

  const localStorageUser = localStorage.getItem("user");
  if (!user && !localStorageUser) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
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
            <Route element={<ProtectedRoute />}>
              <Route path="/map" element={<MapPage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
