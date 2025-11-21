// src/components/RoleAccessSelector.js

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@context/AuthContext';
import { AccessLevels, Roles } from '@utils/accessLevels';
import SegmentSelector from './SegmentSelector';
import './RoleAccessSelector.css';

/**
 * RoleAccessSelector Component
 *
 * Temporary testing component for switching between different roles, access levels, and segments.
 * This component will be removed in production as each login will have specific
 * segment, role, and access level values.
 *
 * Default: ADMIN role + SITE access level + All segments
 */
const RoleAccessSelector = ({ showLabel = true }) => {
  const { currentUser, updateRole, updateAccessLevel } = useAuth();

  // State for dragging
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('roleAccessSelectorPosition');
    return saved ? JSON.parse(saved) : { x: 110, y: 70 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

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

  // Drag handlers
  const handleMouseDown = (e) => {
    // Only start drag if clicking on the container background or testing badge
    if (
      e.target.tagName === 'SELECT' ||
      e.target.tagName === 'OPTION' ||
      e.target.tagName === 'LABEL'
    ) {
      return;
    }

    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain to viewport
      const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 0);

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Save position to localStorage
        localStorage.setItem('roleAccessSelectorPosition', JSON.stringify(position));
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position]);

  return (
    <div
      ref={containerRef}
      className={`role-access-selector-container ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Testing indicator */}
      <div className="testing-badge" aria-label="Testing mode active">
        🧪 TEST
      </div>

      {/* Segment Selector */}
      <SegmentSelector showLabel={showLabel} />

      <div className="selectors-divider" aria-hidden="true"></div>

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
          {/* Display in hierarchical order (lowest to highest for easier testing) */}
          <option value={AccessLevels.SITE}>Site (Lowest)</option>
          <option value={AccessLevels.CLUSTER}>Cluster</option>
          <option value={AccessLevels.CITY}>City</option>
          <option value={AccessLevels.COMPANY}>Company</option>
          <option value={AccessLevels.GROUP}>Group (Highest)</option>
        </select>
      </div>
    </div>
  );
};

RoleAccessSelector.propTypes = {
  showLabel: PropTypes.bool,
};

export default RoleAccessSelector;
