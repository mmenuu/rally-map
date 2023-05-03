import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BaseLayout from "../components/BaseLayout";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import roadtripServices from "../services/roadtripServices";

export default function RoadtripPage() {
  const [roadtrip, setRoadtrip] = useState({
    id: "",
    title: "",
    sub_title: "",
    description: "",
    author: "",
    distance_between_waypoints: 0,
    total_distance: 0,
    total_time: 0,
    summary: "",
    waypoints: [],
  });

  const [editForm, setEditForm] = useState(roadtrip);

  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getRoadtripDetails = async (roadtrip_id) => {
    try {
      const roadtrip = await roadtripServices.getRoadtrip(roadtrip_id);
      setRoadtrip(roadtrip);
      setEditForm(roadtrip);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTakeTrip = async (e) => {
    e.preventDefault();
    try {
      const res = await roadtripServices.createRoadtrip({
        title: roadtrip.title,
        sub_title: roadtrip.sub_title,
        description: roadtrip.description,
        waypoints: roadtrip.waypoints.map((waypoint) => ({
          id: waypoint.id,
          name: waypoint.name,
          amenity: waypoint.amenity,
          position: waypoint.position,
          opening_hours: waypoint.opening_hours,
          note: "",
          description: roadtrip.description,
        })),
      });
      navigate(`/map?roadtrip=${res.roadtrip_id}`);
      console.log(res);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (id) {
      getRoadtripDetails(id);
    }
  }, [id]);

  const handleEdit = async (new_roadtrip) => {
    try {
      const res = await roadtripServices.updateRoadtrip(
        roadtrip.id,
        new_roadtrip
      );
      toast.success(res.message);
      getRoadtripDetails(id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveWaypoint = async (waypoint_id) => {
    const new_waypoints = roadtrip.waypoints.filter(
      (waypoint) => waypoint.id !== waypoint_id
    );
    const new_roadtrip = { ...roadtrip, waypoints: new_waypoints };
    handleEdit(new_roadtrip);
  };

  return (
    <BaseLayout>
      <header>
        <div
          className="w-full h-[26rem] bg-cover bg-center overflow-hidden rounded-2xl"
          style={{
            backgroundImage: `url(https://source.unsplash.com/1050x980/?roadtrip&sig=${roadtrip.id}&auto=format&fit=crop&w=1050&q=80)`,
          }}
        >
          <div className="flex items-center justify-center h-full w-full bg-neutral-900 bg-opacity-50">
            <div className="text-center px-16">
              {user?.username !== roadtrip.author ? (
                <>
                  <h1 className="text-white text-6xl font-semimedium uppercase">
                    {roadtrip.title}
                  </h1>
                  <p className="mt-2 text-neutral-100 text-2xl">
                    {roadtrip.sub_title}
                  </p>
                </>
              ) : (
                <div className="space-y-4">
                  {roadtrip.title ? (
                    <input
                      type="text"
                      className="text-4xl px-2 text-center w-full bg-neutral-200 bg-opacity-20 text-white outline-none py-1 placeholder-neutral-400 focus:placeholder-transparent focus:text-neutral-500 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 focus:bg-neutral-50"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      className="text-neutral-500 px-2 text-3xl text-center w-full bg-opacity-20 bg-neutral-200 outline-none py-1 placeholder-neutral-400 focus:placeholder-transparent focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 focus:bg-neutral-50"
                      placeholder="Title"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                  )}

                  {roadtrip.title !== editForm.title && (
                    <div className="flex space-x-8 justify-end">
                      <button
                        className="text-neutral-200 text-sm font-semibold underline hover:text-neutral-100"
                        onClick={() =>
                          setEditForm({ ...editForm, title: roadtrip.title })
                        }
                      >
                        Cancel
                      </button>

                      <button
                        className="text-neutral-200 text-sm font-semibold underline hover:text-neutral-100"
                        onClick={(e) => {
                          e.preventDefault();
                          setRoadtrip({ ...roadtrip, title: editForm.title });
                          handleEdit({ title: editForm.title });
                        }}
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {roadtrip.sub_title ? (
                    <input
                      type="text"
                      className="text-2xl px-2 text-center w-full bg-neutral-200 bg-opacity-20 text-white outline-none py-1 placeholder-neutral-400 focus:placeholder-transparent focus:text-neutral-500 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 focus:bg-neutral-50"
                      value={editForm.sub_title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, sub_title: e.target.value })
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      className="text-neutral-500 px-2 text-xl text-center w-full bg-opacity-20 bg-neutral-200 outline-none py-1 placeholder-neutral-400 focus:placeholder-transparent focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 focus:bg-neutral-50"
                      placeholder="Add a subtitle"
                      value={editForm.sub_title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, sub_title: e.target.value })
                      }
                    />
                  )}

                  {roadtrip.sub_title !== editForm.sub_title && (
                    <div className="flex space-x-8 justify-end">
                      <button
                        className="text-neutral-200 text-sm font-semibold underline hover:text-neutral-100"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            sub_title: roadtrip.sub_title,
                          })
                        }
                      >
                        Cancel
                      </button>

                      <button
                        className="text-neutral-200 text-sm font-semibold underline hover:text-neutral-100"
                        onClick={(e) => {
                          e.preventDefault();
                          setRoadtrip({
                            ...roadtrip,
                            sub_title: editForm.sub_title,
                          });
                          handleEdit({ sub_title: editForm.sub_title });
                        }}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="px-4 mt-4 space-y-8 pb-8">
        <div className="flex justify-between items-center">
          <div className="flex justify-between space-x-8 text-neutral-600">
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-neutral-400"
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
              <p className="font-light capitalize">
                {roadtrip.waypoints.length} Places
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-neutral-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <p className="font-light capitalize">
                {parseInt(roadtrip.total_time / 60)} min
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-neutral-400"
              >
                <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
              </svg>

              <p className="font-light capitalize">
                {parseFloat(roadtrip.total_distance / 1000).toFixed(3)} km
              </p>
            </div>
            <p className="font-light capitalize">author: {roadtrip.author}</p>
          </div>

          <button
            onClick={handleTakeTrip}
            className="bg-green-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-600 transition-colors duration-150 hover:shadow-lg hover:scale-105 capitalize"
          >
            {user?.username === roadtrip.author
              ? "Clone This Trip"
              : "Take This Trip"}
          </button>
        </div>

        <p className="first-line:tracking-widest first-letter:text-3xl">
          {roadtrip.description}
        </p>
        <div>
          <h3 className="text-2xl font-semimedium">Waypoints</h3>
          <ul className="grid grid-cols-1 mt-4">
            {roadtrip.waypoints &&
              roadtrip.waypoints.map((waypoint) => (
                <li
                  key={waypoint.id}
                  className="bg-white border-b-2 py-8 overflow-hidden"
                >
                  <div className="items-center text-center">
                    <h2 className="text-2xl font-medium">{waypoint.name}</h2>
                    {user?.username !== roadtrip.author ? (
                      <p className="text-neutral-500">{waypoint.description}</p>
                    ) : (
                      <div>
                        {waypoint.description ? (
                          <textarea
                            className="text-neutral-500 text-center w-full bg-neutral-200 outline-none py-1 placeholder-neutral-400 focus:placeholder-transparent focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 focus:bg-neutral-50"
                            placeholder={waypoint.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                waypoints: editForm.waypoints.map((w) =>
                                  w.id === waypoint.id
                                    ? { ...w, description: e.target.value }
                                    : w
                                ),
                              })
                            }
                            value={
                              editForm.waypoints.find(
                                (w) => w.id === waypoint.id
                              ).description
                            }
                          />
                        ) : (
                          <textarea
                            className="text-neutral-500 text-center w-full bg-neutral-200 outline-none py-1 placeholder-neutral-400 focus:placeholder-transparent focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 focus:bg-neutral-50"
                            placeholder="Add a description"
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                waypoints: editForm.waypoints.map((w) =>
                                  w.id === waypoint.id
                                    ? { ...w, description: e.target.value }
                                    : w
                                ),
                              })
                            }
                            value={
                              editForm.waypoints.find(
                                (w) => w.id === waypoint.id
                              ).description
                            }
                          />
                        )}

                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveWaypoint(waypoint.id);
                            }}
                            className="text-neutral-500 px-4 py-2 transition-colors underline capitalize"
                          >
                            Remove
                          </button>
                          {waypoint.description !==
                            editForm.waypoints.find((w) => w.id === waypoint.id)
                              .description && (
                            <>
                              {editForm.waypoints.find(
                                (w) => w.id === waypoint.id
                              ) ? (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setEditForm(roadtrip)}
                                    className="text-neutral-500 px-4 py-2 transition-colors underline  capitalize"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const editedWaypoint =
                                        editForm.waypoints.find(
                                          (w) => w.id === waypoint.id
                                        );

                                      setRoadtrip({
                                        ...roadtrip,
                                        waypoints: roadtrip.waypoints.map((w) =>
                                          w.id === waypoint.id
                                            ? editedWaypoint
                                            : w
                                        ),
                                      });

                                      handleEdit({
                                        ...roadtrip,
                                        waypoints: roadtrip.waypoints.map((w) =>
                                          w.id === waypoint.id
                                            ? editedWaypoint
                                            : w
                                        ),
                                      });
                                    }}
                                    className="text-neutral-500 px-4 py-2 transition-colors underline  capitalize"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : null}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </main>
    </BaseLayout>
  );
}
