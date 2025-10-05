import { useEffect, useLayoutEffect, useMemo, useState, useRef } from 'react'
import DeckGL from '@deck.gl/react'
import Map from 'react-map-gl/maplibre'
import { ANIMATION_SPEED } from './config'
import { TripsLayer } from '@deck.gl/geo-layers'
import { WebMercatorViewport } from '@deck.gl/core'
import { colorMapFor } from './colors'


const INITIAL_VIEW = {
  longitude: 19.0,
  latitude: 47.0,
  zoom: 5,
  minZoom: 0,
  maxZoom: 20,
}

// a small qualitative palette; we’ll loop through it if you have >10 birds
const PALETTE = [
  [227, 26, 28],   // red
  [31, 120, 180],  // blue
  [51, 160, 44],   // green
  [255, 127, 0],   // orange
  [106, 61, 154],  // purple
  [166, 206, 227], // light blue
  [178, 223, 138], // light green
  [251, 154, 153], // pink
  [253, 191, 111], // apricot
  [202, 178, 214], // lavender
]

const MapView = ({ time, data, highlightedSpecies }) => {
  const [tripLayer, setTripLayer] = useState(undefined)
  const [initialViewState, setInitialViewState] = useState(null)
  const mapContainer = useRef(null)

  // build a color for each species actually present in the data
  const speciesList = useMemo(
    () => Array.from(new Set((data || []).map(f => f?.properties?.species).filter(Boolean))),
    [data]
  )

const speciesColor = useMemo(() => colorMapFor(speciesList), [speciesList])

  const getColor = f => {
    const s = f?.properties?.species
    return speciesColor[s] || [160, 160, 160] // safe fallback
  }

  // (optional) center the map on your data bounds instead of the repo’s fixed bbox
  useLayoutEffect(() => {
    if (!initialViewState && data && data.length && mapContainer.current) {
      let minLon = 180, minLat = 90, maxLon = -180, maxLat = -90
      for (const f of data) {
        for (const [lon, lat] of f.geometry?.coordinates || []) {
          if (lon < minLon) minLon = lon
          if (lat < minLat) minLat = lat
          if (lon > maxLon) maxLon = lon
          if (lat > maxLat) maxLat = lat
        }
      }
      const mapDimensions = {
        width: mapContainer.current.clientWidth || 800,
        height: mapContainer.current.clientHeight || 600,
      }
      const { latitude, longitude, zoom } = new WebMercatorViewport(mapDimensions).fitBounds(
        [[minLon, minLat], [maxLon, maxLat]],
        { padding: 40 }
      )
      setInitialViewState({ ...INITIAL_VIEW, latitude, longitude, zoom })
    }
  }, [initialViewState, data])
// compute a trail long enough to cover the whole track
const maxTrail = useMemo(() => {
  if (!data || !data.length) return 3600;
  let max = 0;
  for (const f of data) {
    const t = f.properties?.times || [];
    if (t.length >= 2) {
      const dur = t[t.length - 1] - t[0];
      if (dur > max) max = dur;
    }
  }
  return Math.max(max, 3600); // at least 1h if data is tiny
}, [data]);

  useEffect(() => {
    setTripLayer(
      new TripsLayer({
        id: 'birds',
        data,
        currentTime: time,
        getTimestamps: d => d.properties.times,
        trailLength: maxTrail,
        getColor, // <- robust color
        getPath: d => d.geometry.coordinates,
        getWidth: d => (d.properties.species === highlightedSpecies ? 8 : 2),
        jointRounded: true,
        capRounded: true,
        opacity: 0.75,
        widthUnits: 'pixels',
        shadowEnabled: false,
        parameters: { blend: true },
        updateTriggers: {
          getWidth: highlightedSpecies,
          getColor: speciesList.join('|'), // retrigger when species set changes
        },
      })
    )
  }, [data, time, highlightedSpecies, speciesList])

  return (
    <div id="map" ref={mapContainer}>
      {initialViewState && (
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          layers={tripLayer ? [tripLayer] : []}
        >
          <Map
            attributionControl={false}
            mapStyle="https://demotiles.maplibre.org/style.json"
          />
        </DeckGL>
      )}
    </div>
  )
}

export default MapView