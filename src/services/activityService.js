/**
 * Activity Service
 *
 * This service handles logging and retrieval of recent activities for the dashboard.
 * It provides placeholder functions that IT team needs to implement with actual
 * backend integration.
 *
 * IMPLEMENTATION NOTES FOR IT TEAM:
 * ---------------------------------
 * 1. Replace localStorage with actual API calls to your backend
 * 2. Implement proper authentication headers in API requests
 * 3. Add error handling and retry logic for failed requests
 * 4. Consider WebSocket for real-time activity updates
 * 5. Implement pagination for fetching activities
 * 6. Add rate limiting to prevent activity spam
 *
 * BACKEND REQUIREMENTS:
 * ---------------------
 * - POST /api/activities - Create new activity
 * - GET /api/activities - Fetch activities (with filters)
 * - GET /api/activities/recent - Fetch recent activities for dashboard
 * - DELETE /api/activities/:id - Delete activity (admin only)
 *
 * DATABASE SCHEMA SUGGESTION:
 * ---------------------------
 * activities {
 *   id: UUID (primary key)
 *   type: VARCHAR(50) - Activity type key from ACTIVITY_TYPES
 *   category: VARCHAR(50) - Category for filtering
 *   severity: ENUM('info', 'success', 'warning', 'error')
 *   params: JSONB - Dynamic parameters for translation interpolation
 *   performedBy: UUID - Admin/User who performed the action (FK to users)
 *   targetEntity: VARCHAR(100) - Entity type affected (user, device, policy, etc.)
 *   targetId: VARCHAR(100) - ID of affected entity
 *   segmentId: UUID - Segment context (FK to segments)
 *   ipAddress: VARCHAR(45) - IP address of requester
 *   userAgent: TEXT - Browser/client info
 *   createdAt: TIMESTAMP - When activity occurred
 *   metadata: JSONB - Additional context data
 * }
 */

import { ACTIVITY_TYPES, SEVERITY } from '../constants/activityTypes';

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * TODO [IT]: Replace with actual API base URL from environment config
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Maximum number of activities to show in dashboard widget
 */
const DASHBOARD_ACTIVITY_LIMIT = 10;

/**
 * Local storage key for offline activity queue
 * TODO [IT]: Implement offline queue sync when network is restored
 */
const OFFLINE_QUEUE_KEY = 'pendingActivities';

// =============================================================================
// ACTIVITY LOGGING FUNCTIONS
// =============================================================================

/**
 * Log a new activity to the system
 *
 * @param {string} activityType - Key from ACTIVITY_TYPES
 * @param {Object} params - Dynamic parameters for the activity message
 * @param {Object} options - Additional options
 * @param {string} options.targetEntity - Type of entity affected (user, device, etc.)
 * @param {string} options.targetId - ID of the affected entity
 * @param {Object} options.metadata - Additional context data
 * @returns {Promise<Object>} Created activity object
 *
 * @example
 * // Log user registration
 * await logActivity(ACTIVITY_TYPES.USER_REGISTERED.key, {
 *   name: 'John Doe',
 *   admin: 'Admin User'
 * }, {
 *   targetEntity: 'user',
 *   targetId: 'user_123'
 * });
 */
