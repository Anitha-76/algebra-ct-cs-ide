import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css' // keeps your existing CSS intact for now

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)