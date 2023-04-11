import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import debounce from "lodash/debounce";

import MapPlaceholder from "../components/MapPlaceholder";
import SetViewOnClick from "../components/SetViewOnClick";
import RoutingControl from "../components/RoutingControl";
import WaypointList from "../components/WaypointList";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
  ZoomControl,
} from "react-leaflet";

import {
  startIcon,
  endIcon,
  navigateIcon,
  restaurantIcon,
} from "../components/MarkerIcons";

import axios from "axios";
import "../styles/Map.css";

import roadtripService from "../services/roadtripServices";
import favoriteServices from "../services/favoriteServices";

function MapPage() {
  const animateRef = useRef(true);
  const [elements, setElements] = useState([]);
  const [roadtrip, setRoadtrip] = useState({
    id: null,
    title: "Untitled",
    sub_title: "",
    description: "",
    waypoints: [],
    total_distance: null,
    total_time: null,
    distance_between_waypoints: [],
    category: "",
    summary: "",
  });
  const [routeNavigating, setRouteNavigating] = useState(false);
  const [favorites, setFavorites] = useState([]);

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
      name: element.tags.name || "N/A",
      amenity: element.tags.amenity,
      opening_hours: element.tags.opening_hours || "N/A",
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
    await favoriteServices.addFavorite(element).then((res) => {
      console.log(res);
    });
    const newFavorites = [...favorites, element];
    setFavorites(newFavorites);
  };

  const handleRemoveFavorite = async (id) => {
    await favoriteServices.deleteFavorite(id).then((res) => {
      console.log(res);
    });
    const newFavorites = favorites.filter((n) => n.id !== id);
    setFavorites(newFavorites);
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
  };

  const addWaypointToRoute = (newWaypoint) => {
    handleUpdateWaypoint([...roadtrip.waypoints, newWaypoint]);
  };

  const removeWaypointFromRoute = (waypoint) => {
    handleUpdateWaypoint(
      roadtrip.waypoints.filter((n) => n.id !== waypoint.id)
    );
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
    await roadtripService.createRoadtrip(roadtrip).then((res) => {
      setRoadtrip({
        ...roadtrip,
        id: res.roadtrip_id,
      });
      console.log(res);
    });
  };

  const handleUpdateTrip = async () => {
    await roadtripService.updateRoadtrip(roadtrip.id, roadtrip).then((res) => {
      console.log(res);
    });
  };

  const handleClearTrip = () => {
    setRouteNavigating(false);
    setRoadtrip({
      id: null,
      title: "",
      sub_title: "",
      description: "",
      waypoints: [],
      category: "",
      summary: "",
      total_distance: null,
      total_time: null,
      distance_between_waypoints: [],
    });
  };

  const getFavorites = async () => {
    await favoriteServices.getFavorites().then((res) => {
      setFavorites(res);
    });
  };

  useEffect(() => {
    getFavorites();

    if (roadtrip.id !== null) {
      handleUpdateTrip();
    }

    if (roadtrip.waypoints.length > 0 && !roadtrip.id) {
      handleStartNewTrip();
    }

    if (roadtrip.waypoints.length === 0 && roadtrip.id) {
      roadtripService.deleteRoadtrip(roadtrip.id).then((res) => {
        console.log(res);
      });
      handleClearTrip();
    }
  }, [roadtrip]);

  return (
    <div className="relative w-screen h-screen z-0">
      {roadtrip.waypoints.length > 0 && (
        <div className="absolute bg-white z-20 w-[325px] md:left-2 md:top-40 max-h-[50vh] max-sm:left-0 max-sm:right-0 rounded-xl shadow-2xl overflow-x-hidden overflow-scroll">
          <div className="relative w-full h-full">
            <div className="fixed w-[325px] flex items-center bg-gray-600 z-30 p-1 rounded-t-xl">
              <div className="flex items-center w-full space-x-2">
                <div className="flex items-center text-white space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{roadtrip.waypoints.length}</span>
                </div>

                <div className="flex items-center text-white space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                      clip-rule="evenodd"
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
                    class="w-5 h-5"
                  >
                    <path d="M6.5 3c-1.051 0-2.093.04-3.125.117A1.49 1.49 0 002 4.607V10.5h9V4.606c0-.771-.59-1.43-1.375-1.489A41.568 41.568 0 006.5 3zM2 12v2.5A1.5 1.5 0 003.5 16h.041a3 3 0 015.918 0h.791a.75.75 0 00.75-.75V12H2z" />
                    <path d="M6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM13.25 5a.75.75 0 00-.75.75v8.514a3.001 3.001 0 014.893 1.44c.37-.275.61-.719.595-1.227a24.905 24.905 0 00-1.784-8.549A1.486 1.486 0 0014.823 5H13.25zM14.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>

                  <span className="text-sm">
                    {parseFloat(roadtrip.total_distance / 1000).toFixed(3)}{" "}
                    km
                  </span>
                </div>

                <span></span>
              </div>
              <button onClick={handleClearTrip} className="ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 text-gray-300 hover:text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="relative pt-12 px-4 pb-4 z-20">
              <h1 className="text-3xl text-center">{roadtrip.title}</h1>
              {roadtrip.waypoints.length > 1 && (
                <p className="items-center mb-4 text-md font-semibold text-blue-400 text-center">
                  Total Distance:{" "}
                  {parseFloat(roadtrip.total_distance / 1000).toFixed(3)}{" "}
                  km
                </p>
              )}
              <WaypointList
                onUpdateRoute={handleUpdateWaypoint}
                distanceBetweenWaypoints={roadtrip.distance_between_waypoints}
                waypoints={roadtrip.waypoints}
                removeWaypointFromRoute={removeWaypointFromRoute}
              />
            </div>
          </div>
        </div>
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
        <ZoomControl position="bottomright" />
        <LoadElements />

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
                      {element.amenity.split("_").join(" ")}
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
                          class="w-6 h-6 text-red-500"
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
                          class="w-6 h-6"
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
                          addWaypointToRoute(element);
                        }}
                      >
                        Start New Trip
                      </button>
                    ) : waypointNotExistsInRoute(element) ? (
                      <button
                        className="text-blue-400 w-full font-semibold py-2 bg-blue-50 px-3 rounded-md hover:bg-blue-100 hover:ring-2 hover:ring-blue-400 capitalize"
                        onClick={(e) => {
                          e.preventDefault();
                          addWaypointToRoute(element);
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
