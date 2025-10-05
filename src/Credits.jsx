// src/Credits.jsx
const Credits = () => {
  return (
    <footer className="credits">
      <p>
        Map background: ©{' '}
        <a href="https://carto.com/" target="_blank" rel="noreferrer">CARTO</a> ·
        ©{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
          OpenStreetMap
        </a>{' '}
        contributors
      </p>
      <p>
        Built with <a href="https://deck.gl/" target="_blank" rel="noreferrer">deck.gl</a> &{' '}
        <a href="https://maplibre.org/" target="_blank" rel="noreferrer">MapLibre GL</a>.{' '}
        Source code:{' '}
        <a href="https://github.com/L-KA-HU/bird-tracking" target="_blank" rel="noreferrer">
          GitHub
        </a>.
      </p>
      <p>Author: Lovas-Kiss Ádám, code based on the work of Benjamin Becquet</p>
    </footer>
  )
}

export default Credits
