// src/api/apiConfig.js
// API Configuration - Update these values when backend is ready

export const API_CONFIG = {
  // Base URL for API calls - update when backend is deployed
  BASE_URL: process.env.REACT_APP_API_URL || '/api',

  // WebSocket URL for real-time updates
  WS_URL: process.env.REACT_APP_WS_URL || 'wss://api.example.com/ws',

  // Request timeout in milliseconds
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // Base delay in ms
    RETRY_MULTIPLIER: 2, // Exponential backoff multiplier
    RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504]
  },

  // Cache configuration
  CACHE: {
    DEVICE_STATUS_TTL: 30000, // 30 seconds
    USER_LIST_TTL: 60000, // 1 minute
    STATIC_DATA_TTL: 300000 // 5 minutes
  },

  // Polling intervals (fallback for WebSocket)
  POLLING: {
    DEVICE_STATUS: 10000, // 10 seconds
    ACTIVITY_FEED: 30000, // 30 seconds
    NOTIFICATIONS: 60000 // 1 minute
  }
};

// API Endpoints - centralized endpoint definitions
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify'
  },

  // Users
  USERS: {
    LIST: '/users',
    GET: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    SUSPEND: (id) => `/users/${id}/suspend`,
    ACTIVATE: (id) => `/users/${id}/activate`,
    BLOCK: (id) => `/users/${id}/block`,
    BULK_IMPORT: '/users/bulk-import'
  },

  // Devices
  DEVICES: {
    LIST: '/devices',
    GET: (id) => `/devices/${id}`,
    CREATE: '/devices',
    UPDATE: (id) => `/devices/${id}`,
    DELETE: (id) => `/devices/${id}`,
    DISCONNECT: (id) => `/devices/${id}/disconnect`,
    STATUS: '/devices/status',
    STATUS_DELTA: '/devices/status-delta',
    BULK_IMPORT: '/devices/bulk-import'
  },

  // Reports
  REPORTS: {
    LIST: '/reports',
    GENERATE: '/reports/generate',
    EXPORT_CSV: '/reports/export/csv',
    EXPORT_PDF: '/reports/export/pdf'
  },

  // Activity Logs
  LOGS: {
    LIST: '/logs',
    EXPORT: '/logs/export'
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    CHARTS: '/dashboard/charts',
    ACTIVITIES: '/dashboard/activities',
    ALERTS: '/dashboard/alerts'
  },

  // Site Configuration
  SITE: {
    CONFIG: '/site/config',
    LICENSES: '/site/licenses'
  }
};

// Feature flags for gradual backend integration
export const API_FEATURES = {
  // Set to true when backend is ready for each feature
  USE_REAL_AUTH: false,
  USE_REAL_USERS: false,
  USE_REAL_DEVICES: false,
  USE_REAL_REPORTS: false,
  USE_REAL_LOGS: false,
  USE_WEBSOCKET: false
};

export default API_CONFIG;
