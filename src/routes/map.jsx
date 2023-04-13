import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "../styles/Map.css";

import debounce from "lodash/debounce";
import { v4 as uuidv4 } from "uuid";

import MapPlaceholder from "../components/MapPlaceholder";
import SetViewOnClick from "../components/SetViewOnClick";
import RoutingControl from "../components/RoutingControl";
import WaypointList from "../components/WaypointList";
import DialogLayout from "../components/DialogLayout";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";

import {
  startIcon,
  endIcon,
  navigateIcon,
  restaurantIcon,
} from "../components/MarkerIcons";

import roadtripService from "../services/roadtripServices";
import favoriteServices from "../services/favoriteServices";

const initialRoadtrip = {
  id: null,
  title: "New Roadtrip",
  sub_title: "",
  description: "",
  waypoints: [],
  total_distance: null,
  total_time: null,
  distance_between_waypoints: [],
  category: "",
  summary: "",
};
function CreateMarkerOnClick({ saveMarkers }) {
  const map = useMapEvents({
    contextmenu: (e) => {
      const { lat, lng } = e.latlng;
      saveMarkers([lat, lng]);
    },
  });
  return null;
}

function MapPage() {
  const animateRef = useRef(true);
  const [elements, setElements] = useState([]);
  const [roadtrip, setRoadtrip] = useState(initialRoadtrip);
  const [showEditTitleDialog, setShowEditTitleDialog] = useState(false);
  const [roadtripDetailsForm, setRoadtripDetailsForm] =
    useState(initialRoadtrip);
  const [routeNavigating, setRouteNavigating] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [markers, setMarkers] = useState([]);

  const amenityTypes = [
    "restaurant",
    "cafe",
    "bar",
    "pub",
    "fast_food",
    "biergarten",
    "food_court",
  ];

  const searchElements = async ({ lat, lng }) => {
    const ApiUrl = `${import.meta.env.VITE_MAP_DATA_API}?data=[out:json];`;

    const radiusInMeters = 3000;
    const { data } = await axios.get(
      `${ApiUrl}node["amenity"~"${amenityTypes.join(
        "|"
      )}"](around:${radiusInMeters},${lat},${lng});out;`
    );

    const elementsTransformed = data.elements.map((element) => ({
      id: element.id.toString(),
      position: [element.lat, element.lon],
      name: element.tags.name || "No Name",
      amenity: element.tags.amenity.split("_").join(" "),
      opening_hours: element.tags.opening_hours || "",
    }));

    setElements(elementsTransformed);
  };

  const LoadElements = () => {
    const map = useMapEvent(
      "moveend",
      debounce(() => {
        const { lat, lng } = map.getCenter();
        searchElements({ lat, lng });
      }, 300)
    );

    return null;
  };

  const handleAddFavorite = async (element) => {
    await favoriteServices
      .addFavorite(element)
      .then((res) => {
        const newFavorites = [...favorites, element];
        setFavorites(newFavorites);
        toast.success("Added to favorites");
      })
      .catch((err) => {
        toast.error("Failed to add to favorites");
      });
  };

  const handleRemoveFavorite = async (id) => {
    await favoriteServices
      .deleteFavorite(id)
      .then((res) => {
        const newFavorites = favorites.filter((n) => n.id !== id);
        setFavorites(newFavorites);
        toast.success("Removed from favorites");
      })
      .catch((err) => {
        toast.error("Failed to remove from favorites");
      });
  };

  const handleRouting = () => {
    setRouteNavigating(false);
    setTimeout(() => {
      setRouteNavigating(true);
    }, 1);
  };

  const handleUpdateWaypoint = (waypoints) => {
    setRoadtrip({
      ...roadtrip,
      waypoints: waypoints,
    });
    handleRouting();
  };

  const handleNewRouting = (newRoutingDetails) => {
    setRoadtrip({
      ...roadtrip,
      total_distance: newRoutingDetails.totalDistance,
      total_time: newRoutingDetails.totalTime,
      distance_between_waypoints: newRoutingDetails.distanceBetweenWaypoints,
    });
    toast.success("Auto-Saved", {
      autoClose: 500,
    });
  };

  const handleEditWaypoint = (waypoint) => {
    const newWaypoints = roadtrip.waypoints.map((n) => {
      if (n.id === waypoint.id) {
        return waypoint;
      } else {
        return n;
      }
    });
    setRoadtrip({
      ...roadtrip,
      waypoints: newWaypoints,
    });
    toast.success("Waypoint updated", {
      autoClose: 500,
    });
  };

  const addWaypointToRoute = (newWaypoint) => {
    handleUpdateWaypoint([...roadtrip.waypoints, newWaypoint]);
  };

  const removeWaypointFromRoute = (waypoint) => {
    handleUpdateWaypoint(
      roadtrip.waypoints.filter((n) => n.id !== waypoint.id)
    );

    setMarkers(markers.filter((n) => n.id !== waypoint.id));
  };

  const waypointNotExistsInRoute = (waypoint) => {
    return roadtrip.waypoints.find((n) => n.id === waypoint.id) === undefined;
  };

  const handleIcon = (element) => {
    if (element.id === roadtrip.waypoints[0]?.id) {
      return startIcon;
    } else if (
      !waypointNotExistsInRoute(element) &&
      !(element.id === roadtrip.waypoints[0]?.id) &&
      !(element.id === roadtrip.waypoints[roadtrip.waypoints.length - 1]?.id)
    ) {
      return navigateIcon;
    } else if (
      element.id === roadtrip.waypoints[roadtrip.waypoints.length - 1]?.id
    ) {
      return endIcon;
    } else {
      return restaurantIcon;
    }
  };

  const handleStartNewTrip = async () => {
    await roadtripService
      .createRoadtrip(roadtrip)
      .then((res) => {
        setRoadtrip({
          ...roadtrip,
          id: res.roadtrip_id,
        });
        toast.success("New trip created");
      })
      .catch((err) => {
        toast.error("Failed to create trip");
      });
  };

  const handleUpdateTrip = async () => {
    await roadtripService
      .updateRoadtrip(roadtrip.id, roadtrip)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        toast.error("Failed to update trip");
      });
  };

  const handleClearTrip = () => {
    setRouteNavigating(false);
    setRoadtrip(initialRoadtrip);
    setMarkers([]);
  };

  const getFavorites = async () => {
    await favoriteServices.getFavorites().then((res) => {
      setFavorites(res);
    });
  };

  const saveMarkers = (newMarkerCoordinates) => {
    const newMarker = {
      id: uuidv4(),
      position: newMarkerCoordinates,
      name: "Self Marker",
      amenity: "Location",
      opening_hours: "None",
      description: "",
      note: "",
    };

    const newMarkers = [...markers, newMarker];
    addWaypointToRoute(newMarker);
    setMarkers(newMarkers);
  };

  const handleEditRoadtripTitle = (newTitle) => {
    setRoadtrip({
      ...roadtrip,
      title: newTitle,
    });

    toast.success("Roadtrip title updated", {
      autoClose: 500,
    });
  };

  useEffect(() => {
    if (roadtrip.id !== null) {
      handleUpdateTrip();
    }

    if (roadtrip.waypoints.length > 0 && !roadtrip.id) {
      handleStartNewTrip();
    }

    if (roadtrip.waypoints.length === 0 && roadtrip.id) {
      roadtripService
        .deleteRoadtrip(roadtrip.id)
        .then((res) => {
          handleClearTrip();
          toast.info("Trip Cancelled");
        })
        .catch((err) => {
          toast.error("Failed to cancel trip");
        });
    }
  }, [roadtrip]);

  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <div className="relative w-screen h-screen z-0">
      {roadtrip.waypoints.length > 0 && (
        <div className="absolute bg-white z-20 w-[325px] md:left-2 md:top-40 max-h-[50vh] max-sm:left-0 max-sm:right-0 rounded-xl shadow-2xl overflow-x-hidden overflow-scroll">
          <div className="relative w-full h-full">
            <div
              className="fixed w-[325px] flex items-center bg-gray-600 p-1 rounded-t-xl"
              style={{
                zIndex: 21,
              }}
            >
              <div className="flex items-center w-full space-x-2">
                <div className="flex items-center text-white space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{roadtrip.waypoints.length}</span>
                </div>

                <div className="flex items-center text-white space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="text-sm">
                    {parseInt(roadtrip.total_time / 60)} min
                  </span>
                </div>
                <div className="flex items-center text-white space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 002 4.607V10.5h9V4.606c0-.771-.59-1.43-1.375-1.489A41.568 41.568 0 006.5 3zM2 12v2.5A1.5 1.5 0 003.5 16h.041a3 3 0 015.918 0h.791a.75.75 0 00.75-.75V12H2z" />
                    <path d="M6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13.25 5a.75.75 0 00-.75.75v8.514a3.001 3.001 0 014.893 1.44c.37-.275.61-.719.595-1.227a24.905 24.905 0 00-1.784-8.549A1.486 1.486 0 0014.823 5H13.25zM14.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>

                  <span className="text-sm">
                    {parseFloat(roadtrip.total_distance / 1000).toFixed(3)} km
                  </span>
                </div>
              </div>
              <button onClick={handleClearTrip} className="ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-300 hover:text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="relative pt-12 px-4 pb-4">
              <h1
                className="text-3xl text-center mb-2 hover:underline hover:cursor-pointer"
                onClick={() => {
                  setRoadtripDetailsForm(roadtrip);
                  setShowEditTitleDialog(true);
                }}
              >
                {roadtrip.title}
              </h1>
              {roadtrip.waypoints.length > 1 && (
                <p className="items-center mb-4 text-md font-semibold text-blue-400 text-center">
                  Total Distance:{" "}
                  {parseFloat(roadtrip.total_distance / 1000).toFixed(3)} km
                </p>
              )}
              <WaypointList
                onUpdateRoute={handleUpdateWaypoint}
                distanceBetweenWaypoints={roadtrip.distance_between_waypoints}
                waypoints={roadtrip.waypoints}
                removeWaypointFromRoute={removeWaypointFromRoute}
                onEditWaypoint={handleEditWaypoint}
              />
            </div>
          </div>
        </div>
      )}

      {showEditTitleDialog && (
        <DialogLayout>
          <div className="flex flex-col p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Waypoint Details</h2>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowEditTitleDialog(false)}
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

          <div className="flex flex-col p-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-400 mt-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={roadtripDetailsForm.title}
                onChange={(e) => {
                  setRoadtripDetailsForm({
                    ...roadtripDetailsForm,
                    title: e.target.value,
                  });
                }}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end mt-8">
              <button
                className="bg-blue-400 text-white text-md font-medium rounded-full px-8 py-1 ml-2"
                onClick={() => {
                  handleEditRoadtripTitle(roadtripDetailsForm.title);
                  setShowEditTitleDialog(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </DialogLayout>
      )}

      <MapContainer
        className="z-10"
        center={[13.7294053, 100.7758304]}
        zoom={13}
        maxZoom={18}
        zoomControl={false}
        whenReady={() =>
          searchElements({
            lat: 13.7294053,
            lng: 100.7758304,
          })
        }
        scrollWheelZoom={true}
        placeholder={<MapPlaceholder />}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
        />
        <SetViewOnClick animateRef={animateRef} />
        <CreateMarkerOnClick saveMarkers={saveMarkers} />

        <ZoomControl position="bottomright" />
        <LoadElements />
        {markers.length > 0 &&
          markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              eventHandlers={{
                mouseover: (event) => event.target.openPopup(),
              }}
            >
              <Popup>
                <h1>
                  Selected Location: {marker.position[0]}, {marker.position[1]}
                </h1>
              </Popup>
            </Marker>
          ))}

        {elements.length > 0 &&
          elements.map((element) => (
            <Marker
              key={element.id}
              position={element.position}
              icon={handleIcon(element)}
              eventHandlers={{
                mouseover: (event) => event.target.openPopup(),
              }}
            >
              <Popup>
                <div className="flex flex-col flex-wrap space-y-1 justify-between min-w-[225px]">
                  <h1 className="text-2xl font-medium">{element.name}</h1>
                  <div className="flex flex-wrap justify-between items-center pb-3">
                    <span className="text-yellow-400 bg-yellow-50 px-3 py-1 rounded-md capitalize">
                      {element.amenity}
                    </span>
                    <time className="text-gray-400">
                      {element.opening_hours}
                    </time>
                  </div>

                  <div className="flex space-x-2 items-center">
                    {favorites.find(
                      (favorite) => favorite.id === element.id
                    ) ? (
                      <button
                        onClick={() => {
                          handleRemoveFavorite(element.id);
                        }}
                        className="flex items-center py-1 px-2 space-x-1 text-sm border bg-red-100 border-gray-100 font-semibold text-gray-400 hover:text-gray-500 rounded-md hover:animate-pulse hover:bg-red-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 text-red-500"
                        >
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleAddFavorite(element);
                        }}
                        className="flex items-center py-1 px-2 space-x-1 text-sm border border-gray-100 font-semibold text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </button>
                    )}

                    {roadtrip.waypoints.length === 0 ? (
                      <button
                        className="text-green-400 w-full font-semibold py-2 bg-green-50 px-3 rounded-md hover:bg-green-100 hover:ring-2 hover:ring-green-400 capitalize"
                        onClick={(e) => {
                          e.preventDefault();
                          addWaypointToRoute({
                            ...element,
                            note: "",
                            description: "",
                          });
                        }}
                      >
                        Start New Trip
                      </button>
                    ) : waypointNotExistsInRoute(element) ? (
                      <button
                        className="text-blue-400 w-full font-semibold py-2 bg-blue-50 px-3 rounded-md hover:bg-blue-100 hover:ring-2 hover:ring-blue-400 capitalize"
                        onClick={(e) => {
                          e.preventDefault();
                          addWaypointToRoute({
                            ...element,
                            note: "",
                            description: "",
                          });
                        }}
                      >
                        Add to trip
                      </button>
                    ) : (
                      <button
                        className="text-red-400 w-full font-semibold py-2 bg-red-50 px-3 rounded-md hover:bg-red-100 hover:ring-2 hover:ring-red-400 capitalize"
                        onClick={(e) => {
                          e.preventDefault();
                          removeWaypointFromRoute(element);
                        }}
                      >
                        Remove from trip
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {routeNavigating && (
          <RoutingControl
            position="bottomright"
            color="#856be3"
            waypoints={roadtrip.waypoints.map((waypoint) => waypoint.position)}
            onRouting={handleNewRouting}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapPage;
