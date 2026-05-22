import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid #e03030',
          fontFamily: 'Outfit, sans-serif'
        },
        success: { iconTheme: { primary: '#e03030', secondary: '#0a0a0f' } },
        error: { iconTheme: { primary: '#ff4444', secondary: '#0a0a0f' } }
      }}
    />
  </BrowserRouter>
)
