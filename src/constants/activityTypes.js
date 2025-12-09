/**
 * Activity Types Configuration
 *
 * This file defines all activity types that appear in the Recent Activities
 * section of the dashboard. Each activity has a unique key, category, severity,
 * and translation key for i18n support.
 *
 * SEVERITY LEVELS:
 * - info: General informational activities (blue)
 * - success: Successful operations (green)
 * - warning: Activities requiring attention (yellow/orange)
 * - error: Failed operations or errors (red)
 *
 * CATEGORIES:
 * - user_registration: User creation and registration
 * - user_status: User activation, deactivation, blocking
 * - user_update: Profile updates
 * - license: License management
 * - device: Device registration and management
 * - policy: Policy assignments and changes
 * - password: Password management
 * - bulk: Bulk operations
 * - scheduled: Automated/scheduled actions
 * - export: Reports and data exports
 * - session: User sessions and connectivity
 * - alert: System alerts and warnings
 * - admin: Admin actions and access
 * - notification: Communications sent
 * - audit: Audit and compliance
 */

// Activity Categories
export const ACTIVITY_CATEGORIES = {
  USER_REGISTRATION: 'user_registration',
  USER_STATUS: 'user_status',
  USER_UPDATE: 'user_update',
  USER_SELF_REGISTER: 'user_self_register',
  LICENSE: 'license',
  DEVICE: 'device',
  DEVICE_TYPE: 'device_type',
  DEVICE_BLOCKED: 'device_blocked',
  POLICY: 'policy',
  PASSWORD: 'password',
  BULK: 'bulk',
  BULK_DEVICE: 'bulk_device',
  BULK_VALIDATION: 'bulk_validation',
  SCHEDULED: 'scheduled',
  EXPORT: 'export',
  SESSION: 'session',
  SESSION_DISCONNECT: 'session_disconnect',
  ALERT: 'alert',
  QUOTA: 'quota',
  ADMIN_LOGIN: 'admin_login',
  ADMIN_ROLE: 'admin_role',
  ADMIN_PERMISSION: 'admin_permission',
  NOTIFICATION: 'notification',
  NOTIFY_WELCOME: 'notify_welcome',
  NOTIFY_REMINDER: 'notify_reminder',
  AUDIT: 'audit',
  AUDIT_EXPORT: 'audit_export',
};

// Severity Levels
export const SEVERITY = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

/**
 * Activity Type Definitions
 *
 * Each activity type has:
 * - key: Unique identifier for the activity
 * - category: Category for filtering
 * - severity: Visual indicator (info/success/warning/error)
 * - translationKey: i18n key in the activities namespace
 * - icon: Optional icon name (from react-icons)
 */
