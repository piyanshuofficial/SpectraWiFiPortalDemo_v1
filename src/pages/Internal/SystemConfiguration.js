// src/pages/Internal/SystemConfiguration.js

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import {
  FaCog,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCopy,
  FaShieldAlt,
  FaUserShield,
  FaUsers,
  FaGlobe,
  FaNetworkWired,
  FaCheckCircle,
  FaTimesCircle,
  FaPauseCircle,
  FaKey,
  FaLock,
  FaUnlock,
  FaChevronDown,
  FaChevronRight,
  FaSave,
  FaDownload,
  FaUpload,
  FaSyncAlt,
} from "react-icons/fa";
import "./SystemConfiguration.css";

// Sample Policies Data
const policiesData = [
  {
    id: "pol_001",
    name: "Enterprise Premium",
    type: "bandwidth",
    segment: "Enterprise",
    description: "Premium bandwidth policy for enterprise customers",
    status: "active",
    settings: {
      downloadSpeed: 100,
      uploadSpeed: 50,
      fairUsageLimit: "Unlimited",
      timeRestrictions: "None",
      deviceLimit: 5,
    },
    appliedTo: 45,
    createdAt: "2023-06-15",
    updatedAt: "2024-01-10",
  },
  {
    id: "pol_002",
    name: "Hotel Guest Standard",
    type: "bandwidth",
    segment: "Hotel",
    description: "Standard bandwidth for hotel guests",
    status: "active",
    settings: {
      downloadSpeed: 25,
      uploadSpeed: 10,
      fairUsageLimit: "5 GB/day",
      timeRestrictions: "None",
      deviceLimit: 3,
    },
    appliedTo: 1250,
    createdAt: "2023-03-20",
    updatedAt: "2024-01-05",
  },
  {
    id: "pol_003",
    name: "Co-Living Basic",
    type: "bandwidth",
    segment: "Co-Living",
    description: "Basic bandwidth policy for co-living spaces",
    status: "active",
    settings: {
      downloadSpeed: 15,
      uploadSpeed: 5,
      fairUsageLimit: "2 GB/day",
      timeRestrictions: "None",
      deviceLimit: 2,
    },
    appliedTo: 3200,
    createdAt: "2023-04-10",
    updatedAt: "2023-12-28",
  },
  {
    id: "pol_004",
    name: "PG Economy",
    type: "bandwidth",
    segment: "PG",
    description: "Economy bandwidth policy for PG residents",
    status: "active",
    settings: {
      downloadSpeed: 10,
      uploadSpeed: 5,
      fairUsageLimit: "1.5 GB/day",
      timeRestrictions: "Peak hours throttled",
      deviceLimit: 2,
    },
    appliedTo: 8500,
    createdAt: "2023-05-25",
    updatedAt: "2023-11-15",
  },
  {
    id: "pol_005",
    name: "Co-Working Professional",
    type: "bandwidth",
    segment: "Co-Working",
    description: "Professional tier for co-working members",
    status: "active",
    settings: {
      downloadSpeed: 50,
      uploadSpeed: 25,
      fairUsageLimit: "Unlimited",
      timeRestrictions: "None",
      deviceLimit: 4,
    },
    appliedTo: 2100,
    createdAt: "2023-07-12",
    updatedAt: "2024-01-08",
  },
  {
    id: "pol_006",
    name: "Trial Policy",
    type: "bandwidth",
    segment: "All",
    description: "Limited policy for trial customers",
    status: "inactive",
    settings: {
      downloadSpeed: 5,
      uploadSpeed: 2,
      fairUsageLimit: "500 MB/day",
      timeRestrictions: "Business hours only",
      deviceLimit: 1,
    },
    appliedTo: 0,
    createdAt: "2023-09-01",
    updatedAt: "2023-09-01",
  },
];

