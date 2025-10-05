import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Most projects export a named SettingsProvider:
import { SettingsProvider } from './Settings'
// If you get a build error saying it's not exported,
// use this instead:
// import SettingsProvider from './Settings'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
)