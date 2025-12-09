// src/hooks/useSegmentActivities.js

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSegment } from '@context/SegmentContext';
import { ACTIVITY_TYPES, SEVERITY, ACTIVITY_CATEGORIES } from '../constants/activityTypes';

/**
 * Hook to get segment-specific recent activities with i18n support
 * Returns activities tailored to the current segment with translations
 *
 * Activity data structure:
 * {
 *   id: string,           // Unique identifier
 *   type: string,         // Activity type key from ACTIVITY_TYPES
 *   category: string,     // Category for filtering
 *   severity: string,     // info | success | warning | error
 *   translationKey: string, // i18n translation key
 *   params: object,       // Parameters for translation interpolation
 *   time: string,         // Relative time (translated)
 *   text: string,         // Formatted activity text (for backward compatibility)
 *   createdAt: string,    // ISO timestamp
 * }
 */
export const useSegmentActivities = () => {
  const { t } = useTranslation();
  const { currentSegment } = useSegment();

  /**
   * Format relative time using i18n
   */
  const formatTime = (minutesAgo) => {
    if (minutesAgo < 1) {
      return t('time.justNow');
    } else if (minutesAgo < 60) {
      return t('time.minutesAgo', { count: minutesAgo });
    } else if (minutesAgo < 1440) {
      const hours = Math.floor(minutesAgo / 60);
      return t('time.hoursAgo', { count: hours });
    } else {
      const days = Math.floor(minutesAgo / 1440);
      return t('time.daysAgo', { count: days });
    }
  };

  /**
   * Create activity object with translation support
   */
  const createActivity = (id, typeKey, params, minutesAgo, overrides = {}) => {
    const activityType = ACTIVITY_TYPES[typeKey];
    if (!activityType) {
      console.warn(`[useSegmentActivities] Unknown activity type: ${typeKey}`);
      return null;
    }

    const now = new Date();
    const createdAt = new Date(now - minutesAgo * 60 * 1000).toISOString();

    return {
      id,
      type: activityType.key,
      category: activityType.category,
      severity: activityType.severity,
      translationKey: activityType.translationKey,
      params,
      time: formatTime(minutesAgo),
      text: t(activityType.translationKey, params), // For backward compatibility
      createdAt,
      ...overrides,
    };
  };

  const activities = useMemo(() => {
    /**
     * Segment-specific activities using the new activity types
     * Each segment has realistic activities based on typical operations
     */
    const segmentActivities = {
      enterprise: [
        createActivity('ent_1', 'USER_REGISTERED', { name: 'Amit Mishra', admin: 'HR Admin' }, 10),
        createActivity('ent_2', 'LICENSE_UTILIZATION_HIGH', { percent: 85, used: 850, total: 1000 }, 45),
        createActivity('ent_3', 'BULK_REGISTRATION_COMPLETED', { success: 25, total: 25 }, 120),
        createActivity('ent_4', 'USER_PROFILE_UPDATED', { userId: 'USR-4521', admin: 'IT Department' }, 180),
        createActivity('ent_5', 'ADMIN_LOGGED_IN', { admin: 'superadmin', ipAddress: '192.168.1.100' }, 240),
        createActivity('ent_6', 'REPORT_DOWNLOADED', { reportName: 'Monthly Usage Report', admin: 'Finance Manager' }, 300),
        createActivity('ent_7', 'DEVICE_REGISTERED', { deviceName: 'Dell Latitude 5520', userName: 'New Employee' }, 360),
      ],

      office: [
        createActivity('off_1', 'USER_REGISTERED', { name: 'Srinivas Reddy', admin: 'Office Admin' }, 8),
        createActivity('off_2', 'DEVICE_REGISTERED', { deviceName: 'MacBook Pro M2', userName: 'Priya Venkat' }, 45),
        createActivity('off_3', 'USER_ACTIVATED', { name: 'New Employee', used: 180, total: 250 }, 90),
        createActivity('off_4', 'REPORT_DOWNLOADED', { reportName: 'Office Usage Report', admin: 'Manager' }, 120),
        createActivity('off_5', 'PASSWORD_RESENT', { name: 'Rajesh Kumar' }, 180),
        createActivity('off_6', 'USER_CONTACT_UPDATED', { name: 'Conference Room', newEmail: 'conference@office.com' }, 240),
      ],

      coLiving: [
        createActivity('col_1', 'USER_REGISTERED', { name: 'Priya Sharma', admin: 'Property Manager' }, 15),
        createActivity('col_2', 'DEVICE_REGISTERED', { deviceName: 'MacBook Pro', userName: 'Resident - Room 204' }, 30),
        createActivity('col_3', 'USER_LIST_EXPORTED', { count: 320 }, 60),
        createActivity('col_4', 'WELCOME_CREDENTIALS_SENT', { name: 'New Resident', channel: 'Email' }, 90),
        createActivity('col_5', 'DEVICE_LIMIT_REACHED', { name: 'Rahul Verma', count: 3, max: 3 }, 150),
        createActivity('col_6', 'AUTO_CHECKOUT', { name: 'Guest User' }, 180),
      ],

      hotel: [
        createActivity('hot_1', 'USER_ACTIVATED', { name: 'John Smith - Room 305', used: 425, total: 500 }, 5),
        createActivity('hot_2', 'DEVICE_REGISTERED', { deviceName: 'iPad Air', userName: 'Guest - Room 305' }, 20),
        createActivity('hot_3', 'USER_DEACTIVATED', { name: 'Sarah Johnson - Room 208', admin: 'Front Desk' }, 60),
        createActivity('hot_4', 'AUTO_CHECKOUT', { name: 'Check-out Guest' }, 120),
        createActivity('hot_5', 'CHECKOUT_APPROACHING', { count: 15 }, 180),
        createActivity('hot_6', 'BULK_REGISTRATION_COMPLETED', { success: 12, total: 12 }, 240),
        createActivity('hot_7', 'WELCOME_CREDENTIALS_SENT', { name: 'VIP Guest', channel: 'SMS' }, 300),
      ],

      coWorking: [
        createActivity('cow_1', 'USER_SELF_REGISTERED', { name: 'Startup Inc.' }, 25),
        createActivity('cow_2', 'USER_ACTIVATED', { name: 'Day Pass - Alex Brown', used: 180, total: 300 }, 45),
        createActivity('cow_3', 'DATA_QUOTA_WARNING', { name: 'Premium Desk User', percent: 90 }, 90),
        createActivity('cow_4', 'DEVICE_REGISTERED', { deviceName: 'Conference Laptop', userName: 'Meeting Room A' }, 120),
        createActivity('cow_5', 'USER_PROFILE_UPDATED', { userId: 'USR-2847', admin: 'Space Manager' }, 180),
        createActivity('cow_6', 'EXPIRY_REMINDER_SENT', { count: 8, days: 3 }, 240),
      ],

      pg: [
        createActivity('pg_1', 'USER_REGISTERED', { name: 'Rahul Kumar', admin: 'PG Manager' }, 30),
        createActivity('pg_2', 'DEVICE_REGISTERED', { deviceName: 'Samsung Galaxy S23', userName: 'Room 12 Tenant' }, 60),
        createActivity('pg_3', 'PASSWORD_RESENT', { name: 'Neeta Patil' }, 120),
        createActivity('pg_4', 'USER_CONTACT_UPDATED', { name: 'Amit Singh', newEmail: 'amit.new@email.com' }, 180),
        createActivity('pg_5', 'DEVICE_LIMIT_REACHED', { name: 'Vijay Reddy', count: 2, max: 2 }, 240),
        createActivity('pg_6', 'LICENSE_LOW_WARNING', { count: 10 }, 300),
      ],

      miscellaneous: [
        createActivity('mis_1', 'USER_REGISTERED', { name: 'New User', admin: 'System Admin' }, 20),
        createActivity('mis_2', 'DEVICE_REGISTERED', { deviceName: 'Generic Device', userName: 'User' }, 60),
        createActivity('mis_3', 'EXPORT_COMPLETED', { filename: 'backup_data.csv' }, 120),
        createActivity('mis_4', 'ADMIN_LOGGED_IN', { admin: 'admin', ipAddress: '10.0.0.1' }, 180),
        createActivity('mis_5', 'USERS_REGISTERED_TODAY', { count: 5 }, 240),
      ],
    };

    // Filter out any null activities (from unknown types)
    const activities = segmentActivities[currentSegment] || segmentActivities.enterprise;
    return activities.filter(Boolean);
  }, [currentSegment, t]);

  return activities;
};

