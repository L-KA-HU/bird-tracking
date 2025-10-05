import React, { createContext, useContext, useEffect, useState } from 'react'

const SettingsContext = createContext(null)

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('settings') || '{}')
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('settings', JSON.stringify(settings))
    } catch {
      /* ignore storage errors */
    }
  }, [settings])

  const setSetting = (key, value) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  return (
    <SettingsContext.Provider value={{ settings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSetting = (key, defaultValue = null) => {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSetting must be used inside <SettingsProvider>')
  }
  const value = Object.prototype.hasOwnProperty.call(ctx.settings, key)
    ? ctx.settings[key]
    : defaultValue
  const setValue = v => ctx.setSetting(key, v)
  return [value, setValue]
}

