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
  FaCopy,
  FaShieldAlt,
  FaUserShield,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaPauseCircle,
  FaChevronDown,
  FaChevronRight,
  FaSave,
  FaDownload,
  FaUpload,
  FaBell,
  FaEnvelope,
  FaMobileAlt,
  FaSlack,
  FaLink,
  FaToggleOn,
  FaToggleOff,
  FaExclamationTriangle,
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


// Notification Settings Data
const notificationSettings = {
  alertThresholds: [
    { id: "thr_001", name: "High Bandwidth Usage", metric: "bandwidth_usage", operator: ">", value: 90, unit: "%", severity: "warning", enabled: true },
    { id: "thr_002", name: "Critical Bandwidth", metric: "bandwidth_usage", operator: ">", value: 95, unit: "%", severity: "critical", enabled: true },
    { id: "thr_003", name: "Site Offline", metric: "site_status", operator: "=", value: "offline", unit: "", severity: "critical", enabled: true },
    { id: "thr_004", name: "High User Count", metric: "concurrent_users", operator: ">", value: 500, unit: "users", severity: "warning", enabled: true },
    { id: "thr_005", name: "AP Offline", metric: "ap_status", operator: "=", value: "offline", unit: "", severity: "warning", enabled: true },
    { id: "thr_006", name: "Low Uptime", metric: "uptime", operator: "<", value: 99.5, unit: "%", severity: "warning", enabled: false },
  ],
  emailTemplates: [
    { id: "tpl_001", name: "Welcome Email", type: "user_onboarding", subject: "Welcome to Spectra WiFi", status: "active", lastModified: "2024-01-10" },
    { id: "tpl_002", name: "Password Reset", type: "security", subject: "Reset Your Password", status: "active", lastModified: "2024-01-08" },
    { id: "tpl_003", name: "Alert Notification", type: "alert", subject: "Alert: {{alert_name}}", status: "active", lastModified: "2024-01-05" },
    { id: "tpl_004", name: "Usage Report", type: "report", subject: "Your Weekly Usage Report", status: "active", lastModified: "2023-12-20" },
    { id: "tpl_005", name: "Account Suspended", type: "security", subject: "Account Suspended", status: "inactive", lastModified: "2023-11-15" },
  ],
  channels: {
    email: { enabled: true, smtpServer: "smtp.spectra.co", from: "noreply@spectra.co" },
    sms: { enabled: true, provider: "Twilio", senderId: "SPECTRA" },
    webhook: { enabled: true, endpoints: 3 },
    slack: { enabled: false, workspace: null },
  },
};

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

  // Policy modal state
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [policyFormData, setPolicyFormData] = useState({
    name: "",
    type: "bandwidth",
    segment: "Enterprise",
    description: "",
    status: "active",
    settings: {
      downloadSpeed: 50,
      uploadSpeed: 25,
      fairUsageLimit: "Unlimited",
      timeRestrictions: "None",
      deviceLimit: 3,
    },
  });

  // Policy action handlers
  const handleEditPolicy = (policy) => {
    setEditingPolicy(policy);
    setPolicyFormData({
      name: policy.name,
      type: policy.type,
      segment: policy.segment,
      description: policy.description,
      status: policy.status,
      settings: { ...policy.settings },
    });
    setShowPolicyModal(true);
  };

  const handleDuplicatePolicy = (policy) => {
    setEditingPolicy(null);
    setPolicyFormData({
      name: `${policy.name} (Copy)`,
      type: policy.type,
      segment: policy.segment,
      description: policy.description,
      status: "draft",
      settings: { ...policy.settings },
    });
    setShowPolicyModal(true);
  };

  const handleDeletePolicy = (policy) => {
    if (window.confirm(`Are you sure you want to delete "${policy.name}"? This action cannot be undone.`)) {
      // In production, this would call an API
      console.log("Deleting policy:", policy.id);
      alert(`Policy "${policy.name}" has been deleted.`);
    }
  };

  const handleSavePolicy = () => {
    if (!policyFormData.name.trim()) {
      alert("Please enter a policy name");
      return;
    }
    // In production, this would call an API
    console.log(editingPolicy ? "Updating policy:" : "Creating policy:", policyFormData);
    alert(`Policy "${policyFormData.name}" has been ${editingPolicy ? "updated" : "created"}.`);
    setShowPolicyModal(false);
    setEditingPolicy(null);
  };

  const handleCreateNewPolicy = () => {
    setEditingPolicy(null);
    setPolicyFormData({
      name: "",
      type: "bandwidth",
      segment: "Enterprise",
      description: "",
      status: "draft",
      settings: {
        downloadSpeed: 50,
        uploadSpeed: 25,
        fairUsageLimit: "Unlimited",
        timeRestrictions: "None",
        deviceLimit: 3,
      },
    });
    setShowPolicyModal(true);
  };

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

  // Filtered alert thresholds
  const filteredThresholds = useMemo(() => {
    return notificationSettings.alertThresholds.filter((threshold) => {
      const matchesSearch = threshold.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

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
          <button className="btn btn-primary" onClick={handleCreateNewPolicy}>
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
                <button className="btn-icon" title="Edit" onClick={() => handleEditPolicy(policy)}>
                  <FaEdit />
                </button>
                <button className="btn-icon" title="Duplicate" onClick={() => handleDuplicatePolicy(policy)}>
                  <FaCopy />
                </button>
                <button className="btn-icon danger" title="Delete" onClick={() => handleDeletePolicy(policy)}>
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

  // Render Notifications Section
  const renderNotificationsSection = () => (
    <div className="config-section notifications-section">
      <div className="section-header">
        <div className="section-title">
          <FaBell />
          <h2>Notification Settings</h2>
        </div>
        <div className="section-actions">
          <button className="btn btn-primary">
            <FaPlus /> New Threshold
          </button>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="channels-overview">
        <h3>Notification Channels</h3>
        <div className="channels-grid">
          <div className={`channel-card ${notificationSettings.channels.email.enabled ? 'enabled' : 'disabled'}`}>
            <div className="channel-icon"><FaEnvelope /></div>
            <div className="channel-info">
              <h4>Email</h4>
              <p>{notificationSettings.channels.email.smtpServer}</p>
            </div>
            <div className="channel-status">
              {notificationSettings.channels.email.enabled ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
          </div>
          <div className={`channel-card ${notificationSettings.channels.sms.enabled ? 'enabled' : 'disabled'}`}>
            <div className="channel-icon"><FaMobileAlt /></div>
            <div className="channel-info">
              <h4>SMS</h4>
              <p>{notificationSettings.channels.sms.provider}</p>
            </div>
            <div className="channel-status">
              {notificationSettings.channels.sms.enabled ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
          </div>
          <div className={`channel-card ${notificationSettings.channels.webhook.enabled ? 'enabled' : 'disabled'}`}>
            <div className="channel-icon"><FaLink /></div>
            <div className="channel-info">
              <h4>Webhooks</h4>
              <p>{notificationSettings.channels.webhook.endpoints} endpoints</p>
            </div>
            <div className="channel-status">
              {notificationSettings.channels.webhook.enabled ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
          </div>
          <div className={`channel-card ${notificationSettings.channels.slack.enabled ? 'enabled' : 'disabled'}`}>
            <div className="channel-icon"><FaSlack /></div>
            <div className="channel-info">
              <h4>Slack</h4>
              <p>{notificationSettings.channels.slack.workspace || 'Not configured'}</p>
            </div>
            <div className="channel-status">
              {notificationSettings.channels.slack.enabled ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="thresholds-section">
        <h3><FaExclamationTriangle /> Alert Thresholds</h3>
        <div className="thresholds-table">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Alert Name</th>
                <th>Condition</th>
                <th>Severity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredThresholds.map((threshold) => (
                <tr key={threshold.id}>
                  <td>
                    <button className={`toggle-btn-sm ${threshold.enabled ? 'active' : ''}`}>
                      {threshold.enabled ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </td>
                  <td className="threshold-name">{threshold.name}</td>
                  <td className="threshold-condition">
                    <code>{threshold.metric} {threshold.operator} {threshold.value}{threshold.unit}</code>
                  </td>
                  <td>
                    <span className={`severity-badge ${threshold.severity}`}>
                      {threshold.severity}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn-icon" title="Edit"><FaEdit /></button>
                      <button className="btn-icon danger" title="Delete"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Templates */}
      <div className="templates-section">
        <div className="templates-header">
          <h3><FaEnvelope /> Email Templates</h3>
          <button className="btn btn-outline btn-sm">
            <FaPlus /> New Template
          </button>
        </div>
        <div className="templates-grid">
          {notificationSettings.emailTemplates.map((template) => (
            <div key={template.id} className="template-card">
              <div className="template-header">
                <h4>{template.name}</h4>
                <span className={`status-badge ${template.status}`}>
                  {template.status}
                </span>
              </div>
              <p className="template-type">{template.type}</p>
              <p className="template-subject">Subject: {template.subject}</p>
              <div className="template-footer">
                <span className="template-date">Modified: {template.lastModified}</span>
                <div className="template-actions">
                  <button className="btn-icon" title="Edit"><FaEdit /></button>
                  <button className="btn-icon" title="Duplicate"><FaCopy /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
          <p>Manage policies, notifications, and access controls</p>
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
          className={`tab-btn ${activeSection === "notifications" ? "active" : ""}`}
          onClick={() => { setActiveSection("notifications"); setSearchQuery(""); setSelectedStatus("All"); }}
        >
          <FaBell /> Notifications
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
      {activeSection === "notifications" && renderNotificationsSection()}
      {activeSection === "roles" && renderRolesSection()}

      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="policy-modal-overlay" onClick={() => setShowPolicyModal(false)}>
          <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="policy-modal-header">
              <h2>{editingPolicy ? "Edit Policy" : "Create New Policy"}</h2>
              <button className="close-btn" onClick={() => setShowPolicyModal(false)}>
                <FaTimesCircle />
              </button>
            </div>

            <div className="policy-modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Policy Name *</label>
                  <input
                    type="text"
                    value={policyFormData.name}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, name: e.target.value })}
                    placeholder="Enter policy name"
                  />
                </div>
                <div className="form-group">
                  <label>Segment</label>
                  <select
                    value={policyFormData.segment}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, segment: e.target.value })}
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Co-Living">Co-Living</option>
                    <option value="Co-Working">Co-Working</option>
                    <option value="PG">PG</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={policyFormData.description}
                  onChange={(e) => setPolicyFormData({ ...policyFormData, description: e.target.value })}
                  placeholder="Enter policy description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={policyFormData.status}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Policy Type</label>
                  <select
                    value={policyFormData.type}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, type: e.target.value })}
                  >
                    <option value="bandwidth">Bandwidth</option>
                    <option value="access">Access Control</option>
                    <option value="security">Security</option>
                  </select>
                </div>
              </div>

              <h3 className="settings-title">Policy Settings</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Download Speed (Mbps)</label>
                  <input
                    type="number"
                    value={policyFormData.settings.downloadSpeed}
                    onChange={(e) => setPolicyFormData({
                      ...policyFormData,
                      settings: { ...policyFormData.settings, downloadSpeed: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Upload Speed (Mbps)</label>
                  <input
                    type="number"
                    value={policyFormData.settings.uploadSpeed}
                    onChange={(e) => setPolicyFormData({
                      ...policyFormData,
                      settings: { ...policyFormData.settings, uploadSpeed: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fair Usage Limit</label>
                  <input
                    type="text"
                    value={policyFormData.settings.fairUsageLimit}
                    onChange={(e) => setPolicyFormData({
                      ...policyFormData,
                      settings: { ...policyFormData.settings, fairUsageLimit: e.target.value }
                    })}
                    placeholder="e.g., Unlimited or 5 GB/day"
                  />
                </div>
                <div className="form-group">
                  <label>Device Limit</label>
                  <input
                    type="number"
                    value={policyFormData.settings.deviceLimit}
                    onChange={(e) => setPolicyFormData({
                      ...policyFormData,
                      settings: { ...policyFormData.settings, deviceLimit: parseInt(e.target.value) || 1 }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="policy-modal-footer">
              <button className="btn btn-outline" onClick={() => setShowPolicyModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSavePolicy}>
                <FaSave /> {editingPolicy ? "Update Policy" : "Create Policy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemConfiguration;