export const logActivity = async (activityType, params = {}, options = {}) => {
  const activityConfig = ACTIVITY_TYPES[activityType];

  if (!activityConfig) {
    console.error(`[ActivityService] Unknown activity type: ${activityType}`);
    return null;
  }

  const activity = {
    id: generateActivityId(),
    type: activityConfig.key,
    category: activityConfig.category,
    severity: activityConfig.severity,
    translationKey: activityConfig.translationKey,
    params,
    targetEntity: options.targetEntity || null,
    targetId: options.targetId || null,
    metadata: options.metadata || {},
    createdAt: new Date().toISOString(),
    // TODO [IT]: Get from auth context
    performedBy: getCurrentAdminId(),
    // TODO [IT]: Get from request context
    ipAddress: null,
  };

  /**
   * TODO [IT]: Replace this block with actual API call
   *
   * Example implementation:
   * ```
   * try {
   *   const response = await fetch(`${API_BASE_URL}/activities`, {
   *     method: 'POST',
   *     headers: {
   *       'Content-Type': 'application/json',
   *       'Authorization': `Bearer ${getAuthToken()}`,
   *     },
   *     body: JSON.stringify(activity),
   *   });
   *
   *   if (!response.ok) {
   *     throw new Error(`Failed to log activity: ${response.statusText}`);
   *   }
   *
   *   return await response.json();
   * } catch (error) {
   *   console.error('[ActivityService] Failed to log activity:', error);
   *   // Queue for later sync if offline
   *   queueOfflineActivity(activity);
   *   return null;
   * }
   * ```
   */

  // PLACEHOLDER: Store in localStorage for demo purposes
  const activities = getStoredActivities();
  activities.unshift(activity);
  // Keep only last 100 activities in localStorage
  localStorage.setItem('recentActivities', JSON.stringify(activities.slice(0, 100)));

  console.log('[ActivityService] Activity logged:', activity);
  return activity;
};

/**
 * Fetch recent activities for dashboard display
 *
 * @param {Object} options - Fetch options
 * @param {number} options.limit - Maximum number of activities to fetch
 * @param {string} options.category - Filter by category
 * @param {string} options.severity - Filter by severity
 * @param {string} options.segmentId - Filter by segment
 * @returns {Promise<Array>} Array of activity objects
 */
export const fetchRecentActivities = async (options = {}) => {
  const {
    limit = DASHBOARD_ACTIVITY_LIMIT,
    category = null,
    severity = null,
    segmentId = null,
  } = options;

  /**
   * TODO [IT]: Replace with actual API call
   *
   * Example implementation:
   * ```
   * const queryParams = new URLSearchParams({
   *   limit: limit.toString(),
   *   ...(category && { category }),
   *   ...(severity && { severity }),
   *   ...(segmentId && { segmentId }),
   * });
   *
   * try {
   *   const response = await fetch(
   *     `${API_BASE_URL}/activities/recent?${queryParams}`,
   *     {
   *       headers: {
   *         'Authorization': `Bearer ${getAuthToken()}`,
   *       },
   *     }
   *   );
   *
   *   if (!response.ok) {
   *     throw new Error(`Failed to fetch activities: ${response.statusText}`);
   *   }
   *
   *   return await response.json();
   * } catch (error) {
   *   console.error('[ActivityService] Failed to fetch activities:', error);
   *   return [];
   * }
   * ```
   */

  // PLACEHOLDER: Return from localStorage for demo
  let activities = getStoredActivities();

  // Apply filters
  if (category) {
    activities = activities.filter((a) => a.category === category);
  }
  if (severity) {
    activities = activities.filter((a) => a.severity === severity);
  }

  return activities.slice(0, limit);
};

/**
 * Fetch activities with pagination
 *
 * @param {Object} options - Pagination and filter options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.pageSize - Items per page
 * @param {string} options.startDate - Filter start date (ISO string)
 * @param {string} options.endDate - Filter end date (ISO string)
 * @param {string} options.category - Filter by category
 * @param {string} options.severity - Filter by severity
 * @returns {Promise<Object>} Paginated response { data, total, page, pageSize }
 */
export const fetchActivitiesPaginated = async (options = {}) => {
  const {
    page = 1,
    pageSize = 20,
    startDate = null,
    endDate = null,
    category = null,
    severity = null,
  } = options;

  /**
   * TODO [IT]: Implement actual paginated API call
   *
   * Example:
   * ```
   * const queryParams = new URLSearchParams({
   *   page: page.toString(),
   *   pageSize: pageSize.toString(),
   *   ...(startDate && { startDate }),
   *   ...(endDate && { endDate }),
   *   ...(category && { category }),
   *   ...(severity && { severity }),
   * });
   *
   * const response = await fetch(
   *   `${API_BASE_URL}/activities?${queryParams}`,
   *   { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }
   * );
   *
   * return await response.json();
   * ```
   */

  // PLACEHOLDER: Simulate pagination
  let activities = getStoredActivities();

  if (category) {
    activities = activities.filter((a) => a.category === category);
  }
  if (severity) {
    activities = activities.filter((a) => a.severity === severity);
  }
  if (startDate) {
    activities = activities.filter((a) => new Date(a.createdAt) >= new Date(startDate));
  }
  if (endDate) {
    activities = activities.filter((a) => new Date(a.createdAt) <= new Date(endDate));
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: activities.slice(start, end),
    total: activities.length,
    page,
    pageSize,
  };
};

