/**
 * useRecentActivities Hook
 *
 * A React hook for fetching and displaying recent activities on the dashboard.
 * Provides activity data with i18n support for multilingual display.
 *
 * Usage:
 * ```jsx
 * import useRecentActivities from '../hooks/useRecentActivities';
 *
 * function RecentActivitiesWidget() {
 *   const { activities, loading, error, refresh, formatActivity } = useRecentActivities();
 *
 *   return (
 *     <ul>
 *       {activities.map(activity => (
 *         <li key={activity.id}>{formatActivity(activity)}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchRecentActivities } from '../services/activityService';
import { ACTIVITY_TYPES, SEVERITY, CATEGORY_LABELS } from '../constants/activityTypes';

/**
 * Format relative time for activity timestamp
 * @param {string} timestamp - ISO timestamp
 * @param {function} t - i18n translation function
 * @returns {string} Formatted relative time
 */
const formatRelativeTime = (timestamp, t) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffMs = now - activityTime;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return t('time.justNow');
  } else if (diffMins < 60) {
    return t('time.minutesAgo', { count: diffMins });
  } else if (diffHours < 24) {
    return t('time.hoursAgo', { count: diffHours });
  } else if (diffDays === 1) {
    return t('time.yesterday');
  } else if (diffDays < 7) {
    return t('time.daysAgo', { count: diffDays });
  } else {
    // For older activities, return formatted date
    return activityTime.toLocaleDateString();
  }
};

/**
 * Get severity color class for activity
 * @param {string} severity - Severity level
 * @returns {string} CSS class name
 */
const getSeverityClass = (severity) => {
  switch (severity) {
    case SEVERITY.SUCCESS:
      return 'activity-success';
    case SEVERITY.WARNING:
      return 'activity-warning';
    case SEVERITY.ERROR:
      return 'activity-error';
    case SEVERITY.INFO:
    default:
      return 'activity-info';
  }
};

/**
 * Get severity icon based on type
 * @param {string} severity - Severity level
 * @returns {string} Icon name for react-icons
 */
const getSeverityIcon = (severity) => {
  switch (severity) {
    case SEVERITY.SUCCESS:
      return 'FiCheckCircle';
    case SEVERITY.WARNING:
      return 'FiAlertTriangle';
    case SEVERITY.ERROR:
      return 'FiXCircle';
    case SEVERITY.INFO:
    default:
      return 'FiInfo';
  }
};

/**
 * useRecentActivities Hook
 *
 * @param {Object} options - Hook options
 * @param {number} options.limit - Maximum activities to fetch (default: 10)
 * @param {string} options.category - Filter by category
 * @param {string} options.severity - Filter by severity
 * @param {number} options.refreshInterval - Auto-refresh interval in ms (0 to disable)
 * @returns {Object} Hook return object
 */
const useRecentActivities = (options = {}) => {
  const {
    limit = 10,
    category = null,
    severity = null,
    refreshInterval = 0, // Auto-refresh disabled by default
  } = options;

  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch activities from service
   */
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchRecentActivities({
        limit,
        category,
        severity,
      });

      setActivities(data);
    } catch (err) {
      console.error('[useRecentActivities] Failed to fetch activities:', err);
      setError(err.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }, [limit, category, severity]);

  /**
   * Initial fetch and auto-refresh setup
   */
  useEffect(() => {
    fetchActivities();

    // Set up auto-refresh if interval is specified
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchActivities, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchActivities, refreshInterval]);

  /**
   * Format activity message with i18n interpolation
   * @param {Object} activity - Activity object
   * @returns {string} Translated activity message
   */
  const formatActivity = useCallback(
    (activity) => {
      if (!activity || !activity.translationKey) {
        return activity?.type || 'Unknown activity';
      }

      // Get the translation with interpolated params
      return t(activity.translationKey, activity.params || {});
    },
    [t]
  );

  /**
   * Format activity timestamp as relative time
   * @param {Object} activity - Activity object
   * @returns {string} Relative time string
   */
  const formatActivityTime = useCallback(
    (activity) => {
      if (!activity || !activity.createdAt) {
        return '';
      }
      return formatRelativeTime(activity.createdAt, t);
    },
    [t]
  );

  /**
   * Get category display name
   * @param {string} categoryKey - Category key
   * @returns {string} Translated category name
   */
  const getCategoryLabel = useCallback(
    (categoryKey) => {
      const labelKey = CATEGORY_LABELS[categoryKey];
      return labelKey ? t(labelKey) : categoryKey;
    },
    [t]
  );

  /**
   * Enriched activities with formatted data
   */
  const enrichedActivities = useMemo(() => {
    return activities.map((activity) => ({
      ...activity,
      formattedMessage: formatActivity(activity),
      formattedTime: formatActivityTime(activity),
      severityClass: getSeverityClass(activity.severity),
      severityIcon: getSeverityIcon(activity.severity),
      categoryLabel: getCategoryLabel(activity.category),
    }));
  }, [activities, formatActivity, formatActivityTime, getCategoryLabel]);

  /**
   * Get available categories for filtering
   */
  const availableCategories = useMemo(() => {
    const categories = [...new Set(activities.map((a) => a.category))];
    return categories.map((cat) => ({
      value: cat,
      label: getCategoryLabel(cat),
    }));
  }, [activities, getCategoryLabel]);

  return {
    // Data
    activities: enrichedActivities,
    rawActivities: activities,

    // State
    loading,
    error,

    // Actions
    refresh: fetchActivities,

    // Formatters
    formatActivity,
    formatActivityTime,
    getCategoryLabel,
    getSeverityClass,
    getSeverityIcon,

    // Filter options
    availableCategories,

    // i18n
    t,
  };
};

