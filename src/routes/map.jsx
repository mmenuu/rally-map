import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
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

function MapPage() {
  const animateRef = useRef(true);
  const [elements, setElements] = useState([]);
  const [roadtrip, setRoadtrip] = useState({
    id: null,
    title: "",
    sub_title: "",
    description: "",
    waypoints: [],
    category: "",
    summary: "",
  });
  const [routeNavigating, setRouteNavigating] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const amenityTypes = [
    "restaurant",
    "cafe",
    "bar",
    "pub",
    "fast_food",
    "biergarten",
    "food_court",
  ];

  const [routingDetails, setRoutingDetails] = useState({
    totalDistance: null,
    totalTime: null,
    distanceBetweenWaypoints: [],
  });

  const searchElements = async ({ lat, lng }) => {
    const ApiUrl = `${import.meta.env.VITE_MAP_DATA_API}?data=[out:json];`;

    const radiusInMeters = 3000;
    const { data } = await axios.get(
      `${ApiUrl}node["amenity"~"${amenityTypes.join(
        "|"
      )}"](around:${radiusInMeters},${lat},${lng});out;`
    );

    const elementsTransformed = data.elements.map((element) => ({
      id: element.id,
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
    setRoutingDetails(newRoutingDetails);
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
    } else if (element.id === roadtrip.waypoints[roadtrip.waypoints.length - 1]?.id) {
      return endIcon;
    } else {
      return restaurantIcon;
    }
  };

  const handleStartNewTrip = async () => {
    await roadtripService.createRoadtrip(roadtrip).then((res) => {
      setRoadtrip({ ...roadtrip, id: res.roadtrip_id });
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
    setRoutingDetails({
      totalDistance: null,
      totalTime: null,
      distanceBetweenWaypoints: [],
    });
    setRoadtrip({
      id: null,
      title: "",
      sub_title: "",
      description: "",
      waypoints: [],
      category: "",
      summary: "",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (roadtrip.id !== null) {
      handleUpdateTrip();
    }

    if (roadtrip.waypoints.length > 0 && !roadtrip.id) {
      handleStartNewTrip();
    }
  }, [roadtrip]);

  return (
    <div className="relative w-screen h-screen">
      {roadtrip.waypoints.length > 0 && (
        <div className="absolute bg-white z-20 p-4 w-[325px] md:left-2 md:top-2 md:bottom-2 max-sm:left-0 max-sm:right-0 rounded-xl shadow-2xl overflow-scroll">
          <div className="w-full">
            <button className="float-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400 hover:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={handleClearTrip}
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
          <h1 className="text-3xl text-center">Roadtrip</h1>
          <h3 className="text-xl text-center mb-4 text-gray-400">Waypoints</h3>
          {roadtrip.waypoints.length > 1 &&  (
            <p className="items-center my-4 text-md font-semibold text-blue-400 text-center">
              Total Distance:{" "}
              {parseFloat(routingDetails.totalDistance / 1000).toFixed(3)} km
            </p>
          )}
          <WaypointList
            onUpdateRoute={handleUpdateWaypoint}
            routingDetails={routingDetails}
            waypoints={roadtrip.waypoints}
            removeWaypointFromRoute={removeWaypointFromRoute}
          />
        </div>
      )}

      <div className="absolute flex flex-col space-y-2 z-20 top-20 right-2">
        <button
          className="bg-white p-2 rounded-md shadow-md hover:shadow-lg"
          onClick={handleLogout}
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
              d="M7 16l-4-4m0 0l4-4m-4 4h18m-7 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>

        <button
          className="bg-white p-2 rounded-md shadow-md hover:shadow-lg"
          onClick={() => {
            navigate("/profile");
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

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
        <ZoomControl position="topright" />
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
                  {roadtrip.waypoints.length === 0 ? (
                    <button
                      className="text-green-400 font-semibold py-2 bg-green-50 px-3 rounded-md hover:bg-green-100 hover:ring-2 hover:ring-green-400 w-full capitalize"
                      onClick={(e) => {
                        e.preventDefault();
                        addWaypointToRoute(element);
                      }}
                    >
                      Start New Trip
                    </button>
                  ) : waypointNotExistsInRoute(element) ? (
                    <button
                      className="text-blue-400 font-semibold py-2 bg-blue-50 px-3 rounded-md hover:bg-blue-100 hover:ring-2 hover:ring-blue-400 w-full capitalize"
                      onClick={(e) => {
                        e.preventDefault();
                        addWaypointToRoute(element);
                      }}
                    >
                      Add to trip
                    </button>
                  ) : (
                    <button
                      className="text-red-400 font-semibold py-2 bg-red-50 px-3 rounded-md hover:bg-red-100 hover:ring-2 hover:ring-red-400 w-full capitalize"
                      onClick={(e) => {
                        e.preventDefault();
                        removeWaypointFromRoute(element);
                      }}
                    >
                      Remove from trip
                    </button>
                  )}
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
