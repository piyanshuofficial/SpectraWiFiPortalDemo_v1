// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { LoadingProvider } from './context/LoadingContext';
import { SegmentProvider } from './context/SegmentContext';
import { ThemeProvider } from './context/ThemeContext';

// Initialize i18n before App
import './i18n';

// Initialize Chart.js configuration globally
import './config/chartConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SegmentProvider>
          <UserProvider>
            <LoadingProvider>
              <App />
            </LoadingProvider>
          </UserProvider>
        </SegmentProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);