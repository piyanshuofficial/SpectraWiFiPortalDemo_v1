/**
 * ============================================================================
 * Routes Configuration
 * ============================================================================
 *
 * @file src/config/routes.js
 * @description Centralized route configuration for both Customer Portal and
 *              Internal Portal. Uses React.lazy for code splitting and
 *              includes permission requirements for each route.
 *
 * @codeSplitting
 * All page components are lazy-loaded to reduce initial bundle size.
 * Each route gets its own webpack chunk, loaded only when navigated to.
 *
 * Chunk naming convention: webpackChunkName comment
 * Example: import(/* webpackChunkName: "dashboard" * / './Dashboard')
 *
 * @routeStructure
 * ```
 * Customer Portal Routes (/*)
 * ├── /dashboard          - Main dashboard (Dashboard.js)
 * ├── /users              - User management (UserList.js)
 * ├── /devices            - Device management (DeviceList.js)
 * ├── /guests             - Guest management (GuestManagement.js)
 * ├── /reports            - Reports (ReportDashboard.js)
 * ├── /knowledge          - Knowledge center (KnowledgeHome.js)
 * ├── /logs               - Activity logs (ActivityLogs.js)
 * └── /support            - Help & Support (Support.js)
 *
 * Internal Portal Routes (/internal/*)
 * ├── /internal/dashboard      - Internal dashboard
 * ├── /internal/sites          - Site management
 * ├── /internal/provisioning   - Provisioning queue
 * ├── /internal/customers      - Customer management
 * ├── /internal/guests         - Guest access management
 * ├── /internal/reports        - Internal reports
 * ├── /internal/support        - Support tickets
 * ├── /internal/alerts         - System alerts
 * ├── /internal/bulk-operations- Bulk operations
 * ├── /internal/logs           - Audit logs
 * ├── /internal/config         - System configuration
 * └── /internal/knowledge      - Internal knowledge base
 * ```
 *
 * @routeProperties
 * Each route object contains:
 * - path: URL path
 * - component: Lazy-loaded React component
 * - requiredPermission: Permission key from accessLevels.js
 * - fallbackMessage: Error message when permission denied
 * - title: Page title for document.title
 * - chunkName: Webpack chunk identifier
 *
 * @preloading
 * Routes can be preloaded on hover for faster navigation:
 * - preloadRoute(path): Triggers component load
 * - Used in Sidebar.js onMouseEnter
 *
 * @permissionGuards
 * Routes are wrapped with ProtectedRoute component:
 * 1. Checks if user is authenticated
 * 2. Checks if user has requiredPermission
 * 3. Shows fallbackMessage if denied
 * 4. Redirects to login if not authenticated
 *
 * @internalVsCustomer
 * Internal routes (/internal/*):
 * - Require canAccessInternalPortal permission
 * - Only visible to internal Spectra users
 * - Different layout and sidebar menu
 *
 * Customer routes (/*):
 * - Available to customer portal users
 * - Permissions vary by route
 * - Subject to segment-specific restrictions
 *
 * @suspenseBoundary
 * All routes are wrapped in React.Suspense:
 * - Shows loading spinner while chunk loads
 * - Prevents flash of content
 *
 * @relatedFiles
 * - App.js: Uses routes array for Route components
 * - ProtectedRoute.js: Permission guard wrapper
 * - Sidebar.js: Uses for navigation and preloading
 * - accessLevels.js: Permission definitions
 *
 * ============================================================================
 */

import { lazy } from 'react';

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
const Support = lazy(() => import(/* webpackChunkName: "support" */ '../pages/Support/Support'));

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
const SiteProvisioningQueue = lazy(() => import(/* webpackChunkName: "site-provisioning" */ '../pages/Internal/SiteProvisioningQueue'));

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
  {
    path: '/support',
    component: Support,
    requiredPermission: 'canViewReports',
    fallbackMessage: 'You need basic access to view the Help & Support section.',
    title: 'Help & Support',
    exact: true,
    chunkName: 'support'
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
  },
  {
    path: '/internal/provisioning',
    component: SiteProvisioningQueue,
    requiredPermission: 'canAccessProvisioningQueue',
    fallbackMessage: 'You need Deployment Engineer or higher access to use the Site Provisioning Queue.',
    title: 'Site Provisioning Queue',
    exact: true,
    chunkName: 'site-provisioning',
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