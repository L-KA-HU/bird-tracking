import { useEffect, useMemo, useState } from 'react'
import { useSetting } from './Settings'
import { colorMapFor } from './colors'

const BASE = import.meta.env.BASE_URL || '/'
const withBase = p => (!p ? null : /^https?:\/\//.test(p) ? p : `${BASE}${p.replace(/^\/+/, '')}`)

// normalize helpers (tolerate NFC/NFD and also a “stripped” ASCII key)
const nfc = s => (s || '').normalize('NFC')
const strip = s => nfc(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

// === tweak sizes/layout here ===
const AVATAR = 110; // avatar diameter in px (try 56/64/72)
const PER_ROW = 3; // avatars per row

export default function BirdControls() {
  const [activeSpeciesList, setActiveSpeciesList] = useSetting('activeSpeciesList', [])
  const [highlightedSpecies, setHighlightedSpecies] = useSetting('highlightedSpecies', null)
  const [speed, setSpeed] = useSetting('speed', 1)

  const [species, setSpecies] = useState([])
  const [meta, setMeta] = useState({}) // lookup by normalized keys

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}birds.geojson`).then(r => r.json()).catch(() => ({ features: [] })),
      fetch(`${BASE}birds_meta.json`).then(r => r.json()).catch(() => []),
    ]).then(([j, metaArr]) => {
      const sp = [...new Set((j.features || []).map(f => f?.properties?.species).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b))
      setSpecies(sp)

      // tolerant meta lookup: both NFC and stripped ASCII keys
      const m = {}
      for (const it of metaArr) {
        if (!it?.id) continue
        m[nfc(it.id)] = it
        m[strip(it.id)] = it
      }
      setMeta(m)

      if (!activeSpeciesList || activeSpeciesList.length === 0) setActiveSpeciesList(sp)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const colors = useMemo(() => colorMapFor(species), [species])

  const toggle = (name) => {
    const set = new Set(activeSpeciesList || [])
    set.has(name) ? set.delete(name) : set.add(name)
    setActiveSpeciesList([...set])
  }

  const clearAll = () => setActiveSpeciesList([])
  const selectAll = () => setActiveSpeciesList(species)

  return (
    <div className="panel">
      <h2 className="u-mobileHidden">Általunk jelölt madarak</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={selectAll}>Select all</button>
        <button onClick={clearAll}>Clear</button>
      </div>

      {/* --- GRID of avatars --- */}
      <div className="legendGrid">
  {species.map(name => {
    const info = meta[nfc(name)] || meta[strip(name)] || {}
    const label = info.name || name
    const photo = withBase(info.photo)
    const col = colors[name] || [150,150,150]
    const rgb = `rgb(${col[0]}, ${col[1]}, ${col[2]})`

    return (
      <label key={name} className="legendItem">
        <img
          className="legendPhoto"
          src={photo}
          alt={label}
          style={{ '--legend-color': rgb }}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <span
          className="legendName"
          onMouseEnter={() => setHighlightedSpecies(name)}
          onMouseLeave={() => setHighlightedSpecies(null)}
        >
          {label}
        </span>
        <input
          type="checkbox"
          checked={(activeSpeciesList || []).includes(name)}
          onChange={() => toggle(name)}
        />
      </label>
    )
  })}
</div>
      <hr style={{ margin: '12px 0' }} />
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
        Speed
        <input
          type="range"
          min="0.25"
          max="8"
          step="0.25"
          value={speed || 1}
          onChange={e => setSpeed(parseFloat(e.target.value))}
        />
        <span>{speed || 1}×</span>
      </label>
    </div>
  )
}
