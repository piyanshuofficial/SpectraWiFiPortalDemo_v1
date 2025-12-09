// src/App.js

import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppLayout from '@components/AppLayout';
import ErrorBoundary from '@components/ErrorBoundary';
import RouteLoader from '@components/RouteLoader';
import { useAuth } from '@context/AuthContext';
import { Permissions } from '@utils/accessLevels';
import { routes } from '@config/routes';
import '@components/Badge.css';

/**
 * PrivateRoute wrapper with permission checks
 */
const PrivateRoute = ({ requiredPermission, children, fallbackMessage }) => {
  const { currentUser } = useAuth();
  
  // Safety check: Allow access if no proper auth setup (development mode)
  if (!currentUser || !currentUser.role || !currentUser.accessLevel) {
    return children;
  }
  
  // Get user permissions
  const userPermissions = Permissions[currentUser.accessLevel]?.[currentUser.role];
  
  // If permissions not found, allow access (development mode)
  if (!userPermissions) {
    return children;
  }
  
  // Check specific permission
  const hasPermission = userPermissions[requiredPermission] === true;
  
  if (!hasPermission) {
    return (
      <div 
        className="permission-denied-container" 
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="permission-denied-content">
          <h2 id="access-denied-heading">Access Denied</h2>
          <p aria-describedby="access-denied-heading">
            {fallbackMessage || "You don't have permission to access this page."}
          </p>
          <p className="permission-denied-help">
            Please contact your administrator to request access.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/dashboard'}
            style={{ marginTop: '20px' }}
            aria-label="Return to dashboard page"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};

/**
 * Component to scroll to top on route change
 */
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top of page on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
};

/**
 * Component to update document title based on current route
 */
const DocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const currentRoute = routes.find(route => route.path === location.pathname);
    if (currentRoute && currentRoute.title) {
      document.title = `${currentRoute.title} | Spectra Portal`;
    } else {
      document.title = 'Spectra Portal';
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <DocumentTitle />
        <AppLayout>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Dynamic routes from configuration */}
              {routes.map((route) => {
                const Component = route.component;
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <PrivateRoute
                        requiredPermission={route.requiredPermission}
                        fallbackMessage={route.fallbackMessage}
                      >
                        <Component />
                      </PrivateRoute>
                    }
                  />
                );
              })}

              {/* Fallback to dashboard on unmatched route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;