import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const createRoutineMachineLayer = ({
  position,
  waypoints,
  color,
  onRouting,
}) => {
  const instance = L.Routing.control({
    position,
    waypointMode: "connect",
    waypoints,
    addWaypoints: false,
    lineOptions: {
      styles: [
        {
          color,
          weight: 5,
        },
      ],
    },
    show: false,
    draggableWaypoints: false,
    routeWhileDragging: false,
    createMarker: () => null,
  });

  instance.on("routesfound", (e) => {
    const { routes } = e;
    const { summary, instructions } = routes[0];
    const { totalDistance, totalTime } = summary;

    const distances = instructions.map((instruction) => {
      const { distance } = instruction;
      return distance;
    });
    
    let distanceBetweenWaypoints = [];
    let distanceBetweenWaypointsTotal = 0;
    for (let i = 0, len = distances.length; i < len; i++) {
      distanceBetweenWaypointsTotal += distances[i];
      if (distances[i] === 0) {
        distanceBetweenWaypoints.push(distanceBetweenWaypointsTotal);
        distanceBetweenWaypointsTotal = 0;
      }
    }

    onRouting({ totalDistance, totalTime, distanceBetweenWaypoints });
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
