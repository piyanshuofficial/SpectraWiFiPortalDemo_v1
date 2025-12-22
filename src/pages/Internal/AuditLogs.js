// src/pages/Internal/AuditLogs.js

import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaHistory,
  FaSearch,
  FaFilter,
  FaDownload,
  FaSyncAlt,
  FaUser,
  FaUserShield,
  FaCog,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaKey,
  FaWifi,
  FaUsers,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaBuilding,
} from "react-icons/fa";
import { activityLogs, customers, sites } from "@constants/internalPortalData";
import Pagination from "@components/Pagination";
import SearchableSelect from "@components/SearchableSelect";
import "./AuditLogs.css";

// Transform activityLogs to include all required fields for audit display
const transformedActivityLogs = activityLogs.map(log => ({
  ...log,
  userType: log.userType || (log.user === "System" ? "internal" : log.userRole?.includes("Admin") || log.userRole?.includes("Engineer") ? "internal" : "customer"),
  category: log.category || "General",
  severity: log.severity || "info",
  status: log.status || "success",
  customerName: log.customerName || customers.find(c => c.id === log.customerId)?.name || null,
  siteName: log.siteName || sites.find(s => s.id === log.siteId)?.name || null,
  resource: log.resource || log.action?.replace(/_/g, " "),
  resourceId: log.resourceId || log.siteId || log.customerId,
}));

