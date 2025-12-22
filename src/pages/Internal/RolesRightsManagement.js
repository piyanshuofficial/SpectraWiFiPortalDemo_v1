// src/pages/Internal/RolesRightsManagement.js

import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@context/AuthContext";
import {
  FaUsers,
  FaUserTie,
  FaBuilding,
  FaMapMarkerAlt,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaSearch,
  FaShieldAlt,
  FaUsersCog,
  FaChevronDown,
  FaChevronRight,
  FaEdit,
  FaEye,
  FaKey,
  FaCog,
  FaClipboardList,
  FaDatabase,
  FaFileAlt,
  FaChartBar,
  FaWrench,
  FaLock,
  FaSitemap,
  FaUserShield,
  FaBriefcase,
  FaHandshake,
  FaPlayCircle
} from "react-icons/fa";
import {
  UserTypes,
  AccessLevels,
  Roles,
  InternalRoles,
  Permissions,
  InternalPermissions
} from "@utils/accessLevels";
import PageLoadingSkeleton from "@components/Loading/PageLoadingSkeleton";
import "./RolesRightsManagement.css";

// ============================================
// PERMISSION CATEGORIES & DESCRIPTIONS
// ============================================
const PERMISSION_CATEGORIES = {
  user_management: {
    label: "User Management",
    icon: FaUsers,
    permissions: ["canEditUsers", "canManageRoles", "canManageInternalUsers"]
  },
  data_access: {
    label: "Data & Reports",
    icon: FaFileAlt,
    permissions: ["canViewReports", "canViewAnalytics", "canExportData", "canViewLogs"]
  },
  device_policy: {
    label: "Devices & Policies",
    icon: FaCog,
    permissions: ["canManageDevices", "canManagePolicies", "canManageSegments", "canEditDeviceMAC", "canEditDeviceCategory"]
  },
  site_access: {
    label: "Site Access",
    icon: FaBuilding,
    permissions: ["canViewMultipleSites", "canDrillDownToSite", "canEditAtSiteLevel"]
  },
  administration: {
    label: "Administration",
    icon: FaWrench,
    permissions: ["canManageBilling", "canConfigureSystem", "canAccessSystemSettings", "canManageLicenses"]
  },
  internal_ops: {
    label: "Internal Operations",
    icon: FaUserShield,
    permissions: ["canAccessInternalPortal", "canProvisionSites", "canConfigureSites", "canManageAllSites", "canViewAllCustomers", "canViewAuditLogs", "canAccessSupportTools"]
  },
  bulk_operations: {
    label: "Bulk Operations",
    icon: FaDatabase,
    permissions: ["canAccessBulkOperations", "canBulkRegisterUsers", "canBulkRegisterDevices", "canBulkActivateUsers", "canBulkSuspendUsers", "canBulkBlockUsers", "canBulkChangePolicies", "canBulkRenameDevices", "canBulkResendPasswords", "canScheduleBulkOperations"]
  },
  scheduling: {
    label: "Scheduling",
    icon: FaClipboardList,
    permissions: ["canScheduleUserActions"]
  },
  demo_mode: {
    label: "Demo Mode",
    icon: FaPlayCircle,
    permissions: ["isDemoMode", "useSampleDataOnly"]
  }
};

