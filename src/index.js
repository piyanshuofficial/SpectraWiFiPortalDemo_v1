// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/Button.css'; // Global button styles
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AccessLevelViewProvider } from './context/AccessLevelViewContext';
import { UserProvider } from './context/UserContext';
import { LoadingProvider } from './context/LoadingContext';
import { SegmentProvider } from './context/SegmentContext';
import { ThemeProvider } from './context/ThemeContext';
import { ScheduledTasksProvider } from './context/ScheduledTasksContext';
import { CustomerViewProvider } from './context/CustomerViewContext';

// Initialize i18n before App
import './i18n';

// Initialize Chart.js configuration globally
import './config/chartConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ScheduledTasksProvider>
          <AccessLevelViewProvider>
            <SegmentProvider>
              <CustomerViewProvider>
                <UserProvider>
                  <LoadingProvider>
                    <App />
                  </LoadingProvider>
                </UserProvider>
              </CustomerViewProvider>
            </SegmentProvider>
          </AccessLevelViewProvider>
        </ScheduledTasksProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);