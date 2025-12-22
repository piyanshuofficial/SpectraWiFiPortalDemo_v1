// src/config/segmentPermissionsConfig.js
// Segment-wise default permissions configuration
// These can be overridden by admin during site provisioning

import { SEGMENTS } from '../context/SegmentContext';

/**
 * Segment-wise feature permissions
 *
 * These define the default permissions for each segment.
 * Admins can override these during site provisioning.
 *
 * Feature permissions:
 * - canAddUserDevice: Allow users to add their own devices (user-linked devices)
 * - canAddDigitalDevice: Allow adding digital/smart devices (not linked to users)
 * - canBulkImportUsers: Allow bulk import of users via CSV
 * - canBulkImportDevices: Allow bulk import of devices via CSV
 * - canDisconnectDevice: Allow disconnecting devices from network
 */
export const SEGMENT_FEATURE_PERMISSIONS = {
  [SEGMENTS.ENTERPRISE]: {
    canAddUserDevice: true,
    canAddDigitalDevice: true,
    canBulkImportUsers: true,
    canBulkImportDevices: true,
    canDisconnectDevice: true,
  },
  [SEGMENTS.OFFICE]: {
    canAddUserDevice: false,  // Not allowed for Office
    canAddDigitalDevice: true,
    canBulkImportUsers: false, // Not allowed for Office
    canBulkImportDevices: false, // Not allowed for Office
    canDisconnectDevice: true,
  },
  [SEGMENTS.CO_LIVING]: {
    canAddUserDevice: true,
    canAddDigitalDevice: true,
    canBulkImportUsers: true,
    canBulkImportDevices: true,
    canDisconnectDevice: true,
  },
  [SEGMENTS.CO_WORKING]: {
    canAddUserDevice: true,
    canAddDigitalDevice: true,
    canBulkImportUsers: true,
    canBulkImportDevices: true,
    canDisconnectDevice: true,
  },
  [SEGMENTS.HOTEL]: {
    canAddUserDevice: false,  // Not allowed for Hotel
    canAddDigitalDevice: true,
    canBulkImportUsers: true,
    canBulkImportDevices: true,
    canDisconnectDevice: true,
  },
  [SEGMENTS.PG]: {
    canAddUserDevice: false,  // Not allowed for PG
    canAddDigitalDevice: true,
    canBulkImportUsers: false, // Not allowed for PG
    canBulkImportDevices: false, // Not allowed for PG
    canDisconnectDevice: true,
  },
  [SEGMENTS.MISCELLANEOUS]: {
    canAddUserDevice: true,
    canAddDigitalDevice: true,
    canBulkImportUsers: true,
    canBulkImportDevices: true,
    canDisconnectDevice: true,
  },
};

/**
 * Get feature permissions for a segment
 * @param {string} segment - The segment identifier
 * @returns {Object} Feature permissions object
 */
export const getSegmentFeaturePermissions = (segment) => {
  return SEGMENT_FEATURE_PERMISSIONS[segment] || SEGMENT_FEATURE_PERMISSIONS[SEGMENTS.MISCELLANEOUS];
};

/**
 * Check if a specific feature is allowed for a segment
 * @param {string} segment - The segment identifier
 * @param {string} feature - The feature permission key
 * @returns {boolean} Whether the feature is allowed
 */
export const isFeatureAllowedForSegment = (segment, feature) => {
  const permissions = getSegmentFeaturePermissions(segment);
  return permissions[feature] === true;
};

/**
 * Feature permission labels for UI display
 */
export const FEATURE_PERMISSION_LABELS = {
  canAddUserDevice: 'Add User Device',
  canAddDigitalDevice: 'Add Digital Device',
  canBulkImportUsers: 'Bulk Import Users',
  canBulkImportDevices: 'Bulk Import Devices',
  canDisconnectDevice: 'Disconnect Device',
};

/**
 * Feature permission descriptions for tooltips/help text
 */
export const FEATURE_PERMISSION_DESCRIPTIONS = {
  canAddUserDevice: 'Allow users to register their own devices (laptops, phones, etc.)',
  canAddDigitalDevice: 'Allow adding digital/smart devices like access points, switches, etc.',
  canBulkImportUsers: 'Allow bulk importing users via CSV file upload',
  canBulkImportDevices: 'Allow bulk importing devices via CSV file upload',
  canDisconnectDevice: 'Allow disconnecting devices from the network',
};

/**
 * Get all feature permission keys
 * @returns {string[]} Array of feature permission keys
 */
export const getAllFeaturePermissionKeys = () => {
  return Object.keys(FEATURE_PERMISSION_LABELS);
};

/**
 * Default permissions template for site provisioning
 * Admins can modify these values during site setup
 */
export const getDefaultPermissionsForProvisioning = (segment) => {
  const defaults = getSegmentFeaturePermissions(segment);
  return {
    ...defaults,
    // Include metadata for UI
    _segment: segment,
    _isCustomized: false,
  };
};

export default SEGMENT_FEATURE_PERMISSIONS;
