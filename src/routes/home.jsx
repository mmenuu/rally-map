import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-3xl grid min-h-screen">
        <div className="flex-1 flex flex-col justify-center items-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-center">
              Welcome to Rally Map!
            </h1>
            <p className="text-center">
              Click the button below to go to the map page.
            </p>
          </div>
          <div className="flex justify-center">
            <Link
              to="/map"
              className=" text-gray-800 font-bold py-2 px-4 rounded shadow-md hover:bg-gray-200"
            >
              Go to Map Page →
            </Link>
          </div>
        </div>
    </div>
  );
}
