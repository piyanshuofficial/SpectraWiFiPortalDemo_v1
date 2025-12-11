// src/hooks/usePermissions.js

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Permissions, InternalPermissions, UserTypes } from '../utils/accessLevels';

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
 *
 * @example
 * const { hasPermission, canEditUsers, canManagePolicies } = usePermissions();
 * if (canEditUsers) {
 *   // Show edit UI
 * }
 */
export const usePermissions = () => {
  const { currentUser, isAuthenticated } = useAuth();

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
  };
};
