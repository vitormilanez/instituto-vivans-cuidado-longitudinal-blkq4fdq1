import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { VivansProvider } from '@/context/VivansContext'
import App from './App'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <VivansProvider>
        <App />
      </VivansProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
