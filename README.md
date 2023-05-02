# Rally - Road Trip Planner

<img width="1508" alt="Screenshot 2566-05-03 at 01 55 12" src="https://user-images.githubusercontent.com/43726547/235759461-f3cce61d-74dd-45e0-bdad-5c67b5bb9ef3.png">

[Demo Live](https://rally.1tpp.dev)

Rally Map is a comprehensive web application that helps you plan your dream road trip with ease. With Rally Map, you can create custom itineraries, discover new routes, find interesting landmarks, and get directions to your destinations - all in one place.

The application features a user-friendly interface that allows you to visualize your trip on an interactive map. You can add as many stops as you want, reorder them to optimize your route, and see estimated travel times and distances. Additionally, Rally Map provides recommendations for nearby attractions, accommodations, and restaurants based on your interests.

Rally Map is built using modern web technologies such as React, and is optimized for desktop and mobile devices. It also integrates with the OpenStreetMap platform to provide accurate and up-to-date map data.

Whether you're planning a weekend getaway or a cross-country adventure, Rally Map is your ultimate road trip companion. Start your journey today!

## Features
- Create custom itineraries
- Discover new routes
- Find interesting landmarks
- Get directions to your destinations
- Visualize your trip on an interactive map
- Add as many stops as you want
- Reorder stops to optimize your route
- See estimated travel times and distances
- Recommendations for nearby attractions, accommodations, and restaurants

## Technologies
- React
- Leaflet and React-Leaflet
- TailwindCSS


## Getting Started
1. Clone the repository
2. Install dependencies
3. Start the development server
4. Open http://localhost:3000 to view it in the browser

```bash
git clone https://github.com/1tpp/rally-map.git
cd rally-map
npm install
npm run dev
```

## Environment Variables
To run this project, you will need to add the following environment variables to your .env file
```
VITE_MAPBOX_STYLE=
VITE_MAPBOX_USERNAME=
VITE_MAPBOX_TOKEN=

VITE_MAP_DATA_API=https://overpass-api.de/api/interpreter
FAST_REFRESH = false
SKIP_PREFLIGHT_CHECK=true

VITE_API_URL=https://rally.fly.dev
```

## Contributing
Contributions are always welcome! Get started by forking the repository and submitting a pull request.

## License
[LICENSE](./LICENSE.md)
