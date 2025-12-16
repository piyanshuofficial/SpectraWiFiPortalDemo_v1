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

// Customer Portal Routes
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ '../pages/Dashboard'));
const UserList = lazy(() => import(/* webpackChunkName: "user-management" */ '../pages/UserManagement/UserList'));
const DeviceList = lazy(() => import(/* webpackChunkName: "device-management" */ '../pages/DeviceManagement/DeviceList'));
const GuestManagement = lazy(() => import(/* webpackChunkName: "guest-management" */ '../pages/GuestManagement/GuestManagement'));
const ReportDashboard = lazy(() => import(/* webpackChunkName: "reports" */ '../pages/Reports/ReportDashboard'));
const KnowledgeHome = lazy(() => import(/* webpackChunkName: "knowledge-center" */ '../pages/KnowledgeCenter/KnowledgeHome'));
const ActivityLogs = lazy(() => import(/* webpackChunkName: "activity-logs" */ '../pages/ActivityLogs/ActivityLogs'));

// Internal Portal Routes
const InternalDashboard = lazy(() => import(/* webpackChunkName: "internal-dashboard" */ '../pages/Internal/InternalDashboard'));
const SiteManagement = lazy(() => import(/* webpackChunkName: "site-management" */ '../pages/Internal/SiteManagement'));
const CustomerManagement = lazy(() => import(/* webpackChunkName: "customer-management" */ '../pages/Internal/CustomerManagement'));
const InternalGuestManagement = lazy(() => import(/* webpackChunkName: "internal-guest-management" */ '../pages/Internal/InternalGuestManagement'));
const InternalAuditLogs = lazy(() => import(/* webpackChunkName: "internal-audit-logs" */ '../pages/Internal/AuditLogs'));
const SystemConfiguration = lazy(() => import(/* webpackChunkName: "system-configuration" */ '../pages/Internal/SystemConfiguration'));
const InternalKnowledgeCenter = lazy(() => import(/* webpackChunkName: "internal-knowledge" */ '../pages/Internal/InternalKnowledgeCenter'));
const InternalReports = lazy(() => import(/* webpackChunkName: "internal-reports" */ '../pages/Internal/InternalReports'));
const InternalSupport = lazy(() => import(/* webpackChunkName: "internal-support" */ '../pages/Internal/InternalSupport'));
const InternalAlerts = lazy(() => import(/* webpackChunkName: "internal-alerts" */ '../pages/Internal/InternalAlerts'));
const BulkOperations = lazy(() => import(/* webpackChunkName: "bulk-operations" */ '../pages/Internal/BulkOperations/BulkOperations'));

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
    path: '/guests',
    component: GuestManagement,
    requiredPermission: 'canEditUsers',
    fallbackMessage: 'You need user management permissions to access guest management.',
    title: 'Guest Management',
    exact: true,
    chunkName: 'guest-management'
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
  },
  // Internal Portal Routes
  {
    path: '/internal/dashboard',
    component: InternalDashboard,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'Internal Dashboard',
    exact: true,
    chunkName: 'internal-dashboard',
    isInternal: true
  },
  {
    path: '/internal/sites',
    component: SiteManagement,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'Site Management',
    exact: true,
    chunkName: 'site-management',
    isInternal: true
  },
  {
    path: '/internal/sites/:siteId',
    component: SiteManagement,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'Site Details',
    exact: true,
    chunkName: 'site-management',
    isInternal: true
  },
  {
    path: '/internal/customers',
    component: CustomerManagement,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'Customer Management',
    exact: true,
    chunkName: 'customer-management',
    isInternal: true
  },
  {
    path: '/internal/guests',
    component: InternalGuestManagement,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'Guest Access Management',
    exact: true,
    chunkName: 'internal-guest-management',
    isInternal: true
  },
  {
    path: '/internal/logs',
    component: InternalAuditLogs,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'Audit Logs',
    exact: true,
    chunkName: 'internal-audit-logs',
    isInternal: true
  },
  {
    path: '/internal/config',
    component: SystemConfiguration,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'System Configuration',
    exact: true,
    chunkName: 'system-configuration',
    isInternal: true
  },
  {
    path: '/internal/knowledge',
    component: InternalKnowledgeCenter,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'Internal Knowledge Base',
    exact: true,
    chunkName: 'internal-knowledge',
    isInternal: true
  },
  {
    path: '/internal/reports',
    component: InternalReports,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'Reports & Analytics',
    exact: true,
    chunkName: 'internal-reports',
    isInternal: true
  },
  {
    path: '/internal/support',
    component: InternalSupport,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'Support Queue',
    exact: true,
    chunkName: 'internal-support',
    isInternal: true
  },
  {
    path: '/internal/alerts',
    component: InternalAlerts,
    requiredPermission: 'canAccessInternalPortal',
    fallbackMessage: 'This page is only accessible to internal Spectra staff.',
    title: 'Alerts & Notifications',
    exact: true,
    chunkName: 'internal-alerts',
    isInternal: true
  },
  {
    path: '/internal/bulk-operations',
    component: BulkOperations,
    requiredPermission: 'canAccessBulkOperations',
    fallbackMessage: 'You need Super Admin access to use Bulk Operations.',
    title: 'Bulk Operations',
    exact: true,
    chunkName: 'bulk-operations',
    isInternal: true
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