// src/components/RoleAccessSelector.js

import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@context/AuthContext';
import { AccessLevels, Roles } from '@utils/accessLevels';
import './RoleAccessSelector.css';

/**
 * RoleAccessSelector Component
 *
 * Temporary testing component for switching between different roles and access levels.
 * This component will be removed in production as each login will have specific
 * segment, role, and access level values.
 *
 * Default: ADMIN role + GROUP access level (maximum rights)
 */
const RoleAccessSelector = ({ showLabel = true }) => {
  const { currentUser, updateRole, updateAccessLevel } = useAuth();

  const handleRoleChange = (e) => {
    updateRole(e.target.value);
  };

  const handleAccessLevelChange = (e) => {
    updateAccessLevel(e.target.value);
  };

  // Helper to format display names
  const formatDisplayName = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="role-access-selector-container">
      {/* Testing indicator */}
      <div className="testing-badge" aria-label="Testing mode active">
        🧪 TEST
      </div>

      {/* Role Selector */}
      <div className="role-selector-test">
        {showLabel && (
          <label htmlFor="role-test-select" className="selector-label">
            Role:
          </label>
        )}
        <select
          id="role-test-select"
          value={currentUser.role}
          onChange={handleRoleChange}
          className="role-test-dropdown"
          aria-label="Select user role for testing"
        >
          {Object.values(Roles).map((role) => (
            <option key={role} value={role}>
              {formatDisplayName(role)}
            </option>
          ))}
        </select>
      </div>

      {/* Access Level Selector */}
      <div className="access-level-selector-test">
        {showLabel && (
          <label htmlFor="access-level-test-select" className="selector-label">
            Access:
          </label>
        )}
        <select
          id="access-level-test-select"
          value={currentUser.accessLevel}
          onChange={handleAccessLevelChange}
          className="access-level-test-dropdown"
          aria-label="Select access level for testing"
        >
          {/* Display in hierarchical order (highest to lowest) */}
          <option value={AccessLevels.GROUP}>Group (Highest)</option>
          <option value={AccessLevels.COMPANY}>Company</option>
          <option value={AccessLevels.CITY}>City</option>
          <option value={AccessLevels.CLUSTER}>Cluster</option>
          <option value={AccessLevels.SITE}>Site (Lowest)</option>
        </select>
      </div>
    </div>
  );
};

RoleAccessSelector.propTypes = {
  showLabel: PropTypes.bool,
};

export default RoleAccessSelector;