// Sample Domains/Sites Configuration Data
const domainsData = [
  {
    id: "dom_001",
    name: "spectra-enterprise",
    displayName: "Enterprise Portal",
    type: "customer",
    url: "enterprise.spectra.co",
    status: "active",
    sslEnabled: true,
    customBranding: true,
    features: ["Multi-site", "Analytics", "Reports", "API Access"],
    customers: 5,
    createdAt: "2023-01-10",
  },
  {
    id: "dom_002",
    name: "spectra-hotel",
    displayName: "Hotel Management",
    type: "customer",
    url: "hotels.spectra.co",
    status: "active",
    sslEnabled: true,
    customBranding: true,
    features: ["Guest Portal", "Captive Portal", "Analytics"],
    customers: 4,
    createdAt: "2023-02-15",
  },
  {
    id: "dom_003",
    name: "spectra-coliving",
    displayName: "Co-Living Portal",
    type: "customer",
    url: "coliving.spectra.co",
    status: "active",
    sslEnabled: true,
    customBranding: false,
    features: ["Resident Portal", "Usage Tracking", "Billing"],
    customers: 2,
    createdAt: "2023-03-20",
  },
  {
    id: "dom_004",
    name: "spectra-pg",
    displayName: "PG Management",
    type: "customer",
    url: "pg.spectra.co",
    status: "active",
    sslEnabled: true,
    customBranding: false,
    features: ["Basic Portal", "Usage Tracking"],
    customers: 1,
    createdAt: "2023-04-05",
  },
  {
    id: "dom_005",
    name: "spectra-internal",
    displayName: "Internal Portal",
    type: "internal",
    url: "internal.spectra.co",
    status: "active",
    sslEnabled: true,
    customBranding: false,
    features: ["Full Access", "Admin Tools", "Config Management"],
    customers: null,
    createdAt: "2023-01-01",
  },
  {
    id: "dom_006",
    name: "spectra-coworking",
    displayName: "Co-Working Portal",
    type: "customer",
    url: "coworking.spectra.co",
    status: "active",
    sslEnabled: true,
    customBranding: true,
    features: ["Member Portal", "Booking", "Analytics"],
    customers: 3,
    createdAt: "2023-05-10",
  },
  {
    id: "dom_007",
    name: "spectra-sandbox",
    displayName: "Sandbox Environment",
    type: "internal",
    url: "sandbox.spectra.co",
    status: "maintenance",
    sslEnabled: true,
    customBranding: false,
    features: ["Testing", "Development"],
    customers: null,
    createdAt: "2023-06-01",
  },
];

