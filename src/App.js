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

const PrivateRoute = ({ permissionCheck, children, fallbackMessage }) => {
  const { currentUser } = useAuth();
  const hasPermission = permissionCheck(currentUser);
  
  if (!hasPermission) {
    return (
      <div className="permission-denied-container" role="alert">
        <div className="permission-denied-content">
          <h2>Access Denied</h2>
          <p>{fallbackMessage || "You don't have permission to access this page."}</p>
          <p className="permission-denied-help">
            Please contact your administrator to request access.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/dashboard'}
            style={{ marginTop: '20px' }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
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
                fallbackMessage="You need report viewing permissions to access the dashboard."
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
                fallbackMessage="You need user management permissions to access this page."
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
                fallbackMessage="You need device management permissions to access this page."
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
                fallbackMessage="You need report viewing permissions to access this page."
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
                fallbackMessage="You need report viewing permissions to access the Knowledge Center."
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