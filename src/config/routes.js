// src/config/routes.js

import { lazy } from 'react';

/**
 * Centralized Route Configuration
 * 
 * Benefits:
 * - Code splitting: Each route loaded on-demand
 * - Maintainability: All routes in one place
 * - Scalability: Easy to add/modify routes
 * - Performance: Smaller initial bundle
 */

// ============================================
// LAZY-LOADED ROUTE COMPONENTS
// ============================================

const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ '../pages/Dashboard'));
const UserList = lazy(() => import(/* webpackChunkName: "user-management" */ '../pages/UserManagement/UserList'));
const DeviceList = lazy(() => import(/* webpackChunkName: "device-management" */ '../pages/DeviceManagement/DeviceList'));
const ReportDashboard = lazy(() => import(/* webpackChunkName: "reports" */ '../pages/Reports/ReportDashboard'));
const KnowledgeHome = lazy(() => import(/* webpackChunkName: "knowledge-center" */ '../pages/KnowledgeCenter/KnowledgeHome'));
const ActivityLogs = lazy(() => import(/* webpackChunkName: "activity-logs" */ '../pages/ActivityLogs/ActivityLogs'));

// ============================================
// ROUTE DEFINITIONS
// ============================================

/**
 * Route configuration array
 * @typedef {Object} RouteConfig
 * @property {string} path - Route path
 * @property {React.ComponentType} component - Lazy-loaded component
 * @property {string} requiredPermission - Permission key from Permissions object
 * @property {string} fallbackMessage - Message shown when permission denied
 * @property {string} title - Page title for document.title
 * @property {boolean} exact - Whether route should match exactly
 * @property {string} chunkName - Webpack chunk name for debugging
 */

export const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    requiredPermission: 'canViewReports',
    fallbackMessage: 'You need report viewing permissions to access the dashboard.',
    title: 'Dashboard',
    exact: true,
    chunkName: 'dashboard'
  },
  {
    path: '/users',
    component: UserList,
    requiredPermission: 'canEditUsers',
    fallbackMessage: 'You need user management permissions to access this page.',
    title: 'User Management',
    exact: true,
    chunkName: 'user-management'
  },
  {
    path: '/devices',
    component: DeviceList,
    requiredPermission: 'canManageDevices',
    fallbackMessage: 'You need device management permissions to access this page.',
    title: 'Device Management',
    exact: true,
    chunkName: 'device-management'
  },
  {
    path: '/reports',
    component: ReportDashboard,
    requiredPermission: 'canViewReports',
    fallbackMessage: 'You need report viewing permissions to access this page.',
    title: 'Reports',
    exact: true,
    chunkName: 'reports'
  },
  {
    path: '/knowledge',
    component: KnowledgeHome,
    requiredPermission: 'canViewReports',
    fallbackMessage: 'You need report viewing permissions to access the Knowledge Center.',
    title: 'Knowledge Center',
    exact: true,
    chunkName: 'knowledge-center'
  },
  {
    path: '/logs',
    component: ActivityLogs,
    requiredPermission: 'canViewLogs',
    fallbackMessage: 'You need administrator or manager access to view activity logs.',
    title: 'Activity Logs',
    exact: true,
    chunkName: 'activity-logs'
  }
];

/**
 * Get route configuration by path
 * @param {string} path - Route path
 * @returns {RouteConfig|undefined}
 */
export const getRouteByPath = (path) => {
  return routes.find(route => route.path === path);
};

/**
 * Get all routes requiring specific permission
 * @param {string} permission - Permission key
 * @returns {RouteConfig[]}
 */
export const getRoutesByPermission = (permission) => {
  return routes.filter(route => route.requiredPermission === permission);
};

/**
 * Preload a route component
 * Useful for predictive loading on hover/focus
 * @param {string} path - Route path to preload
 */
export const preloadRoute = (path) => {
  const route = getRouteByPath(path);
  if (route && route.component && route.component.preload) {
    route.component.preload();
  }
};

/**
 * Preload multiple routes
 * @param {string[]} paths - Array of route paths
 */
export const preloadRoutes = (paths) => {
  paths.forEach(path => preloadRoute(path));
};

export default routes;