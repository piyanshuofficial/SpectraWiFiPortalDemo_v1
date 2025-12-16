// src/pages/Internal/SystemConfiguration.js

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import ConfirmationModal from "@components/ConfirmationModal";
import notifications from "@utils/notifications";
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
  FaWhatsapp,
  FaLink,
  FaToggleOn,
  FaToggleOff,
  FaExclamationTriangle,
  FaFileExport,
  FaFileImport,
  FaFile,
  FaKey,
} from "react-icons/fa";
import {
  AUTH_METHODS,
  SEGMENT_AUTH_CONFIG,
  getAuthMethodLabel,
  getAuthMethodDescription,
} from "@constants/siteProvisioningConfig";
import "./SystemConfiguration.css";

// Sample Authentication Templates Data
const authTemplatesData = [
  {
    id: "auth_tpl_001",
    name: "Enterprise Standard",
    segment: "enterprise",
    description: "Default authentication template for enterprise customers with SSO and guest access",
    status: "active",
    isDefault: true,
    authConfig: {
      users: ["adfs_sso", "username_password", "otp_rmn"],
      guests: ["otp_rmn", "social_login", "captive_portal"],
      devices: ["mac_auth", "wpa2_psk", "dot1x"],
    },
    appliedTo: 45,
    createdAt: "2023-06-15",
    updatedAt: "2024-01-10",
    createdBy: "System",
  },
  {
    id: "auth_tpl_002",
    name: "Hotel Guest Experience",
    segment: "hotel",
    description: "Optimized for hotel environments with room guest and conference room access",
    status: "active",
    isDefault: true,
    authConfig: {
      roomGuests: ["room_number_validation", "otp_rmn", "pms_integration"],
      conferenceRooms: ["voucher_code", "otp_rmn"],
      staff: ["username_password", "otp_rmn"],
      devices: ["mac_auth", "wpa2_psk"],
    },
    appliedTo: 128,
    createdAt: "2023-07-20",
    updatedAt: "2024-01-08",
    createdBy: "Admin",
  },
  {
    id: "auth_tpl_003",
    name: "Co-Living Resident",
    segment: "coliving",
    description: "Template for co-living spaces with resident and guest authentication",
    status: "active",
    isDefault: true,
    authConfig: {
      residents: ["username_password", "otp_rmn"],
      guests: ["otp_rmn", "social_login"],
      devices: ["mac_auth", "wpa2_psk"],
    },
    appliedTo: 85,
    createdAt: "2023-08-10",
    updatedAt: "2024-01-05",
    createdBy: "Admin",
  },
  {
    id: "auth_tpl_004",
    name: "PG Basic",
    segment: "pg",
    description: "Simple authentication template for PG accommodations",
    status: "active",
    isDefault: true,
    authConfig: {
      residents: ["otp_rmn", "username_password"],
      guests: ["otp_rmn"],
      devices: ["mac_auth"],
    },
    appliedTo: 210,
    createdAt: "2023-09-05",
    updatedAt: "2024-01-02",
    createdBy: "System",
  },
  {
    id: "auth_tpl_005",
    name: "Co-Working Professional",
    segment: "coworking",
    description: "Authentication for co-working spaces with member and visitor access",
    status: "active",
    isDefault: true,
    authConfig: {
      members: ["username_password", "otp_rmn", "social_login"],
      guests: ["otp_rmn", "captive_portal"],
      devices: ["mac_auth", "wpa2_psk"],
    },
    appliedTo: 156,
    createdAt: "2023-10-01",
    updatedAt: "2024-01-03",
    createdBy: "Admin",
  },
  {
    id: "auth_tpl_006",
    name: "Office Standard",
    segment: "office",
    description: "Standard office authentication with SSO and device MAC auth",
    status: "active",
    isDefault: true,
    authConfig: {
      users: ["adfs_sso", "username_password"],
      guests: ["otp_rmn", "captive_portal"],
      devices: ["dot1x", "mac_auth", "wpa2_psk"],
    },
    appliedTo: 67,
    createdAt: "2023-11-15",
    updatedAt: "2024-01-06",
    createdBy: "System",
  },
  {
    id: "auth_tpl_007",
    name: "Enterprise High Security",
    segment: "enterprise",
    description: "Enhanced security template with multi-factor authentication",
    status: "active",
    isDefault: false,
    authConfig: {
      users: ["adfs_sso", "otp_rmn"],
      guests: ["voucher_code", "otp_rmn"],
      devices: ["dot1x", "certificate_auth"],
    },
    appliedTo: 12,
    createdAt: "2023-12-01",
    updatedAt: "2024-01-09",
    createdBy: "Admin",
  },
  {
    id: "auth_tpl_008",
    name: "Miscellaneous Default",
    segment: "miscellaneous",
    description: "Flexible template for miscellaneous segment sites",
    status: "active",
    isDefault: true,
    authConfig: {
      users: ["username_password", "otp_rmn"],
      guests: ["otp_rmn", "captive_portal"],
      devices: ["mac_auth", "wpa2_psk"],
    },
    appliedTo: 34,
    createdAt: "2023-12-10",
    updatedAt: "2024-01-04",
    createdBy: "System",
  },
];

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
    { id: "tpl_001", name: "Welcome Email", type: "user_onboarding", subject: "Welcome to Spectra WiFi", status: "active", scope: "global", segment: "all", customer: null, site: null, priority: "high", lastModified: "2024-01-10", createdBy: "System" },
    { id: "tpl_002", name: "Password Reset", type: "security", subject: "Reset Your Password", status: "active", scope: "global", segment: "all", customer: null, site: null, priority: "high", lastModified: "2024-01-08", createdBy: "System" },
    { id: "tpl_003", name: "Alert Notification", type: "alert", subject: "Alert: {{alert_name}}", status: "active", scope: "global", segment: "all", customer: null, site: null, priority: "high", lastModified: "2024-01-05", createdBy: "System" },
    { id: "tpl_004", name: "Usage Report", type: "report", subject: "Your Weekly Usage Report", status: "active", scope: "segment", segment: "enterprise", customer: null, site: null, priority: "medium", lastModified: "2023-12-20", createdBy: "Admin" },
    { id: "tpl_005", name: "Account Suspended", type: "security", subject: "Account Suspended", status: "inactive", scope: "global", segment: "all", customer: null, site: null, priority: "high", lastModified: "2023-11-15", createdBy: "System" },
    { id: "tpl_006", name: "Hotel Guest Welcome", type: "user_onboarding", subject: "Welcome to {{hotel_name}}", status: "active", scope: "segment", segment: "hotel", customer: null, site: null, priority: "medium", lastModified: "2024-01-02", createdBy: "Admin" },
    { id: "tpl_007", name: "TechCorp Custom Alert", type: "alert", subject: "TechCorp Network Alert", status: "active", scope: "customer", segment: "enterprise", customer: "TechCorp Industries", site: null, priority: "high", lastModified: "2024-01-08", createdBy: "Support" },
  ],
  whatsappTemplates: [
    { id: "wa_001", name: "Welcome Message", type: "user_onboarding", message: "Welcome to Spectra WiFi! Your account is now active.", status: "approved", language: "en", scope: "global", segment: "all", customer: null, site: null, category: "utility", lastModified: "2024-01-12", createdBy: "System" },
    { id: "wa_002", name: "OTP Verification", type: "authentication", message: "Your OTP is {{otp}}. Valid for 10 minutes.", status: "approved", language: "en", scope: "global", segment: "all", customer: null, site: null, category: "authentication", lastModified: "2024-01-10", createdBy: "System" },
    { id: "wa_003", name: "Service Alert", type: "alert", message: "Alert: {{alert_name}} - {{alert_message}}", status: "approved", language: "en", scope: "global", segment: "all", customer: null, site: null, category: "utility", lastModified: "2024-01-08", createdBy: "System" },
    { id: "wa_004", name: "Payment Reminder", type: "billing", message: "Your payment of ₹{{amount}} is due on {{due_date}}.", status: "pending", language: "en", scope: "segment", segment: "enterprise", customer: null, site: null, category: "utility", lastModified: "2024-01-05", createdBy: "Admin" },
    { id: "wa_005", name: "Service Restored", type: "notification", message: "Good news! Your service has been restored.", status: "approved", language: "en", scope: "global", segment: "all", customer: null, site: null, category: "utility", lastModified: "2024-01-03", createdBy: "System" },
    { id: "wa_006", name: "Guest WiFi Credentials", type: "guest_access", message: "Your Guest WiFi credentials - SSID: {{ssid}}, Password: {{password}}", status: "approved", language: "en", scope: "segment", segment: "hotel", customer: null, site: null, category: "utility", lastModified: "2024-01-01", createdBy: "Admin" },
    { id: "wa_007", name: "Hotel Check-in Welcome", type: "user_onboarding", message: "Welcome to {{hotel_name}}! Connect to WiFi: {{ssid}}. Enjoy your stay!", status: "approved", language: "en", scope: "customer", segment: "hotel", customer: "Grand Plaza Hotel", site: null, category: "marketing", lastModified: "2024-01-10", createdBy: "Support" },
  ],
  smsTemplates: [
    { id: "sms_001", name: "OTP Code", type: "authentication", message: "{{otp}} is your Spectra verification code. Valid for 10 mins. Do not share.", status: "active", chars: 72, scope: "global", segment: "all", customer: null, site: null, senderId: "SPECTRA", lastModified: "2024-01-15", createdBy: "System" },
    { id: "sms_002", name: "Welcome SMS", type: "user_onboarding", message: "Welcome to Spectra WiFi! Your account is active. Download app: {{app_link}}", status: "active", chars: 78, scope: "global", segment: "all", customer: null, site: null, senderId: "SPECTRA", lastModified: "2024-01-12", createdBy: "System" },
    { id: "sms_003", name: "Payment Due", type: "billing", message: "Spectra: Your payment of Rs.{{amount}} is due on {{date}}. Pay now to avoid disconnection.", status: "active", chars: 89, scope: "segment", segment: "enterprise", customer: null, site: null, senderId: "SPECTRA", lastModified: "2024-01-10", createdBy: "Admin" },
    { id: "sms_004", name: "Service Alert", type: "alert", message: "Spectra Alert: {{alert_message}}. Contact support if issue persists.", status: "active", chars: 65, scope: "global", segment: "all", customer: null, site: null, senderId: "SPECTRA", lastModified: "2024-01-08", createdBy: "System" },
    { id: "sms_005", name: "Password Reset", type: "security", message: "Your Spectra password reset code is {{code}}. Expires in 15 mins.", status: "active", chars: 64, scope: "global", segment: "all", customer: null, site: null, senderId: "SPECTRA", lastModified: "2024-01-05", createdBy: "System" },
    { id: "sms_006", name: "Guest Access", type: "guest_access", message: "Spectra Guest WiFi - Network: {{ssid}}, Password: {{password}}. Valid for {{duration}}.", status: "active", chars: 82, scope: "segment", segment: "hotel", customer: null, site: null, senderId: "SPECTRA", lastModified: "2024-01-03", createdBy: "Admin" },
    { id: "sms_007", name: "Service Disconnected", type: "notification", message: "Spectra: Your service has been disconnected due to non-payment. Pay now to restore.", status: "inactive", chars: 85, scope: "global", segment: "all", customer: null, site: null, senderId: "SPECTRA", lastModified: "2023-12-20", createdBy: "System" },
    { id: "sms_008", name: "CoWork Day Pass", type: "guest_access", message: "Your CoWork day pass is active. WiFi: {{ssid}}, Pass: {{password}}. Valid till {{expiry}}.", status: "active", chars: 88, scope: "segment", segment: "coWorking", customer: null, site: null, senderId: "COWORK", lastModified: "2024-01-05", createdBy: "Admin" },
  ],
  channels: {
    email: { enabled: true, smtpServer: "smtp.spectra.co", from: "noreply@spectra.co" },
    sms: { enabled: true, provider: "Twilio", senderId: "SPECTRA" },
    webhook: { enabled: true, endpoints: 3 },
    whatsapp: { enabled: true, businessAccount: "Spectra", phoneNumber: "+91 98765 43210" },
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

  // Delete confirmation modal state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Template modal state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateType, setTemplateType] = useState('email'); // 'email', 'whatsapp', 'sms'
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    type: 'notification',
    subject: '',
    message: '',
    scope: 'global',
    segment: 'all',
    customer: '',
    site: '',
    status: 'active',
    language: 'en',
    category: 'utility',
    senderId: 'SPECTRA',
    priority: 'medium',
  });
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

  // Import/Export modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState(null);

  // Auth Template modal state
  const [showAuthTemplateModal, setShowAuthTemplateModal] = useState(false);
  const [editingAuthTemplate, setEditingAuthTemplate] = useState(null);
  const [isSavingAuthTemplate, setIsSavingAuthTemplate] = useState(false);
  const [selectedAuthSegment, setSelectedAuthSegment] = useState("all");
  const [authTemplateFormData, setAuthTemplateFormData] = useState({
    name: "",
    segment: "enterprise",
    description: "",
    status: "active",
    isDefault: false,
    authConfig: {},
  });

  // Auth template delete confirmation
  const [showAuthTemplateDeleteConfirmation, setShowAuthTemplateDeleteConfirmation] = useState(false);
  const [authTemplateToDelete, setAuthTemplateToDelete] = useState(null);
  const [isDeletingAuthTemplate, setIsDeletingAuthTemplate] = useState(false);

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
    setPolicyToDelete(policy);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!policyToDelete) return;

    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      // In production, this would call an API
      console.log("Deleting policy:", policyToDelete.id);
      notifications.showSuccess(`Policy "${policyToDelete.name}" has been deleted.`);
      setShowDeleteConfirmation(false);
      setPolicyToDelete(null);
    } catch (error) {
      notifications.showError("Failed to delete policy. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setPolicyToDelete(null);
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

  // Template action handlers
  const handleOpenTemplateModal = (type) => {
    setTemplateType(type);
    setTemplateFormData({
      name: '',
      type: 'notification',
      subject: '',
      message: '',
      scope: 'global',
      segment: 'all',
      customer: '',
      site: '',
      status: type === 'whatsapp' ? 'pending' : 'active',
      language: 'en',
      category: 'utility',
      senderId: 'SPECTRA',
      priority: 'medium',
    });
    setShowTemplateModal(true);
  };

  const handleCloseTemplateModal = () => {
    setShowTemplateModal(false);
    setTemplateFormData({
      name: '',
      type: 'notification',
      subject: '',
      message: '',
      scope: 'global',
      segment: 'all',
      customer: '',
      site: '',
      status: 'active',
      language: 'en',
      category: 'utility',
      senderId: 'SPECTRA',
      priority: 'medium',
    });
  };

  const handleSaveTemplate = async () => {
    if (!templateFormData.name.trim()) {
      notifications.showError('Please enter a template name');
      return;
    }
    if (templateType === 'email' && !templateFormData.subject.trim()) {
      notifications.showError('Please enter an email subject');
      return;
    }
    if ((templateType === 'whatsapp' || templateType === 'sms') && !templateFormData.message.trim()) {
      notifications.showError('Please enter a message');
      return;
    }

    setIsSavingTemplate(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const templateId = `${templateType}_${Date.now()}`;
      const newTemplate = {
        id: templateId,
        name: templateFormData.name,
        type: templateFormData.type,
        status: templateFormData.status,
        scope: templateFormData.scope,
        segment: templateFormData.segment,
        customer: templateFormData.customer || null,
        site: templateFormData.site || null,
        lastModified: new Date().toISOString().split('T')[0],
        createdBy: 'Admin',
        ...(templateType === 'email' && {
          subject: templateFormData.subject,
          priority: templateFormData.priority,
        }),
        ...(templateType === 'whatsapp' && {
          message: templateFormData.message,
          language: templateFormData.language,
          category: templateFormData.category,
        }),
        ...(templateType === 'sms' && {
          message: templateFormData.message,
          chars: templateFormData.message.length,
          senderId: templateFormData.senderId,
        }),
      };

      console.log('Creating template:', newTemplate);
      notifications.showSuccess(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template "${templateFormData.name}" has been created.`);
      handleCloseTemplateModal();
    } catch (error) {
      notifications.showError('Failed to create template. Please try again.');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  // Sample data for dropdowns
  const segmentOptions = ['all', 'enterprise', 'hotel', 'coLiving', 'coWorking', 'pg', 'office'];
  const customerOptions = ['TechCorp Industries', 'Grand Plaza Hotel', 'Urban Living Spaces', 'WorkHub Co-Working', 'Sunrise PG'];
  const siteOptions = ['Main Office', 'Branch Office', 'Hotel Lobby', 'Co-Working Floor 1', 'Residential Block A'];
  const templateTypeOptions = [
    { value: 'notification', label: 'Notification' },
    { value: 'user_onboarding', label: 'User Onboarding' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'security', label: 'Security' },
    { value: 'billing', label: 'Billing' },
    { value: 'alert', label: 'Alert' },
    { value: 'report', label: 'Report' },
    { value: 'guest_access', label: 'Guest Access' },
  ];

  // Export/Import handlers
  const handleExportPolicies = () => {
    const exportData = {
      exportType: 'policies',
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: policiesData,
    };
    downloadJsonFile(exportData, `user-policies-${formatDateForFilename()}.json`);
    notifications.showSuccess('User policies exported successfully!');
  };

  const handleExportAll = () => {
    const exportData = {
      exportType: 'full_config',
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: {
        policies: policiesData,
        notifications: notificationSettings,
        roles: rolesData,
      },
    };
    downloadJsonFile(exportData, `system-config-${formatDateForFilename()}.json`);
    notifications.showSuccess('Full system configuration exported successfully!');
  };

  const downloadJsonFile = (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDateForFilename = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const handleOpenImportModal = () => {
    setShowImportModal(true);
    setImportFile(null);
    setImportPreview(null);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
    setImportFile(null);
    setImportPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.json')) {
        notifications.showError('Please select a valid JSON file.');
        return;
      }
      setImportFile(file);

      // Read and preview file content
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setImportPreview(data);
        } catch (error) {
          notifications.showError('Invalid JSON file format.');
          setImportFile(null);
          setImportPreview(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportConfig = async () => {
    if (!importFile || !importPreview) {
      notifications.showError('Please select a valid configuration file.');
      return;
    }

    setIsImporting(true);
    try {
      // Simulate API call for import
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would send to an API
      console.log('Importing configuration:', importPreview);

      const importType = importPreview.exportType || 'unknown';
      let message = 'Configuration imported successfully!';

      if (importType === 'policies') {
        message = `${importPreview.data?.length || 0} policies imported successfully!`;
      } else if (importType === 'full_config') {
        const policiesCount = importPreview.data?.policies?.length || 0;
        message = `Full configuration imported: ${policiesCount} policies and notification settings.`;
      }

      notifications.showSuccess(message);
      handleCloseImportModal();
    } catch (error) {
      notifications.showError('Failed to import configuration. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  // Auth Template action handlers
  const handleCreateNewAuthTemplate = () => {
    setEditingAuthTemplate(null);
    const defaultSegment = selectedAuthSegment !== "all" ? selectedAuthSegment : "enterprise";
    const segmentConfig = SEGMENT_AUTH_CONFIG[defaultSegment] || SEGMENT_AUTH_CONFIG.enterprise;
    const defaultConfig = {};
    segmentConfig.categories.forEach(cat => {
      defaultConfig[cat] = [];
    });
    setAuthTemplateFormData({
      name: "",
      segment: defaultSegment,
      description: "",
      status: "active",
      isDefault: false,
      authConfig: defaultConfig,
    });
    setShowAuthTemplateModal(true);
  };

  const handleEditAuthTemplate = (template) => {
    setEditingAuthTemplate(template);
    setAuthTemplateFormData({
      name: template.name,
      segment: template.segment,
      description: template.description,
      status: template.status,
      isDefault: template.isDefault,
      authConfig: { ...template.authConfig },
    });
    setShowAuthTemplateModal(true);
  };

  const handleDuplicateAuthTemplate = (template) => {
    setEditingAuthTemplate(null);
    setAuthTemplateFormData({
      name: `${template.name} (Copy)`,
      segment: template.segment,
      description: template.description,
      status: "inactive",
      isDefault: false,
      authConfig: { ...template.authConfig },
    });
    setShowAuthTemplateModal(true);
  };

  const handleDeleteAuthTemplate = (template) => {
    setAuthTemplateToDelete(template);
    setShowAuthTemplateDeleteConfirmation(true);
  };

  const handleConfirmDeleteAuthTemplate = async () => {
    if (!authTemplateToDelete) return;
    setIsDeletingAuthTemplate(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log("Deleting auth template:", authTemplateToDelete.id);
      notifications.showSuccess(`Auth template "${authTemplateToDelete.name}" has been deleted.`);
      setShowAuthTemplateDeleteConfirmation(false);
      setAuthTemplateToDelete(null);
    } catch (error) {
      notifications.showError("Failed to delete auth template. Please try again.");
    } finally {
      setIsDeletingAuthTemplate(false);
    }
  };

  const handleCancelDeleteAuthTemplate = () => {
    setShowAuthTemplateDeleteConfirmation(false);
    setAuthTemplateToDelete(null);
  };

  const handleSaveAuthTemplate = async () => {
    if (!authTemplateFormData.name.trim()) {
      notifications.showError("Please enter a template name");
      return;
    }

    // Validate at least one auth method is selected
    const hasAuthMethods = Object.values(authTemplateFormData.authConfig).some(
      methods => methods && methods.length > 0
    );
    if (!hasAuthMethods) {
      notifications.showError("Please select at least one authentication method");
      return;
    }

    setIsSavingAuthTemplate(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log(editingAuthTemplate ? "Updating auth template:" : "Creating auth template:", authTemplateFormData);
      notifications.showSuccess(
        `Auth template "${authTemplateFormData.name}" has been ${editingAuthTemplate ? "updated" : "created"}.`
      );
      setShowAuthTemplateModal(false);
      setEditingAuthTemplate(null);
    } catch (error) {
      notifications.showError("Failed to save auth template. Please try again.");
    } finally {
      setIsSavingAuthTemplate(false);
    }
  };

  const handleCloseAuthTemplateModal = () => {
    setShowAuthTemplateModal(false);
    setEditingAuthTemplate(null);
  };

  const handleAuthMethodToggle = (category, methodId) => {
    setAuthTemplateFormData(prev => {
      const currentMethods = prev.authConfig[category] || [];
      const newMethods = currentMethods.includes(methodId)
        ? currentMethods.filter(m => m !== methodId)
        : [...currentMethods, methodId];
      return {
        ...prev,
        authConfig: {
          ...prev.authConfig,
          [category]: newMethods,
        },
      };
    });
  };

  const handleAuthTemplateSegmentChange = (newSegment) => {
    const segmentConfig = SEGMENT_AUTH_CONFIG[newSegment] || SEGMENT_AUTH_CONFIG.enterprise;
    const defaultConfig = {};
    segmentConfig.categories.forEach(cat => {
      defaultConfig[cat] = authTemplateFormData.authConfig[cat] || [];
    });
    setAuthTemplateFormData(prev => ({
      ...prev,
      segment: newSegment,
      authConfig: defaultConfig,
    }));
  };

  // Segment labels mapping
  const segmentLabels = {
    enterprise: "Enterprise",
    hotel: "Hotel",
    coliving: "Co-Living",
    pg: "PG",
    coworking: "Co-Working",
    office: "Office",
    miscellaneous: "Miscellaneous",
  };

  // Category labels mapping
  const categoryLabels = {
    users: "Users",
    guests: "Guests",
    devices: "Devices",
    residents: "Residents",
    members: "Members",
    staff: "Staff",
    roomGuests: "Room Guests",
    conferenceRooms: "Conference Rooms",
  };

  // Filtered auth templates
  const filteredAuthTemplates = useMemo(() => {
    return authTemplatesData.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSegment =
        selectedAuthSegment === "all" || template.segment === selectedAuthSegment;
      const matchesStatus =
        selectedStatus === "All" || template.status === selectedStatus;
      return matchesSearch && matchesSegment && matchesStatus;
    });
  }, [searchQuery, selectedAuthSegment, selectedStatus]);

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
          <button className="btn btn-outline" onClick={handleExportPolicies}>
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
          <div className={`channel-card ${notificationSettings.channels.whatsapp.enabled ? 'enabled' : 'disabled'}`}>
            <div className="channel-icon whatsapp"><FaWhatsapp /></div>
            <div className="channel-info">
              <h4>WhatsApp Business</h4>
              <p>{notificationSettings.channels.whatsapp.businessAccount || 'Not configured'}</p>
            </div>
            <div className="channel-status">
              {notificationSettings.channels.whatsapp.enabled ? <FaCheckCircle /> : <FaTimesCircle />}
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
          <button className="btn btn-outline btn-sm" onClick={() => handleOpenTemplateModal('email')}>
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
              <div className="template-scope-badges">
                <span className={`scope-badge ${template.scope}`}>{template.scope}</span>
                {template.segment !== 'all' && (
                  <span className="scope-badge segment">{template.segment}</span>
                )}
                {template.customer && (
                  <span className="scope-badge customer">{template.customer}</span>
                )}
              </div>
              <p className="template-type">{template.type.replace('_', ' ')}</p>
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

      {/* WhatsApp Templates */}
      <div className="templates-section whatsapp-templates">
        <div className="templates-header">
          <h3><FaWhatsapp className="whatsapp-icon" /> WhatsApp Templates</h3>
          <button className="btn btn-outline btn-sm" onClick={() => handleOpenTemplateModal('whatsapp')}>
            <FaPlus /> New Template
          </button>
        </div>
        <p className="templates-description">
          WhatsApp Business API message templates. Templates must be approved by Meta before use.
        </p>
        <div className="templates-grid">
          {notificationSettings.whatsappTemplates.map((template) => (
            <div key={template.id} className="template-card whatsapp-card">
              <div className="template-header">
                <h4>{template.name}</h4>
                <span className={`status-badge ${template.status}`}>
                  {template.status}
                </span>
              </div>
              <div className="template-scope-badges">
                <span className={`scope-badge ${template.scope}`}>{template.scope}</span>
                {template.segment !== 'all' && (
                  <span className="scope-badge segment">{template.segment}</span>
                )}
                {template.customer && (
                  <span className="scope-badge customer">{template.customer}</span>
                )}
              </div>
              <p className="template-type">{template.type.replace('_', ' ')}</p>
              <p className="template-message">"{template.message}"</p>
              <div className="template-meta">
                <span className="template-language">Lang: {template.language.toUpperCase()}</span>
                <span className="template-language">{template.category}</span>
              </div>
              <div className="template-footer">
                <span className="template-date">Modified: {template.lastModified}</span>
                <div className="template-actions">
                  <button className="btn-icon" title="Edit"><FaEdit /></button>
                  <button className="btn-icon" title="Duplicate"><FaCopy /></button>
                  <button className="btn-icon danger" title="Delete"><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SMS Templates */}
      <div className="templates-section sms-templates">
        <div className="templates-header">
          <h3><FaMobileAlt className="sms-icon" /> SMS Templates</h3>
          <button className="btn btn-outline btn-sm" onClick={() => handleOpenTemplateModal('sms')}>
            <FaPlus /> New Template
          </button>
        </div>
        <p className="templates-description sms-description">
          SMS templates for transactional messages. Keep messages under 160 characters for single SMS.
        </p>
        <div className="templates-grid">
          {notificationSettings.smsTemplates.map((template) => (
            <div key={template.id} className="template-card sms-card">
              <div className="template-header">
                <h4>{template.name}</h4>
                <span className={`status-badge ${template.status}`}>
                  {template.status}
                </span>
              </div>
              <div className="template-scope-badges">
                <span className={`scope-badge ${template.scope}`}>{template.scope}</span>
                {template.segment !== 'all' && (
                  <span className="scope-badge segment">{template.segment}</span>
                )}
                {template.customer && (
                  <span className="scope-badge customer">{template.customer}</span>
                )}
              </div>
              <p className="template-type">{template.type.replace('_', ' ')}</p>
              <p className="template-message sms-message">"{template.message}"</p>
              <div className="template-meta">
                <span className={`char-count ${template.chars > 160 ? 'warning' : ''}`}>
                  {template.chars} / 160 chars
                </span>
                <span className="template-language">{template.senderId}</span>
              </div>
              <div className="template-footer">
                <span className="template-date">Modified: {template.lastModified}</span>
                <div className="template-actions">
                  <button className="btn-icon" title="Edit"><FaEdit /></button>
                  <button className="btn-icon" title="Duplicate"><FaCopy /></button>
                  <button className="btn-icon danger" title="Delete"><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Auth Templates Section
  const renderAuthTemplatesSection = () => (
    <div className="config-section auth-templates-section">
      <div className="section-header">
        <div className="section-title">
          <FaKey />
          <h2>Authentication Templates</h2>
          <span className="count">{filteredAuthTemplates.length} templates</span>
        </div>
        <div className="section-actions">
          <button className="btn btn-outline">
            <FaDownload /> Export
          </button>
          <button className="btn btn-primary" onClick={handleCreateNewAuthTemplate}>
            <FaPlus /> New Template
          </button>
        </div>
      </div>

      {/* Segment Filter Tabs */}
      <div className="auth-segment-tabs">
        <button
          className={`segment-tab ${selectedAuthSegment === "all" ? "active" : ""}`}
          onClick={() => setSelectedAuthSegment("all")}
        >
          All Segments
        </button>
        {Object.keys(segmentLabels).map(seg => (
          <button
            key={seg}
            className={`segment-tab ${selectedAuthSegment === seg ? "active" : ""}`}
            onClick={() => setSelectedAuthSegment(seg)}
          >
            {segmentLabels[seg]}
          </button>
        ))}
      </div>

      <div className="auth-templates-grid">
        {filteredAuthTemplates.map((template) => (
          <div key={template.id} className={`auth-template-card ${template.isDefault ? 'default-template' : ''}`}>
            <div className="auth-template-header">
              <div className="auth-template-info">
                <h3>
                  {template.name}
                  {template.isDefault && <span className="default-badge">Default</span>}
                </h3>
                <span className={`status-badge ${template.status}`}>
                  {getStatusIcon(template.status)} {template.status}
                </span>
              </div>
              <div className="auth-template-actions">
                <button className="btn-icon" title="Edit" onClick={() => handleEditAuthTemplate(template)}>
                  <FaEdit />
                </button>
                <button className="btn-icon" title="Duplicate" onClick={() => handleDuplicateAuthTemplate(template)}>
                  <FaCopy />
                </button>
                {!template.isDefault && (
                  <button className="btn-icon danger" title="Delete" onClick={() => handleDeleteAuthTemplate(template)}>
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>

            <p className="auth-template-description">{template.description}</p>

            <div className="auth-template-tags">
              <span className="tag segment">{segmentLabels[template.segment] || template.segment}</span>
              <span className="tag created-by">By {template.createdBy}</span>
            </div>

            <div className="auth-template-config">
              <h4>Authentication Methods</h4>
              <div className="auth-categories-preview">
                {Object.entries(template.authConfig).map(([category, methods]) => (
                  <div key={category} className="auth-category-preview">
                    <span className="category-label">{categoryLabels[category] || category}:</span>
                    <div className="method-tags">
                      {methods.map(methodId => (
                        <span key={methodId} className="method-tag">
                          {getAuthMethodLabel(methodId)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="auth-template-footer">
              <span className="applied-count">
                <FaUsers /> Applied to {template.appliedTo} sites
              </span>
              <span className="updated-date">
                Updated: {new Date(template.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredAuthTemplates.length === 0 && (
        <div className="no-results">
          <FaKey />
          <h3>No templates found</h3>
          <p>No authentication templates match your search criteria.</p>
          <button className="btn btn-primary" onClick={handleCreateNewAuthTemplate}>
            <FaPlus /> Create New Template
          </button>
        </div>
      )}
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
        <div className="page-header-content">
          <div className="page-title-section">
            <h1>
              <FaCog className="page-title-icon" /> System Configuration
            </h1>
            <p className="page-subtitle">Manage policies, notifications, and access controls</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-outline" onClick={handleOpenImportModal}>
              <FaUpload /> Import Config
            </button>
            <button className="btn btn-outline" onClick={handleExportAll}>
              <FaDownload /> Export All
            </button>
          </div>
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
        <button
          className={`tab-btn ${activeSection === "authTemplates" ? "active" : ""}`}
          onClick={() => { setActiveSection("authTemplates"); setSearchQuery(""); setSelectedStatus("All"); setSelectedAuthSegment("all"); }}
        >
          <FaKey /> Auth Templates
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
      {activeSection === "authTemplates" && renderAuthTemplatesSection()}

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

      {/* Delete Policy Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Policy"
        message={
          policyToDelete
            ? `Are you sure you want to delete the policy "${policyToDelete.name}"?\n\nThis will:\n• Remove the policy configuration permanently\n• Affect all sites/users currently using this policy\n• This action cannot be undone`
            : ''
        }
        confirmText="Delete Policy"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="template-modal-overlay" onClick={handleCloseTemplateModal}>
          <div className={`template-modal template-modal-${templateType}`} onClick={(e) => e.stopPropagation()}>
            <div className="template-modal-header">
              <h2>
                {templateType === 'email' && <><FaEnvelope className="modal-icon email" /> New Email Template</>}
                {templateType === 'whatsapp' && <><FaWhatsapp className="modal-icon whatsapp" /> New WhatsApp Template</>}
                {templateType === 'sms' && <><FaMobileAlt className="modal-icon sms" /> New SMS Template</>}
              </h2>
              <button className="close-btn" onClick={handleCloseTemplateModal}>
                <FaTimesCircle />
              </button>
            </div>

            <div className="template-modal-body">
              {/* Basic Information */}
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Template Name *</label>
                    <input
                      type="text"
                      value={templateFormData.name}
                      onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Template Type</label>
                    <select
                      value={templateFormData.type}
                      onChange={(e) => setTemplateFormData({ ...templateFormData, type: e.target.value })}
                    >
                      {templateTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email-specific: Subject */}
                {templateType === 'email' && (
                  <div className="form-group full-width">
                    <label>Email Subject *</label>
                    <input
                      type="text"
                      value={templateFormData.subject}
                      onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                      placeholder="Enter email subject (supports {{variables}})"
                    />
                  </div>
                )}

                {/* WhatsApp/SMS: Message */}
                {(templateType === 'whatsapp' || templateType === 'sms') && (
                  <div className="form-group full-width">
                    <label>Message Content *</label>
                    <textarea
                      value={templateFormData.message}
                      onChange={(e) => setTemplateFormData({ ...templateFormData, message: e.target.value })}
                      placeholder="Enter message content (supports {{variables}})"
                      rows="4"
                    />
                    {templateType === 'sms' && (
                      <span className={`char-counter ${templateFormData.message.length > 160 ? 'warning' : ''}`}>
                        {templateFormData.message.length} / 160 characters
                        {templateFormData.message.length > 160 && ' (Multiple SMS)'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Scope & Targeting */}
              <div className="form-section">
                <h4>Scope & Targeting</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Scope</label>
                    <select
                      value={templateFormData.scope}
                      onChange={(e) => setTemplateFormData({ ...templateFormData, scope: e.target.value, customer: '', site: '' })}
                    >
                      <option value="global">Global (All)</option>
                      <option value="segment">Segment Specific</option>
                      <option value="customer">Customer Specific</option>
                      <option value="site">Site Specific</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Segment</label>
                    <select
                      value={templateFormData.segment}
                      onChange={(e) => setTemplateFormData({ ...templateFormData, segment: e.target.value })}
                      disabled={templateFormData.scope === 'global'}
                    >
                      {segmentOptions.map(seg => (
                        <option key={seg} value={seg}>
                          {seg === 'all' ? 'All Segments' : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/([A-Z])/g, ' $1')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {(templateFormData.scope === 'customer' || templateFormData.scope === 'site') && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Customer</label>
                      <select
                        value={templateFormData.customer}
                        onChange={(e) => setTemplateFormData({ ...templateFormData, customer: e.target.value })}
                      >
                        <option value="">Select Customer</option>
                        {customerOptions.map(cust => (
                          <option key={cust} value={cust}>{cust}</option>
                        ))}
                      </select>
                    </div>
                    {templateFormData.scope === 'site' && (
                      <div className="form-group">
                        <label>Site</label>
                        <select
                          value={templateFormData.site}
                          onChange={(e) => setTemplateFormData({ ...templateFormData, site: e.target.value })}
                        >
                          <option value="">Select Site</option>
                          {siteOptions.map(site => (
                            <option key={site} value={site}>{site}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Additional Settings */}
              <div className="form-section">
                <h4>Additional Settings</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={templateFormData.status}
                      onChange={(e) => setTemplateFormData({ ...templateFormData, status: e.target.value })}
                    >
                      {templateType === 'whatsapp' ? (
                        <>
                          <option value="pending">Pending Approval</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </>
                      ) : (
                        <>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Email-specific: Priority */}
                  {templateType === 'email' && (
                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        value={templateFormData.priority}
                        onChange={(e) => setTemplateFormData({ ...templateFormData, priority: e.target.value })}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  )}

                  {/* WhatsApp-specific: Language & Category */}
                  {templateType === 'whatsapp' && (
                    <>
                      <div className="form-group">
                        <label>Language</label>
                        <select
                          value={templateFormData.language}
                          onChange={(e) => setTemplateFormData({ ...templateFormData, language: e.target.value })}
                        >
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={templateFormData.category}
                          onChange={(e) => setTemplateFormData({ ...templateFormData, category: e.target.value })}
                        >
                          <option value="utility">Utility</option>
                          <option value="authentication">Authentication</option>
                          <option value="marketing">Marketing</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* SMS-specific: Sender ID */}
                  {templateType === 'sms' && (
                    <div className="form-group">
                      <label>Sender ID</label>
                      <input
                        type="text"
                        value={templateFormData.senderId}
                        onChange={(e) => setTemplateFormData({ ...templateFormData, senderId: e.target.value.toUpperCase() })}
                        placeholder="e.g., SPECTRA"
                        maxLength="11"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Template Preview */}
              <div className="form-section template-preview-section">
                <h4>Preview</h4>
                <div className={`template-preview ${templateType}-preview`}>
                  {templateType === 'email' && (
                    <>
                      <div className="preview-header">
                        <strong>Subject:</strong> {templateFormData.subject || 'No subject'}
                      </div>
                      <div className="preview-meta">
                        <span className="preview-badge">{templateFormData.type}</span>
                        <span className="preview-badge scope">{templateFormData.scope}</span>
                        {templateFormData.segment !== 'all' && (
                          <span className="preview-badge segment">{templateFormData.segment}</span>
                        )}
                      </div>
                    </>
                  )}
                  {templateType === 'whatsapp' && (
                    <>
                      <div className="preview-message whatsapp-bubble">
                        {templateFormData.message || 'Your message preview will appear here...'}
                      </div>
                      <div className="preview-meta">
                        <span className="preview-badge">{templateFormData.category}</span>
                        <span className="preview-badge">{templateFormData.language.toUpperCase()}</span>
                        <span className="preview-badge scope">{templateFormData.scope}</span>
                      </div>
                    </>
                  )}
                  {templateType === 'sms' && (
                    <>
                      <div className="preview-message sms-bubble">
                        {templateFormData.message || 'Your SMS preview will appear here...'}
                      </div>
                      <div className="preview-meta">
                        <span className="preview-badge sender">{templateFormData.senderId}</span>
                        <span className={`preview-badge chars ${templateFormData.message.length > 160 ? 'warning' : ''}`}>
                          {templateFormData.message.length} chars
                        </span>
                        <span className="preview-badge scope">{templateFormData.scope}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="template-modal-footer">
              <button className="btn btn-outline" onClick={handleCloseTemplateModal} disabled={isSavingTemplate}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveTemplate} disabled={isSavingTemplate}>
                {isSavingTemplate ? (
                  <>Saving...</>
                ) : (
                  <><FaSave /> Create Template</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Config Modal */}
      {showImportModal && (
        <div className="import-modal-overlay" onClick={handleCloseImportModal}>
          <div className="import-modal" onClick={(e) => e.stopPropagation()}>
            <div className="import-modal-header">
              <h2>
                <FaFileImport className="modal-icon" /> Import Configuration
              </h2>
              <button className="close-btn" onClick={handleCloseImportModal}>
                <FaTimesCircle />
              </button>
            </div>

            <div className="import-modal-body">
              <div className="import-instructions">
                <p>Upload a JSON configuration file exported from this system. Supported formats:</p>
                <ul>
                  <li><strong>Full Configuration</strong> - Policies, notifications, and roles</li>
                  <li><strong>Policies Only</strong> - User policies export</li>
                </ul>
              </div>

              <div className="file-upload-section">
                <label className="file-upload-label">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <div className="file-upload-box">
                    <FaFile className="upload-icon" />
                    <span className="upload-text">
                      {importFile ? importFile.name : 'Click to select or drag and drop a JSON file'}
                    </span>
                    {importFile && (
                      <span className="file-size">
                        {(importFile.size / 1024).toFixed(2)} KB
                      </span>
                    )}
                  </div>
                </label>
              </div>

              {importPreview && (
                <div className="import-preview">
                  <h4>Import Preview</h4>
                  <div className="preview-details">
                    <div className="preview-item">
                      <span className="preview-label">Type:</span>
                      <span className="preview-value">
                        {importPreview.exportType === 'full_config' ? 'Full Configuration' :
                         importPreview.exportType === 'policies' ? 'User Policies' : 'Unknown'}
                      </span>
                    </div>
                    <div className="preview-item">
                      <span className="preview-label">Export Date:</span>
                      <span className="preview-value">
                        {importPreview.exportDate ? new Date(importPreview.exportDate).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div className="preview-item">
                      <span className="preview-label">Version:</span>
                      <span className="preview-value">{importPreview.version || 'N/A'}</span>
                    </div>

                    {importPreview.exportType === 'policies' && (
                      <div className="preview-item">
                        <span className="preview-label">Policies:</span>
                        <span className="preview-value">{importPreview.data?.length || 0} items</span>
                      </div>
                    )}

                    {importPreview.exportType === 'full_config' && (
                      <>
                        <div className="preview-item">
                          <span className="preview-label">Policies:</span>
                          <span className="preview-value">{importPreview.data?.policies?.length || 0} items</span>
                        </div>
                        <div className="preview-item">
                          <span className="preview-label">Email Templates:</span>
                          <span className="preview-value">{importPreview.data?.notifications?.emailTemplates?.length || 0} items</span>
                        </div>
                        <div className="preview-item">
                          <span className="preview-label">Alert Thresholds:</span>
                          <span className="preview-value">{importPreview.data?.notifications?.alertThresholds?.length || 0} items</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="import-warning">
                    <FaExclamationTriangle />
                    <span>Importing will merge with existing configuration. Duplicate entries may be overwritten.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="import-modal-footer">
              <button className="btn btn-outline" onClick={handleCloseImportModal} disabled={isImporting}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleImportConfig}
                disabled={isImporting || !importFile || !importPreview}
              >
                {isImporting ? (
                  <>Importing...</>
                ) : (
                  <><FaUpload /> Import Configuration</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Template Modal */}
      {showAuthTemplateModal && (
        <div className="auth-template-modal-overlay" onClick={handleCloseAuthTemplateModal}>
          <div className="auth-template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-template-modal-header">
              <h2>
                <FaKey className="modal-icon" />
                {editingAuthTemplate ? "Edit Authentication Template" : "Create Authentication Template"}
              </h2>
              <button className="close-btn" onClick={handleCloseAuthTemplateModal}>
                <FaTimesCircle />
              </button>
            </div>

            <div className="auth-template-modal-body">
              {/* Basic Information */}
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Template Name *</label>
                    <input
                      type="text"
                      value={authTemplateFormData.name}
                      onChange={(e) => setAuthTemplateFormData({ ...authTemplateFormData, name: e.target.value })}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Segment *</label>
                    <select
                      value={authTemplateFormData.segment}
                      onChange={(e) => handleAuthTemplateSegmentChange(e.target.value)}
                    >
                      {Object.entries(segmentLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={authTemplateFormData.description}
                    onChange={(e) => setAuthTemplateFormData({ ...authTemplateFormData, description: e.target.value })}
                    placeholder="Describe this authentication template"
                    rows="2"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={authTemplateFormData.status}
                      onChange={(e) => setAuthTemplateFormData({ ...authTemplateFormData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={authTemplateFormData.isDefault}
                        onChange={(e) => setAuthTemplateFormData({ ...authTemplateFormData, isDefault: e.target.checked })}
                      />
                      <span>Set as default template for this segment</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Authentication Methods Selection */}
              <div className="form-section auth-methods-section">
                <h4>Authentication Methods by Category</h4>
                <p className="section-description">
                  Select the authentication methods available for each user category in the {segmentLabels[authTemplateFormData.segment]} segment.
                </p>

                <div className="auth-categories-edit">
                  {(SEGMENT_AUTH_CONFIG[authTemplateFormData.segment]?.categories || []).map(category => (
                    <div key={category} className="auth-category-edit-card">
                      <h5 className="category-title">{categoryLabels[category] || category}</h5>
                      <div className="auth-methods-list">
                        {AUTH_METHODS.map(method => (
                          <label
                            key={method.id}
                            className={`auth-method-checkbox ${(authTemplateFormData.authConfig[category] || []).includes(method.id) ? 'selected' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={(authTemplateFormData.authConfig[category] || []).includes(method.id)}
                              onChange={() => handleAuthMethodToggle(category, method.id)}
                            />
                            <div className="method-info">
                              <span className="method-label">{method.label}</span>
                              <span className="method-description">{getAuthMethodDescription(method.id)}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Section */}
              <div className="form-section auth-template-preview-section">
                <h4>Template Preview</h4>
                <div className="auth-template-preview">
                  <div className="preview-header">
                    <strong>{authTemplateFormData.name || 'Untitled Template'}</strong>
                    <span className={`status-badge ${authTemplateFormData.status}`}>{authTemplateFormData.status}</span>
                    {authTemplateFormData.isDefault && <span className="default-badge">Default</span>}
                  </div>
                  <div className="preview-segment">
                    <span className="segment-badge">{segmentLabels[authTemplateFormData.segment]}</span>
                  </div>
                  <div className="preview-config">
                    {Object.entries(authTemplateFormData.authConfig).map(([category, methods]) => (
                      methods && methods.length > 0 && (
                        <div key={category} className="preview-category">
                          <span className="category-name">{categoryLabels[category] || category}:</span>
                          <span className="methods-list">
                            {methods.map(m => getAuthMethodLabel(m)).join(', ')}
                          </span>
                        </div>
                      )
                    ))}
                    {Object.values(authTemplateFormData.authConfig).every(m => !m || m.length === 0) && (
                      <p className="no-methods">No authentication methods selected</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-template-modal-footer">
              <button className="btn btn-outline" onClick={handleCloseAuthTemplateModal} disabled={isSavingAuthTemplate}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveAuthTemplate} disabled={isSavingAuthTemplate}>
                {isSavingAuthTemplate ? (
                  <>Saving...</>
                ) : (
                  <><FaSave /> {editingAuthTemplate ? "Update Template" : "Create Template"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Template Delete Confirmation Modal */}
      <ConfirmationModal
        open={showAuthTemplateDeleteConfirmation}
        onClose={handleCancelDeleteAuthTemplate}
        onConfirm={handleConfirmDeleteAuthTemplate}
        title="Delete Authentication Template"
        message={
          authTemplateToDelete
            ? `Are you sure you want to delete the auth template "${authTemplateToDelete.name}"?\n\nThis will:\n• Remove the template configuration permanently\n• Sites using this template will need to be reconfigured\n• This action cannot be undone`
            : ''
        }
        confirmText="Delete Template"
        cancelText="Cancel"
        variant="danger"
        loading={isDeletingAuthTemplate}
      />
    </div>
  );
};

export default SystemConfiguration;
