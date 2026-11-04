import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SWRConfig } from 'swr'
import { App } from './App'
import '../app/globals.css'

const root = document.getElementById('root')
if (!root) throw new Error('The application root is missing.')
createRoot(root).render(
  <StrictMode>
    <SWRConfig value={{ revalidateOnFocus: false, errorRetryCount: 1, dedupingInterval: 2000 }}>
      <App />
    </SWRConfig>
  </StrictMode>,
)
