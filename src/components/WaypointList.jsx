import React, { useRef } from "react";
import Waypoint from "./Waypoint";

export default function WaypointList({
  waypoints,
  distanceBetweenWaypoints,
  onUpdateRoute,
  removeWaypointFromRoute,
}) {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleSort = (e) => {
    const dragIndex = dragItem.current;
    const overIndex = dragOverItem.current;

    waypoints.splice(overIndex, 0, waypoints.splice(dragIndex, 1)[0]);
    dragItem.current = overIndex;

    onUpdateRoute(waypoints);
  };

  return (
    <ul className="flex flex-col list-none">
      {waypoints.map((waypoint, index) => (
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
          <Waypoint
            waypoint={waypoint}
            index={index}
            removeWaypointFromRoute={removeWaypointFromRoute}
          />
          {waypoints.length > 1 && waypoints.length - 1 !== index && (
            <div className="flex items-center my-2">
              <div className="border-b w-full"></div>
              <span className="w-28 ml-5 font-medium text-gray-400">
                {distanceBetweenWaypoints[index]
                  ? `${parseFloat(
                      distanceBetweenWaypoints[index] / 1000
                    ).toFixed(3)} km`
                  : "calculating..."}
              </span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
