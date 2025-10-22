import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { Toaster } from 'react-hot-toast'; // 1. Import Toaster

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* 2. Add the Toaster component for notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#22c55e', // primary green
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#ef4444', // red
              color: 'white',
            },
          },
        }}
      />
      <App />
    </AuthProvider>
  </React.StrictMode>
);