import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'

// Legacy hash links (/#/privacy, /#/terms, /#/accept-invite) keep working: rewrite the URL to the
// clean path *before* BrowserRouter reads window.location, otherwise the router sees only "/".
const hash = window.location.hash
if (hash.startsWith('#/')) {
  window.history.replaceState(null, '', hash.slice(1))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