const PERMISSION_DESCRIPTIONS = {
  // User Management
  canEditUsers: "Create, edit, and manage user accounts",
  canManageRoles: "Assign and modify user roles within the organization",
  canManageInternalUsers: "Manage Spectra internal staff accounts",

  // Data & Reports
  canViewReports: "Access and view all reports",
  canViewAnalytics: "View analytics dashboards and metrics",
  canExportData: "Export data to CSV, PDF, or other formats",
  canViewLogs: "Access activity and audit logs",

  // Devices & Policies
  canManageDevices: "Register, edit, and remove devices",
  canManagePolicies: "Create and modify user policies",
  canManageSegments: "Manage network segments and zones",
  canEditDeviceMAC: "Modify MAC addresses of registered devices",
  canEditDeviceCategory: "Change device categories and types",

  // Site Access
  canViewMultipleSites: "View data across multiple sites",
  canDrillDownToSite: "Navigate from company view to individual sites",
  canEditAtSiteLevel: "Make changes when viewing a specific site",

  // Administration
  canManageBilling: "Access billing information and invoices",
  canConfigureSystem: "Modify system-wide configurations",
  canAccessSystemSettings: "Access system settings panel",
  canManageLicenses: "Manage software licenses and subscriptions",

  // Internal Operations
  canAccessInternalPortal: "Access the Spectra internal admin portal",
  canProvisionSites: "Create and provision new customer sites",
  canConfigureSites: "Configure site settings and parameters",
  canManageAllSites: "Full management access to all sites",
  canViewAllCustomers: "View all customer accounts",
  canViewAuditLogs: "Access detailed audit trails",
  canAccessSupportTools: "Access customer support tools",

  // Bulk Operations
  canAccessBulkOperations: "Access bulk operations feature",
  canBulkRegisterUsers: "Register multiple users at once",
  canBulkRegisterDevices: "Register multiple devices at once",
  canBulkActivateUsers: "Activate multiple users simultaneously",
  canBulkSuspendUsers: "Suspend multiple users at once",
  canBulkBlockUsers: "Block multiple users at once",
  canBulkChangePolicies: "Change policies for multiple users",
  canBulkRenameDevices: "Rename multiple devices at once",
  canBulkResendPasswords: "Resend passwords to multiple users",
  canScheduleBulkOperations: "Schedule bulk operations for later",

  // Scheduling
  canScheduleUserActions: "Schedule user actions for future execution",

  // Demo Mode
  isDemoMode: "Demo mode enabled - shows sample data only",
  useSampleDataOnly: "Always use sample data instead of live data"
};

const PERMISSION_LABELS = {
  canEditUsers: "Edit Users",
  canManageRoles: "Manage Roles",
  canManageInternalUsers: "Manage Internal Users",
  canViewReports: "View Reports",
  canViewAnalytics: "View Analytics",
  canExportData: "Export Data",
  canViewLogs: "View Logs",
  canManageDevices: "Manage Devices",
  canManagePolicies: "Manage Policies",
  canManageSegments: "Manage Segments",
  canEditDeviceMAC: "Edit Device MAC",
  canEditDeviceCategory: "Edit Device Category",
  canViewMultipleSites: "View Multiple Sites",
  canDrillDownToSite: "Drill Down to Site",
  canEditAtSiteLevel: "Edit at Site Level",
  canManageBilling: "Manage Billing",
  canConfigureSystem: "Configure System",
  canAccessSystemSettings: "System Settings",
  canManageLicenses: "Manage Licenses",
  canAccessInternalPortal: "Internal Portal Access",
  canProvisionSites: "Provision Sites",
  canConfigureSites: "Configure Sites",
  canManageAllSites: "Manage All Sites",
  canViewAllCustomers: "View All Customers",
  canViewAuditLogs: "View Audit Logs",
  canAccessSupportTools: "Support Tools",
  canAccessBulkOperations: "Bulk Operations",
  canBulkRegisterUsers: "Bulk Register Users",
  canBulkRegisterDevices: "Bulk Register Devices",
  canBulkActivateUsers: "Bulk Activate Users",
  canBulkSuspendUsers: "Bulk Suspend Users",
  canBulkBlockUsers: "Bulk Block Users",
  canBulkChangePolicies: "Bulk Change Policies",
  canBulkRenameDevices: "Bulk Rename Devices",
  canBulkResendPasswords: "Bulk Resend Passwords",
  canScheduleBulkOperations: "Schedule Bulk Operations",
  canScheduleUserActions: "Schedule User Actions",
  isDemoMode: "Demo Mode",
  useSampleDataOnly: "Sample Data Only"
};

