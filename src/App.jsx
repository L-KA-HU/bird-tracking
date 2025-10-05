import Panel from './Panel'
import MapView from './MapView'
import { useState, useEffect, useMemo, useRef } from 'react'
import { ANIMATION_SPEED, AUTO_PLAY } from './config'
import { getTimeRange } from './times'
import { usePageVisibility } from './usePageVisibility'
import { useSetting } from './Settings'

const BASE = import.meta.env.BASE_URL || '/'

const App = () => {
  const [data, setData] = useState([])
  const [timeRange, setTimeRange] = useState([])
  const [time, setTime] = useState(0)
  const [isTimeRunning, setIsTimeRunning] = useState(false)
  const updateHandle = useRef(null)

  const [highlightedSpecies] = useSetting('highlightedSpecies')
  const [activeSpeciesList] = useSetting('activeSpeciesList', [])
  const [speed] = useSetting('speed')

  const isPageVisible = usePageVisibility()

  // Load data (always remove the loading overlay, even on errors)
  useEffect(() => {
    document.body.classList.add('loading')
    fetch(`${BASE}birds.geojson`, { cache: 'no-cache' })
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load birds.geojson: ${r.status}`)
        return r.json()
      })
      .then(j => setData(Array.isArray(j?.features) ? j.features : []))
      .catch(err => {
        console.error('[data] load error:', err)
        setData([])
      })
      .finally(() => {
        document.body.classList.remove('loading')
      })
  }, [])

  // Time range from actual data (no merging)
  useEffect(() => {
    if (data.length > 0) {
      const [minTime, maxTime] = getTimeRange(data, false) // <- never merge
      setTimeRange([minTime, maxTime])
      setTime(minTime)
      if (AUTO_PLAY) setIsTimeRunning(true)
    }
  }, [data])

  // Pause/resume with space bar
  useEffect(() => {
    const pauseOnSpace = e => {
      if (e.key === ' ' && data.length !== 0 && !['BUTTON', 'A', 'INPUT'].includes(e.target?.tagName)) {
        setIsTimeRunning(prev => !prev)
      }
    }
    document.body.addEventListener('keypress', pauseOnSpace)
    return () => document.body.removeEventListener('keypress', pauseOnSpace)
  }, [data])

  // Animation timer
  useEffect(() => {
    if (isPageVisible && isTimeRunning && !updateHandle.current) {
      updateHandle.current = setInterval(() => {
        setTime(t => t + ANIMATION_SPEED * speed)
      }, 50)
    }
    return () => {
      if (updateHandle.current) {
        clearInterval(updateHandle.current)
        updateHandle.current = null
      }
    }
  }, [isTimeRunning, setTime, speed, isPageVisible])

  // Loop back to start
  useEffect(() => {
    if (time > timeRange[1]) setTime(timeRange[0])
  }, [time, timeRange, setTime])

  // Only filter by selection; no time transformation
  const transformedData = useMemo(() => {
    const allSpecies = Array.from(new Set(data.map(d => d.properties.species)))
    const hasValidSelection = (activeSpeciesList?.length ?? 0) > 0 && activeSpeciesList.some(s => allSpecies.includes(s))
    return hasValidSelection ? data.filter(d => activeSpeciesList.includes(d.properties.species)) : data
  }, [data, activeSpeciesList])

  return (
    <>
      <div id="layout">
        <MapView time={time} data={transformedData} highlightedSpecies={highlightedSpecies} />
        <Panel
          time={time}
          timeRange={timeRange}
          setTime={setTime}
          isTimeRunning={isTimeRunning}
          setIsTimeRunning={setIsTimeRunning}
        />
      </div>
      {data.length === 0 && <div id="loading">Please wait for data to be fetched…</div>}
    </>
  )
}

export default App
