import React, { useState } from "react";

import ConfirmDialog from "../components/ConfirmDialog";

export default function RoadtripCard({ roadtrip, onRemoveRoadtrip }) {
  const [showDialog, setShowDialog] = useState(false);
  const [roadtripMenuOpen, setRoadtripMenuOpen] = useState(false);

  return (
    <>
      <div className="p-4 shadow-sm rounded-xl bg-blue-50 space-y-2 border border-blue-200 relative z-10">
        <h3 className="text-xl font-medium">{roadtrip.title}</h3>
        <div className="flex justify-between">
          <div className="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <p className="font-light">{roadtrip.waypoints.length} Places</p>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <p className="font-light">
              {parseInt(roadtrip.total_time / 60)} min
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
              <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
              <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
            </svg>

            <p className="font-light">
              {parseFloat(roadtrip.total_distance / 1000).toFixed(3)} km
            </p>
          </div>
        </div>

        <div className="absolute top-0 right-2 z-20">
          <button
            onClick={() => {
              setRoadtripMenuOpen(!roadtripMenuOpen);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </button>
        </div>
        {roadtripMenuOpen && (
          <ul className="absolute right-4 top-4 mt-8 bg-white rounded-md shadow-lg w-32 z-40">
            <button
              onClick={() => {
                console.log("edit");
              }}
              className="py-2 px-4 cursor-pointer hover:bg-gray-100 w-full"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setShowDialog(true);
              }}
              className="py-2 px-4 cursor-pointer hover:bg-gray-100 w-full"
            >
              Remove
            </button>
          </ul>
        )}
      </div>
      {showDialog && (
        <ConfirmDialog
          title="Remove roadtrip"
          message="Are you sure you want to remove this roadtrip?"
          onCancel={() => setShowDialog(false)}
          onConfirm={(e) => {
            e.preventDefault();
            onRemoveRoadtrip(roadtrip.id);
            setShowDialog(false);
          }}
        />
      )}
    </>
  );
}