// Extended audit log data for comprehensive view
const extendedAuditLogs = [
  ...transformedActivityLogs,
  // Add more detailed audit entries
  {
    id: "audit_001",
    timestamp: "2025-12-19T11:45:00",
    userType: "internal",
    user: "Priya Sharma",
    userRole: "Support Engineer",
    action: "config_change",
    category: "Configuration",
    resource: "Site Settings",
    resourceId: "site_001",
    siteName: "The Oberoi, Mumbai",
    customerName: "Oberoi Hotels & Resorts",
    description: "Updated bandwidth allocation from 500 Mbps to 750 Mbps",
    ipAddress: "192.168.1.105",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_002",
    timestamp: "2025-12-19T11:30:00",
    userType: "customer",
    user: "Rajesh Kumar",
    userRole: "Site Admin",
    action: "user_create",
    category: "User Management",
    resource: "User Account",
    resourceId: "user_5823",
    siteName: "The Oberoi, Mumbai",
    customerName: "Oberoi Hotels & Resorts",
    description: "Created new user account for staff member",
    ipAddress: "10.0.15.42",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_003",
    timestamp: "2025-12-19T11:15:00",
    userType: "internal",
    user: "Vikram Singh",
    userRole: "Deployment Engineer",
    action: "site_provision",
    category: "Site Management",
    resource: "New Site",
    resourceId: "site_new_012",
    siteName: "WeWork BKC",
    customerName: "WeWork India",
    description: "Provisioned new site with 100 user licenses",
    ipAddress: "192.168.1.108",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_004",
    timestamp: "2025-12-19T10:55:00",
    userType: "customer",
    user: "Amit Verma",
    userRole: "Network Admin",
    action: "device_register",
    category: "Device Management",
    resource: "Access Point",
    resourceId: "AP-WW-BKC-015",
    siteName: "WeWork BKC",
    customerName: "WeWork India",
    description: "Registered new access point MAC: 00:1A:2B:3C:4D:5E",
    ipAddress: "10.0.20.15",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_005",
    timestamp: "2025-12-19T10:30:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "alert_trigger",
    category: "Monitoring",
    resource: "Site Health",
    resourceId: "site_003",
    siteName: "Nestaway Koramangala",
    customerName: "Nestaway Technologies",
    description: "High CPU usage detected on controller (85%)",
    ipAddress: null,
    severity: "warning",
    status: "triggered",
  },
  {
    id: "audit_006",
    timestamp: "2025-12-19T10:15:00",
    userType: "customer",
    user: "Sneha Patel",
    userRole: "Admin",
    action: "policy_update",
    category: "Policy Management",
    resource: "Bandwidth Policy",
    resourceId: "pol_bandwidth_02",
    siteName: "Nestaway Koramangala",
    customerName: "Nestaway Technologies",
    description: "Modified fair usage policy limits from 2GB to 5GB daily",
    ipAddress: "10.0.25.30",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_007",
    timestamp: "2025-12-19T09:45:00",
    userType: "internal",
    user: "Anita Desai",
    userRole: "Super Admin",
    action: "license_extend",
    category: "License Management",
    resource: "Customer License",
    resourceId: "lic_cust_003",
    siteName: null,
    customerName: "Nestaway Technologies",
    description: "Extended license validity by 6 months",
    ipAddress: "192.168.1.102",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_008",
    timestamp: "2025-12-19T09:30:00",
    userType: "customer",
    user: "Nikhil Reddy",
    userRole: "Manager",
    action: "login",
    category: "Authentication",
    resource: "User Session",
    resourceId: "session_48572",
    siteName: "Zolo House HSR",
    customerName: "Zolo Stays",
    description: "User login from new device",
    ipAddress: "49.207.52.18",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_009",
    timestamp: "2025-12-19T09:00:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "backup_complete",
    category: "System",
    resource: "Database Backup",
    resourceId: "backup_20251219",
    siteName: null,
    customerName: null,
    description: "Daily backup completed successfully (245 GB)",
    ipAddress: null,
    severity: "info",
    status: "success",
  },
  {
    id: "audit_010",
    timestamp: "2025-12-19T08:45:00",
    userType: "customer",
    user: "Unknown",
    userRole: "N/A",
    action: "login_failed",
    category: "Authentication",
    resource: "User Session",
    resourceId: null,
    siteName: "ITC Grand Chola",
    customerName: "ITC Hotels",
    description: "Failed login attempt - invalid credentials (3 attempts)",
    ipAddress: "103.25.40.112",
    severity: "warning",
    status: "failed",
  },
  {
    id: "audit_011",
    timestamp: "2025-12-19T08:30:00",
    userType: "internal",
    user: "Rahul Mehta",
    userRole: "Support Engineer",
    action: "ticket_resolve",
    category: "Support",
    resource: "Support Ticket",
    resourceId: "TKT-2025-0892",
    siteName: "Awfis Connaught Place",
    customerName: "Awfis Space Solutions",
    description: "Resolved connectivity issue - updated firewall rules",
    ipAddress: "192.168.1.110",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_012",
    timestamp: "2025-12-19T08:15:00",
    userType: "customer",
    user: "Kavita Sharma",
    userRole: "Admin",
    action: "user_delete",
    category: "User Management",
    resource: "User Account",
    resourceId: "user_4521",
    siteName: "Awfis Connaught Place",
    customerName: "Awfis Space Solutions",
    description: "Deleted inactive user account (last login: 90+ days ago)",
    ipAddress: "10.0.30.25",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_013",
    timestamp: "2025-12-19T07:45:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "certificate_expiry",
    category: "Security",
    resource: "SSL Certificate",
    resourceId: "cert_site_007",
    siteName: "Stanza Living Bangalore",
    customerName: "Stanza Living",
    description: "SSL certificate expiring in 15 days - renewal required",
    ipAddress: null,
    severity: "critical",
    status: "pending",
  },
  {
    id: "audit_014",
    timestamp: "2025-12-19T07:30:00",
    userType: "customer",
    user: "Deepak Jain",
    userRole: "Site Admin",
    action: "report_generate",
    category: "Reports",
    resource: "Usage Report",
    resourceId: "rpt_usage_dec_2025",
    siteName: "Stanza Living Bangalore",
    customerName: "Stanza Living",
    description: "Generated monthly usage report for December 2025",
    ipAddress: "10.0.35.18",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_015",
    timestamp: "2025-12-19T07:00:00",
    userType: "internal",
    user: "Vikram Singh",
    userRole: "Deployment Engineer",
    action: "firmware_update",
    category: "Maintenance",
    resource: "Access Points",
    resourceId: "firmware_batch_015",
    siteName: "OYO Rooms Gurgaon",
    customerName: "OYO Rooms",
    description: "Scheduled firmware update for 25 access points",
    ipAddress: "192.168.1.108",
    severity: "info",
    status: "scheduled",
  },
  // Authentication Configuration Audit Entries
  {
    id: "audit_auth_001",
    timestamp: "2025-12-19T14:30:00",
    userType: "internal",
    user: "Priya Sharma",
    userRole: "Support Engineer",
    action: "auth_config_update",
    category: "Auth Configuration",
    resource: "Site Auth Config",
    resourceId: "site_001",
    siteName: "The Oberoi, Mumbai",
    customerName: "Oberoi Hotels & Resorts",
    description: "Updated authentication methods for Room Guests: Added PMS Integration, Removed Voucher Code",
    ipAddress: "192.168.1.105",
    severity: "info",
    status: "success",
    changes: {
      category: "roomGuests",
      added: ["pms_integration"],
      removed: ["voucher_code"]
    }
  },
  {
    id: "audit_auth_002",
    timestamp: "2025-12-19T13:45:00",
    userType: "internal",
    user: "Anita Desai",
    userRole: "Super Admin",
    action: "auth_template_create",
    category: "Auth Configuration",
    resource: "Auth Template",
    resourceId: "auth_tpl_009",
    siteName: null,
    customerName: null,
    description: "Created new authentication template 'Enterprise High Security' for Enterprise segment",
    ipAddress: "192.168.1.102",
    severity: "info",
    status: "success",
    changes: {
      templateName: "Enterprise High Security",
      segment: "enterprise",
      authMethods: {
        users: ["adfs_sso", "otp_rmn"],
        guests: ["voucher_code", "otp_rmn"],
        devices: ["dot1x", "certificate_auth"]
      }
    }
  },
  {
    id: "audit_auth_003",
    timestamp: "2025-12-19T12:20:00",
    userType: "internal",
    user: "Vikram Singh",
    userRole: "Deployment Engineer",
    action: "auth_config_provision",
    category: "Auth Configuration",
    resource: "Site Auth Config",
    resourceId: "site_new_015",
    siteName: "WeWork Cyber Hub",
    customerName: "WeWork India",
    description: "Configured authentication methods during site provisioning: Members (3 methods), Guests (2 methods), Devices (2 methods)",
    ipAddress: "192.168.1.108",
    severity: "info",
    status: "success",
    changes: {
      members: ["username_password", "otp_rmn", "social_login"],
      guests: ["otp_rmn", "captive_portal"],
      devices: ["mac_auth", "wpa2_psk"]
    }
  },
  {
    id: "audit_auth_004",
    timestamp: "2025-12-18T17:00:00",
    userType: "internal",
    user: "Rahul Mehta",
    userRole: "Support Engineer",
    action: "auth_method_disable",
    category: "Auth Configuration",
    resource: "Site Auth Config",
    resourceId: "site_003",
    siteName: "Nestaway Koramangala",
    customerName: "Nestaway Technologies",
    description: "Disabled Social Login authentication method for Guests category due to security review",
    ipAddress: "192.168.1.110",
    severity: "warning",
    status: "success",
    changes: {
      category: "guests",
      disabled: ["social_login"],
      reason: "Security review"
    }
  },
  {
    id: "audit_auth_005",
    timestamp: "2025-12-18T16:15:00",
    userType: "internal",
    user: "Anita Desai",
    userRole: "Super Admin",
    action: "auth_template_update",
    category: "Auth Configuration",
    resource: "Auth Template",
    resourceId: "auth_tpl_002",
    siteName: null,
    customerName: null,
    description: "Updated 'Hotel Guest Experience' template: Added Room Number Validation for Room Guests",
    ipAddress: "192.168.1.102",
    severity: "info",
    status: "success",
    changes: {
      templateName: "Hotel Guest Experience",
      category: "roomGuests",
      added: ["room_number_validation"]
    }
  },
  {
    id: "audit_auth_006",
    timestamp: "2025-12-18T14:30:00",
    userType: "customer",
    user: "Sneha Patel",
    userRole: "Admin",
    action: "auth_config_view",
    category: "Auth Configuration",
    resource: "Site Auth Config",
    resourceId: "site_003",
    siteName: "Nestaway Koramangala",
    customerName: "Nestaway Technologies",
    description: "Viewed authentication configuration for site",
    ipAddress: "10.0.25.30",
    severity: "info",
    status: "success",
  },
  {
    id: "audit_auth_007",
    timestamp: "2025-12-18T08:00:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "auth_config_sync",
    category: "Auth Configuration",
    resource: "Auth Templates",
    resourceId: "sync_batch_001",
    siteName: null,
    customerName: null,
    description: "Synchronized default auth templates to 45 new Enterprise sites",
    ipAddress: null,
    severity: "info",
    status: "success",
    changes: {
      templateId: "auth_tpl_001",
      sitesUpdated: 45
    }
  },
  {
    id: "audit_auth_008",
    timestamp: "2025-12-17T16:45:00",
    userType: "internal",
    user: "Priya Sharma",
    userRole: "Support Engineer",
    action: "auth_config_bulk_update",
    category: "Auth Configuration",
    resource: "Multiple Sites",
    resourceId: "bulk_update_001",
    siteName: null,
    customerName: "Zolo Stays",
    description: "Bulk updated authentication config for 12 Zolo Stays sites: Enabled OTP via RMN for Residents",
    ipAddress: "192.168.1.105",
    severity: "info",
    status: "success",
    changes: {
      sitesAffected: 12,
      category: "residents",
      enabled: ["otp_rmn"]
    }
  },
  {
    id: "audit_auth_009",
    timestamp: "2025-12-17T15:20:00",
    userType: "internal",
    user: "Anita Desai",
    userRole: "Super Admin",
    action: "auth_template_delete",
    category: "Auth Configuration",
    resource: "Auth Template",
    resourceId: "auth_tpl_old_003",
    siteName: null,
    customerName: null,
    description: "Deleted deprecated authentication template 'Legacy PG Basic' - no sites using this template",
    ipAddress: "192.168.1.102",
    severity: "warning",
    status: "success",
    changes: {
      templateName: "Legacy PG Basic",
      reason: "Deprecated - no active sites"
    }
  },
  {
    id: "audit_auth_010",
    timestamp: "2025-12-17T14:00:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "auth_config_validation",
    category: "Auth Configuration",
    resource: "Site Auth Config",
    resourceId: "site_007",
    siteName: "Stanza Living Bangalore",
    customerName: "Stanza Living",
    description: "Auth config validation warning: No authentication methods configured for Guests category",
    ipAddress: null,
    severity: "warning",
    status: "pending",
    changes: {
      category: "guests",
      issue: "No methods configured"
    }
  },
  // Customer View / Impersonation Audit Entries
  {
    id: "audit_impersonation_001",
    timestamp: "2025-12-19T15:30:00",
    userType: "internal",
    user: "Priya Sharma",
    userRole: "Support Engineer",
    action: "customer_impersonation_start",
    category: "Customer View",
    resource: "Customer Portal",
    resourceId: "cust_001",
    siteName: "The Oberoi, Mumbai",
    customerName: "Oberoi Hotels & Resorts",
    description: "Started customer impersonation session to troubleshoot user login issues",
    ipAddress: "192.168.1.105",
    severity: "info",
    status: "success",
    changes: {
      reason: "Troubleshoot user login issues",
      ticketId: "TKT-2025-0912"
    }
  },
  {
    id: "audit_impersonation_002",
    timestamp: "2025-12-19T15:45:00",
    userType: "internal",
    user: "Priya Sharma",
    userRole: "Support Engineer",
    action: "customer_impersonation_end",
    category: "Customer View",
    resource: "Customer Portal",
    resourceId: "cust_001",
    siteName: "The Oberoi, Mumbai",
    customerName: "Oberoi Hotels & Resorts",
    description: "Ended customer impersonation session after resolving the issue",
    ipAddress: "192.168.1.105",
    severity: "info",
    status: "success",
    changes: {
      duration: "15 minutes",
      actionsPerformed: ["Viewed user list", "Checked device status", "Verified policy settings"]
    }
  },
  {
    id: "audit_impersonation_003",
    timestamp: "2025-12-18T10:20:00",
    userType: "internal",
    user: "Rahul Mehta",
    userRole: "Support Engineer",
    action: "customer_impersonation_start",
    category: "Customer View",
    resource: "Customer Portal",
    resourceId: "cust_005",
    siteName: null,
    customerName: "WeWork India",
    description: "Started customer impersonation session for demo and training purposes",
    ipAddress: "192.168.1.110",
    severity: "info",
    status: "success",
    changes: {
      reason: "Customer training session",
      scope: "All sites"
    }
  },
  {
    id: "audit_impersonation_004",
    timestamp: "2025-12-18T11:30:00",
    userType: "internal",
    user: "Rahul Mehta",
    userRole: "Support Engineer",
    action: "customer_impersonation_end",
    category: "Customer View",
    resource: "Customer Portal",
    resourceId: "cust_005",
    siteName: null,
    customerName: "WeWork India",
    description: "Ended customer impersonation session after completing training",
    ipAddress: "192.168.1.110",
    severity: "info",
    status: "success",
    changes: {
      duration: "70 minutes",
      actionsPerformed: ["Dashboard walkthrough", "Reports demo", "User management demo"]
    }
  },
  // Site Provisioning Audit Entries
  {
    id: "audit_provision_001",
    timestamp: "2025-12-19T09:00:00",
    userType: "internal",
    user: "Vikram Singh",
    userRole: "Deployment Engineer",
    action: "provisioning_started",
    category: "Provisioning",
    resource: "New Site",
    resourceId: "site_prov_018",
    siteName: "Marriott Aerocity",
    customerName: "Marriott International",
    description: "Started site provisioning process - 200 user licenses, 15 APs",
    ipAddress: "192.168.1.108",
    severity: "info",
    status: "pending",
    changes: {
      licenses: 200,
      accessPoints: 15,
      segment: "Hotel",
      expectedCompletion: "2025-12-20T18:00:00"
    }
  },
  {
    id: "audit_provision_002",
    timestamp: "2025-12-18T16:00:00",
    userType: "internal",
    user: "Vikram Singh",
    userRole: "Deployment Engineer",
    action: "provisioning_completed",
    category: "Provisioning",
    resource: "New Site",
    resourceId: "site_prov_017",
    siteName: "Hyatt Regency Delhi",
    customerName: "Hyatt Hotels",
    description: "Site provisioning completed successfully - All tests passed",
    ipAddress: "192.168.1.108",
    severity: "info",
    status: "success",
    changes: {
      licenses: 150,
      accessPoints: 12,
      testsPassed: ["WiFi Connectivity", "Internet Access", "User Auth", "Bandwidth Test"],
      configurationTime: "4 hours 30 minutes"
    }
  },
  {
    id: "audit_provision_003",
    timestamp: "2025-12-17T14:30:00",
    userType: "internal",
    user: "Vikram Singh",
    userRole: "Deployment Engineer",
    action: "provisioning_failed",
    category: "Provisioning",
    resource: "New Site",
    resourceId: "site_prov_016",
    siteName: "Radisson Blu Noida",
    customerName: "Radisson Hotel Group",
    description: "Site provisioning failed - Network connectivity test failed",
    ipAddress: "192.168.1.108",
    severity: "critical",
    status: "failed",
    changes: {
      failedStep: "Network Connectivity Test",
      errorCode: "CONN_TIMEOUT",
      errorMessage: "Unable to reach controller after 3 attempts",
      retryScheduled: "2025-12-18T09:00:00"
    }
  },
  {
    id: "audit_provision_004",
    timestamp: "2025-12-18T17:30:00",
    userType: "internal",
    user: "Vikram Singh",
    userRole: "Deployment Engineer",
    action: "rfs_confirmed",
    category: "Provisioning",
    resource: "Site Activation",
    resourceId: "site_prov_017",
    siteName: "Hyatt Regency Delhi",
    customerName: "Hyatt Hotels",
    description: "Ready For Service confirmed - Site activated for production use",
    ipAddress: "192.168.1.108",
    severity: "info",
    status: "success",
    changes: {
      activationDate: "2025-12-18T17:30:00",
      activatedBy: "Vikram Singh",
      welcomeEmailSent: true,
      credentialsEmailSent: true
    }
  },
  {
    id: "audit_provision_005",
    timestamp: "2025-12-16T11:00:00",
    userType: "internal",
    user: "Anita Desai",
    userRole: "Super Admin",
    action: "rfs_confirmed",
    category: "Provisioning",
    resource: "Site Activation",
    resourceId: "site_prov_015",
    siteName: "CoHo Living Bangalore",
    customerName: "CoHo.in",
    description: "Ready For Service confirmed with backdated activation (installation completed earlier)",
    ipAddress: "192.168.1.102",
    severity: "info",
    status: "success",
    changes: {
      activationDate: "2025-12-15T10:00:00",
      requestedActivationDate: "2025-12-15T10:00:00",
      reason: "Site was operational before portal configuration",
      activatedBy: "Anita Desai"
    }
  },
  // Site Suspension/Block Audit Entries
  {
    id: "audit_suspend_001",
    timestamp: "2025-12-19T08:00:00",
    userType: "internal",
    user: "Anita Desai",
    userRole: "Super Admin",
    action: "site_suspended",
    category: "Suspension/Block",
    resource: "Site Status",
    resourceId: "site_012",
    siteName: "PayingGuest HSR Layout",
    customerName: "PG Stays India",
    description: "Site suspended due to payment overdue (60+ days)",
    ipAddress: "192.168.1.102",
    severity: "warning",
    status: "success",
    changes: {
      reason: "Payment overdue",
      overdueAmount: "₹45,000",
      overdueDays: 65,
      serviceAffected: "User authentication disabled",
      reactivationCondition: "Full payment clearance"
    }
  },
  {
    id: "audit_suspend_002",
    timestamp: "2025-12-15T14:00:00",
    userType: "internal",
    user: "Anita Desai",
    userRole: "Super Admin",
    action: "site_blocked",
    category: "Suspension/Block",
    resource: "Site Status",
    resourceId: "site_025",
    siteName: "Budget Stay Andheri",
    customerName: "Budget Stays Pvt Ltd",
    description: "Site permanently blocked - Contract terminated by customer",
    ipAddress: "192.168.1.102",
    severity: "critical",
    status: "success",
    changes: {
      reason: "Contract termination",
      terminationType: "Customer requested",
      effectiveDate: "2025-12-15",
      dataRetention: "90 days",
      equipmentReturn: "Scheduled for 2025-12-22"
    }
  },
  {
    id: "audit_suspend_003",
    timestamp: "2025-12-17T16:30:00",
    userType: "internal",
    user: "Anita Desai",
    userRole: "Super Admin",
    action: "site_reactivated",
    category: "Suspension/Block",
    resource: "Site Status",
    resourceId: "site_019",
    siteName: "Student Living Pune",
    customerName: "EduStay Solutions",
    description: "Site reactivated after payment clearance",
    ipAddress: "192.168.1.102",
    severity: "info",
    status: "success",
    changes: {
      previousStatus: "Suspended",
      reason: "Payment received",
      paymentAmount: "₹32,500",
      paymentReference: "PAY-2025-78542",
      downtime: "5 days"
    }
  },
  {
    id: "audit_suspend_004",
    timestamp: "2025-12-10T09:00:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "site_suspended",
    category: "Suspension/Block",
    resource: "Site Status",
    resourceId: "site_022",
    siteName: "Guest House Whitefield",
    customerName: "Tech Park Stays",
    description: "Automatic site suspension triggered - Payment overdue threshold exceeded",
    ipAddress: null,
    severity: "warning",
    status: "success",
    changes: {
      triggerRule: "Auto-suspend after 45 days overdue",
      overdueAmount: "₹28,000",
      overdueDays: 47,
      notificationsSent: 3,
      escalationEmail: "finance@techparkstays.com"
    }
  },
  // SLA Audit Entries
  {
    id: "audit_sla_001",
    timestamp: "2025-12-19T06:00:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "sla_breach_detected",
    category: "SLA",
    resource: "Service Level",
    resourceId: "sla_breach_2025_042",
    siteName: "The Oberoi, Mumbai",
    customerName: "Oberoi Hotels & Resorts",
    description: "SLA breach detected - Network uptime fell below 99.9% threshold",
    ipAddress: null,
    severity: "critical",
    status: "triggered",
    changes: {
      metric: "Network Uptime",
      threshold: "99.9%",
      actual: "98.7%",
      downtime: "78 minutes",
      incidentPeriod: "2025-12-18 22:00 to 2025-12-19 00:18",
      creditDue: "5% monthly bill"
    }
  },
  {
    id: "audit_sla_002",
    timestamp: "2025-12-18T14:00:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "sla_warning",
    category: "SLA",
    resource: "Service Level",
    resourceId: "sla_warn_2025_089",
    siteName: "WeWork BKC",
    customerName: "WeWork India",
    description: "SLA warning - Response time approaching threshold limit",
    ipAddress: null,
    severity: "warning",
    status: "triggered",
    changes: {
      metric: "Average Response Time",
      threshold: "50ms",
      current: "45ms",
      trend: "Increasing",
      recommendation: "Review network load and optimize routing"
    }
  },
  {
    id: "audit_sla_003",
    timestamp: "2025-12-01T00:05:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "sla_report_generated",
    category: "SLA",
    resource: "SLA Report",
    resourceId: "sla_rpt_nov_2025",
    siteName: null,
    customerName: null,
    description: "Monthly SLA report generated for November 2025 - 245 customers",
    ipAddress: null,
    severity: "info",
    status: "success",
    changes: {
      reportPeriod: "November 2025",
      customersIncluded: 245,
      sitesIncluded: 892,
      overallCompliance: "99.2%",
      breachCount: 12,
      creditsDue: "₹1,45,000"
    }
  },
  {
    id: "audit_sla_004",
    timestamp: "2025-12-15T10:30:00",
    userType: "internal",
    user: "Anita Desai",
    userRole: "Super Admin",
    action: "sla_report_generated",
    category: "SLA",
    resource: "SLA Report",
    resourceId: "sla_rpt_cust_003",
    siteName: null,
    customerName: "Nestaway Technologies",
    description: "Custom SLA report generated for Nestaway Technologies Q4 2025",
    ipAddress: "192.168.1.102",
    severity: "info",
    status: "success",
    changes: {
      reportType: "Quarterly",
      period: "Q4 2025 (Oct-Dec)",
      sitesIncluded: 45,
      avgUptime: "99.85%",
      breachCount: 2,
      exportFormat: "PDF"
    }
  },
  // Communication Audit Entries
  {
    id: "audit_comm_001",
    timestamp: "2025-12-18T17:35:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "welcome_email_triggered",
    category: "Communication",
    resource: "Email",
    resourceId: "email_welcome_017",
    siteName: "Hyatt Regency Delhi",
    customerName: "Hyatt Hotels",
    description: "Welcome email triggered for new site activation",
    ipAddress: null,
    severity: "info",
    status: "success",
    changes: {
      emailType: "Welcome Email",
      recipients: ["it.manager@hyatt.com", "ops.head@hyatt.com"],
      templateUsed: "Hotel Welcome Template",
      attachments: ["Portal Access Guide", "Quick Start Guide"],
      deliveryStatus: "Delivered"
    }
  },
  {
    id: "audit_comm_002",
    timestamp: "2025-12-16T11:05:00",
    userType: "internal",
    user: "System",
    userRole: "Automated",
    action: "welcome_email_triggered",
    category: "Communication",
    resource: "Email",
    resourceId: "email_welcome_015",
    siteName: "CoHo Living Bangalore",
    customerName: "CoHo.in",
    description: "Welcome email with portal credentials sent to site administrator",
    ipAddress: null,
    severity: "info",
    status: "success",
    changes: {
      emailType: "Welcome + Credentials",
      recipients: ["admin@coho.in"],
      templateUsed: "Co-Living Welcome Template",
      portalURL: "https://portal.spectra.co",
      credentialsIncluded: true
    }
  },
  {
    id: "audit_comm_003",
    timestamp: "2025-12-19T09:15:00",
    userType: "internal",
    user: "Vikram Singh",
    userRole: "Deployment Engineer",
    action: "welcome_email_triggered",
    category: "Communication",
    resource: "Email",
    resourceId: "email_welcome_018",
    siteName: "Marriott Aerocity",
    customerName: "Marriott International",
    description: "Manual welcome email trigger requested during provisioning",
    ipAddress: "192.168.1.108",
    severity: "info",
    status: "pending",
    changes: {
      emailType: "Welcome Email",
      recipients: ["it.head@marriott.com", "wifi.admin@marriott.com"],
      scheduledFor: "After RFS confirmation",
      templateUsed: "Hotel Premium Welcome Template"
    }
  },
];

