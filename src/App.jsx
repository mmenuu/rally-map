import { useState, useRef } from 'react'
// import MinimapControl from './MiniMap';
import RoutingControl from './RoutingControl';
import debounce from 'lodash/debounce';

import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMapEvents, ZoomControl } from 'react-leaflet'
import axios from "axios";
import './App.css'

function SetViewOnClick({ animateRef }) {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    })
  })

  return null
}

function MapPlaceholder() {
  return (
    <p>
      Rally Map.{' '}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  )
}

function App() {
  const animateRef = useRef(true)
  const [nodes, setNodes] = useState([]);
  const [route, setRoute] = useState([]);
  const [navigate, setNavigate] = useState(false);

  const searchNodes = async ({ lat, lng }) => {
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:3000,${lat}, ${lng})[%22amenity%22=%22restaurant%22];out;`;
    const response = await axios.get(url);
    const data = response.data;
    const nodes = data.elements.map(element => ({
      id: element.id,
      position: [element.lat, element.lon],
      name: element.tags.name ? element.tags.name : 'N/A',
      amenity: element.tags.amenity,
      opening_hours: element.tags.opening_hours ? element.tags.opening_hours : 'N/A',
    }));
    setNodes(nodes);
  };

  function LoadNodes({ searchNodes }) {
    const map = useMapEvent('moveend', debounce(() => {
      const center = map.getCenter();
      searchNodes({
        lat: center.lat,
        lng: center.lng,
      });
    }, 1000));

    return null;
  }

  function addNodeToRoute(node) {
    setRoute([...route, node]);
    handleRouting()
  }

  function removeNodeFromRoute(node) {
    setRoute(route.filter(n => n.id !== node.id));
    handleRouting()
  }

  function handleRouting() {
    setNavigate(false);
    setTimeout(() => {
      setNavigate(true);
    }, 1);
  }

  function nodeNotInRoute(node) {
    return route.find(n => n.id === node.id) === undefined;
  }

  return (
    <div className='relative w-screen h-screen'>
      {route.length > 0 && (
        <div className='absolute bg-white z-20 p-4 w-[325px] md:left-2 md:top-2 max-sm:left-0 max-sm:right-0 rounded-xl shadow-2xl max-h-[40vh] overflow-scroll'>
          <h1 className='text-3xl text-center'>Roadtrip</h1>
          <h3 className='text-xl text-center mb-4 text-gray-400'>
            Waypoints
          </h3>

          <ul
            className='flex flex-col space-y-2 list-none'
          >
            {route.map((node, index) => (
              <li
                className='rounded-md p-3 bg-gray-50 shadow-md cursor-grab'
                key={node.id}
              >
                <div className='flex justify-between items-center'>
                  <div className='flex flex-col'>
                    <div className='flex justify-between items-center'>
                      <span
                        className='text-2xl font-semibold text-gray-400 mr-4'
                      >{index + 1}</span>

                      <div className='flex flex-col'>
                        <h2
                          className='text-xl font-medium'
                        >{node.name}</h2>
                        <span
                          className='text-sm text-gray-400 capitalize'
                        >{node.amenity}</span>
                      </div>
                    </div>

                  </div>
                  <button className='cursor-pointer'
                    onClick={() => removeNodeFromRoute(node)}
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
              </li>
            ))}
          </ul>
        </div>
      )
      }

      {
        route.length > 1 && (
          <button className="absolute text-green-400 bottom-2 left-2 font-semibold py-2 bg-green-50 px-3 rounded-md hover:bg-green-100 hover:ring-2 hover:ring-green-400 mt-4 z-20"
            onClick={() => {
              alert(JSON.stringify(route));
            }}>
            Save Trip
          </button>
        )
      }

      <MapContainer
        className='z-10'
        center={[13.7294053, 100.7758304]}
        zoom={13}
        zoomControl={false}
        whenReady={() => searchNodes({
          lat: 13.7294053,
          lng: 100.7758304,
        })}

        scrollWheelZoom={true}
        placeholder={<MapPlaceholder />}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
        />
        <LoadNodes searchNodes={searchNodes} />
        {nodes.length > 0 && nodes.map((node) => (
          <Marker key={node.id} position={node.position}>
            <Popup>
              <div
                className='flex flex-col flex-wrap space-y-1 justify-between min-w-[225px]'
              >
                <h1 className='text-2xl font-medium'>{
                  node.name
                }</h1>
                <div className='flex flex-wrap justify-between items-center pb-3'>
                  <span className='text-yellow-400 bg-yellow-50 px-3 py-1 rounded-md capitalize'>{node.amenity}</span>
                  <time className='text-gray-400'>
                    {node.opening_hours}
                  </time>
                </div>
                {
                  route.length === 0 ? (
                    <button
                      className='text-green-400 font-semibold py-2 bg-green-50 px-3 rounded-md hover:bg-green-100 hover:ring-2 hover:ring-green-400 w-full'
                      onClick={() => addNodeToRoute(node)}
                    >
                      Start new trip
                    </button>) :
                    nodeNotInRoute(node) ? (
                      <button
                        className='text-blue-400 font-semibold py-2 bg-blue-50 px-3 rounded-md hover:bg-blue-100 hover:ring-2 hover:ring-blue-400 w-full'
                        onClick={() => addNodeToRoute(node)}
                      >
                        Add to trip
                      </button>
                    ) : (
                      <button
                        className='text-red-400 font-semibold py-2 bg-red-50 px-3 rounded-md hover:bg-red-100 hover:ring-2 hover:ring-red-400 w-full'
                        onClick={() => removeNodeFromRoute(node)}
                      >
                        Remove from trip
                      </button>
                    )
                }
              </div>
            </Popup>
          </Marker>
        ))}
        <SetViewOnClick animateRef={animateRef} />
        {/* <MinimapControl position="topright" zoom={5} /> */}

        {navigate && (
          <RoutingControl position="bottomright" color="red" waypoints={route.map(node => node.position)} />
        )
        }
        {console.log(navigate)}
        <ZoomControl position="topright" />
      </MapContainer>
    </div >
  )
}

export default App;
