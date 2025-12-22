/**
 * ============================================================================
 * usePermissions Hook
 * ============================================================================
 *
 * @file src/hooks/usePermissions.js
 * @description Central permission checking hook that combines role-based
 *              permissions with segment-based feature restrictions.
 *
 * @permissionSources
 * Permissions come from TWO sources that are combined:
 *
 * 1. ROLE-BASED Permissions (from accessLevels.js):
 *    - Based on user's role (ADMIN, MANAGER, USER, VIEWER)
 *    - And access level (COMPANY or SITE) for customer users
 *    - Examples: canEditUsers, canViewReports, canManageDevices
 *
 * 2. SEGMENT-BASED Permissions (from segmentPermissionsConfig.js):
 *    - Based on current segment (Enterprise, Hotel, PG, etc.)
 *    - Control feature availability per segment type
 *    - Examples: canAddUserDevice, canBulkImportUsers
 *
 * @permissionFlow
 * ```
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                    Permission Resolution Flow                        │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │                                                                      │
 * │   currentUser (role, accessLevel)                                   │
 * │              │                                                       │
 * │              ▼                                                       │
 * │   ┌─────────────────────┐        ┌─────────────────────┐           │
 * │   │ Role Permissions    │        │ Segment Permissions │           │
 * │   │ (from accessLevels) │        │ (from segmentConfig)│           │
 * │   └──────────┬──────────┘        └──────────┬──────────┘           │
 * │              │                              │                       │
 * │              └──────────────┬───────────────┘                       │
 * │                             ▼                                       │
 * │                   Combined Permission Object                        │
 * │                             │                                       │
 * │                             ▼                                       │
 * │                   hasPermission('canEditUsers')                     │
 * │                   hasSegmentFeature('canAddUserDevice')             │
 * └──────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @rolePermissions
 * For CUSTOMER users (access level + role matrix):
 * | Permission        | Admin | Manager | Network Admin | User | Viewer |
 * |-------------------|-------|---------|---------------|------|--------|
 * | canEditUsers      |   ✓   |    ✓    |       ✗       |   ✗  |    ✗   |
 * | canManageDevices  |   ✓   |    ✓    |       ✓       |   ✗  |    ✗   |
 * | canViewReports    |   ✓   |    ✓    |       ✓       |   ✓  |    ✓   |
 * | canExportData     |   ✓   |    ✓    |       ✗       |   ✗  |    ✗   |
 *
 * For INTERNAL users (role-based):
 * | Permission               | Super Admin | Operations | Support | Sales |
 * |--------------------------|-------------|------------|---------|-------|
 * | canAccessInternalPortal  |      ✓      |      ✓     |    ✓    |   ✓   |
 * | canProvisionSites        |      ✓      |      ✓     |    ✗    |   ✗   |
 * | canAccessBulkOperations  |      ✓      |      ✗     |    ✗    |   ✗   |
 *
 * @segmentPermissions
 * | Feature              | Enterprise | Hotel | CoLiving | PG  | Misc |
 * |----------------------|------------|-------|----------|-----|------|
 * | canAddUserDevice     |     ✓      |   ✓   |    ✓     |  ✓  |  ✓   |
 * | canAddDigitalDevice  |     ✓      |   ✗   |    ✗     |  ✗  |  ✗   |
 * | canBulkImportUsers   |     ✓      |   ✓   |    ✓     |  ✓  |  ✓   |
 * | canDisconnectDevice  |     ✓      |   ✓   |    ✓     |  ✗  |  ✗   |
 *
 * @usage
 * ```jsx
 * import { usePermissions } from '@hooks/usePermissions';
 *
 * const UserEditButton = () => {
 *   const { canEditUsers, canAddUserDevice, hasPermission } = usePermissions();
 *
 *   // Direct boolean check
 *   if (!canEditUsers) return null;
 *
 *   // Function check for dynamic permissions
 *   if (!hasPermission('canManageDevices')) return null;
 *
 *   return <Button>Edit User</Button>;
 * };
 * ```
 *
 * @internalUsers
 * Internal users automatically get all segment-based permissions since
 * they need to support customers across all segment types.
 *
 * @dependencies
 * - AuthContext      : Provides currentUser with role/accessLevel
 * - SegmentContext   : Provides currentSegment
 * - accessLevels.js  : Permission matrices
 * - segmentPermissionsConfig.js : Segment feature flags
 *
 * @relatedFiles
 * - accessLevels.js              : Role/permission definitions
 * - segmentPermissionsConfig.js  : Segment feature flags
 * - ProtectedRoute.js            : Uses permissions for route access
 * - Sidebar.js                   : Uses permissions to show/hide menu items
 *
 * ============================================================================
 */

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSegment } from '../context/SegmentContext';
import { Permissions, InternalPermissions, UserTypes } from '../utils/accessLevels';
import { getSegmentFeaturePermissions } from '../config/segmentPermissionsConfig';

/**
 * Custom hook for managing user permissions
 *
 * @returns {Object} Object containing:
 *   - rolePermissions: All permissions for current user's role and access level
 *   - hasPermission: Function to check if user has a specific permission
 *   - canEditUsers: Boolean indicating if user can edit users
 *   - canViewReports: Boolean indicating if user can view reports
 *   - canManageDevices: Boolean indicating if user can manage devices
 *   - canManagePolicies: Boolean indicating if user can manage policies
 *   - canViewAnalytics: Boolean indicating if user can view analytics
 *   - canExportData: Boolean indicating if user can export data
 *   - canManageSegments: Boolean indicating if user can manage segments
 *   - canViewMultipleSites: Boolean indicating if user can view multiple sites
 *   - canManageBilling: Boolean indicating if user can manage billing
 *   - canConfigureSystem: Boolean indicating if user can configure system settings
 *   - canManageRoles: Boolean indicating if user can manage roles and permissions
 *   - canAccessInternalPortal: Boolean indicating if user can access internal portal
 *   - Segment-based feature permissions (canAddUserDevice, canAddDigitalDevice, etc.)
 *
 * @example
 * const { hasPermission, canEditUsers, canManagePolicies, canAddUserDevice } = usePermissions();
 * if (canEditUsers) {
 *   // Show edit UI
 * }
 */