export const ACTIVITY_TYPES = {
  // ============================================
  // USER REGISTRATION & STATUS CHANGES
  // ============================================

  USER_REGISTERED: {
    key: 'USER_REGISTERED',
    category: ACTIVITY_CATEGORIES.USER_REGISTRATION,
    severity: SEVERITY.SUCCESS,
    translationKey: 'activities.userRegistered',
    // Params: { name, admin }
  },

  USERS_REGISTERED_TODAY: {
    key: 'USERS_REGISTERED_TODAY',
    category: ACTIVITY_CATEGORIES.USER_REGISTRATION,
    severity: SEVERITY.INFO,
    translationKey: 'activities.usersRegisteredToday',
    // Params: { count }
  },

  USER_ACTIVATED: {
    key: 'USER_ACTIVATED',
    category: ACTIVITY_CATEGORIES.USER_STATUS,
    severity: SEVERITY.SUCCESS,
    translationKey: 'activities.userActivated',
    // Params: { name, used, total }
  },

  USER_DEACTIVATED: {
    key: 'USER_DEACTIVATED',
    category: ACTIVITY_CATEGORIES.USER_STATUS,
    severity: SEVERITY.INFO,
    translationKey: 'activities.userDeactivated',
    // Params: { name, admin }
  },

  USER_BLOCKED: {
    key: 'USER_BLOCKED',
    category: ACTIVITY_CATEGORIES.USER_STATUS,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.userBlocked',
    // Params: { name }
  },

  USER_STATUS_CHANGED: {
    key: 'USER_STATUS_CHANGED',
    category: ACTIVITY_CATEGORIES.USER_STATUS,
    severity: SEVERITY.INFO,
    translationKey: 'activities.userStatusChanged',
    // Params: { name, oldStatus, newStatus }
  },

  USER_PROFILE_UPDATED: {
    key: 'USER_PROFILE_UPDATED',
    category: ACTIVITY_CATEGORIES.USER_UPDATE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.userProfileUpdated',
    // Params: { userId, admin }
  },

  USER_REGISTRATION_FAILED: {
    key: 'USER_REGISTRATION_FAILED',
    category: ACTIVITY_CATEGORIES.USER_REGISTRATION,
    severity: SEVERITY.ERROR,
    translationKey: 'activities.userRegistrationFailed',
    // Params: { name, reason }
  },

  USER_REACTIVATED: {
    key: 'USER_REACTIVATED',
    category: ACTIVITY_CATEGORIES.USER_STATUS,
    severity: SEVERITY.SUCCESS,
    translationKey: 'activities.userReactivated',
    // Params: { name, days }
  },

  USER_CONTACT_UPDATED: {
    key: 'USER_CONTACT_UPDATED',
    category: ACTIVITY_CATEGORIES.USER_UPDATE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.userContactUpdated',
    // Params: { name, newEmail }
  },

  USER_SELF_REGISTERED: {
    key: 'USER_SELF_REGISTERED',
    category: ACTIVITY_CATEGORIES.USER_SELF_REGISTER,
    severity: SEVERITY.SUCCESS,
    translationKey: 'activities.userSelfRegistered',
    // Params: { name }
  },

  // ============================================
  // LICENSE MANAGEMENT
  // ============================================

  LICENSE_UTILIZATION_HIGH: {
    key: 'LICENSE_UTILIZATION_HIGH',
    category: ACTIVITY_CATEGORIES.LICENSE,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.licenseUtilizationHigh',
    // Params: { percent, used, total }
  },

  LICENSE_LOW_WARNING: {
    key: 'LICENSE_LOW_WARNING',
    category: ACTIVITY_CATEGORIES.LICENSE,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.licenseLowWarning',
    // Params: { count }
  },

  LICENSE_FREED: {
    key: 'LICENSE_FREED',
    category: ACTIVITY_CATEGORIES.LICENSE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.licenseFreed',
    // Params: { name }
  },

  LICENSE_ALLOCATION_CHANGED: {
    key: 'LICENSE_ALLOCATION_CHANGED',
    category: ACTIVITY_CATEGORIES.LICENSE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.licenseAllocationChanged',
    // Params: { old, new }
  },

  // ============================================
  // DEVICE MANAGEMENT
  // ============================================

  DEVICE_REGISTERED: {
    key: 'DEVICE_REGISTERED',
    category: ACTIVITY_CATEGORIES.DEVICE,
    severity: SEVERITY.SUCCESS,
    translationKey: 'activities.deviceRegistered',
    // Params: { deviceName, userName }
  },

  DEVICE_REMOVED: {
    key: 'DEVICE_REMOVED',
    category: ACTIVITY_CATEGORIES.DEVICE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.deviceRemoved',
    // Params: { deviceName, userName }
  },

  DEVICE_MAC_UPDATED: {
    key: 'DEVICE_MAC_UPDATED',
    category: ACTIVITY_CATEGORIES.DEVICE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.deviceMacUpdated',
    // Params: { oldMAC, newMAC }
  },

  DEVICE_LIMIT_REACHED: {
    key: 'DEVICE_LIMIT_REACHED',
    category: ACTIVITY_CATEGORIES.DEVICE,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.deviceLimitReached',
    // Params: { name, count, max }
  },

  DEVICES_REGISTERED_24H: {
    key: 'DEVICES_REGISTERED_24H',
    category: ACTIVITY_CATEGORIES.DEVICE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.devicesRegistered24h',
    // Params: { count }
  },

  DEVICE_RENAMED: {
    key: 'DEVICE_RENAMED',
    category: ACTIVITY_CATEGORIES.DEVICE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.deviceRenamed',
    // Params: { deviceName, admin }
  },

  DEVICE_TYPE_UPDATED: {
    key: 'DEVICE_TYPE_UPDATED',
    category: ACTIVITY_CATEGORIES.DEVICE_TYPE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.deviceTypeUpdated',
    // Params: { deviceName, oldType, newType }
  },

  DEVICE_UNAUTHORIZED_BLOCKED: {
    key: 'DEVICE_UNAUTHORIZED_BLOCKED',
    category: ACTIVITY_CATEGORIES.DEVICE_BLOCKED,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.deviceUnauthorizedBlocked',
    // Params: { name }
  },

  // ============================================
  // POLICY MANAGEMENT
  // ============================================

  POLICY_CHANGED: {
    key: 'POLICY_CHANGED',
    category: ACTIVITY_CATEGORIES.POLICY,
    severity: SEVERITY.INFO,
    translationKey: 'activities.policyChanged',
    // Params: { userName, oldPolicy, newPolicy }
  },

  USERS_ASSIGNED_POLICY: {
    key: 'USERS_ASSIGNED_POLICY',
    category: ACTIVITY_CATEGORIES.POLICY,
    severity: SEVERITY.INFO,
    translationKey: 'activities.usersAssignedPolicy',
    // Params: { count, policyName }
  },

  // ============================================
  // PASSWORD MANAGEMENT
  // ============================================

  PASSWORD_RESENT: {
    key: 'PASSWORD_RESENT',
    category: ACTIVITY_CATEGORIES.PASSWORD,
    severity: SEVERITY.SUCCESS,
    translationKey: 'activities.passwordResent',
    // Params: { name }
  },

  PASSWORD_SEND_FAILED: {
    key: 'PASSWORD_SEND_FAILED',
    category: ACTIVITY_CATEGORIES.PASSWORD,
    severity: SEVERITY.ERROR,
    translationKey: 'activities.passwordSendFailed',
    // Params: { name }
  },

  // ============================================
  // BULK OPERATIONS
  // ============================================

  BULK_REGISTRATION_COMPLETED: {
    key: 'BULK_REGISTRATION_COMPLETED',
    category: ACTIVITY_CATEGORIES.BULK,
    severity: SEVERITY.SUCCESS,
    translationKey: 'activities.bulkRegistrationCompleted',
    // Params: { success, total }
  },

  BULK_OPERATION_FAILED: {
    key: 'BULK_OPERATION_FAILED',
    category: ACTIVITY_CATEGORIES.BULK,
    severity: SEVERITY.ERROR,
    translationKey: 'activities.bulkOperationFailed',
    // Params: { count }
  },

  BULK_DEVICE_IMPORT: {
    key: 'BULK_DEVICE_IMPORT',
    category: ACTIVITY_CATEGORIES.BULK_DEVICE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.bulkDeviceImport',
    // Params: { success, skipped, failed }
  },

  BULK_IMPORT_VALIDATION_FAILED: {
    key: 'BULK_IMPORT_VALIDATION_FAILED',
    category: ACTIVITY_CATEGORIES.BULK_VALIDATION,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.bulkImportValidationFailed',
    // Params: { count }
  },

  // ============================================
  // SCHEDULED ACTIONS
  // ============================================

  AUTO_CHECKOUT: {
    key: 'AUTO_CHECKOUT',
    category: ACTIVITY_CATEGORIES.SCHEDULED,
    severity: SEVERITY.INFO,
    translationKey: 'activities.autoCheckout',
    // Params: { name }
  },

  // ============================================
  // REPORTS & EXPORTS
  // ============================================

  REPORT_DOWNLOADED: {
    key: 'REPORT_DOWNLOADED',
    category: ACTIVITY_CATEGORIES.EXPORT,
    severity: SEVERITY.INFO,
    translationKey: 'activities.reportDownloaded',
    // Params: { reportName, admin }
  },

  USER_LIST_EXPORTED: {
    key: 'USER_LIST_EXPORTED',
    category: ACTIVITY_CATEGORIES.EXPORT,
    severity: SEVERITY.INFO,
    translationKey: 'activities.userListExported',
    // Params: { count }
  },

  MONTHLY_REPORT_GENERATED: {
    key: 'MONTHLY_REPORT_GENERATED',
    category: ACTIVITY_CATEGORIES.EXPORT,
    severity: SEVERITY.SUCCESS,
    translationKey: 'activities.monthlyReportGenerated',
    // Params: none
  },

  EXPORT_COMPLETED: {
    key: 'EXPORT_COMPLETED',
    category: ACTIVITY_CATEGORIES.EXPORT,
    severity: SEVERITY.SUCCESS,
    translationKey: 'activities.exportCompleted',
    // Params: { filename }
  },

  // ============================================
  // SESSION & ACTIVITY
  // ============================================

  USERS_CONNECTED_YESTERDAY: {
    key: 'USERS_CONNECTED_YESTERDAY',
    category: ACTIVITY_CATEGORIES.SESSION,
    severity: SEVERITY.INFO,
    translationKey: 'activities.usersConnectedYesterday',
    // Params: { count, peakCount }
  },

  INACTIVE_USERS_DETECTED: {
    key: 'INACTIVE_USERS_DETECTED',
    category: ACTIVITY_CATEGORIES.SESSION,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.inactiveUsersDetected',
    // Params: { count, days }
  },

  USER_FORCE_DISCONNECTED: {
    key: 'USER_FORCE_DISCONNECTED',
    category: ACTIVITY_CATEGORIES.SESSION_DISCONNECT,
    severity: SEVERITY.INFO,
    translationKey: 'activities.userForceDisconnected',
    // Params: { name, admin }
  },

  // ============================================
  // ALERTS & WARNINGS
  // ============================================

  DATA_QUOTA_WARNING: {
    key: 'DATA_QUOTA_WARNING',
    category: ACTIVITY_CATEGORIES.ALERT,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.dataQuotaWarning',
    // Params: { name, percent }
  },

  USERS_EXCEEDED_DATA_LIMIT: {
    key: 'USERS_EXCEEDED_DATA_LIMIT',
    category: ACTIVITY_CATEGORIES.ALERT,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.usersExceededDataLimit',
    // Params: { count }
  },

  CHECKOUT_APPROACHING: {
    key: 'CHECKOUT_APPROACHING',
    category: ACTIVITY_CATEGORIES.ALERT,
    severity: SEVERITY.INFO,
    translationKey: 'activities.checkoutApproaching',
    // Params: { count }
  },

  FAILED_LOGIN_ATTEMPTS: {
    key: 'FAILED_LOGIN_ATTEMPTS',
    category: ACTIVITY_CATEGORIES.ALERT,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.failedLoginAttempts',
    // Params: { count }
  },

  USERS_QUOTA_THRESHOLD: {
    key: 'USERS_QUOTA_THRESHOLD',
    category: ACTIVITY_CATEGORIES.QUOTA,
    severity: SEVERITY.WARNING,
    translationKey: 'activities.usersQuotaThreshold',
    // Params: { count, percent }
  },

  // ============================================
  // ADMIN & ACCESS MANAGEMENT
  // ============================================

  ADMIN_LOGGED_IN: {
    key: 'ADMIN_LOGGED_IN',
    category: ACTIVITY_CATEGORIES.ADMIN_LOGIN,
    severity: SEVERITY.INFO,
    translationKey: 'activities.adminLoggedIn',
    // Params: { admin, ipAddress }
  },

  ADMIN_ROLE_CHANGED: {
    key: 'ADMIN_ROLE_CHANGED',
    category: ACTIVITY_CATEGORIES.ADMIN_ROLE,
    severity: SEVERITY.INFO,
    translationKey: 'activities.adminRoleChanged',
    // Params: { admin, oldRole, newRole, superAdmin }
  },

  ADMIN_PERMISSIONS_UPDATED: {
    key: 'ADMIN_PERMISSIONS_UPDATED',
    category: ACTIVITY_CATEGORIES.ADMIN_PERMISSION,
    severity: SEVERITY.INFO,
    translationKey: 'activities.adminPermissionsUpdated',
    // Params: { admin, permissionChanges }
  },

  // ============================================
  // NOTIFICATIONS & COMMUNICATIONS
  // ============================================

  WELCOME_CREDENTIALS_SENT: {
    key: 'WELCOME_CREDENTIALS_SENT',
    category: ACTIVITY_CATEGORIES.NOTIFY_WELCOME,
    severity: SEVERITY.SUCCESS,
    translationKey: 'activities.welcomeCredentialsSent',
    // Params: { name, channel }
  },

  EXPIRY_REMINDER_SENT: {
    key: 'EXPIRY_REMINDER_SENT',
    category: ACTIVITY_CATEGORIES.NOTIFY_REMINDER,
    severity: SEVERITY.INFO,
    translationKey: 'activities.expiryReminderSent',
    // Params: { count, days }
  },

  // ============================================
  // AUDIT & COMPLIANCE
  // ============================================

  AUDIT_LOG_EXPORTED: {
    key: 'AUDIT_LOG_EXPORTED',
    category: ACTIVITY_CATEGORIES.AUDIT_EXPORT,
    severity: SEVERITY.INFO,
    translationKey: 'activities.auditLogExported',
    // Params: { startDate, endDate, count }
  },
};

