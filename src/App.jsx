import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./routes/Home";
import MapPage from "./routes/map";
import ErrorPage from "./routes/error";
import Magazine from "./routes/magazine";

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
  { path: "/magazine",
   element: <Magazine />}
]);

export default function App() {
  return <RouterProvider router={router} />;
}
