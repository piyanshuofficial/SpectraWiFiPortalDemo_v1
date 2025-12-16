// src/components/RoleAccessSelector.js

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { AccessLevels, Roles, InternalRoles, UserTypes, DemoCredentials } from '@utils/accessLevels';
import SegmentSelector from './SegmentSelector';
import './RoleAccessSelector.css';

/**
 * Quick navigation shortcuts - using text labels
 */
const pageShortcuts = {
  customer: [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/users', label: 'Users' },
    { path: '/devices', label: 'Devices' },
    { path: '/reports', label: 'Reports' },
    { path: '/knowledge', label: 'Knowledge' },
    { path: '/logs', label: 'Logs' },
  ],
  internal: [
    { path: '/internal/dashboard', label: 'Internal Dashboard' },
    { path: '/internal/sites', label: 'Site Management' },
    { path: '/dashboard', label: 'Customer View' },
  ],
};

/**
 * RoleAccessSelector Component
 *
 * Testing component for switching between different roles, access levels, and demo users.
 * Features:
 * - Quick login with demo credentials (with copy functionality)
 * - Role and access level switching
 * - Page navigation shortcuts (text labels)
 * - Segment selector for testing different segments
 * - Expand/collapse functionality
 */
const RoleAccessSelector = ({ showLabel = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    isAuthenticated,
    updateRole,
    updateAccessLevel,
    loginWithDemoCredential,
    logout,
    isInternalUser,
    isCustomerUser,
  } = useAuth();

  // State for visibility (collapsed/expanded)
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('roleAccessSelectorExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // State for expanded sections (dropdowns)
  const [expandedSection, setExpandedSection] = useState(null);

  // State for copied indicator
  const [copiedId, setCopiedId] = useState(null);

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

  const toggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    localStorage.setItem('roleAccessSelectorExpanded', JSON.stringify(newExpanded));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Handle quick login with demo credential
  const handleQuickLogin = (credentialId) => {
    const result = loginWithDemoCredential(credentialId);
    if (result.success) {
      // Navigate based on user type
      if (result.user.userType === UserTypes.INTERNAL) {
        navigate('/internal/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
    setExpandedSection(null);
  };

  // Handle copy credentials
  const handleCopyCredentials = (e, cred) => {
    e.stopPropagation();
    const text = `Username: ${cred.username}\nPassword: ${cred.password}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(cred.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get current shortcuts based on user type
  const currentShortcuts = isInternalUser ? pageShortcuts.internal : pageShortcuts.customer;

  // Helper to format display names
  const formatDisplayName = (value) => {
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    if (
      e.target.tagName === 'SELECT' ||
      e.target.tagName === 'OPTION' ||
      e.target.tagName === 'LABEL' ||
      e.target.tagName === 'BUTTON' ||
      e.target.closest('.dropdown-section') ||
      e.target.closest('.shortcuts-row') ||
      e.target.closest('.expand-toggle')
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

      const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 0);

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
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

  // Close expanded section when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setExpandedSection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`role-access-selector-container ${isDragging ? 'dragging' : ''} ${
        isInternalUser ? 'internal-mode' : ''
      } ${!isExpanded ? 'collapsed' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header with testing indicator and expand/collapse */}
      <div className="toolbar-header">
        <div className="testing-badge" aria-label="Testing mode active">
          DEV {isInternalUser ? '(INTERNAL)' : '(CUSTOMER)'}
        </div>
        <button
          className="expand-toggle"
          onClick={toggleExpanded}
          aria-label={isExpanded ? 'Collapse toolbar' : 'Expand toolbar'}
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '\u25B2' : '\u25BC'}
        </button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <>
          {/* User info */}
          {isAuthenticated && currentUser && (
            <div className="current-user-info">
              <span className="user-name">{currentUser.displayName}</span>
              <span className="user-role">{formatDisplayName(currentUser.role)}</span>
            </div>
          )}

          <div className="selectors-divider" aria-hidden="true"></div>

          {/* Quick Login Section */}
          <div className="dropdown-section">
            <button
              className={`section-toggle ${expandedSection === 'credentials' ? 'active' : ''}`}
              onClick={() => toggleSection('credentials')}
            >
              Quick Login
              <span className="toggle-arrow">{expandedSection === 'credentials' ? '\u25B2' : '\u25BC'}</span>
            </button>
            {expandedSection === 'credentials' && (
              <div className="dropdown-content credentials-dropdown">
                <div className="credentials-group">
                  <h4>Internal Users</h4>
                  {DemoCredentials.internal.map((cred) => (
                    <div
                      key={cred.id}
                      className={`credential-item ${currentUser?.id === cred.id ? 'active' : ''}`}
                    >
                      <button
                        className="credential-btn"
                        onClick={() => handleQuickLogin(cred.id)}
                      >
                        <span className="cred-label">{cred.label}</span>
                        <span className="cred-email">{cred.username}</span>
                      </button>
                      <button
                        className="copy-btn"
                        onClick={(e) => handleCopyCredentials(e, cred)}
                        title="Copy credentials"
                      >
                        {copiedId === cred.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="credentials-group">
                  <h4>Customer Users</h4>
                  {DemoCredentials.customer.map((cred) => (
                    <div
                      key={cred.id}
                      className={`credential-item ${currentUser?.id === cred.id ? 'active' : ''}`}
                    >
                      <button
                        className="credential-btn"
                        onClick={() => handleQuickLogin(cred.id)}
                      >
                        <span className="cred-label">{cred.label}</span>
                        <span className="cred-email">{cred.username}</span>
                      </button>
                      <button
                        className="copy-btn"
                        onClick={(e) => handleCopyCredentials(e, cred)}
                        title="Copy credentials"
                      >
                        {copiedId === cred.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
                {isAuthenticated && (
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="selectors-divider" aria-hidden="true"></div>

          {/* Page Shortcuts - Text Labels */}
          <div className="dropdown-section">
            <button
              className={`section-toggle ${expandedSection === 'pages' ? 'active' : ''}`}
              onClick={() => toggleSection('pages')}
            >
              Pages
              <span className="toggle-arrow">{expandedSection === 'pages' ? '\u25B2' : '\u25BC'}</span>
            </button>
            {expandedSection === 'pages' && (
              <div className="dropdown-content pages-dropdown">
                {currentShortcuts.map((shortcut) => (
                  <button
                    key={shortcut.path}
                    className={`page-link-btn ${location.pathname === shortcut.path ? 'active' : ''}`}
                    onClick={() => {
                      navigate(shortcut.path);
                      setExpandedSection(null);
                    }}
                  >
                    {shortcut.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="selectors-divider" aria-hidden="true"></div>

          {/* Customer-only controls */}
          {isCustomerUser && (
            <>
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
                  value={currentUser?.role || Roles.ADMIN}
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
                  value={currentUser?.accessLevel || AccessLevels.SITE}
                  onChange={handleAccessLevelChange}
                  className="access-level-test-dropdown"
                  aria-label="Select access level for testing"
                >
                  <option value={AccessLevels.SITE}>Site</option>
                  <option value={AccessLevels.COMPANY}>Company</option>
                </select>
              </div>
            </>
          )}

          {/* Internal-only controls */}
          {isInternalUser && (
            <div className="internal-role-selector">
              {showLabel && (
                <label htmlFor="internal-role-select" className="selector-label">
                  Internal Role:
                </label>
              )}
              <select
                id="internal-role-select"
                value={currentUser?.role || InternalRoles.SUPER_ADMIN}
                onChange={handleRoleChange}
                className="role-test-dropdown"
                aria-label="Select internal role for testing"
              >
                {Object.values(InternalRoles).map((role) => (
                  <option key={role} value={role}>
                    {formatDisplayName(role)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
};

RoleAccessSelector.propTypes = {
  showLabel: PropTypes.bool,
};

export default RoleAccessSelector;