/**
 * Get all activity types for a specific category
 * @param {string} category - Category to filter by
 * @returns {Array} Array of activity type objects
 */
export const getActivitiesByCategory = (category) => {
  return Object.values(ACTIVITY_TYPES).filter(
    (activity) => activity.category === category
  );
};

/**
 * Get all activity types for a specific severity
 * @param {string} severity - Severity to filter by
 * @returns {Array} Array of activity type objects
 */
export const getActivitiesBySeverity = (severity) => {
  return Object.values(ACTIVITY_TYPES).filter(
    (activity) => activity.severity === severity
  );
};

/**
 * Get activity type by key
 * @param {string} key - Activity type key
 * @returns {Object|undefined} Activity type object or undefined
 */
export const getActivityByKey = (key) => {
  return ACTIVITY_TYPES[key];
};

/**
 * Category display names for UI (uses translation keys)
 */
export const CATEGORY_LABELS = {
  [ACTIVITY_CATEGORIES.USER_REGISTRATION]: 'activities.categories.userRegistration',
  [ACTIVITY_CATEGORIES.USER_STATUS]: 'activities.categories.userStatus',
  [ACTIVITY_CATEGORIES.USER_UPDATE]: 'activities.categories.userUpdate',
  [ACTIVITY_CATEGORIES.USER_SELF_REGISTER]: 'activities.categories.userSelfRegister',
  [ACTIVITY_CATEGORIES.LICENSE]: 'activities.categories.license',
  [ACTIVITY_CATEGORIES.DEVICE]: 'activities.categories.device',
  [ACTIVITY_CATEGORIES.DEVICE_TYPE]: 'activities.categories.deviceType',
  [ACTIVITY_CATEGORIES.DEVICE_BLOCKED]: 'activities.categories.deviceBlocked',
  [ACTIVITY_CATEGORIES.POLICY]: 'activities.categories.policy',
  [ACTIVITY_CATEGORIES.PASSWORD]: 'activities.categories.password',
  [ACTIVITY_CATEGORIES.BULK]: 'activities.categories.bulk',
  [ACTIVITY_CATEGORIES.BULK_DEVICE]: 'activities.categories.bulkDevice',
  [ACTIVITY_CATEGORIES.BULK_VALIDATION]: 'activities.categories.bulkValidation',
  [ACTIVITY_CATEGORIES.SCHEDULED]: 'activities.categories.scheduled',
  [ACTIVITY_CATEGORIES.EXPORT]: 'activities.categories.export',
  [ACTIVITY_CATEGORIES.SESSION]: 'activities.categories.session',
  [ACTIVITY_CATEGORIES.SESSION_DISCONNECT]: 'activities.categories.sessionDisconnect',
  [ACTIVITY_CATEGORIES.ALERT]: 'activities.categories.alert',
  [ACTIVITY_CATEGORIES.QUOTA]: 'activities.categories.quota',
  [ACTIVITY_CATEGORIES.ADMIN_LOGIN]: 'activities.categories.adminLogin',
  [ACTIVITY_CATEGORIES.ADMIN_ROLE]: 'activities.categories.adminRole',
  [ACTIVITY_CATEGORIES.ADMIN_PERMISSION]: 'activities.categories.adminPermission',
  [ACTIVITY_CATEGORIES.NOTIFICATION]: 'activities.categories.notification',
  [ACTIVITY_CATEGORIES.NOTIFY_WELCOME]: 'activities.categories.notifyWelcome',
  [ACTIVITY_CATEGORIES.NOTIFY_REMINDER]: 'activities.categories.notifyReminder',
  [ACTIVITY_CATEGORIES.AUDIT]: 'activities.categories.audit',
  [ACTIVITY_CATEGORIES.AUDIT_EXPORT]: 'activities.categories.auditExport',
};

export default ACTIVITY_TYPES;
