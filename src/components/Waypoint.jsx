import React from "react";

export default function Waypoint({ waypoint, index, removeWaypointFromRoute }) {
  return (
    <div className="flex p-3 bg-gray-50 hover:bg-blue-100 rounded-sm  justify-between items-center">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-semibold text-gray-400 mr-4">
            {index + 1}
          </span>

          <div className="flex flex-col">
            <h2 className="text-xl font-medium">{waypoint.name}</h2>
            <span className="text-sm text-gray-400 capitalize">
              {waypoint.amenity}
            </span>
          </div>
        </div>
      </div>
      <button
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          removeWaypointFromRoute(waypoint);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-400 hover:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
