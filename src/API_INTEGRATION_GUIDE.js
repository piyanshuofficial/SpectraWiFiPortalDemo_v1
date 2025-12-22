/**
 * ============================================================================
 * SPECTRA PORTAL - BACKEND API INTEGRATION GUIDE
 * ============================================================================
 *
 * This file provides a comprehensive overview of all backend integration points
 * required to make the portal fully functional. Each section corresponds to
 * specific features in the application.
 *
 * IMPORTANT: Search for "BACKEND INTEGRATION" in the codebase to find all
 * integration points with detailed documentation in context.
 *
 * ============================================================================
 */

/**
 * ============================================================================
 * 1. AUTHENTICATION & AUTHORIZATION
 * ============================================================================
 * Files: src/pages/Auth/Login.js, src/context/AuthContext.js
 */
const AuthenticationAPI = {
  /**
   * User login with username/password
   */
  login: {
    endpoint: 'POST /api/v1/auth/login',
    request: {
      loginId: 'string',      // Username or email
      password: 'string',
      rememberMe: 'boolean'
    },
    response: {
      accessToken: 'JWT token',
      refreshToken: 'JWT token',
      expiresIn: 'number (seconds)',
      user: {
        id: 'string',
        name: 'string',
        email: 'string',
        role: 'admin|manager|user',
        userType: 'CUSTOMER|INTERNAL',
        segment: 'Enterprise|Hotel|CoLiving|CoWorking|PG|Misc',
        companyId: 'string',
        siteId: 'string (nullable)',
        permissions: ['canEditUsers', 'canManageDevices', '...']
      }
    }
  },

  /**
   * OTP-based login
   */
  sendOtp: {
    endpoint: 'POST /api/v1/auth/send-otp',
    request: { mobileNumber: 'string', countryCode: 'string' },
    response: { otpId: 'string', expiresIn: 'number' }
  },

  verifyOtp: {
    endpoint: 'POST /api/v1/auth/verify-otp',
    request: { otpId: 'string', otp: 'string', mobileNumber: 'string' },
    response: { /* Same as login response */ }
  },

  /**
   * Password recovery
   */
  forgotPassword: {
    endpoint: 'POST /api/v1/auth/forgot-password',
    request: { type: 'serviceId|username', value: 'string' },
    response: { message: 'string', maskedEmail: 'string' }
  },

  /**
   * Token refresh
   */
  refreshToken: {
    endpoint: 'POST /api/v1/auth/refresh',
    request: { refreshToken: 'string' },
    response: { accessToken: 'string', expiresIn: 'number' }
  },

  /**
   * Logout
   */
  logout: {
    endpoint: 'POST /api/v1/auth/logout',
    request: { refreshToken: 'string' },
    response: { success: 'boolean' }
  }
};

/**
 * ============================================================================
 * 2. USER MANAGEMENT
 * ============================================================================
 * Files: src/pages/UserManagement/UserList.js, src/pages/UserManagement/UserFormModal.js
 */
const UserManagementAPI = {
  /**
   * List users with filtering and pagination
   */
  listUsers: {
    endpoint: 'GET /api/v1/users',
    query: {
      siteId: 'string',
      segment: 'string',
      status: 'Active|Suspended|Blocked',
      policy: 'string',
      search: 'string',
      page: 'number',
      limit: 'number'
    },
    response: {
      users: [/* User objects */],
      totalCount: 'number',
      stats: {
        total: 'number',
        active: 'number',
        suspended: 'number',
        blocked: 'number'
      }
    }
  },

  /**
   * Create new user
   */
  createUser: {
    endpoint: 'POST /api/v1/users',
    request: {
      userId: 'string',
      firstName: 'string',
      lastName: 'string',
      email: 'string',
      mobile: 'string',
      policy: {
        speedLimit: 'string',
        dataVolume: 'string',
        deviceLimit: 'number',
        cycleType: 'Daily|Monthly'
      },
      checkInDate: 'ISO8601 (optional)',
      checkOutDate: 'ISO8601 (optional)',
      segment: 'string',
      siteId: 'string'
    },
    response: {
      userId: 'string',
      password: 'string (auto-generated)',
      credentialsSent: 'boolean'
    },
    backendProcessing: [
      '1. Validate user data',
      '2. Check license availability',
      '3. Generate password',
      '4. Create user in database',
      '5. Provision in AAA/RADIUS system',
      '6. Send credentials via SMS/Email',
      '7. Create audit log entry'
    ]
  },

  /**
   * Update user
   */
  updateUser: {
    endpoint: 'PUT /api/v1/users/{userId}',
    request: { /* Partial user object */ },
    response: { user: '/* Updated user object */' }
  },

  /**
   * Delete user
   */
  deleteUser: {
    endpoint: 'DELETE /api/v1/users/{userId}',
    backendProcessing: [
      '1. Disconnect active sessions',
      '2. Remove from AAA system',
      '3. Soft-delete in database',
      '4. Free up license',
      '5. Create audit log'
    ]
  },

  /**
   * Change user status (suspend/block/activate)
   */
  changeStatus: {
    endpoint: 'PATCH /api/v1/users/{userId}/status',
    request: { status: 'Active|Suspended|Blocked', reason: 'string' },
    backendProcessing: [
      'Suspend: Temporarily disable in AAA, keep license consumed',
      'Block: Permanently disable, free license',
      'Activate: Re-enable in AAA'
    ]
  },

  /**
   * Resend credentials
   */
  resendCredentials: {
    endpoint: 'POST /api/v1/users/{userId}/resend-credentials',
    request: { method: 'email|sms|both', regeneratePassword: 'boolean' }
  },

  /**
   * Bulk import users
   */
  bulkImport: {
    endpoint: 'POST /api/v1/users/bulk-import',
    request: { file: 'CSV file', segment: 'string', siteId: 'string' },
    response: {
      imported: 'number',
      failed: 'number',
      errors: [{ row: 'number', error: 'string' }]
    }
  }
};