// Sample Roles Data
const rolesData = {
  internal: [
    {
      id: "role_int_001",
      name: "Super Admin",
      code: "SUPER_ADMIN",
      description: "Full platform access with all permissions",
      status: "active",
      userCount: 3,
      permissions: {
        customers: ["view", "create", "edit", "delete", "manage"],
        sites: ["view", "create", "edit", "delete", "provision", "configure"],
        users: ["view", "create", "edit", "delete", "manage"],
        policies: ["view", "create", "edit", "delete", "apply"],
        reports: ["view", "generate", "export"],
        config: ["view", "edit", "manage"],
        billing: ["view", "manage"],
        support: ["view", "manage", "escalate"],
      },
      isSystem: true,
    },
    {
      id: "role_int_002",
      name: "Support Engineer",
      code: "SUPPORT_ENGINEER",
      description: "Customer support and troubleshooting",
      status: "active",
      userCount: 8,
      permissions: {
        customers: ["view"],
        sites: ["view", "configure"],
        users: ["view", "edit"],
        policies: ["view", "apply"],
        reports: ["view", "generate"],
        config: ["view"],
        billing: ["view"],
        support: ["view", "manage"],
      },
      isSystem: true,
    },
    {
      id: "role_int_003",
      name: "Deployment Engineer",
      code: "DEPLOYMENT_ENGINEER",
      description: "Site provisioning and deployment",
      status: "active",
      userCount: 5,
      permissions: {
        customers: ["view"],
        sites: ["view", "create", "edit", "provision", "configure"],
        users: ["view"],
        policies: ["view", "apply"],
        reports: ["view"],
        config: ["view", "edit"],
        billing: [],
        support: ["view"],
      },
      isSystem: true,
    },
    {
      id: "role_int_004",
      name: "Analyst",
      code: "ANALYST",
      description: "Data analysis and reporting",
      status: "active",
      userCount: 4,
      permissions: {
        customers: ["view"],
        sites: ["view"],
        users: ["view"],
        policies: ["view"],
        reports: ["view", "generate", "export"],
        config: [],
        billing: ["view"],
        support: ["view"],
      },
      isSystem: false,
    },
  ],
  customer: [
    {
      id: "role_cust_001",
      name: "Site Admin",
      code: "ADMIN",
      description: "Full site administration access",
      status: "active",
      userCount: 125,
      permissions: {
        users: ["view", "create", "edit", "delete"],
        devices: ["view", "create", "edit", "delete"],
        policies: ["view", "apply"],
        reports: ["view", "generate", "export"],
        settings: ["view", "edit"],
        support: ["view", "create"],
      },
      isSystem: true,
    },
    {
      id: "role_cust_002",
      name: "Manager",
      code: "MANAGER",
      description: "Team and user management",
      status: "active",
      userCount: 340,
      permissions: {
        users: ["view", "create", "edit"],
        devices: ["view", "create", "edit"],
        policies: ["view"],
        reports: ["view", "generate"],
        settings: ["view"],
        support: ["view", "create"],
      },
      isSystem: true,
    },
    {
      id: "role_cust_003",
      name: "Network Admin",
      code: "NETWORK_ADMIN",
      description: "Network and device management",
      status: "active",
      userCount: 180,
      permissions: {
        users: ["view"],
        devices: ["view", "create", "edit", "delete"],
        policies: ["view", "apply"],
        reports: ["view"],
        settings: ["view"],
        support: ["view", "create"],
      },
      isSystem: true,
    },
    {
      id: "role_cust_004",
      name: "User",
      code: "USER",
      description: "Basic user access",
      status: "active",
      userCount: 45000,
      permissions: {
        users: [],
        devices: ["view"],
        policies: [],
        reports: [],
        settings: [],
        support: ["view", "create"],
      },
      isSystem: true,
    },
    {
      id: "role_cust_005",
      name: "Viewer",
      code: "VIEWER",
      description: "Read-only access",
      status: "active",
      userCount: 12500,
      permissions: {
        users: ["view"],
        devices: ["view"],
        policies: [],
        reports: ["view"],
        settings: [],
        support: ["view"],
      },
      isSystem: true,
    },
  ],
};

/**
 * System Configuration Component
 * Manage policies, domains, and roles
 */
