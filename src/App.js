// src/App.js

import React, { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppLayout from '@components/AppLayout';
import ErrorBoundary from '@components/ErrorBoundary';
import RouteLoader from '@components/RouteLoader';
import SupportChatbot from '@components/SupportChatbot';
import CustomerViewBanner from '@components/CustomerViewBanner';
import { useAuth } from '@context/AuthContext';
import { useCustomerView } from '@context/CustomerViewContext';
import { Permissions, InternalPermissions, UserTypes } from '@utils/accessLevels';
import { routes } from '@config/routes';
import '@components/Badge.css';

// Pre-import critical CSS to prevent flash of unstyled content (FOUC)
// These CSS files are loaded upfront to ensure styles are available before components render
import '@pages/Dashboard.css';
import '@pages/Internal/InternalDashboard.css';
import '@pages/Internal/SiteManagement.css';
import '@pages/Internal/CustomerManagement.css';
import '@pages/UserManagement/UserManagement.css';
import '@pages/DeviceManagement/DeviceList.css';
import '@pages/Reports/ReportDashboard.css';
import '@pages/KnowledgeCenter/KnowledgeHome.css';
import '@pages/ActivityLogs/ActivityLogs.css';

// Lazy load auth pages
const Login = lazy(() => import('@pages/Auth/Login'));
const ForgotDetails = lazy(() => import('@pages/Auth/ForgotDetails'));

/**
 * PrivateRoute wrapper with permission checks
 */
const PrivateRoute = ({ requiredPermission, children, fallbackMessage }) => {
  const { currentUser, isAuthenticated, userPermissions } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Safety check: Allow access if no proper auth setup (development mode)
  if (!currentUser || !currentUser.role) {
    return children;
  }

  // Get user permissions based on user type
  let permissions = userPermissions;

  // If permissions object is empty, fall back to direct lookup
  if (!permissions || Object.keys(permissions).length === 0) {
    if (currentUser.userType === UserTypes.INTERNAL) {
      permissions = InternalPermissions[currentUser.role];
    } else {
      permissions = Permissions[currentUser.accessLevel]?.[currentUser.role];
    }
  }

  // If permissions not found, allow access (development mode)
  if (!permissions) {
    return children;
  }

  // Check specific permission
  const hasPermission = permissions[requiredPermission] === true;

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
 * Public route - redirects to dashboard if already authenticated
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to the page they came from, or dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
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
    // Check auth routes first
    if (location.pathname === '/login') {
      document.title = 'Login | Spectra Portal';
      return;
    }
    if (location.pathname === '/forgot-details') {
      document.title = 'Forgot Details | Spectra Portal';
      return;
    }

    const currentRoute = routes.find(route => route.path === location.pathname);
    if (currentRoute && currentRoute.title) {
      document.title = `${currentRoute.title} | Spectra Portal`;
    } else {
      document.title = 'Spectra Portal';
    }
  }, [location]);

  return null;
};

/**
 * Customer Chatbot Wrapper - only shows on non-internal routes
 */
const CustomerChatbotWrapper = () => {
  const location = useLocation();
  const isInternalPortal = location.pathname.startsWith('/internal');

  // Only show chatbot for customer portal (non-internal routes)
  if (isInternalPortal) {
    return null;
  }

  return <SupportChatbot />;
};

/**
 * Customer View Mode Handler
 * Manages body class and renders banner when in impersonation mode
 */
const CustomerViewModeHandler = () => {
  const { isImpersonating } = useCustomerView();

  useEffect(() => {
    if (isImpersonating) {
      document.body.classList.add('customer-view-active');
    } else {
      document.body.classList.remove('customer-view-active');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('customer-view-active');
    };
  }, [isImpersonating]);

  return <CustomerViewBanner />;
};

/**
 * Main authenticated app content with layout
 */
const AuthenticatedApp = () => {
  return (
    <>
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
      {/* AI Support Chatbot - only for customer portal (rendered outside AppLayout for proper fixed positioning) */}
      <CustomerChatbotWrapper />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <DocumentTitle />
        <CustomerViewModeHandler />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* Public auth routes - no layout */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-details"
              element={
                <PublicRoute>
                  <ForgotDetails />
                </PublicRoute>
              }
            />

            {/* All other routes go through authenticated app */}
            <Route path="/*" element={<AuthenticatedApp />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