/**
 * ============================================================================
 * 3. DEVICE MANAGEMENT
 * ============================================================================
 * Files: src/pages/DeviceManagement/DeviceList.js
 */
const DeviceManagementAPI = {
  /**
   * List devices
   */
  listDevices: {
    endpoint: 'GET /api/v1/devices',
    query: {
      siteId: 'string',
      segment: 'string',
      type: 'user|digital',
      status: 'online|offline|blocked',
      search: 'string',
      page: 'number',
      limit: 'number'
    },
    response: {
      devices: [/* Device objects */],
      totalCount: 'number',
      onlineCount: 'number',
      stats: { /* Device statistics */ }
    }
  },

  /**
   * Register device
   */
  registerDevice: {
    endpoint: 'POST /api/v1/devices',
    request: {
      macAddress: 'string (XX:XX:XX:XX:XX:XX)',
      deviceName: 'string',
      deviceType: 'laptop|mobile|tablet|printer|camera|...',
      userId: 'string (for user devices)',
      priority: 'high|medium|low',
      segment: 'string',
      siteId: 'string'
    },
    backendProcessing: [
      '1. Validate MAC address format',
      '2. Check MAC uniqueness',
      '3. Verify user device limit',
      '4. OUI lookup for vendor info',
      '5. Register in AAA system',
      '6. Add to whitelist/MAC auth',
      '7. Create database record'
    ]
  },

  /**
   * Disconnect device
   */
  disconnectDevice: {
    endpoint: 'POST /api/v1/devices/{deviceId}/disconnect',
    backendProcessing: [
      '1. Send CoA (Change of Authorization) to NAS',
      '2. Clear session from RADIUS',
      '3. Force deauth via controller API'
    ]
  },

  /**
   * Block device
   */
  blockDevice: {
    endpoint: 'PATCH /api/v1/devices/{deviceId}/block',
    request: { reason: 'string' }
  },

  /**
   * Real-time device status (WebSocket)
   */
  deviceStatusWebSocket: {
    endpoint: 'WSS /api/v1/ws/devices/{siteId}',
    events: [
      'DEVICE_ONLINE',
      'DEVICE_OFFLINE',
      'DEVICE_BLOCKED',
      'DATA_USAGE_UPDATE'
    ]
  }
};

/**
 * ============================================================================
 * 4. GUEST MANAGEMENT
 * ============================================================================
 * Files: src/pages/GuestManagement/GuestManagement.js
 */
