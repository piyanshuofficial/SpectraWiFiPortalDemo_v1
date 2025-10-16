// src/App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserManagement/UserList';
import DeviceManagement from './pages/DeviceManagement/DeviceList';
import Reports from './pages/Reports/ReportDashboard';
import KnowledgeCenter from './pages/KnowledgeCenter/KnowledgeHome';

import { useAuth } from './context/AuthContext';
import { Permissions } from './utils/accessLevels';
import "./components/Badge.css";


const PrivateRoute = ({ permissionCheck, children }) => {
  const { currentUser } = useAuth();
  if (!permissionCheck(currentUser)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                permissionCheck={(user) =>
                  Permissions[user.accessLevel]?.[user.role]?.canViewReports
                }
              >
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute
                permissionCheck={(user) =>
                  Permissions[user.accessLevel]?.[user.role]?.canEditUsers
                }
              >
                <UserList />
              </PrivateRoute>
            }
          />

          <Route
            path="/devices"
            element={
              <PrivateRoute
                permissionCheck={(user) =>
                  Permissions[user.accessLevel]?.[user.role]?.canManageDevices
                }
              >
                <DeviceManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <PrivateRoute
                permissionCheck={(user) =>
                  Permissions[user.accessLevel]?.[user.role]?.canViewReports
                }
              >
                <Reports />
              </PrivateRoute>
            }
          />

          <Route
            path="/knowledge"
            element={
              <PrivateRoute
                permissionCheck={(user) =>
                  Permissions[user.accessLevel]?.[user.role]?.canViewReports
                }
              >
                <KnowledgeCenter />
              </PrivateRoute>
            }
          />

          {/* Fallback to dashboard on unmatched route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