// ============================================
// ROLE METADATA
// ============================================
const INTERNAL_ROLE_META = {
  [InternalRoles.SUPER_ADMIN]: {
    label: "Super Admin",
    description: "Full system access with all administrative capabilities. Can manage all sites, users, and system configurations.",
    color: "#7c3aed",
    icon: FaUserShield
  },
  [InternalRoles.OPERATIONS_MANAGER]: {
    label: "Operations Manager",
    description: "Oversees daily operations across sites. Can manage billing, perform bulk operations, and access support tools.",
    color: "#dc2626",
    icon: FaBriefcase
  },
  [InternalRoles.SUPPORT_ENGINEER]: {
    label: "Support Engineer",
    description: "Customer support focused role with access to troubleshooting tools and user management capabilities.",
    color: "#0891b2",
    icon: FaUserTie
  },
  [InternalRoles.DEPLOYMENT_ENGINEER]: {
    label: "Deployment Engineer",
    description: "Site deployment and configuration focused role. Can provision new sites and manage network configurations.",
    color: "#059669",
    icon: FaWrench
  },
  [InternalRoles.SALES_REPRESENTATIVE]: {
    label: "Sales Representative",
    description: "View-only access for demos and customer presentations. Can view analytics, reports, and billing information.",
    color: "#ea580c",
    icon: FaHandshake
  },
  [InternalRoles.DEMO_ACCOUNT]: {
    label: "Demo Account",
    description: "Full access with sample data only. This role always shows demo data even after going live - ideal for training and presentations.",
    color: "#8b5cf6",
    icon: FaPlayCircle
  }
};

const CUSTOMER_ROLE_META = {
  [Roles.ADMIN]: {
    label: "Admin",
    description: "Full administrative access within their access scope. Can manage users, devices, and policies.",
    color: "#dc2626",
    icon: FaUserShield
  },
  [Roles.MANAGER]: {
    label: "Manager",
    description: "Operational management access. Can manage day-to-day operations, users, and devices.",
    color: "#ea580c",
    icon: FaBriefcase
  },
  [Roles.USER]: {
    label: "User",
    description: "Standard user access. Can view reports and analytics but has limited management capabilities.",
    color: "#2563eb",
    icon: FaUsers
  },
  [Roles.VIEWER]: {
    label: "Viewer",
    description: "Read-only access. Can view reports and analytics but cannot make any changes.",
    color: "#6b7280",
    icon: FaEye
  }
};

const ACCESS_LEVEL_META = {
  [AccessLevels.COMPANY]: {
    label: "Company Level",
    description: "Access to all sites within the organization with aggregated views and drill-down capability.",
    icon: FaBuilding
  },
  [AccessLevels.SITE]: {
    label: "Site Level",
    description: "Access limited to a single site with full operational control for that location.",
    icon: FaMapMarkerAlt
  }
};

/**
 * RolesRightsManagement Component
 * Manage and view roles and permissions for internal and customer users
 */
