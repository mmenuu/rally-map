import React, { useState } from "react";

import ConfirmDialog from "./ConfirmDialog";
import DialogLayout from "./DialogLayout";
import { useNavigate } from "react-router-dom";

export default function RoadtripCard({
  roadtrip,
  onRemoveTrip,
  onEditTrip,
  isOwner,
}) {
  const [roadtripMenuOpen, setRoadtripMenuOpen] = useState(false);
  const [showRemoveTripDialog, setShowRemoveTripDialog] = useState(false);
  const [editTripDetailsForm, setEditTripDetailsForm] = useState(roadtrip);
  const [showEditTripDialog, setShowEditTripDialog] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="p-4 shadow-sm rounded-xl flex flex-col justify-between h-48 bg-blue-50 space-y-2 border border-blue-200 relative">
        <h3
          className="text-xl font-medium hover:underline hover:cursor-pointer"
          onClick={(e) => navigate(`/map?roadtrip=${roadtrip.id}`)}
        >
          {roadtrip.title}
        </h3>
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

        {isOwner && (
          <div className="absolute top-0 right-2 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
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
        )}
        {roadtripMenuOpen && (
          <ul
            onMouseLeave={(e) => {
              e.preventDefault();
              setRoadtripMenuOpen(false);
            }}
            className="absolute right-4 top-4 mt-8 bg-white rounded-md shadow-lg w-32 z-20"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate(`/roadtrip/${roadtrip.id}`);
              }}
              className="py-2 px-4 cursor-pointer hover:bg-gray-100 w-full"
            >
              View
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowEditTripDialog(true);
              }}
              className="py-2 px-4 cursor-pointer hover:bg-gray-100 w-full"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowRemoveTripDialog(true);
              }}
              className="py-2 px-4 cursor-pointer hover:bg-gray-100 w-full"
            >
              Remove
            </button>
          </ul>
        )}
      </div>

      {showEditTripDialog && (
        <DialogLayout>
          <div className="flex flex-col p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Trip Details</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowEditTripDialog(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid px-4 space-y-2 border-b pb-8">
            <div>
              <label className="text-sm font-semibold text-gray-400">
                Title
              </label>

              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-2 py-1 mt-1"
                value={editTripDetailsForm.title}
                onChange={(e) => {
                  e.preventDefault();
                  setEditTripDetailsForm({
                    ...editTripDetailsForm,
                    title: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400 mt-2">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-2 py-1 mt-1"
                value={editTripDetailsForm.description}
                onChange={(e) => {
                  e.preventDefault();
                  setEditTripDetailsForm({
                    ...editTripDetailsForm,
                    description: e.target.value,
                  });
                }}
              />
            </div>
          </div>

          <div className="flex justify-between mt-32 p-4">
            <button
              className="text-red-400 text-md font-medium px-4 py-2 underline"
              onClick={(e) => {
                e.preventDefault();
                onRemoveTrip(roadtrip.id);
                setShowEditTripDialog(false);
              }}
            >
              Remove Waypoint
            </button>
            <button
              className="bg-blue-400 text-white text-md font-medium rounded-full px-8 py-1 ml-2"
              onClick={(e) => {
                e.preventDefault();
                onEditTrip(roadtrip.id, {
                  ...roadtrip,
                  title: editTripDetailsForm.title,
                  description: editTripDetailsForm.description,
                });
                setShowEditTripDialog(false);
              }}
            >
              Save
            </button>
          </div>
        </DialogLayout>
      )}
      {showRemoveTripDialog && (
        <ConfirmDialog
          title="Remove roadtrip"
          message="Are you sure you want to remove this roadtrip?"
          onCancel={() => setShowRemoveTripDialog(false)}
          onConfirm={(e) => {
            e.preventDefault();
            onRemoveTrip(roadtrip.id);
            setShowRemoveTripDialog(false);
          }}
        />
      )}
    </>
  );
}
