import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const createRoutineMachineLayer = ({ position, waypoints, color }) => {

  const instance = L.Routing.control({
    position,
    waypointMode: "snap",
    waypoints,
    addWaypoints: false,
    lineOptions: {
      styles: [
        {
          color,
        },
      ],
    },
    show: false,
    draggableWaypoints: false,
    routeWhileDragging: false,
  });

  instance.on("routesfound", (e) => {
    const { routes } = e;
    const { summary } = routes[0];
    const { totalDistance, totalTime } = summary;
    console.log(totalDistance / 1000,Math.round(totalTime % 3600 / 60));
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;