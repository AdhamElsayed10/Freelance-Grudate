import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ScrollToTop from './components/ScrollToTop'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <LanguageProvider>
            <ScrollToTop />
            <App />
          </LanguageProvider>
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