const RolesRightsManagement = () => {
  const { hasPermission } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState("internal"); // 'internal' or 'customer'
  const [selectedAccessLevel, setSelectedAccessLevel] = useState(AccessLevels.COMPANY);
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(PERMISSION_CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get roles based on active tab
  const roles = useMemo(() => {
    if (activeTab === "internal") {
      return Object.values(InternalRoles);
    }
    return Object.values(Roles);
  }, [activeTab]);

  // Get role metadata
  const getRoleMeta = (role) => {
    if (activeTab === "internal") {
      return INTERNAL_ROLE_META[role] || { label: role, description: "", color: "#6b7280" };
    }
    return CUSTOMER_ROLE_META[role] || { label: role, description: "", color: "#6b7280" };
  };

  // Get permissions for a role
  const getPermissions = (role) => {
    if (activeTab === "internal") {
      return InternalPermissions[role] || {};
    }
    return Permissions[selectedAccessLevel]?.[role] || {};
  };

  // Get all unique permissions
  const allPermissions = useMemo(() => {
    const perms = new Set();

    if (activeTab === "internal") {
      Object.values(InternalPermissions).forEach(rolePerms => {
        Object.keys(rolePerms).forEach(p => perms.add(p));
      });
    } else {
      Object.values(Permissions).forEach(accessLevel => {
        Object.values(accessLevel).forEach(rolePerms => {
          Object.keys(rolePerms).forEach(p => perms.add(p));
        });
      });
    }

    return Array.from(perms);
  }, [activeTab]);

  // Filter permissions by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return PERMISSION_CATEGORIES;

    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.entries(PERMISSION_CATEGORIES).forEach(([key, category]) => {
      const matchingPermissions = category.permissions.filter(perm => {
        const label = PERMISSION_LABELS[perm]?.toLowerCase() || "";
        const desc = PERMISSION_DESCRIPTIONS[perm]?.toLowerCase() || "";
        return label.includes(query) || desc.includes(query) || perm.toLowerCase().includes(query);
      });

      if (matchingPermissions.length > 0) {
        filtered[key] = { ...category, permissions: matchingPermissions };
      }
    });

    return filtered;
  }, [searchQuery]);

  // Toggle category expansion
  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Handle permission click for details
  const handlePermissionClick = (permission) => {
    setSelectedPermission(permission);
    setShowPermissionModal(true);
  };

  // Get permission status across all roles
  const getPermissionRoleStatus = (permission) => {
    const status = {};
    roles.forEach(role => {
      const perms = getPermissions(role);
      status[role] = perms[permission] === true;
    });
    return status;
  };

  if (isLoading) {
    return <PageLoadingSkeleton title="Roles & Rights Management" />;
  }

  return (
    <div className="roles-rights-page">
      {/* Page Header */}
      <div className="rr-header">
        <div className="rr-header-content">
          <div className="rr-header-icon">
            <FaShieldAlt />
          </div>
          <div className="rr-header-text">
            <h1>Roles & Rights Management</h1>
            <p>Configure and manage access permissions for internal and customer users</p>
          </div>
        </div>
      </div>

      {/* User Type Tabs */}
      <div className="rr-tabs">
        <button
          className={`rr-tab ${activeTab === 'internal' ? 'active' : ''}`}
          onClick={() => setActiveTab('internal')}
        >
          <FaUsersCog />
          <span>Internal Users</span>
          <span className="tab-badge">{Object.keys(InternalRoles).length} Roles</span>
        </button>
        <button
          className={`rr-tab ${activeTab === 'customer' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer')}
        >
          <FaUsers />
          <span>Customer Users</span>
          <span className="tab-badge">{Object.keys(Roles).length} Roles</span>
        </button>
      </div>

      {/* Access Level Selector (for Customer only) */}
      {activeTab === "customer" && (
        <div className="rr-access-level-selector">
          <span className="selector-label">Access Level:</span>
          <div className="access-level-options">
            {Object.entries(ACCESS_LEVEL_META).map(([level, meta]) => (
              <button
                key={level}
                className={`access-level-btn ${selectedAccessLevel === level ? 'active' : ''}`}
                onClick={() => setSelectedAccessLevel(level)}
              >
                <meta.icon />
                <span>{meta.label}</span>
              </button>
            ))}
          </div>
          <div className="access-level-info">
            <FaInfoCircle />
            <span>{ACCESS_LEVEL_META[selectedAccessLevel].description}</span>
          </div>
        </div>
      )}

      {/* Role Cards */}
      <div className="rr-roles-section">
        <h2>
          {activeTab === "internal" ? "Internal Roles" : "Customer Roles"}
          {activeTab === "customer" && ` - ${ACCESS_LEVEL_META[selectedAccessLevel].label}`}
        </h2>
        <div className="rr-role-cards">
          {roles.map(role => {
            const meta = getRoleMeta(role);
            const permissions = getPermissions(role);
            const enabledCount = Object.values(permissions).filter(v => v === true).length;
            const totalCount = Object.keys(permissions).length;

            return (
              <div key={role} className="rr-role-card" style={{ borderTopColor: meta.color }}>
                <div className="role-card-header">
                  <div className="role-icon" style={{ background: meta.color }}>
                    {meta.icon && <meta.icon />}
                  </div>
                  <div className="role-info">
                    <h3>{meta.label}</h3>
                    <p>{meta.description}</p>
                  </div>
                </div>
                <div className="role-card-stats">
                  <div className="stat">
                    <span className="stat-value">{enabledCount}</span>
                    <span className="stat-label">Permissions</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{Math.round((enabledCount / totalCount) * 100)}%</span>
                    <span className="stat-label">Access Level</span>
                  </div>
                </div>
                <div className="role-card-bar">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(enabledCount / totalCount) * 100}%`,
                      background: meta.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="rr-search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search permissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery("")}>
            <FaTimes />
          </button>
        )}
      </div>

      {/* Permissions Matrix */}
      <div className="rr-permissions-matrix">
        <div className="matrix-header">
          <div className="matrix-corner">
            <span>Permissions</span>
          </div>
          <div className="matrix-roles">
            {roles.map(role => {
              const meta = getRoleMeta(role);
              return (
                <div key={role} className="matrix-role-header" style={{ borderBottomColor: meta.color }}>
                  <span>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="matrix-body">
          {Object.entries(filteredCategories).map(([categoryKey, category]) => {
            // Filter out permissions that don't exist in current context
            const relevantPermissions = category.permissions.filter(p =>
              allPermissions.includes(p)
            );

            if (relevantPermissions.length === 0) return null;

            return (
              <div key={categoryKey} className="matrix-category">
                <button
                  className="category-header"
                  onClick={() => toggleCategory(categoryKey)}
                >
                  <div className="category-title">
                    <category.icon />
                    <span>{category.label}</span>
                    <span className="category-count">{relevantPermissions.length}</span>
                  </div>
                  {expandedCategories[categoryKey] ? <FaChevronDown /> : <FaChevronRight />}
                </button>

                {expandedCategories[categoryKey] && (
                  <div className="category-permissions">
                    {relevantPermissions.map(permission => {
                      const roleStatus = getPermissionRoleStatus(permission);

                      return (
                        <div key={permission} className="permission-row">
                          <button
                            className="permission-name"
                            onClick={() => handlePermissionClick(permission)}
                          >
                            <span>{PERMISSION_LABELS[permission] || permission}</span>
                            <FaInfoCircle className="info-icon" />
                          </button>
                          <div className="permission-cells">
                            {roles.map(role => (
                              <div
                                key={role}
                                className={`permission-cell ${roleStatus[role] ? 'enabled' : 'disabled'}`}
                              >
                                {roleStatus[role] ? (
                                  <FaCheck className="check-icon" />
                                ) : (
                                  <FaTimes className="times-icon" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="rr-legend">
        <div className="legend-item">
          <span className="legend-icon enabled"><FaCheck /></span>
          <span>Permission Granted</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon disabled"><FaTimes /></span>
          <span>Permission Denied</span>
        </div>
        {activeTab === "customer" && (
          <div className="legend-note">
            <FaInfoCircle />
            <span>
              At Company level, edit permissions (users, devices, policies) only apply when drilled down to a specific site.
              The aggregated company view is read-only for all roles.
            </span>
          </div>
        )}
      </div>

      {/* Permission Detail Modal */}
      {showPermissionModal && selectedPermission && createPortal(
        <div className="rr-modal-overlay" onClick={() => setShowPermissionModal(false)}>
          <div className="rr-modal" onClick={e => e.stopPropagation()}>
            <div className="rr-modal-header">
              <h2><FaKey /> Permission Details</h2>
              <button className="modal-close" onClick={() => setShowPermissionModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="rr-modal-body">
              <div className="permission-detail">
                <h3>{PERMISSION_LABELS[selectedPermission] || selectedPermission}</h3>
                <p className="permission-key">
                  <code>{selectedPermission}</code>
                </p>
                <p className="permission-description">
                  {PERMISSION_DESCRIPTIONS[selectedPermission] || "No description available"}
                </p>
              </div>

              <div className="permission-role-access">
                <h4>Role Access</h4>
                <div className="role-access-list">
                  {roles.map(role => {
                    const meta = getRoleMeta(role);
                    const hasAccess = getPermissions(role)[selectedPermission] === true;

                    return (
                      <div
                        key={role}
                        className={`role-access-item ${hasAccess ? 'granted' : 'denied'}`}
                      >
                        <div className="role-access-info">
                          <span
                            className="role-dot"
                            style={{ background: meta.color }}
                          />
                          <span>{meta.label}</span>
                        </div>
                        <span className={`access-status ${hasAccess ? 'granted' : 'denied'}`}>
                          {hasAccess ? (
                            <><FaCheck /> Granted</>
                          ) : (
                            <><FaTimes /> Denied</>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="rr-modal-footer">
              <button className="btn-secondary" onClick={() => setShowPermissionModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default RolesRightsManagement;