export const usePermissions = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { currentSegment } = useSegment();

  const rolePermissions = useMemo(() => {
    // Return empty permissions if not authenticated or no user
    if (!isAuthenticated || !currentUser) {
      return {};
    }

    // Get permissions based on user type
    if (currentUser.userType === UserTypes.INTERNAL) {
      return InternalPermissions[currentUser.role] || {};
    } else {
      // Customer user - use access level and role
      return Permissions[currentUser.accessLevel]?.[currentUser.role] || {};
    }
  }, [currentUser, isAuthenticated]);

  const hasPermission = useMemo(() => {
    return (permission) => rolePermissions[permission] === true;
  }, [rolePermissions]);

  // Get segment-based feature permissions
  const segmentFeaturePermissions = useMemo(() => {
    // Internal users have all segment permissions
    if (currentUser?.userType === UserTypes.INTERNAL) {
      return {
        canAddUserDevice: true,
        canAddDigitalDevice: true,
        canBulkImportUsers: true,
        canBulkImportDevices: true,
        canDisconnectDevice: true,
      };
    }
    // Get permissions based on current segment
    return getSegmentFeaturePermissions(currentSegment);
  }, [currentUser, currentSegment]);

  // Check if a segment feature is allowed
  const hasSegmentFeature = useMemo(() => {
    return (feature) => segmentFeaturePermissions[feature] === true;
  }, [segmentFeaturePermissions]);

  return {
    rolePermissions,
    hasPermission,
    // Existing permissions
    canEditUsers: rolePermissions.canEditUsers === true,
    canViewReports: rolePermissions.canViewReports === true,
    canManageDevices: rolePermissions.canManageDevices === true,
    // New permissions
    canManagePolicies: rolePermissions.canManagePolicies === true,
    canViewAnalytics: rolePermissions.canViewAnalytics === true,
    canExportData: rolePermissions.canExportData === true,
    canManageSegments: rolePermissions.canManageSegments === true,
    canViewMultipleSites: rolePermissions.canViewMultipleSites === true,
    canManageBilling: rolePermissions.canManageBilling === true,
    canConfigureSystem: rolePermissions.canConfigureSystem === true,
    canManageRoles: rolePermissions.canManageRoles === true,
    canViewLogs: rolePermissions.canViewLogs === true,
    // Internal portal permissions
    canAccessInternalPortal: rolePermissions.canAccessInternalPortal === true,
    canProvisionSites: rolePermissions.canProvisionSites === true,
    canConfigureSites: rolePermissions.canConfigureSites === true,
    canManageAllSites: rolePermissions.canManageAllSites === true,
    canViewAllCustomers: rolePermissions.canViewAllCustomers === true,
    canManageInternalUsers: rolePermissions.canManageInternalUsers === true,
    canAccessSystemSettings: rolePermissions.canAccessSystemSettings === true,
    canViewAuditLogs: rolePermissions.canViewAuditLogs === true,
    canManageLicenses: rolePermissions.canManageLicenses === true,
    canAccessSupportTools: rolePermissions.canAccessSupportTools === true,
    // Bulk Operations permissions (Super Admin only)
    canAccessBulkOperations: rolePermissions.canAccessBulkOperations === true,
    canBulkRegisterUsers: rolePermissions.canBulkRegisterUsers === true,
    canBulkRegisterDevices: rolePermissions.canBulkRegisterDevices === true,
    canBulkActivateUsers: rolePermissions.canBulkActivateUsers === true,
    canBulkSuspendUsers: rolePermissions.canBulkSuspendUsers === true,
    canBulkBlockUsers: rolePermissions.canBulkBlockUsers === true,
    canBulkChangePolicies: rolePermissions.canBulkChangePolicies === true,
    canBulkRenameDevices: rolePermissions.canBulkRenameDevices === true,
    canBulkResendPasswords: rolePermissions.canBulkResendPasswords === true,
    canScheduleBulkOperations: rolePermissions.canScheduleBulkOperations === true,
    // Device Editing permissions (Super Admin + Support Engineer)
    canEditDeviceMAC: rolePermissions.canEditDeviceMAC === true,
    canEditDeviceCategory: rolePermissions.canEditDeviceCategory === true,
    // Single User Scheduling permissions (Super Admin + Support Engineer)
    canScheduleUserActions: rolePermissions.canScheduleUserActions === true,
    // Segment-based feature permissions
    segmentFeaturePermissions,
    hasSegmentFeature,
    canAddUserDevice: segmentFeaturePermissions.canAddUserDevice === true,
    canAddDigitalDevice: segmentFeaturePermissions.canAddDigitalDevice === true,
    canBulkImportUsers: segmentFeaturePermissions.canBulkImportUsers === true,
    canBulkImportDevices: segmentFeaturePermissions.canBulkImportDevices === true,
    canDisconnectDevice: segmentFeaturePermissions.canDisconnectDevice === true,
    // Current segment for reference
    currentSegment,
  };
};
