// src/hooks/usePermissions.js

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Permissions } from '../utils/accessLevels';

/**
 * Custom hook for managing user permissions
 * 
 * @returns {Object} Object containing:
 *   - rolePermissions: All permissions for current user's role and access level
 *   - hasPermission: Function to check if user has a specific permission
 *   - canEditUsers: Boolean indicating if user can edit users
 *   - canViewReports: Boolean indicating if user can view reports
 *   - canManageDevices: Boolean indicating if user can manage devices
 * 
 * @example
 * const { hasPermission, canEditUsers } = usePermissions();
 * if (canEditUsers) {
 *   // Show edit UI
 * }
 */
export const usePermissions = () => {
  const { currentUser } = useAuth();

  const rolePermissions = useMemo(() => {
    return Permissions[currentUser.accessLevel]?.[currentUser.role] || {};
  }, [currentUser.accessLevel, currentUser.role]);

  const hasPermission = useMemo(() => {
    return (permission) => rolePermissions[permission] === true;
  }, [rolePermissions]);

  return {
    rolePermissions,
    hasPermission,
    canEditUsers: rolePermissions.canEditUsers === true,
    canViewReports: rolePermissions.canViewReports === true,
    canManageDevices: rolePermissions.canManageDevices === true,
  };
};