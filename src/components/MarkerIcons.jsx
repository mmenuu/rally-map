import L from "leaflet";

const startIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/7244/7244208.png",
  iconSize: [29, 32],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const endIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9452/9452425.png",
  iconSize: [29, 32],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const navigateIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9835/9835833.png",
  iconSize: [29, 32],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const restaurantIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/651/651059.png",
  iconSize: [29, 32],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

export { startIcon, endIcon, navigateIcon, restaurantIcon };
