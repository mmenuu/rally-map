import { useState, useRef, useEffect } from 'react'
import MinimapControl from './MiniMap';
import RoutingControl from './RoutingControl';

import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMapEvents } from 'react-leaflet'
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
      position: [element.lat, element.lon],
      name: element.tags.name,
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
    return route.find(n => n.name === node.name) === undefined;
  }

  function handleNavigate() {
    setNavigate(!navigate);
  }

  return (
    <div>
      {route.length > 0 && (
        <div style={{
          position: 'absolute',
          top: "50%",
          left: '1rem',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 10,
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
        }}>
          <h1 style={
            {
              fontSize: '1.5rem',
              marginBottom: 10,
            }}>Waypoint</h1>
          <ul style={{
            listStyle: 'none',
          }}>
            {route.map((node, index) => (
              <li key={index}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <span style={{
                    fontWeight: 'bold',
                    marginRight: 10,
                    borderRadius: '100%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'green',
                    color: 'white',
                  }}>{index + 1}</span>

                  <h2 style={{
                    fontSize: '1rem',
                    marginBottom: 5,
                    marginRight: 10,
                  }}>{node.name}</h2>
                </div>
              </li>
            ))}
          </ul>
          {
            route.length > 1 && (
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'skyblue',
                  backgroundOpacity: 0.5,
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  width: '100%',
                  cursor: 'pointer',
                }}
                onClick={handleNavigate}
              >
                {navigate ? 'Stop' : 'Start'}
              </button>
            )
          }
        </div>
      )
      }
      <MapContainer
        center={[13.7294053, 100.7758304]}
        zoom={13}
        scrollWheelZoom={false}
        placeholder={<MapPlaceholder />}
      >
        <TileLayer
          attribution='Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>'
          url={`https://api.mapbox.com/styles/v1/${import.meta.env.VITE_MAPBOX_USERNAME}/${import.meta.env.VITE_MAPBOX_STYLE}/tiles/256/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`}
        />
        <LoadNodes />
        {nodes.length > 0 && nodes.map((node, index) => (
          <Marker key={index} position={node.position}>
            <Popup>
              <div
              >
                <h1 style={{
                  fontSize: '1.5rem',
                  marginBottom: 10,
                }}>{node.name}</h1>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                  <span style={{
                    color: 'red',
                    fontWeight: 'bold',
                    borderRadius: 5,
                    padding: 5,
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  }}>{node.amenity}</span>
                  <time>
                    {node.opening_hours}
                  </time>
                </div>
              </div>

              {
                route.length === 0 ? (
                  <button
                    style={{
                      backgroundColor: 'green',
                      color: 'white',
                      padding: 10,
                      borderRadius: 5,
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                    onClick={() => addNodeToRoute(node)}
                  >
                    Start Trip
                  </button>) : nodeNotInRoute(node) && !navigate ? (
                    <button
                      style={{
                        backgroundColor: 'green',
                        color: 'white',
                        padding: 10,
                        borderRadius: 5,
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                      onClick={() => setRoute([...route, node])}
                    >
                      Add to route
                    </button>
                  ) : (
                  <p style={{
                    color: 'skyblue',
                  }}>
                    Already in route or navigating
                  </p>
                )
              }
            </Popup>
          </Marker>
        ))}
        <SetViewOnClick animateRef={animateRef} />
        <MinimapControl position="topright" zoom={5} />

        {navigate && (
          <RoutingControl position="bottomright" color="red" waypoints={route.map(node => node.position)} />
        )}
      </MapContainer>
    </div >
  )
}

export default App;