export default useRecentActivities;

/**
 * Sample activities for development/demo purposes
 * Covers all activity types with realistic data
 * TODO [IT]: Remove this when backend is integrated
 */
export const generateSampleActivities = () => {
  const now = new Date();

  return [
    // User Registration & Status
    {
      id: 'sample_1',
      type: 'USER_REGISTERED',
      category: 'user_registration',
      severity: 'success',
      translationKey: 'activities.userRegistered',
      params: { name: 'Rahul Sharma', admin: 'HR Admin' },
      createdAt: new Date(now - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_2',
      type: 'USER_ACTIVATED',
      category: 'user_status',
      severity: 'success',
      translationKey: 'activities.userActivated',
      params: { name: 'Priya Patel', used: 85, total: 100 },
      createdAt: new Date(now - 12 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_3',
      type: 'USER_SELF_REGISTERED',
      category: 'user_self_register',
      severity: 'success',
      translationKey: 'activities.userSelfRegistered',
      params: { name: 'Walk-in Guest' },
      createdAt: new Date(now - 18 * 60 * 1000).toISOString(),
    },

    // License Management
    {
      id: 'sample_4',
      type: 'LICENSE_UTILIZATION_HIGH',
      category: 'license',
      severity: 'warning',
      translationKey: 'activities.licenseUtilizationHigh',
      params: { percent: 85, used: 850, total: 1000 },
      createdAt: new Date(now - 25 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_5',
      type: 'LICENSE_LOW_WARNING',
      category: 'license',
      severity: 'warning',
      translationKey: 'activities.licenseLowWarning',
      params: { count: 15 },
      createdAt: new Date(now - 35 * 60 * 1000).toISOString(),
    },

    // Device Management
    {
      id: 'sample_6',
      type: 'DEVICE_REGISTERED',
      category: 'device',
      severity: 'success',
      translationKey: 'activities.deviceRegistered',
      params: { deviceName: 'iPhone 15 Pro', userName: 'VIP User' },
      createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_7',
      type: 'DEVICE_LIMIT_REACHED',
      category: 'device',
      severity: 'warning',
      translationKey: 'activities.deviceLimitReached',
      params: { name: 'Power User', count: 5, max: 5 },
      createdAt: new Date(now - 55 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_8',
      type: 'DEVICE_TYPE_UPDATED',
      category: 'device_type',
      severity: 'info',
      translationKey: 'activities.deviceTypeUpdated',
      params: { deviceName: 'Smart TV', oldType: 'Unknown', newType: 'IoT Device' },
      createdAt: new Date(now - 65 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_9',
      type: 'DEVICE_UNAUTHORIZED_BLOCKED',
      category: 'device_blocked',
      severity: 'warning',
      translationKey: 'activities.deviceUnauthorizedBlocked',
      params: { name: 'Unknown User' },
      createdAt: new Date(now - 75 * 60 * 1000).toISOString(),
    },

    // User Profile Updates
    {
      id: 'sample_10',
      type: 'USER_PROFILE_UPDATED',
      category: 'user_profile',
      severity: 'info',
      translationKey: 'activities.userProfileUpdated',
      params: { userId: 'USR-3854', admin: 'IT Admin' },
      createdAt: new Date(now - 90 * 60 * 1000).toISOString(),
    },

    // Password Management
    {
      id: 'sample_11',
      type: 'PASSWORD_RESENT',
      category: 'password',
      severity: 'success',
      translationKey: 'activities.passwordResent',
      params: { name: 'Suresh Reddy' },
      createdAt: new Date(now - 100 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_12',
      type: 'PASSWORD_SEND_FAILED',
      category: 'password',
      severity: 'error',
      translationKey: 'activities.passwordSendFailed',
      params: { name: 'Invalid Contact User' },
      createdAt: new Date(now - 110 * 60 * 1000).toISOString(),
    },

    // Bulk Operations
    {
      id: 'sample_13',
      type: 'BULK_REGISTRATION_COMPLETED',
      category: 'bulk',
      severity: 'success',
      translationKey: 'activities.bulkRegistrationCompleted',
      params: { success: 48, total: 50 },
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_14',
      type: 'BULK_DEVICE_IMPORT',
      category: 'bulk_device',
      severity: 'info',
      translationKey: 'activities.bulkDeviceImport',
      params: { success: 30, skipped: 3, failed: 2 },
      createdAt: new Date(now - 2.5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_15',
      type: 'BULK_IMPORT_VALIDATION_FAILED',
      category: 'bulk_validation',
      severity: 'warning',
      translationKey: 'activities.bulkImportValidationFailed',
      params: { count: 8 },
      createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    },

    // Scheduled Actions
    {
      id: 'sample_16',
      type: 'AUTO_CHECKOUT',
      category: 'scheduled',
      severity: 'info',
      translationKey: 'activities.autoCheckout',
      params: { name: 'Hotel Guest' },
      createdAt: new Date(now - 3.5 * 60 * 60 * 1000).toISOString(),
    },

    // Reports & Exports
    {
      id: 'sample_17',
      type: 'REPORT_DOWNLOADED',
      category: 'export',
      severity: 'info',
      translationKey: 'activities.reportDownloaded',
      params: { reportName: 'Monthly Usage Report', admin: 'Finance Manager' },
      createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_18',
      type: 'USER_LIST_EXPORTED',
      category: 'export',
      severity: 'info',
      translationKey: 'activities.userListExported',
      params: { count: 500 },
      createdAt: new Date(now - 4.5 * 60 * 60 * 1000).toISOString(),
    },

    // Session & Connectivity
    {
      id: 'sample_19',
      type: 'USER_FORCE_DISCONNECTED',
      category: 'session_disconnect',
      severity: 'info',
      translationKey: 'activities.userForceDisconnected',
      params: { name: 'Problematic User', admin: 'Network Admin' },
      createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_20',
      type: 'USERS_CONNECTED_YESTERDAY',
      category: 'session',
      severity: 'info',
      translationKey: 'activities.usersConnectedYesterday',
      params: { count: 850, peakCount: 720 },
      createdAt: new Date(now - 5.5 * 60 * 60 * 1000).toISOString(),
    },

    // Alerts & Warnings
    {
      id: 'sample_21',
      type: 'CHECKOUT_APPROACHING',
      category: 'alert',
      severity: 'warning',
      translationKey: 'activities.checkoutApproaching',
      params: { count: 15 },
      createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_22',
      type: 'USERS_QUOTA_THRESHOLD',
      category: 'quota',
      severity: 'warning',
      translationKey: 'activities.usersQuotaThreshold',
      params: { count: 35, percent: 80 },
      createdAt: new Date(now - 6.5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_23',
      type: 'FAILED_LOGIN_ATTEMPTS',
      category: 'alert',
      severity: 'warning',
      translationKey: 'activities.failedLoginAttempts',
      params: { count: 10 },
      createdAt: new Date(now - 7 * 60 * 60 * 1000).toISOString(),
    },

    // Admin & Access Management
    {
      id: 'sample_24',
      type: 'ADMIN_LOGGED_IN',
      category: 'admin_login',
      severity: 'info',
      translationKey: 'activities.adminLoggedIn',
      params: { admin: 'superadmin', ipAddress: '192.168.1.100' },
      createdAt: new Date(now - 8 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_25',
      type: 'ADMIN_ROLE_CHANGED',
      category: 'admin_role',
      severity: 'info',
      translationKey: 'activities.adminRoleChanged',
      params: { admin: 'new_manager', oldRole: 'Viewer', newRole: 'Manager', superAdmin: 'superadmin' },
      createdAt: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_26',
      type: 'ADMIN_PERMISSIONS_UPDATED',
      category: 'admin_permission',
      severity: 'info',
      translationKey: 'activities.adminPermissionsUpdated',
      params: { admin: 'support_staff', permissionChanges: '+canEditUsers' },
      createdAt: new Date(now - 9 * 60 * 60 * 1000).toISOString(),
    },

    // Notifications & Communications
    {
      id: 'sample_27',
      type: 'WELCOME_CREDENTIALS_SENT',
      category: 'notify_welcome',
      severity: 'success',
      translationKey: 'activities.welcomeCredentialsSent',
      params: { name: 'New User', channel: 'Email' },
      createdAt: new Date(now - 10 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'sample_28',
      type: 'EXPIRY_REMINDER_SENT',
      category: 'notify_reminder',
      severity: 'info',
      translationKey: 'activities.expiryReminderSent',
      params: { count: 10, days: 7 },
      createdAt: new Date(now - 11 * 60 * 60 * 1000).toISOString(),
    },

    // Audit & Compliance
    {
      id: 'sample_29',
      type: 'AUDIT_LOG_EXPORTED',
      category: 'audit_export',
      severity: 'info',
      translationKey: 'activities.auditLogExported',
      params: { startDate: '2024-11-01', endDate: '2024-11-30', count: 1500 },
      createdAt: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
    },

    // User Status Changes
    {
      id: 'sample_30',
      type: 'USER_DEACTIVATED',
      category: 'user_status',
      severity: 'info',
      translationKey: 'activities.userDeactivated',
      params: { name: 'Former Employee', admin: 'HR Admin' },
      createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};