const GuestManagementAPI = {
  /**
   * List guests
   */
  listGuests: {
    endpoint: 'GET /api/v1/guests',
    query: {
      siteId: 'string',
      segment: 'string',
      status: 'active|checked_in|checked_out|expired|pending',
      guestType: 'string',
      page: 'number',
      limit: 'number'
    }
  },

  /**
   * Create guest
   */
  createGuest: {
    endpoint: 'POST /api/v1/guests',
    request: {
      firstName: 'string',
      lastName: 'string',
      mobile: 'string',
      email: 'string (optional)',
      guestType: 'string',
      duration: 'string (24h, 48h, 7d)',
      hostId: 'string',
      purposeOfVisit: 'string',
      siteId: 'string',
      segment: 'string'
    },
    response: {
      guestId: 'string',
      accessCode: 'string',
      validFrom: 'ISO8601',
      validUntil: 'ISO8601',
      credentials: { ssid: 'string', username: 'string', password: 'string' }
    }
  },

  /**
   * Extend guest access
   */
  extendAccess: {
    endpoint: 'PATCH /api/v1/guests/{guestId}/extend',
    request: { duration: 'string', durationHours: 'number' }
  },

  /**
   * Revoke guest access
   */
  revokeAccess: {
    endpoint: 'PATCH /api/v1/guests/{guestId}/revoke',
    request: { forceDisconnect: 'boolean', reason: 'string' }
  },

  /**
   * Generate vouchers
   */
  generateVouchers: {
    endpoint: 'POST /api/v1/guests/vouchers/bulk',
    request: {
      quantity: 'number (1-100)',
      guestType: 'string',
      duration: 'string',
      prefix: 'string',
      siteId: 'string',
      segment: 'string'
    },
    response: {
      batchId: 'string',
      vouchers: [{ id: 'string', code: 'string', validityHours: 'number' }]
    }
  }
};

/**
 * ============================================================================
 * 5. DASHBOARD & ANALYTICS
 * ============================================================================
 * Files: src/pages/Dashboard.js
 */
const DashboardAPI = {
  /**
   * Dashboard metrics
   */
  getMetrics: {
    endpoint: 'GET /api/v1/dashboard/metrics',
    query: { siteId: 'string', segment: 'string', companyView: 'boolean' },
    response: {
      activeUsers: 'number',
      activeUsersDelta: 'number',
      licenseUsagePercent: 'number',
      dataUsageTB: 'number',
      networkUptime: 'number',
      totalAlerts: 'number',
      criticalAlerts: 'number',
      activeGuests: 'number'
    }
  },

  /**
   * Network usage chart data
   */
  getNetworkUsage: {
    endpoint: 'GET /api/v1/dashboard/charts/network-usage',
    query: { siteId: 'string', segment: 'string', days: 'number' },
    response: { data: [{ date: 'YYYY-MM-DD', usageGB: 'number' }] }
  },

  /**
   * User distribution by speed tier
   */
  getSpeedDistribution: {
    endpoint: 'GET /api/v1/dashboard/charts/speed-distribution',
    response: { data: [{ speedTier: 'string', userCount: 'number' }] }
  },

  /**
   * Peak usage hours
   */
  getPeakUsage: {
    endpoint: 'GET /api/v1/dashboard/charts/peak-usage',
    response: { data: [{ period: 'string', usage: 'number' }] }
  },

  /**
   * Recent activities
   */
  getActivities: {
    endpoint: 'GET /api/v1/dashboard/activities',
    query: { siteId: 'string', segment: 'string', limit: 'number' },
    response: {
      activities: [{
        id: 'string',
        type: 'string',
        user: 'string',
        action: 'string',
        timestamp: 'ISO8601'
      }]
    }
  }
};

/**
 * ============================================================================
 * 6. ACTIVITY LOGS
 * ============================================================================
 * Files: src/pages/ActivityLogs/ActivityLogs.js
 */
const ActivityLogsAPI = {
  /**
   * Get activity logs
   */
  getLogs: {
    endpoint: 'GET /api/v1/activity-logs',
    query: {
      siteId: 'string',
      segment: 'string',
      category: 'user|device|system|auth',
      action: 'CREATE|UPDATE|DELETE|LOGIN|LOGOUT',
      dateRange: 'number (days)',
      performedBy: 'string',
      search: 'string',
      page: 'number',
      limit: 'number',
      sortBy: 'string',
      sortOrder: 'asc|desc'
    },
    response: {
      logs: [{
        id: 'string',
        timestamp: 'ISO8601',
        action: 'string',
        entity: 'string',
        category: 'string',
        target: 'string',
        details: 'string',
        performedBy: { id: 'string', name: 'string', role: 'string' },
        ipAddress: 'string',
        siteId: 'string',
        metadata: { oldValue: 'object', newValue: 'object' }
      }],
      totalCount: 'number'
    }
  }
};

/**
 * ============================================================================
 * 7. INTERNAL PORTAL APIs
 * ============================================================================
 * Files: src/pages/Internal/*
 */