const SystemConfiguration = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  // State for active section
  const [activeSection, setActiveSection] = useState("policies");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [expandedRole, setExpandedRole] = useState(null);

  // Policies state
  const filteredPolicies = useMemo(() => {
    return policiesData.filter((policy) => {
      const matchesSearch =
        policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "All" || policy.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  // Domains state
  const filteredDomains = useMemo(() => {
    return domainsData.filter((domain) => {
      const matchesSearch =
        domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "All" || domain.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FaCheckCircle className="status-icon active" />;
      case "inactive":
        return <FaPauseCircle className="status-icon inactive" />;
      case "maintenance":
        return <FaCog className="status-icon maintenance" />;
      default:
        return null;
    }
  };

  // Render Policies Section
  const renderPoliciesSection = () => (
    <div className="config-section policies-section">
      <div className="section-header">
        <div className="section-title">
          <FaShieldAlt />
          <h2>User Policies</h2>
          <span className="count">{filteredPolicies.length} policies</span>
        </div>
        <div className="section-actions">
          <button className="btn btn-outline">
            <FaDownload /> Export
          </button>
          <button className="btn btn-primary">
            <FaPlus /> New Policy
          </button>
        </div>
      </div>

      <div className="policies-grid">
        {filteredPolicies.map((policy) => (
          <div key={policy.id} className="policy-card">
            <div className="policy-header">
              <div className="policy-info">
                <h3>{policy.name}</h3>
                <span className={`status-badge ${policy.status}`}>
                  {getStatusIcon(policy.status)} {policy.status}
                </span>
              </div>
              <div className="policy-actions">
                <button className="btn-icon" title="Edit">
                  <FaEdit />
                </button>
                <button className="btn-icon" title="Duplicate">
                  <FaCopy />
                </button>
                <button className="btn-icon danger" title="Delete">
                  <FaTrash />
                </button>
              </div>
            </div>

            <p className="policy-description">{policy.description}</p>

            <div className="policy-tags">
              <span className="tag segment">{policy.segment}</span>
              <span className="tag type">{policy.type}</span>
            </div>

            <div className="policy-settings">
              <div className="setting-row">
                <span className="setting-label">Download Speed</span>
                <span className="setting-value">{policy.settings.downloadSpeed} Mbps</span>
              </div>
              <div className="setting-row">
                <span className="setting-label">Upload Speed</span>
                <span className="setting-value">{policy.settings.uploadSpeed} Mbps</span>
              </div>
              <div className="setting-row">
                <span className="setting-label">Fair Usage</span>
                <span className="setting-value">{policy.settings.fairUsageLimit}</span>
              </div>
              <div className="setting-row">
                <span className="setting-label">Device Limit</span>
                <span className="setting-value">{policy.settings.deviceLimit} devices</span>
              </div>
            </div>

            <div className="policy-footer">
              <span className="applied-count">
                <FaUsers /> Applied to {policy.appliedTo.toLocaleString()} users
              </span>
              <span className="updated-date">
                Updated: {new Date(policy.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Domains Section
  const renderDomainsSection = () => (
    <div className="config-section domains-section">
      <div className="section-header">
        <div className="section-title">
          <FaGlobe />
          <h2>Domains / Sites</h2>
          <span className="count">{filteredDomains.length} domains</span>
        </div>
        <div className="section-actions">
          <button className="btn btn-outline">
            <FaSyncAlt /> Sync DNS
          </button>
          <button className="btn btn-primary">
            <FaPlus /> New Domain
          </button>
        </div>
      </div>

      <div className="domains-table">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Domain Name</th>
              <th>Display Name</th>
              <th>Type</th>
              <th>URL</th>
              <th>SSL</th>
              <th>Features</th>
              <th>Customers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDomains.map((domain) => (
              <tr key={domain.id}>
                <td>{getStatusIcon(domain.status)}</td>
                <td className="domain-name">{domain.name}</td>
                <td>{domain.displayName}</td>
                <td>
                  <span className={`type-badge ${domain.type}`}>
                    {domain.type}
                  </span>
                </td>
                <td>
                  <a href={`https://${domain.url}`} target="_blank" rel="noopener noreferrer" className="url-link">
                    {domain.url}
                  </a>
                </td>
                <td>
                  {domain.sslEnabled ? (
                    <FaLock className="ssl-icon enabled" title="SSL Enabled" />
                  ) : (
                    <FaUnlock className="ssl-icon disabled" title="SSL Disabled" />
                  )}
                </td>
                <td>
                  <div className="features-list">
                    {domain.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="feature-tag">{feature}</span>
                    ))}
                    {domain.features.length > 2 && (
                      <span className="feature-more">+{domain.features.length - 2}</span>
                    )}
                  </div>
                </td>
                <td>{domain.customers !== null ? domain.customers : "-"}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn-icon" title="View">
                      <FaEye />
                    </button>
                    <button className="btn-icon" title="Edit">
                      <FaEdit />
                    </button>
                    <button className="btn-icon" title="Configure">
                      <FaCog />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Roles Section
  const renderRolesSection = () => (
    <div className="config-section roles-section">
      <div className="section-header">
        <div className="section-title">
          <FaUserShield />
          <h2>Roles & Permissions</h2>
        </div>
        <div className="section-actions">
          <button className="btn btn-outline">
            <FaDownload /> Export
          </button>
          <button className="btn btn-primary">
            <FaPlus /> New Role
          </button>
        </div>
      </div>

      {/* Internal Roles */}
      <div className="roles-group">
        <h3 className="roles-group-title">
          <FaUserShield /> Internal Staff Roles
        </h3>
        <div className="roles-list">
          {rolesData.internal.map((role) => (
            <div key={role.id} className="role-card">
              <div
                className="role-header"
                onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
              >
                <div className="role-info">
                  <h4>{role.name}</h4>
                  <span className="role-code">{role.code}</span>
                </div>
                <div className="role-meta">
                  <span className="user-count">
                    <FaUsers /> {role.userCount} users
                  </span>
                  {role.isSystem && <span className="system-badge">System</span>}
                  {expandedRole === role.id ? <FaChevronDown /> : <FaChevronRight />}
                </div>
              </div>

              <p className="role-description">{role.description}</p>

              {expandedRole === role.id && (
                <div className="role-permissions">
                  <h5>Permissions</h5>
                  <div className="permissions-grid">
                    {Object.entries(role.permissions).map(([module, perms]) => (
                      <div key={module} className="permission-item">
                        <span className="permission-module">{module}</span>
                        <div className="permission-actions">
                          {perms.length > 0 ? (
                            perms.map((perm) => (
                              <span key={perm} className="perm-tag">{perm}</span>
                            ))
                          ) : (
                            <span className="perm-none">No access</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="role-actions">
                    <button className="btn btn-sm btn-outline">
                      <FaEdit /> Edit Permissions
                    </button>
                    {!role.isSystem && (
                      <button className="btn btn-sm btn-outline danger">
                        <FaTrash /> Delete Role
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Customer Roles */}
      <div className="roles-group">
        <h3 className="roles-group-title">
          <FaUsers /> Customer Roles
        </h3>
        <div className="roles-list">
          {rolesData.customer.map((role) => (
            <div key={role.id} className="role-card">
              <div
                className="role-header"
                onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
              >
                <div className="role-info">
                  <h4>{role.name}</h4>
                  <span className="role-code">{role.code}</span>
                </div>
                <div className="role-meta">
                  <span className="user-count">
                    <FaUsers /> {role.userCount.toLocaleString()} users
                  </span>
                  {role.isSystem && <span className="system-badge">System</span>}
                  {expandedRole === role.id ? <FaChevronDown /> : <FaChevronRight />}
                </div>
              </div>

              <p className="role-description">{role.description}</p>

              {expandedRole === role.id && (
                <div className="role-permissions">
                  <h5>Permissions</h5>
                  <div className="permissions-grid">
                    {Object.entries(role.permissions).map(([module, perms]) => (
                      <div key={module} className="permission-item">
                        <span className="permission-module">{module}</span>
                        <div className="permission-actions">
                          {perms.length > 0 ? (
                            perms.map((perm) => (
                              <span key={perm} className="perm-tag">{perm}</span>
                            ))
                          ) : (
                            <span className="perm-none">No access</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="role-actions">
                    <button className="btn btn-sm btn-outline">
                      <FaEdit /> Edit Permissions
                    </button>
                    {!role.isSystem && (
                      <button className="btn btn-sm btn-outline danger">
                        <FaTrash /> Delete Role
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="system-configuration">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>
            <FaCog /> System Configuration
          </h1>
          <p>Manage policies, domains, and access controls</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <FaUpload /> Import Config
          </button>
          <button className="btn btn-outline">
            <FaDownload /> Export All
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="section-tabs">
        <button
          className={`tab-btn ${activeSection === "policies" ? "active" : ""}`}
          onClick={() => { setActiveSection("policies"); setSearchQuery(""); setSelectedStatus("All"); }}
        >
          <FaShieldAlt /> User Policies
        </button>
        <button
          className={`tab-btn ${activeSection === "domains" ? "active" : ""}`}
          onClick={() => { setActiveSection("domains"); setSearchQuery(""); setSelectedStatus("All"); }}
        >
          <FaGlobe /> Domains / Sites
        </button>
        <button
          className={`tab-btn ${activeSection === "roles" ? "active" : ""}`}
          onClick={() => { setActiveSection("roles"); setSearchQuery(""); setSelectedStatus("All"); }}
        >
          <FaUserShield /> Roles & Permissions
        </button>
      </div>

      {/* Search and Filters */}
      {activeSection !== "roles" && (
        <div className="filters-bar">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${activeSection}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      )}

      {/* Section Content */}
      {activeSection === "policies" && renderPoliciesSection()}
      {activeSection === "domains" && renderDomainsSection()}
      {activeSection === "roles" && renderRolesSection()}
    </div>
  );
};

export default SystemConfiguration;