/**
 * Get sample activities for demo/testing
 * These cover all activity types defined in the system
 */
export const getSampleActivities = (t) => {
  const now = new Date();

  const formatTime = (minutesAgo) => {
    if (minutesAgo < 1) return t('time.justNow');
    if (minutesAgo < 60) return t('time.minutesAgo', { count: minutesAgo });
    if (minutesAgo < 1440) return t('time.hoursAgo', { count: Math.floor(minutesAgo / 60) });
    return t('time.daysAgo', { count: Math.floor(minutesAgo / 1440) });
  };

  const createSample = (id, typeKey, params, minutesAgo) => {
    const activityType = ACTIVITY_TYPES[typeKey];
    if (!activityType) return null;

    return {
      id,
      type: activityType.key,
      category: activityType.category,
      severity: activityType.severity,
      translationKey: activityType.translationKey,
      params,
      time: formatTime(minutesAgo),
      text: t(activityType.translationKey, params),
      createdAt: new Date(now - minutesAgo * 60 * 1000).toISOString(),
    };
  };

  return [
    // User Registration & Status
    createSample('s1', 'USER_REGISTERED', { name: 'Rahul Sharma', admin: 'Admin User' }, 5),
    createSample('s2', 'USERS_REGISTERED_TODAY', { count: 12 }, 15),
    createSample('s3', 'USER_ACTIVATED', { name: 'Priya Patel', used: 85, total: 100 }, 30),
    createSample('s4', 'USER_DEACTIVATED', { name: 'Guest User', admin: 'System' }, 45),
    createSample('s5', 'USER_BLOCKED', { name: 'Suspicious User' }, 60),
    createSample('s6', 'USER_STATUS_CHANGED', { name: 'Amit Kumar', oldStatus: 'Suspended', newStatus: 'Active' }, 75),
    createSample('s7', 'USER_PROFILE_UPDATED', { userId: 'USR-1234', admin: 'HR Admin' }, 90),
    createSample('s8', 'USER_REGISTRATION_FAILED', { name: 'Test User', reason: 'Duplicate email' }, 105),
    createSample('s9', 'USER_REACTIVATED', { name: 'Inactive User', days: 30 }, 120),
    createSample('s10', 'USER_CONTACT_UPDATED', { name: 'Suresh Reddy', newEmail: 'suresh.new@example.com' }, 135),
    createSample('s11', 'USER_SELF_REGISTERED', { name: 'Walk-in Guest' }, 150),

    // License Management
    createSample('s12', 'LICENSE_UTILIZATION_HIGH', { percent: 85, used: 850, total: 1000 }, 165),
    createSample('s13', 'LICENSE_LOW_WARNING', { count: 15 }, 180),
    createSample('s14', 'LICENSE_FREED', { name: 'Deactivated User' }, 195),
    createSample('s15', 'LICENSE_ALLOCATION_CHANGED', { old: 500, new: 750 }, 210),

    // Device Management
    createSample('s16', 'DEVICE_REGISTERED', { deviceName: 'iPhone 15 Pro', userName: 'VIP User' }, 225),
    createSample('s17', 'DEVICE_REMOVED', { deviceName: 'Old Laptop', userName: 'Former Employee' }, 240),
    createSample('s18', 'DEVICE_MAC_UPDATED', { oldMAC: 'AA:BB:CC:DD:EE:FF', newMAC: '11:22:33:44:55:66' }, 255),
    createSample('s19', 'DEVICE_LIMIT_REACHED', { name: 'Power User', count: 5, max: 5 }, 270),
    createSample('s20', 'DEVICES_REGISTERED_24H', { count: 45 }, 285),
    createSample('s21', 'DEVICE_RENAMED', { deviceName: 'Work Laptop', admin: 'IT Admin' }, 300),
    createSample('s22', 'DEVICE_TYPE_UPDATED', { deviceName: 'Smart TV', oldType: 'Unknown', newType: 'IoT Device' }, 315),
    createSample('s23', 'DEVICE_UNAUTHORIZED_BLOCKED', { name: 'Unknown User' }, 330),

    // User Profile Updates
    createSample('s24', 'USER_PROFILE_UPDATED', { userId: 'USR-5921', admin: 'HR Admin' }, 345),
    createSample('s25', 'USER_CONTACT_UPDATED', { name: 'Support Team', newEmail: 'support.new@company.com' }, 360),

    // Password Management
    createSample('s26', 'PASSWORD_RESENT', { name: 'Forgot Password User' }, 375),
    createSample('s27', 'PASSWORD_SEND_FAILED', { name: 'Invalid Contact User' }, 390),

    // Bulk Operations
    createSample('s28', 'BULK_REGISTRATION_COMPLETED', { success: 48, total: 50 }, 405),
    createSample('s29', 'BULK_OPERATION_FAILED', { count: 5 }, 420),
    createSample('s30', 'BULK_DEVICE_IMPORT', { success: 30, skipped: 3, failed: 2 }, 435),
    createSample('s31', 'BULK_IMPORT_VALIDATION_FAILED', { count: 8 }, 450),

    // Scheduled Actions
    createSample('s32', 'AUTO_CHECKOUT', { name: 'Hotel Guest' }, 465),

    // Reports & Exports
    createSample('s33', 'REPORT_DOWNLOADED', { reportName: 'Monthly Usage', admin: 'Manager' }, 480),
    createSample('s34', 'USER_LIST_EXPORTED', { count: 500 }, 495),
    createSample('s35', 'MONTHLY_REPORT_GENERATED', {}, 510),
    createSample('s36', 'EXPORT_COMPLETED', { filename: 'users_export_dec2024.csv' }, 525),

    // Session & Activity
    createSample('s37', 'USERS_CONNECTED_YESTERDAY', { count: 850, peakCount: 720 }, 540),
    createSample('s38', 'INACTIVE_USERS_DETECTED', { count: 25, days: 30 }, 555),
    createSample('s39', 'USER_FORCE_DISCONNECTED', { name: 'Problematic User', admin: 'Network Admin' }, 570),

    // Alerts & Warnings
    createSample('s40', 'DATA_QUOTA_WARNING', { name: 'Heavy User', percent: 95 }, 585),
    createSample('s41', 'USERS_EXCEEDED_DATA_LIMIT', { count: 12 }, 600),
    createSample('s42', 'CHECKOUT_APPROACHING', { count: 20 }, 615),
    createSample('s43', 'FAILED_LOGIN_ATTEMPTS', { count: 15 }, 630),
    createSample('s44', 'USERS_QUOTA_THRESHOLD', { count: 35, percent: 80 }, 645),

    // Admin & Access Management
    createSample('s45', 'ADMIN_LOGGED_IN', { admin: 'superadmin', ipAddress: '192.168.1.1' }, 660),
    createSample('s46', 'ADMIN_ROLE_CHANGED', { admin: 'new_manager', oldRole: 'Viewer', newRole: 'Manager', superAdmin: 'superadmin' }, 675),
    createSample('s47', 'ADMIN_PERMISSIONS_UPDATED', { admin: 'support_staff', permissionChanges: '+canEditUsers, -canDeleteUsers' }, 690),

    // Notifications & Communications
    createSample('s48', 'WELCOME_CREDENTIALS_SENT', { name: 'New User', channel: 'Email' }, 705),
    createSample('s49', 'EXPIRY_REMINDER_SENT', { count: 10, days: 7 }, 720),

    // Audit & Compliance
    createSample('s50', 'AUDIT_LOG_EXPORTED', { startDate: '2024-11-01', endDate: '2024-11-30', count: 1500 }, 735),
  ].filter(Boolean);
};

export default useSegmentActivities;