const InternalPortalAPI = {
  /**
   * Site Management
   */
  sites: {
    list: {
      endpoint: 'GET /api/v1/internal/sites',
      query: {
        customerId: 'string',
        status: 'online|degraded|offline|maintenance',
        region: 'string',
        type: 'string',
        page: 'number',
        limit: 'number'
      }
    },
    provision: {
      endpoint: 'POST /api/v1/internal/sites',
      request: {
        customerId: 'string',
        siteName: 'string',
        type: 'string',
        location: { city: 'string', state: 'string', region: 'string' },
        config: { /* Site configuration */ }
      }
    },
    suspend: {
      endpoint: 'PATCH /api/v1/internal/sites/{siteId}/suspend',
      request: { reason: 'string' }
    },
    block: {
      endpoint: 'PATCH /api/v1/internal/sites/{siteId}/block',
      request: { reason: 'string' }
    }
  },

  /**
   * Customer Management
   */
  customers: {
    list: {
      endpoint: 'GET /api/v1/internal/customers',
      query: { status: 'string', industry: 'string', page: 'number', limit: 'number' }
    },
    impersonate: {
      endpoint: 'POST /api/v1/internal/customers/{customerId}/impersonate',
      response: { impersonationToken: 'string', expiresIn: 'number' }
    }
  },

  /**
   * Bulk Operations
   */
  bulkOperations: {
    statusChange: {
      endpoint: 'POST /api/v1/internal/bulk/status-change',
      request: {
        userIds: ['string'],
        targetStatus: 'Active|Suspended|Blocked',
        reason: 'string'
      }
    },
    policyChange: {
      endpoint: 'POST /api/v1/internal/bulk/policy-change',
      request: { userIds: ['string'], newPolicy: { /* Policy object */ } }
    },
    resendPasswords: {
      endpoint: 'POST /api/v1/internal/bulk/resend-passwords',
      request: { userIds: ['string'], method: 'email|sms|both' }
    }
  }
};

/**
 * ============================================================================
 * 8. COMMON API PATTERNS
 * ============================================================================
 */
const CommonPatterns = {
  /**
   * Standard error response format
   */
  errorResponse: {
    success: false,
    error: {
      code: 'ERROR_CODE',
      message: 'Human-readable message',
      details: { /* Additional context */ }
    }
  },

  /**
   * Common HTTP status codes
   */
  httpStatusCodes: {
    200: 'Success',
    201: 'Created',
    400: 'Bad Request - Invalid input',
    401: 'Unauthorized - Authentication required',
    403: 'Forbidden - Insufficient permissions',
    404: 'Not Found',
    409: 'Conflict - Resource already exists',
    422: 'Validation Error',
    429: 'Rate Limited',
    500: 'Internal Server Error'
  },

  /**
   * Authentication headers
   */
  authHeaders: {
    'Authorization': 'Bearer {accessToken}',
    'X-Site-ID': '{siteId}',
    'X-Segment': '{segment}'
  },

  /**
   * Pagination pattern
   */
  pagination: {
    request: { page: 'number', limit: 'number' },
    response: { data: '[]', totalCount: 'number', page: 'number', limit: 'number' }
  }
};

/**
 * ============================================================================
 * 9. EXTERNAL SYSTEM INTEGRATIONS
 * ============================================================================
 */
const ExternalIntegrations = {
  /**
   * AAA/RADIUS System
   * For user authentication and session management
   */
  aaa: {
    description: 'FreeRADIUS or similar AAA server',
    operations: [
      'User provisioning (create/update/delete)',
      'MAC address registration',
      'Session termination (CoA/Disconnect)',
      'Accounting queries'
    ],
    endpoints: [
      'POST /aaa/api/users - Create user',
      'DELETE /aaa/api/users/{id} - Delete user',
      'POST /aaa/api/disconnect-mac - Force disconnect MAC',
      'POST /aaa/api/disconnect-user - Force disconnect user'
    ]
  },

  /**
   * Network Monitoring System
   * For real-time device status and metrics
   */
  monitoring: {
    description: 'Prometheus, Zabbix, or custom monitoring',
    operations: [
      'Query device online status',
      'Get bandwidth usage',
      'Network uptime metrics',
      'Alert generation'
    ]
  },

  /**
   * SMS/Email Gateway
   * For credential delivery and notifications
   */
  notifications: {
    sms: {
      endpoint: 'POST /api/v1/notifications/sms',
      request: { mobile: 'string', message: 'string', template: 'string' }
    },
    email: {
      endpoint: 'POST /api/v1/notifications/email',
      request: { to: 'string', subject: 'string', template: 'string', data: 'object' }
    }
  },

  /**
   * PMS Integration (Hotels)
   * For automatic guest provisioning
   */
  pms: {
    description: 'Property Management System integration',
    operations: [
      'Check-in webhook - Auto-create guest',
      'Check-out webhook - Auto-revoke access',
      'Room change - Update guest details'
    ]
  }
};

// Export for reference
export {
  AuthenticationAPI,
  UserManagementAPI,
  DeviceManagementAPI,
  GuestManagementAPI,
  DashboardAPI,
  ActivityLogsAPI,
  InternalPortalAPI,
  CommonPatterns,
  ExternalIntegrations
};
