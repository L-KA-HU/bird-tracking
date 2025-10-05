import { tsToDate } from './times'

export default function TimeControl({
  time,
  timeRange,
  setTime,
  isTimeRunning,
  setIsTimeRunning,
}) {
  const [min = 0, max = 0] = timeRange || []
  const label = time
    ? tsToDate(time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''

  return (
    <div className="controls">
      <div className="timeControlLine">
        <button
          className="c-button c-button--icon"
          aria-label={isTimeRunning ? 'Pause' : 'Play'}
          onClick={() => setIsTimeRunning(!isTimeRunning)}
          title={isTimeRunning ? 'Pause' : 'Play'}
          style={{ marginRight: 8 }}
        >
          {isTimeRunning ? '▮▮' : '▶'}
        </button>

        <input
          type="range"
          min={min}
          max={max}
          step={3600}
          value={time}
          onChange={e => setTime(Number(e.target.value))}
          style={{ flex: 1 }}
        />

        <div style={{ width: 110, textAlign: 'right', marginLeft: 8 }}>
          {label}
        </div>
      </div>
    </div>
  )
}
