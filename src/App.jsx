import { useState, useRef, useCallback, useMemo } from 'react'
import { useEventHandlers } from '@react-leaflet/core'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMapEvent, useMap, Rectangle } from 'react-leaflet'
import RoutingControl from './RoutingControl'

import './App.css'

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

const BOUNDS_STYLE = { weight: 1 }

function MinimapBounds({ parentMap, zoom }) {
  const minimap = useMap()

  // Clicking a point on the minimap sets the parent's map center
  const onClick = useCallback(
    (e) => {
      parentMap.setView(e.latlng, parentMap.getZoom())
    },
    [parentMap],
  )
  useMapEvent('click', onClick)

  // Keep track of bounds in state to trigger renders
  const [bounds, setBounds] = useState(parentMap.getBounds())
  const onChange = useCallback(() => {
    setBounds(parentMap.getBounds())
    // Update the minimap's view to match the parent map's center and zoom
    minimap.setView(parentMap.getCenter(), zoom)
  }, [minimap, parentMap, zoom])

  // Listen to events on the parent map
  const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [])
  useEventHandlers({ instance: parentMap }, handlers)

  return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />
}

function MinimapControl({ position, zoom }) {
  const parentMap = useMap()
  const mapZoom = zoom || 0

  // Memoize the minimap so it's not affected by position changes
  const minimap = useMemo(
    () => (
      <MapContainer
        style={{ height: 125, width: 125 }}
        center={parentMap.getCenter()}
        zoom={mapZoom}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
      </MapContainer>
    ),
    [],
  )

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright
  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{minimap}</div>
    </div>
  )
}


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
  const [start, setStart] = useState([13.7294053, 100.7758304])
  const [end, setEnd] = useState([13.7277969, 100.7648801])
  return (
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
      <RoutingControl
        position={'bottomright'}
        waypoints={[start, end]}
        color={'#757de8'}
      />

      <SetViewOnClick animateRef={animateRef} />
      <MinimapControl position="topright" />
    </MapContainer>
  )
}

export default App
