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

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;