// =============================================================================
// SPECIFIC ACTIVITY LOGGING HELPERS
// =============================================================================
// These functions provide convenient wrappers for common activity types.
// IT team should call these functions from the appropriate places in the codebase.
// =============================================================================

// -----------------------------------------------------------------------------
// USER REGISTRATION & STATUS
// -----------------------------------------------------------------------------

/**
 * Log user registration activity
 * CALL THIS: After successful user creation in UserFormModal or user registration API
 *
 * @param {string} userName - Name of registered user
 * @param {string} adminName - Name of admin who performed registration
 * @param {string} userId - ID of the new user
 */
export const logUserRegistered = async (userName, adminName, userId) => {
  return logActivity(
    'USER_REGISTERED',
    { name: userName, admin: adminName },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log daily user registration count
 * CALL THIS: From a scheduled job or dashboard data aggregation
 *
 * @param {number} count - Number of users registered today
 */
export const logUsersRegisteredToday = async (count) => {
  return logActivity('USERS_REGISTERED_TODAY', { count });
};

/**
 * Log user activation
 * CALL THIS: After user status changed to 'Active'
 *
 * @param {string} userName - Name of activated user
 * @param {number} usedLicenses - Current used license count
 * @param {number} totalLicenses - Total available licenses
 * @param {string} userId - User ID
 */
export const logUserActivated = async (userName, usedLicenses, totalLicenses, userId) => {
  return logActivity(
    'USER_ACTIVATED',
    { name: userName, used: usedLicenses, total: totalLicenses },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log user deactivation
 * CALL THIS: After user status changed to 'Suspended' or 'Inactive'
 *
 * @param {string} userName - Name of deactivated user
 * @param {string} adminName - Admin who performed deactivation
 * @param {string} userId - User ID
 */
export const logUserDeactivated = async (userName, adminName, userId) => {
  return logActivity(
    'USER_DEACTIVATED',
    { name: userName, admin: adminName },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log user blocked permanently
 * CALL THIS: After user status changed to 'Blocked'
 *
 * @param {string} userName - Name of blocked user
 * @param {string} userId - User ID
 */
export const logUserBlocked = async (userName, userId) => {
  return logActivity(
    'USER_BLOCKED',
    { name: userName },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log user status change
 * CALL THIS: After any user status transition
 *
 * @param {string} userName - Name of user
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @param {string} userId - User ID
 */
export const logUserStatusChanged = async (userName, oldStatus, newStatus, userId) => {
  return logActivity(
    'USER_STATUS_CHANGED',
    { name: userName, oldStatus, newStatus },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log user profile update
 * CALL THIS: After user profile fields are modified
 *
 * @param {string} userId - User ID
 * @param {string} adminName - Admin who made the update
 */
export const logUserProfileUpdated = async (userId, adminName) => {
  return logActivity(
    'USER_PROFILE_UPDATED',
    { userId, admin: adminName },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log failed user registration
 * CALL THIS: When user registration fails
 *
 * @param {string} userName - Attempted user name
 * @param {string} reason - Failure reason
 */
export const logUserRegistrationFailed = async (userName, reason) => {
  return logActivity('USER_REGISTRATION_FAILED', { name: userName, reason });
};

/**
 * Log user reactivation after inactivity
 * CALL THIS: When inactive user is reactivated
 *
 * @param {string} userName - Name of user
 * @param {number} daysInactive - Days user was inactive
 * @param {string} userId - User ID
 */
export const logUserReactivated = async (userName, daysInactive, userId) => {
  return logActivity(
    'USER_REACTIVATED',
    { name: userName, days: daysInactive },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log user contact info update
 * CALL THIS: After user email or mobile is updated
 *
 * @param {string} userName - Name of user
 * @param {string} newEmail - New email address
 * @param {string} userId - User ID
 */
export const logUserContactUpdated = async (userName, newEmail, userId) => {
  return logActivity(
    'USER_CONTACT_UPDATED',
    { name: userName, newEmail },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log self-registration via guest portal
 * CALL THIS: After user self-registers through guest portal
 *
 * @param {string} userName - Name of user
 * @param {string} userId - User ID
 */
export const logUserSelfRegistered = async (userName, userId) => {
  return logActivity(
    'USER_SELF_REGISTERED',
    { name: userName },
    { targetEntity: 'user', targetId: userId }
  );
};

// -----------------------------------------------------------------------------
// LICENSE MANAGEMENT
// -----------------------------------------------------------------------------

/**
 * Log high license utilization warning
 * CALL THIS: When license utilization exceeds threshold (e.g., 80%)
 *
 * @param {number} percent - Current utilization percentage
 * @param {number} used - Used licenses
 * @param {number} total - Total licenses
 */
export const logLicenseUtilizationHigh = async (percent, used, total) => {
  return logActivity('LICENSE_UTILIZATION_HIGH', { percent, used, total });
};

/**
 * Log low license warning
 * CALL THIS: When remaining licenses fall below threshold
 *
 * @param {number} remaining - Remaining license count
 */
export const logLicenseLowWarning = async (remaining) => {
  return logActivity('LICENSE_LOW_WARNING', { count: remaining });
};

/**
 * Log license freed up
 * CALL THIS: When user is deactivated and license is released
 *
 * @param {string} userName - Name of deactivated user
 */
export const logLicenseFreed = async (userName) => {
  return logActivity('LICENSE_FREED', { name: userName });
};

/**
 * Log license allocation change
 * CALL THIS: When total license count changes
 *
 * @param {number} oldCount - Previous license count
 * @param {number} newCount - New license count
 */
export const logLicenseAllocationChanged = async (oldCount, newCount) => {
  return logActivity('LICENSE_ALLOCATION_CHANGED', { old: oldCount, new: newCount });
};

// -----------------------------------------------------------------------------
// DEVICE MANAGEMENT
// -----------------------------------------------------------------------------

/**
 * Log device registration
 * CALL THIS: After device is successfully registered
 *
 * @param {string} deviceName - Name of device
 * @param {string} userName - Name of user device is assigned to
 * @param {string} deviceId - Device ID
 */
export const logDeviceRegistered = async (deviceName, userName, deviceId) => {
  return logActivity(
    'DEVICE_REGISTERED',
    { deviceName, userName },
    { targetEntity: 'device', targetId: deviceId }
  );
};

/**
 * Log device removal
 * CALL THIS: After device is removed from user
 *
 * @param {string} deviceName - Name of device
 * @param {string} userName - Name of user
 * @param {string} deviceId - Device ID
 */
export const logDeviceRemoved = async (deviceName, userName, deviceId) => {
  return logActivity(
    'DEVICE_REMOVED',
    { deviceName, userName },
    { targetEntity: 'device', targetId: deviceId }
  );
};

/**
 * Log device MAC address update
 * CALL THIS: After device MAC is modified
 *
 * @param {string} oldMAC - Previous MAC address
 * @param {string} newMAC - New MAC address
 * @param {string} deviceId - Device ID
 */
export const logDeviceMacUpdated = async (oldMAC, newMAC, deviceId) => {
  return logActivity(
    'DEVICE_MAC_UPDATED',
    { oldMAC, newMAC },
    { targetEntity: 'device', targetId: deviceId }
  );
};

/**
 * Log device limit reached
 * CALL THIS: When user reaches maximum device limit
 *
 * @param {string} userName - Name of user
 * @param {number} currentCount - Current device count
 * @param {number} maxCount - Maximum allowed devices
 * @param {string} userId - User ID
 */
export const logDeviceLimitReached = async (userName, currentCount, maxCount, userId) => {
  return logActivity(
    'DEVICE_LIMIT_REACHED',
    { name: userName, count: currentCount, max: maxCount },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log devices registered in last 24 hours
 * CALL THIS: From scheduled job or dashboard aggregation
 *
 * @param {number} count - Number of devices registered
 */
export const logDevicesRegistered24h = async (count) => {
  return logActivity('DEVICES_REGISTERED_24H', { count });
};

/**
 * Log device rename
 * CALL THIS: After device name is changed
 *
 * @param {string} deviceName - New device name
 * @param {string} adminName - Admin who renamed
 * @param {string} deviceId - Device ID
 */
export const logDeviceRenamed = async (deviceName, adminName, deviceId) => {
  return logActivity(
    'DEVICE_RENAMED',
    { deviceName, admin: adminName },
    { targetEntity: 'device', targetId: deviceId }
  );
};

/**
 * Log device type update
 * CALL THIS: After device type/category is changed
 *
 * @param {string} deviceName - Device name
 * @param {string} oldType - Previous device type
 * @param {string} newType - New device type
 * @param {string} deviceId - Device ID
 */
export const logDeviceTypeUpdated = async (deviceName, oldType, newType, deviceId) => {
  return logActivity(
    'DEVICE_TYPE_UPDATED',
    { deviceName, oldType, newType },
    { targetEntity: 'device', targetId: deviceId }
  );
};

/**
 * Log unauthorized device blocked
 * CALL THIS: When unauthorized device attempt is blocked
 *
 * @param {string} userName - Name of user who attempted
 */
export const logDeviceUnauthorizedBlocked = async (userName) => {
  return logActivity('DEVICE_UNAUTHORIZED_BLOCKED', { name: userName });
};

// -----------------------------------------------------------------------------
// POLICY MANAGEMENT
// -----------------------------------------------------------------------------

/**
 * Log policy change for user
 * CALL THIS: After user's policy is changed
 *
 * @param {string} userName - Name of user
 * @param {string} oldPolicy - Previous policy name
 * @param {string} newPolicy - New policy name
 * @param {string} userId - User ID
 */
export const logPolicyChanged = async (userName, oldPolicy, newPolicy, userId) => {
  return logActivity(
    'POLICY_CHANGED',
    { userName, oldPolicy, newPolicy },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log users assigned to policy
 * CALL THIS: After bulk policy assignment
 *
 * @param {number} count - Number of users assigned
 * @param {string} policyName - Name of policy
 */
export const logUsersAssignedPolicy = async (count, policyName) => {
  return logActivity('USERS_ASSIGNED_POLICY', { count, policyName });
};

// -----------------------------------------------------------------------------
// PASSWORD MANAGEMENT
// -----------------------------------------------------------------------------

/**
 * Log password resent
 * CALL THIS: After password is resent to user
 *
 * @param {string} userName - Name of user
 * @param {string} userId - User ID
 */
export const logPasswordResent = async (userName, userId) => {
  return logActivity(
    'PASSWORD_RESENT',
    { name: userName },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log password send failure
 * CALL THIS: When password delivery fails
 *
 * @param {string} userName - Name of user
 * @param {string} userId - User ID
 */
export const logPasswordSendFailed = async (userName, userId) => {
  return logActivity(
    'PASSWORD_SEND_FAILED',
    { name: userName },
    { targetEntity: 'user', targetId: userId }
  );
};

// -----------------------------------------------------------------------------
// BULK OPERATIONS
// -----------------------------------------------------------------------------

/**
 * Log bulk registration completion
 * CALL THIS: After bulk user import completes
 *
 * @param {number} successCount - Successfully imported count
 * @param {number} totalCount - Total attempted count
 */
export const logBulkRegistrationCompleted = async (successCount, totalCount) => {
  return logActivity('BULK_REGISTRATION_COMPLETED', {
    success: successCount,
    total: totalCount,
  });
};

/**
 * Log bulk operation failure
 * CALL THIS: When bulk operation has errors
 *
 * @param {number} errorCount - Number of errors
 */
export const logBulkOperationFailed = async (errorCount) => {
  return logActivity('BULK_OPERATION_FAILED', { count: errorCount });
};

/**
 * Log bulk device import
 * CALL THIS: After bulk device import completes
 *
 * @param {number} success - Successfully imported
 * @param {number} skipped - Skipped records
 * @param {number} failed - Failed records
 */
export const logBulkDeviceImport = async (success, skipped, failed) => {
  return logActivity('BULK_DEVICE_IMPORT', { success, skipped, failed });
};

/**
 * Log bulk import validation failure
 * CALL THIS: When bulk import has validation errors
 *
 * @param {number} rejectedCount - Number of rejected rows
 */
export const logBulkImportValidationFailed = async (rejectedCount) => {
  return logActivity('BULK_IMPORT_VALIDATION_FAILED', { count: rejectedCount });
};

// -----------------------------------------------------------------------------
// SCHEDULED ACTIONS
// -----------------------------------------------------------------------------

/**
 * Log auto-checkout (Hotel/Co-Living)
 * CALL THIS: When scheduled checkout deactivates user
 *
 * @param {string} userName - Name of user
 * @param {string} userId - User ID
 */
export const logAutoCheckout = async (userName, userId) => {
  return logActivity(
    'AUTO_CHECKOUT',
    { name: userName },
    { targetEntity: 'user', targetId: userId }
  );
};

// -----------------------------------------------------------------------------
// REPORTS & EXPORTS
// -----------------------------------------------------------------------------

/**
 * Log report download
 * CALL THIS: After report is downloaded
 *
 * @param {string} reportName - Name of report
 * @param {string} adminName - Admin who downloaded
 */
export const logReportDownloaded = async (reportName, adminName) => {
  return logActivity('REPORT_DOWNLOADED', { reportName, admin: adminName });
};

/**
 * Log user list export
 * CALL THIS: After user list is exported to CSV
 *
 * @param {number} recordCount - Number of records exported
 */
export const logUserListExported = async (recordCount) => {
  return logActivity('USER_LIST_EXPORTED', { count: recordCount });
};

/**
 * Log monthly report generation
 * CALL THIS: When monthly billing report is generated
 */
export const logMonthlyReportGenerated = async () => {
  return logActivity('MONTHLY_REPORT_GENERATED', {});
};

/**
 * Log export completion
 * CALL THIS: After any export completes
 *
 * @param {string} filename - Name of exported file
 */
export const logExportCompleted = async (filename) => {
  return logActivity('EXPORT_COMPLETED', { filename });
};

// -----------------------------------------------------------------------------
// SESSION & ACTIVITY
// -----------------------------------------------------------------------------

/**
 * Log users connected yesterday summary
 * CALL THIS: From scheduled job generating daily summary
 *
 * @param {number} totalCount - Total users connected
 * @param {number} peakCount - Peak concurrent users
 */
export const logUsersConnectedYesterday = async (totalCount, peakCount) => {
  return logActivity('USERS_CONNECTED_YESTERDAY', {
    count: totalCount,
    peakCount,
  });
};

/**
 * Log inactive users detected
 * CALL THIS: From scheduled job or report
 *
 * @param {number} count - Number of inactive users
 * @param {number} days - Days of inactivity threshold
 */
export const logInactiveUsersDetected = async (count, days) => {
  return logActivity('INACTIVE_USERS_DETECTED', { count, days });
};

/**
 * Log forced user disconnection
 * CALL THIS: When admin forcefully disconnects user
 *
 * @param {string} userName - Name of disconnected user
 * @param {string} adminName - Admin who disconnected
 * @param {string} userId - User ID
 */
export const logUserForceDisconnected = async (userName, adminName, userId) => {
  return logActivity(
    'USER_FORCE_DISCONNECTED',
    { name: userName, admin: adminName },
    { targetEntity: 'user', targetId: userId }
  );
};

// -----------------------------------------------------------------------------
// ALERTS & WARNINGS
// -----------------------------------------------------------------------------

/**
 * Log data quota warning
 * CALL THIS: When user reaches data quota threshold
 *
 * @param {string} userName - Name of user
 * @param {number} percent - Usage percentage
 * @param {string} userId - User ID
 */
export const logDataQuotaWarning = async (userName, percent, userId) => {
  return logActivity(
    'DATA_QUOTA_WARNING',
    { name: userName, percent },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log users exceeded data limit
 * CALL THIS: From scheduled report or alert
 *
 * @param {number} count - Number of users who exceeded
 */
export const logUsersExceededDataLimit = async (count) => {
  return logActivity('USERS_EXCEEDED_DATA_LIMIT', { count });
};

/**
 * Log checkout approaching
 * CALL THIS: When users have upcoming checkout dates
 *
 * @param {number} count - Number of users with approaching checkout
 */
export const logCheckoutApproaching = async (count) => {
  return logActivity('CHECKOUT_APPROACHING', { count });
};

/**
 * Log failed login attempts
 * CALL THIS: When suspicious login activity detected
 *
 * @param {number} count - Number of failed attempts
 */
export const logFailedLoginAttempts = async (count) => {
  return logActivity('FAILED_LOGIN_ATTEMPTS', { count });
};

/**
 * Log users reaching quota threshold
 * CALL THIS: When multiple users reach quota percentage
 *
 * @param {number} count - Number of users
 * @param {number} percent - Threshold percentage
 */
export const logUsersQuotaThreshold = async (count, percent) => {
  return logActivity('USERS_QUOTA_THRESHOLD', { count, percent });
};

// -----------------------------------------------------------------------------
// ADMIN & ACCESS MANAGEMENT
// -----------------------------------------------------------------------------

/**
 * Log admin login
 * CALL THIS: After successful admin login
 *
 * @param {string} adminName - Admin username
 * @param {string} ipAddress - Login IP address
 */
export const logAdminLoggedIn = async (adminName, ipAddress) => {
  return logActivity('ADMIN_LOGGED_IN', { admin: adminName, ipAddress });
};

/**
 * Log admin role change
 * CALL THIS: After admin role is modified
 *
 * @param {string} adminName - Admin whose role changed
 * @param {string} oldRole - Previous role
 * @param {string} newRole - New role
 * @param {string} superAdminName - Admin who made the change
 */
export const logAdminRoleChanged = async (adminName, oldRole, newRole, superAdminName) => {
  return logActivity('ADMIN_ROLE_CHANGED', {
    admin: adminName,
    oldRole,
    newRole,
    superAdmin: superAdminName,
  });
};

/**
 * Log admin permissions update
 * CALL THIS: After admin permissions are modified
 *
 * @param {string} adminName - Admin whose permissions changed
 * @param {string} permissionChanges - Description of changes
 */
export const logAdminPermissionsUpdated = async (adminName, permissionChanges) => {
  return logActivity('ADMIN_PERMISSIONS_UPDATED', {
    admin: adminName,
    permissionChanges,
  });
};

// -----------------------------------------------------------------------------
// NOTIFICATIONS & COMMUNICATIONS
// -----------------------------------------------------------------------------

/**
 * Log welcome credentials sent
 * CALL THIS: After welcome email/SMS is sent
 *
 * @param {string} userName - Name of user
 * @param {string} channel - Delivery channel (Email/SMS)
 * @param {string} userId - User ID
 */
export const logWelcomeCredentialsSent = async (userName, channel, userId) => {
  return logActivity(
    'WELCOME_CREDENTIALS_SENT',
    { name: userName, channel },
    { targetEntity: 'user', targetId: userId }
  );
};

/**
 * Log expiry reminder sent
 * CALL THIS: After bulk expiry reminders are sent
 *
 * @param {number} count - Number of reminders sent
 * @param {number} days - Days until expiry
 */
export const logExpiryReminderSent = async (count, days) => {
  return logActivity('EXPIRY_REMINDER_SENT', { count, days });
};

// -----------------------------------------------------------------------------
// AUDIT & COMPLIANCE
// -----------------------------------------------------------------------------

/**
 * Log audit log export
 * CALL THIS: After audit logs are exported
 *
 * @param {string} startDate - Export start date
 * @param {string} endDate - Export end date
 * @param {number} count - Number of entries exported
 */
export const logAuditLogExported = async (startDate, endDate, count) => {
  return logActivity('AUDIT_LOG_EXPORTED', { startDate, endDate, count });
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate unique activity ID
 * TODO [IT]: Replace with UUID from backend or uuid library
 */
const generateActivityId = () => {
  return `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get current admin ID from auth context
 * TODO [IT]: Implement to get actual admin ID from auth state
 */
const getCurrentAdminId = () => {
  // PLACEHOLDER: Return from auth context
  // Example: return authContext.currentUser?.id;
  return 'admin_placeholder';
};

/**
 * Get stored activities from localStorage (placeholder)
 */
const getStoredActivities = () => {
  try {
    const stored = localStorage.getItem('recentActivities');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[ActivityService] Failed to parse stored activities:', error);
    return [];
  }
};

/**
 * Queue activity for offline sync
 * TODO [IT]: Implement offline queue with sync on reconnection
 */
const queueOfflineActivity = (activity) => {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    queue.push(activity);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('[ActivityService] Failed to queue offline activity:', error);
  }
};

/**
 * Sync offline activities when network is restored
 * TODO [IT]: Call this on network reconnection
 */
export const syncOfflineActivities = async () => {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    if (queue.length === 0) return;

    /**
     * TODO [IT]: Implement batch API call to sync activities
     * Example:
     * ```
     * const response = await fetch(`${API_BASE_URL}/activities/batch`, {
     *   method: 'POST',
     *   headers: {
     *     'Content-Type': 'application/json',
     *     'Authorization': `Bearer ${getAuthToken()}`,
     *   },
     *   body: JSON.stringify({ activities: queue }),
     * });
     *
     * if (response.ok) {
     *   localStorage.removeItem(OFFLINE_QUEUE_KEY);
     * }
     * ```
     */

    console.log('[ActivityService] Syncing offline activities:', queue.length);
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch (error) {
    console.error('[ActivityService] Failed to sync offline activities:', error);
  }
};

/**
 * Clear all stored activities (for testing/development)
 */
export const clearStoredActivities = () => {
  localStorage.removeItem('recentActivities');
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
};

export default {
  logActivity,
  fetchRecentActivities,
  fetchActivitiesPaginated,
  // User activities
  logUserRegistered,
  logUsersRegisteredToday,
  logUserActivated,
  logUserDeactivated,
  logUserBlocked,
  logUserStatusChanged,
  logUserProfileUpdated,
  logUserRegistrationFailed,
  logUserReactivated,
  logUserContactUpdated,
  logUserSelfRegistered,
  // License activities
  logLicenseUtilizationHigh,
  logLicenseLowWarning,
  logLicenseFreed,
  logLicenseAllocationChanged,
  // Device activities
  logDeviceRegistered,
  logDeviceRemoved,
  logDeviceMacUpdated,
  logDeviceLimitReached,
  logDevicesRegistered24h,
  logDeviceRenamed,
  logDeviceTypeUpdated,
  logDeviceUnauthorizedBlocked,
  // Policy activities
  logPolicyChanged,
  logUsersAssignedPolicy,
  // Password activities
  logPasswordResent,
  logPasswordSendFailed,
  // Bulk activities
  logBulkRegistrationCompleted,
  logBulkOperationFailed,
  logBulkDeviceImport,
  logBulkImportValidationFailed,
  // Scheduled activities
  logAutoCheckout,
  // Export activities
  logReportDownloaded,
  logUserListExported,
  logMonthlyReportGenerated,
  logExportCompleted,
  // Session activities
  logUsersConnectedYesterday,
  logInactiveUsersDetected,
  logUserForceDisconnected,
  // Alert activities
  logDataQuotaWarning,
  logUsersExceededDataLimit,
  logCheckoutApproaching,
  logFailedLoginAttempts,
  logUsersQuotaThreshold,
  // Admin activities
  logAdminLoggedIn,
  logAdminRoleChanged,
  logAdminPermissionsUpdated,
  // Notification activities
  logWelcomeCredentialsSent,
  logExpiryReminderSent,
  // Audit activities
  logAuditLogExported,
  // Utility
  syncOfflineActivities,
  clearStoredActivities,
};
