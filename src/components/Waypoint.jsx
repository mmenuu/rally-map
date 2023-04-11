import React from "react";

export default function Waypoint({ waypoint, index, removeWaypointFromRoute }) {
  return (
    <div className="flex p-3 bg-gray-50 hover:bg-blue-100 rounded-sm  justify-between items-center">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-400 mr-4">
            {index + 1}
          </span>

          <div className="flex flex-col">
            <h2 className="text-md font-medium">{waypoint.name}</h2>
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
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-gray-300 hover:text-red-500"
        >
          <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
          <path
            fillRule="evenodd"
            d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.133 2.845a.75.75 0 011.06 0l1.72 1.72 1.72-1.72a.75.75 0 111.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 11-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 11-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
