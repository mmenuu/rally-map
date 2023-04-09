import { useState, useRef } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import RoutingControl from "../components/RoutingControl";
import debounce from "lodash/debounce";
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

function SetViewOnClick({ animateRef }) {
  const map = useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;
    map.setView({ lat, lng }, map.getZoom(), {
      animate: animateRef.current || false,
    });
  });

  return null;
}

function MapPlaceholder() {
  return (
    <p>
      Rally Map.{" "}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

function MapPage() {
  const animateRef = useRef(true);
  const [elements, setElements] = useState([]);
  const [route, setRoute] = useState([]);
  const [routeNavigating, setRouteNavigating] = useState(false);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [routingDetails, setRoutingDetails] = useState({
    totalDistance: null,
    totalTime: null,
    distanceBetweenWaypoints: [],
  });

  const searchElements = async ({ lat, lng }) => {
    const ApiUrl = `${import.meta.env.VITE_MAP_DATA_API}?data=[out:json];`;
    const amenityTypes = [
      "restaurant",
      "cafe",
      "bar",
      "pub",
      "fast_food",
      "biergarten",
      "food_court",
    ];

    const { data } = await axios.get(
      `${ApiUrl}node["amenity"~"${amenityTypes.join("|")}"](${lat - 0.1},${
        lng - 0.1
      },${lat + 0.1},${lng + 0.1});out;`
    );
    console.log(data.elements);

    const elementsTransformed = data.elements.map((element) => ({
      id: element.id,
      position: [element.lat, element.lon],
      name: element.tags.name || "N/A",
      amenity: element.tags.amenity,
      opening_hours: element.tags.opening_hours || "N/A",
    }));

    setElements(elementsTransformed);
  };

  function LoadElements() {
    const map = useMapEvent(
      "moveend",
      debounce(() => {
        const { lat, lng } = map.getCenter();
        searchElements({ lat, lng });
      }, 1000)
    );

    return null;
  }

  function addWaypointToRoute(waypoint) {
    setRoute([...route, waypoint]);
    handleNewRouting();
  }

  function removeWaypointFromRoute(waypoint) {
    setRoute(route.filter((n) => n.id !== waypoint.id));
    handleNewRouting();
  }

  function handleNewRouting() {
    setRouteNavigating(false);
    setTimeout(() => {
      setRouteNavigating(true);
    }, 1);
  }

  function handleRouting(details) {
    setRoutingDetails(details);
  }

  function waypointNotExistsInRoute(waypoint) {
    return route.find((n) => n.id === waypoint.id) === undefined;
  }

  const handleSort = (e) => {
    let items = [...route];
    const dragIndex = dragItem.current;
    const overIndex = dragOverItem.current;

    items.splice(overIndex, 0, items.splice(dragIndex, 1)[0]);
    dragItem.current = overIndex;

    setRoute(items);
    handleNewRouting();
  };

  const handleIcon = (element) => {
    const amenityIconMap = {
      restaurant: restaurantIcon,
      cafe: restaurantIcon,
      bar: restaurantIcon,
      pub: restaurantIcon,
      fast_food: restaurantIcon,
      biergarten: restaurantIcon,
      food_court: restaurantIcon,
    };

    if (element.id === route[0]?.id) {
      return startIcon;
    } else if (
      !waypointNotExistsInRoute(element) &&
      !(element.id === route[route.length - 1]?.id)
    ) {
      return navigateIcon;
    } else if (element.id === route[route.length - 1]?.id) {
      return endIcon;
    } else if (amenityIconMap[element.amenity]) {
      return amenityIconMap[element.amenity];
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {route.length > 0 && (
        <div className="absolute bg-white z-20 p-4 w-[325px] md:left-2 md:top-2 md:bottom-2 max-sm:left-0 max-sm:right-0 rounded-xl shadow-2xl overflow-scroll">
          <h1 className="text-3xl text-center">Roadtrip</h1>
          <h3 className="text-xl text-center mb-4 text-gray-400">Waypoints</h3>

          <ul className="flex flex-col list-none">
            {route.map((waypoint, index) => (
              <li
                className="cursor-grab active:cursor-grabbing"
                key={waypoint.id}
                draggable
                onDragStart={(e) => {
                  dragItem.current = index;
                }}
                onDragEnter={(e) => {
                  dragOverItem.current = index;
                }}
                onDragEnd={handleSort}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
              >
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
                    onClick={() => removeWaypointFromRoute(waypoint)}
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
                {route.length > 1 && route.length - 1 !== index && (
                  <div className="flex items-center my-4">
                    <div className="border-b w-full"></div>
                    <span className="w-28 ml-5 font-medium text-gray-400">
                      {routingDetails.distanceBetweenWaypoints[index]
                        ? `${parseFloat(
                            routingDetails.distanceBetweenWaypoints[index] /
                              1000
                          ).toFixed(3)} km`
                        : "calculating..."}
                    </span>
                  </div>
                )}
                {route.length - 1 === index && route.length > 1 && (
                  <p className="items-center my-4 text-md font-semibold text-blue-400 text-center">
                    Total Distance:{" "}
                    {parseFloat(routingDetails.totalDistance / 1000).toFixed(3)}{" "}
                    km
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {route.length > 1 && (
        <button
          className="absolute text-green-400 bottom-10 left-96 font-semibold py-2 bg-green-50 px-3 rounded-md hover:bg-green-100 hover:ring-2 hover:ring-green-400 mt-4 z-20"
          onClick={() => {
            alert(JSON.stringify(route));
          }}
        >
          Save Trip
        </button>
      )}

      <div className="absolute z-20 bottom-2 left-2">
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
        <LoadElements />
        {elements.length > 0 &&
          elements.map((element) => (
            <Marker
              key={element.id}
              position={element.position}
              icon={handleIcon(element)}
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
                  {route.length === 0 ? (
                    <button
                      className="text-green-400 font-semibold py-2 bg-green-50 px-3 rounded-md hover:bg-green-100 hover:ring-2 hover:ring-green-400 w-full capitalize"
                      onClick={() => addWaypointToRoute(element)}
                    >
                      Start New Trip
                    </button>
                  ) : waypointNotExistsInRoute(element) ? (
                    <button
                      className="text-blue-400 font-semibold py-2 bg-blue-50 px-3 rounded-md hover:bg-blue-100 hover:ring-2 hover:ring-blue-400 w-full capitalize"
                      onClick={() => addWaypointToRoute(element)}
                    >
                      Add to trip
                    </button>
                  ) : (
                    <button
                      className="text-red-400 font-semibold py-2 bg-red-50 px-3 rounded-md hover:bg-red-100 hover:ring-2 hover:ring-red-400 w-full capitalize"
                      onClick={() => removeWaypointFromRoute(element)}
                    >
                      Remove from trip
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        <SetViewOnClick animateRef={animateRef} />

        {routeNavigating && (
          <RoutingControl
            position="bottomright"
            color="#856be3"
            waypoints={route.map((waypoint) => waypoint.position)}
            onRouting={handleRouting}
          />
        )}
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}

export default MapPage;
