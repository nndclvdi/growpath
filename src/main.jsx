import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Pastikan Anda mengimpor AppProvider dengan path yang benar
import { AppProvider } from './context/AppContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. BUNGKUS APLIKASI ANDA DI SINI */}
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)