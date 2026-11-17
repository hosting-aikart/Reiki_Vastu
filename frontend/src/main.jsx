import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CatalogProvider } from './catalog/CatalogContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CatalogProvider>
      <App />
    </CatalogProvider>
  </StrictMode>,
)
