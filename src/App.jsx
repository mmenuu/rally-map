import { useState, useRef } from 'react'
// import MinimapControl from './MiniMap';
import RoutingControl from './RoutingControl';

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

  const searchNodes = async (c) => {
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:3000,${c.lat}, ${c.lng})[%22amenity%22=%22restaurant%22];out;`;
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

  function LoadNodes() {
    const map = useMapEvents({
      moveend() {
        const visibleCenter = map.getCenter();
        searchNodes(visibleCenter);
      }
    });
    return null;
  }

  function addNodeToRoute(node) {
    setRoute([...route, node]);
  }

  function nodeNotInRoute(node) {
    return route.find(n => n.id === node.id) === undefined;
  }

  function removeNodeFromRoute(node) {
    if (navigate) {
      alert('Please stop navigation first.');
      return;
    }

    setRoute(route.filter(n => n.id !== node.id));
  }

  function handleNavigate() {
    setNavigate(!navigate);
  }

  return (
    <div className='relative w-screen h-screen'>
      {route.length > 0 && (
        <div className='absolute bg-white z-20 p-4 md:min-w-[325px] md:left-2 md:top-2 max-sm:left-0 max-sm:right-0 rounded-xl shadow-2xl max-h-[40vh] overflow-scroll'>
          <h1 className='text-3xl text-center'>Roadtrip</h1>
          <h3 className='text-xl text-center mb-4 text-gray-400'>
            Waypoints
          </h3>

          <ul
            className='flex flex-col space-y-2 list-none'
          >
            {route.map((node, index) => (
              <li
                className='flex justify-between p-3 shadow-sm bg-gray-50 group hover:text-red-400 hover:bg-red-100 hover:ring-2 hover:ring-red-400 rounded-md'
                key={node.id}
                onClick={() => removeNodeFromRoute(node)}
              >
                <div className='flex justify-between items-center'>
                  <span
                    className='text-2xl font-semibold text-gray-400 group-hover:text-red-400'
                  >{index + 1}</span>
                  <h2
                    className='text-xl font-medium ml-3 group-hover:text-red-400'
                  >{node.name}</h2>
                </div>
              </li>
            ))}
          </ul>
          {
            route.length > 1 && (
              <button
                className={`text-${navigate ? 'red' : 'blue'}-400 font-semibold py-2 bg-${navigate ? 'red' : 'blue'}-50 px-3 rounded-md hover:bg-${navigate ? 'red' : 'blue'}-100 hover:ring-2 hover:ring-${navigate ? 'red' : 'blue'}-400 w-full mt-4`}
                onClick={handleNavigate}
              >
                {navigate ? 'Stop' : 'Start Navigation'}
              </button>
            )
          }
        </div>
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
          attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
          url={`https://api.mapbox.com/styles/v1/${import.meta.env.VITE_MAPBOX_USERNAME}/${import.meta.env.VITE_MAPBOX_STYLE}/tiles/256/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`}
        />
        <LoadNodes />
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
                      Start Trip
                    </button>) : nodeNotInRoute(node) && !navigate ? (
                      <button
                        className='text-green-400 font-semibold py-2 bg-green-50 px-3 rounded-md hover:bg-green-100 hover:ring-2 hover:ring-green-400 w-full'
                        onClick={() => setRoute([...route, node])}
                      >
                        Add to route
                      </button>
                    ) : (
                    <div>
                      {
                        navigate && (
                          <p className="text-red-400">
                            Please stop navigation first.
                          </p>
                        )
                      }
                      {
                        (!nodeNotInRoute(node) && !navigate) && (
                          <button className='text-red-400 font-semibold py-2 bg-red-50 px-3 rounded-md hover:bg-red-100 hover:ring-2 hover:ring-red-400 w-full' onClick={() => removeNodeFromRoute(node)}>
                            Remove from route
                          </button>
                        )
                      }
                    </div>
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
        )}
        <ZoomControl position="topright" />
      </MapContainer>
    </div >
  )
}

export default App;