/**
 * Audit Logs Component
 * Comprehensive audit trail for both customer and internal activities
 */
const AuditLogs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(searchParams.get("customer") || "All");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [activeStatCard, setActiveStatCard] = useState(null); // Track active stat card filter
  const [statusFilter, setStatusFilter] = useState("All"); // For failed status filter

  // Filter options
  const userTypeOptions = ["All", "internal", "customer"];
  const categoryOptions = ["All", "Authentication", "Auth Configuration", "User Management", "Device Management", "Configuration", "Site Management", "Policy Management", "License Management", "Support", "Monitoring", "System", "Security", "Reports", "Maintenance"];
  const severityOptions = ["All", "info", "warning", "critical"];
  const customerFilterOptions = useMemo(() =>
    customers.map(c => ({
      value: c.name,
      label: c.name,
      type: c.type,
    })),
    []
  );
  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
    { value: "all", label: "All Time" },
  ];

  // Filter logs
  const filteredLogs = useMemo(() => {
    return extendedAuditLogs.filter((log) => {
      const matchesSearch =
        log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resourceId?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUserType =
        selectedUserType === "All" || log.userType === selectedUserType;

      const matchesCategory =
        selectedCategory === "All" || log.category === selectedCategory;

      const matchesSeverity =
        selectedSeverity === "All" || log.severity === selectedSeverity;

      const matchesCustomer =
        selectedCustomer === "All" || log.customerName === selectedCustomer;

      const matchesStatus =
        statusFilter === "All" || log.status === statusFilter;

      // Date filtering
      const logDate = new Date(log.timestamp);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 30);

      let matchesDate = true;
      switch (selectedDateRange) {
        case "today":
          matchesDate = logDate >= today;
          break;
        case "yesterday":
          matchesDate = logDate >= yesterday && logDate < today;
          break;
        case "week":
          matchesDate = logDate >= weekAgo;
          break;
        case "month":
          matchesDate = logDate >= monthAgo;
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesUserType && matchesCategory && matchesSeverity && matchesCustomer && matchesDate && matchesStatus;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [searchQuery, selectedUserType, selectedCategory, selectedSeverity, selectedCustomer, selectedDateRange, statusFilter]);

  // Pagination
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredLogs.slice(start, start + rowsPerPage);
  }, [filteredLogs, currentPage, rowsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedUserType, selectedCategory, selectedSeverity, selectedCustomer, selectedDateRange, statusFilter]);

  // Get action icon
  const getActionIcon = (action) => {
    switch (action) {
      case "login":
        return <FaSignInAlt />;
      case "logout":
        return <FaSignOutAlt />;
      case "login_failed":
        return <FaExclamationTriangle />;
      case "user_create":
      case "site_provision":
        return <FaPlus />;
      case "user_delete":
        return <FaTrash />;
      case "config_change":
      case "policy_update":
        return <FaEdit />;
      case "device_register":
        return <FaWifi />;
      case "alert_trigger":
        return <FaExclamationTriangle />;
      case "license_extend":
        return <FaKey />;
      case "backup_complete":
      case "firmware_update":
        return <FaCog />;
      case "ticket_resolve":
        return <FaCheckCircle />;
      case "certificate_expiry":
        return <FaExclamationTriangle />;
      case "report_generate":
        return <FaHistory />;
      // Auth Configuration actions
      case "auth_config_update":
      case "auth_config_provision":
      case "auth_config_bulk_update":
      case "auth_config_sync":
      case "auth_template_update":
        return <FaKey />;
      case "auth_template_create":
        return <FaPlus />;
      case "auth_template_delete":
        return <FaTrash />;
      case "auth_method_disable":
      case "auth_config_validation":
        return <FaExclamationTriangle />;
      case "auth_config_view":
        return <FaInfoCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  // Get severity badge class
  const getSeverityClass = (severity) => {
    switch (severity) {
      case "critical":
        return "severity-critical";
      case "warning":
        return "severity-warning";
      default:
        return "severity-info";
    }
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case "success":
        return "status-success";
      case "failed":
        return "status-failed";
      case "pending":
      case "scheduled":
        return "status-pending";
      case "triggered":
        return "status-warning";
      default:
        return "";
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedUserType("All");
    setSelectedCategory("All");
    setSelectedSeverity("All");
    setSelectedCustomer("All");
    setSelectedDateRange("all");
    setSearchQuery("");
    setCurrentPage(1);
    setActiveStatCard(null);
    setStatusFilter("All");
  };

  // Handle stat card click for filtering
  const handleStatCardClick = (cardType) => {
    // If clicking the same card, toggle off (clear filters)
    if (activeStatCard === cardType) {
      clearFilters();
      return;
    }

    // Reset filters first
    setSelectedUserType("All");
    setSelectedSeverity("All");
    setStatusFilter("All");
    setCurrentPage(1);
    setActiveStatCard(cardType);

    // Apply specific filter based on card type
    switch (cardType) {
      case "total":
        // Show all events - no specific filter needed
        break;
      case "critical":
        setSelectedSeverity("critical");
        break;
      case "warnings":
        setSelectedSeverity("warning");
        break;
      case "internal":
        setSelectedUserType("internal");
        break;
      case "customer":
        setSelectedUserType("customer");
        break;
      case "failed":
        setStatusFilter("failed");
        break;
      default:
        break;
    }
  };

  // Summary stats
  const summaryStats = useMemo(() => {
    const total = filteredLogs.length;
    const critical = filteredLogs.filter(l => l.severity === "critical").length;
    const warnings = filteredLogs.filter(l => l.severity === "warning").length;
    const internal = filteredLogs.filter(l => l.userType === "internal").length;
    const customer = filteredLogs.filter(l => l.userType === "customer").length;
    const failed = filteredLogs.filter(l => l.status === "failed").length;

    return { total, critical, warnings, internal, customer, failed };
  }, [filteredLogs]);

  return (
    <div className="audit-logs">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1>
              <FaHistory className="page-title-icon" /> Audit Logs
            </h1>
            <p className="page-subtitle">Comprehensive activity trail for platform operations</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-outline" onClick={() => console.log("Refresh")}>
              <FaSyncAlt /> Refresh
            </button>
            <button className="btn btn-outline" onClick={() => console.log("Export")}>
              <FaDownload /> Export Logs
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div
          className={`summary-stat clickable ${activeStatCard === "total" ? "active" : ""}`}
          onClick={() => handleStatCardClick("total")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("total")}
        >
          <span className="stat-number">{summaryStats.total}</span>
          <span className="stat-label">Total Events</span>
        </div>
        <div
          className={`summary-stat critical clickable ${activeStatCard === "critical" ? "active" : ""}`}
          onClick={() => handleStatCardClick("critical")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("critical")}
        >
          <span className="stat-number">{summaryStats.critical}</span>
          <span className="stat-label">Critical</span>
        </div>
        <div
          className={`summary-stat warning clickable ${activeStatCard === "warnings" ? "active" : ""}`}
          onClick={() => handleStatCardClick("warnings")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("warnings")}
        >
          <span className="stat-number">{summaryStats.warnings}</span>
          <span className="stat-label">Warnings</span>
        </div>
        <div
          className={`summary-stat clickable ${activeStatCard === "internal" ? "active" : ""}`}
          onClick={() => handleStatCardClick("internal")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("internal")}
        >
          <span className="stat-number">{summaryStats.internal}</span>
          <span className="stat-label">Internal</span>
        </div>
        <div
          className={`summary-stat clickable ${activeStatCard === "customer" ? "active" : ""}`}
          onClick={() => handleStatCardClick("customer")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("customer")}
        >
          <span className="stat-number">{summaryStats.customer}</span>
          <span className="stat-label">Customer</span>
        </div>
        <div
          className={`summary-stat failed clickable ${activeStatCard === "failed" ? "active" : ""}`}
          onClick={() => handleStatCardClick("failed")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("failed")}
        >
          <span className="stat-number">{summaryStats.failed}</span>
          <span className="stat-label">Failed</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <div className="search-row">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by user, action, description, or resource ID..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="search-input"
            />
          </div>
          <div className="search-actions">
            <button
              className={`btn btn-outline filter-toggle ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filters-row">
            <div className="filter-group">
              <label>Date Range</label>
              <select
                value={selectedDateRange}
                onChange={(e) => { setSelectedDateRange(e.target.value); setCurrentPage(1); }}
              >
                {dateRangeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>User Type</label>
              <select
                value={selectedUserType}
                onChange={(e) => { setSelectedUserType(e.target.value); setCurrentPage(1); }}
              >
                {userTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All" ? "All" : opt === "internal" ? "Internal Staff" : "Customer Users"}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              >
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Severity</label>
              <select
                value={selectedSeverity}
                onChange={(e) => { setSelectedSeverity(e.target.value); setCurrentPage(1); }}
              >
                {severityOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group searchable-filter">
              <label>Customer</label>
              <SearchableSelect
                options={customerFilterOptions}
                value={selectedCustomer === "All" ? "" : selectedCustomer}
                onChange={(val) => { setSelectedCustomer(val || "All"); setCurrentPage(1); }}
                placeholder="All Customers"
                searchPlaceholder="Search customers..."
                getOptionLabel={(opt) => opt.label}
                getOptionValue={(opt) => opt.value}
                emptyOption={{ label: "All Customers", value: "" }}
                size="small"
              />
            </div>
            <button className="btn btn-text" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Category</th>
              <th>Description</th>
              <th>Customer / Site</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  <FaHistory className="empty-icon" />
                  <p>No audit logs found matching your filters</p>
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => {
                const { date, time } = formatTimestamp(log.timestamp);
                return (
                  <tr key={log.id} className={`severity-row-${log.severity}`}>
                    <td className="timestamp-cell">
                      <span className="date">{date}</span>
                      <span className="time">{time}</span>
                    </td>
                    <td className="user-cell">
                      <div className="user-info">
                        <span className={`user-type-badge ${log.userType}`}>
                          {log.userType === "internal" ? <FaUserShield /> : <FaUser />}
                        </span>
                        <div className="user-details">
                          <span className="user-name">{log.user}</span>
                          <span className="user-role">{log.userRole}</span>
                        </div>
                      </div>
                    </td>
                    <td className="action-cell">
                      <span className="action-icon">{getActionIcon(log.action)}</span>
                      <span className="action-name">{log.action.replace(/_/g, " ")}</span>
                    </td>
                    <td>
                      <span className="category-badge">{log.category}</span>
                    </td>
                    <td className="description-cell">
                      <span className="description">{log.description}</span>
                      {log.ipAddress && <span className="ip-address">IP: {log.ipAddress}</span>}
                    </td>
                    <td className="location-cell">
                      {log.customerName && (
                        <span className="customer-name">
                          <FaBuilding /> {log.customerName}
                        </span>
                      )}
                      {log.siteName && (
                        <span className="site-name">
                          <FaMapMarkerAlt /> {log.siteName}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`severity-badge ${getSeverityClass(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="pagination-wrapper">
          <Pagination
            totalItems={filteredLogs.length}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(newRows) => {
              setRowsPerPage(newRows);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
