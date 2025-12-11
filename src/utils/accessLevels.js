// src/utils/accessLevels.js

/**
 * User Types - Distinguishes between internal Spectra staff and customers
 */
export const UserTypes = {
  INTERNAL: "internal",
  CUSTOMER: "customer",
};

/**
 * Access Levels - Two-tier access scope for customer portal
 * SITE: Single location, full operational control
 * COMPANY: Multiple sites, aggregated view, drill-down capability
 */
export const AccessLevels = {
  SITE: "site",
  COMPANY: "company",
};

/**
 * Customer Portal Roles - 4 roles for customer users
 */
export const Roles = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
  VIEWER: "viewer",
};

/**
 * Internal Portal Roles - 3 roles for Spectra staff
 */
export const InternalRoles = {
  SUPER_ADMIN: "super_admin",
  SUPPORT_ENGINEER: "support_engineer",
  DEPLOYMENT_ENGINEER: "deployment_engineer",
};

/**
 * Permissions Matrix
 *
 * Access Level Hierarchy:
 * COMPANY > SITE
 *
 * Role Hierarchy (highest to lowest):
 * ADMIN > MANAGER > USER > VIEWER
 *
 * SITE level: Full operational control for a single location
 * COMPANY level: Aggregated view-only, can drill down to sites for changes
 *
 * Note: At COMPANY level, editing permissions (canEditUsers, canManageDevices, etc.)
 * only apply when drilled down to a specific site view. The aggregated company view
 * is read-only for all roles.
 */
export const Permissions = {
  // SITE - Single location, full operational control
  [AccessLevels.SITE]: {
    [Roles.ADMIN]: {
      canEditUsers: true,
      canViewReports: true,
      canManageDevices: true,
      canManagePolicies: true,
      canViewAnalytics: true,
      canExportData: true,
      canManageSegments: true,
      canViewMultipleSites: false,
      canManageBilling: false,
      canConfigureSystem: false,
      canManageRoles: true,
      canViewLogs: true,
      canDrillDownToSite: false,
      canEditAtSiteLevel: true,
    },
    [Roles.MANAGER]: {
      canEditUsers: true,
      canViewReports: true,
      canManageDevices: true,
      canManagePolicies: true,
      canViewAnalytics: true,
      canExportData: true,
      canManageSegments: false,
      canViewMultipleSites: false,
      canManageBilling: false,
      canConfigureSystem: false,
      canManageRoles: false,
      canViewLogs: true,
      canDrillDownToSite: false,
      canEditAtSiteLevel: true,
    },
    [Roles.USER]: {
      canEditUsers: false,
      canViewReports: true,
      canManageDevices: false,
      canManagePolicies: false,
      canViewAnalytics: true,
      canExportData: false,
      canManageSegments: false,
      canViewMultipleSites: false,
      canManageBilling: false,
      canConfigureSystem: false,
      canManageRoles: false,
      canViewLogs: false,
      canDrillDownToSite: false,
      canEditAtSiteLevel: false,
    },
    [Roles.VIEWER]: {
      canEditUsers: false,
      canViewReports: true,
      canManageDevices: false,
      canManagePolicies: false,
      canViewAnalytics: true,
      canExportData: false,
      canManageSegments: false,
      canViewMultipleSites: false,
      canManageBilling: false,
      canConfigureSystem: false,
      canManageRoles: false,
      canViewLogs: false,
      canDrillDownToSite: false,
      canEditAtSiteLevel: false,
    },
  },

  // COMPANY - Multiple sites, aggregated view, drill-down capability
  [AccessLevels.COMPANY]: {
    [Roles.ADMIN]: {
      canEditUsers: true, // Only when drilled down to site
      canViewReports: true,
      canManageDevices: true, // Only when drilled down to site
      canManagePolicies: true, // Only when drilled down to site
      canViewAnalytics: true,
      canExportData: true,
      canManageSegments: true, // Only when drilled down to site
      canViewMultipleSites: true,
      canManageBilling: true,
      canConfigureSystem: true,
      canManageRoles: true,
      canViewLogs: true,
      canDrillDownToSite: true,
      canEditAtSiteLevel: true, // Can edit when drilled down
    },
    [Roles.MANAGER]: {
      canEditUsers: true, // Only when drilled down to site
      canViewReports: true,
      canManageDevices: true, // Only when drilled down to site
      canManagePolicies: true, // Only when drilled down to site
      canViewAnalytics: true,
      canExportData: true,
      canManageSegments: false,
      canViewMultipleSites: true,
      canManageBilling: false,
      canConfigureSystem: false,
      canManageRoles: false,
      canViewLogs: true,
      canDrillDownToSite: true,
      canEditAtSiteLevel: true, // Can edit when drilled down
    },
    [Roles.USER]: {
      canEditUsers: false,
      canViewReports: true,
      canManageDevices: false,
      canManagePolicies: false,
      canViewAnalytics: true,
      canExportData: true,
      canManageSegments: false,
      canViewMultipleSites: true,
      canManageBilling: false,
      canConfigureSystem: false,
      canManageRoles: false,
      canViewLogs: false,
      canDrillDownToSite: true,
      canEditAtSiteLevel: false, // View only even when drilled down
    },
    [Roles.VIEWER]: {
      canEditUsers: false,
      canViewReports: true,
      canManageDevices: false,
      canManagePolicies: false,
      canViewAnalytics: true,
      canExportData: false,
      canManageSegments: false,
      canViewMultipleSites: true,
      canManageBilling: false,
      canConfigureSystem: false,
      canManageRoles: false,
      canViewLogs: false,
      canDrillDownToSite: true,
      canEditAtSiteLevel: false, // View only even when drilled down
    },
  },
};

/**
 * Internal Portal Permissions
 *
 * Permissions for Spectra internal staff.
 * Internal users have access to all sites and additional administrative capabilities.
 */
export const InternalPermissions = {
  [InternalRoles.SUPER_ADMIN]: {
    // All customer permissions
    canEditUsers: true,
    canViewReports: true,
    canManageDevices: true,
    canManagePolicies: true,
    canViewAnalytics: true,
    canExportData: true,
    canManageSegments: true,
    canViewMultipleSites: true,
    canManageBilling: true,
    canConfigureSystem: true,
    canManageRoles: true,
    canViewLogs: true,
    // Internal-specific permissions
    canAccessInternalPortal: true,
    canProvisionSites: true,
    canConfigureSites: true,
    canManageAllSites: true,
    canViewAllCustomers: true,
    canManageInternalUsers: true,
    canAccessSystemSettings: true,
    canViewAuditLogs: true,
    canManageLicenses: true,
    canAccessSupportTools: true,
    // Bulk Operations (Super Admin Only)
    canAccessBulkOperations: true,
    canBulkRegisterUsers: true,
    canBulkRegisterDevices: true,
    canBulkActivateUsers: true,
    canBulkSuspendUsers: true,
    canBulkBlockUsers: true,
    canBulkChangePolicies: true,
    canBulkRenameDevices: true,
    canBulkResendPasswords: true,
    canScheduleBulkOperations: true,
    // Device Editing (Super Admin + Support Engineer)
    canEditDeviceMAC: true,
    canEditDeviceCategory: true,
    // Single User Scheduling (Super Admin + Support Engineer)
    canScheduleUserActions: true,
  },
  [InternalRoles.SUPPORT_ENGINEER]: {
    // Limited customer-facing permissions
    canEditUsers: true,
    canViewReports: true,
    canManageDevices: true,
    canManagePolicies: true,
    canViewAnalytics: true,
    canExportData: true,
    canManageSegments: true,
    canViewMultipleSites: true,
    canManageBilling: false,
    canConfigureSystem: false,
    canManageRoles: false,
    canViewLogs: true,
    // Internal-specific permissions
    canAccessInternalPortal: true,
    canProvisionSites: false,
    canConfigureSites: true,
    canManageAllSites: false,
    canViewAllCustomers: true,
    canManageInternalUsers: false,
    canAccessSystemSettings: false,
    canViewAuditLogs: true,
    canManageLicenses: false,
    canAccessSupportTools: true,
    // Bulk Operations (Not Available)
    canAccessBulkOperations: false,
    canBulkRegisterUsers: false,
    canBulkRegisterDevices: false,
    canBulkActivateUsers: false,
    canBulkSuspendUsers: false,
    canBulkBlockUsers: false,
    canBulkChangePolicies: false,
    canBulkRenameDevices: false,
    canBulkResendPasswords: false,
    canScheduleBulkOperations: false,
    // Device Editing (Allowed)
    canEditDeviceMAC: true,
    canEditDeviceCategory: true,
    // Single User Scheduling (Allowed)
    canScheduleUserActions: true,
  },
  [InternalRoles.DEPLOYMENT_ENGINEER]: {
    // Deployment-focused permissions
    canEditUsers: false,
    canViewReports: true,
    canManageDevices: true,
    canManagePolicies: true,
    canViewAnalytics: true,
    canExportData: true,
    canManageSegments: true,
    canViewMultipleSites: true,
    canManageBilling: false,
    canConfigureSystem: true,
    canManageRoles: false,
    canViewLogs: true,
    // Internal-specific permissions
    canAccessInternalPortal: true,
    canProvisionSites: true,
    canConfigureSites: true,
    canManageAllSites: false,
    canViewAllCustomers: true,
    canManageInternalUsers: false,
    canAccessSystemSettings: true,
    canViewAuditLogs: true,
    canManageLicenses: true,
    canAccessSupportTools: false,
    // Bulk Operations (Not Available)
    canAccessBulkOperations: false,
    canBulkRegisterUsers: false,
    canBulkRegisterDevices: false,
    canBulkActivateUsers: false,
    canBulkSuspendUsers: false,
    canBulkBlockUsers: false,
    canBulkChangePolicies: false,
    canBulkRenameDevices: false,
    canBulkResendPasswords: false,
    canScheduleBulkOperations: false,
    // Device Editing (Not Available)
    canEditDeviceMAC: false,
    canEditDeviceCategory: false,
    // Single User Scheduling (Not Available)
    canScheduleUserActions: false,
  },
};

/**
 * Demo credentials for testing different user types and roles
 */
export const DemoCredentials = {
  internal: [
    {
      id: "int_super",
      label: "Super Admin",
      username: "superadmin@spectra.co",
      password: "demo123",
      role: InternalRoles.SUPER_ADMIN,
      displayName: "Rajesh Kumar",
    },
    {
      id: "int_support",
      label: "Support Engineer",
      username: "support@spectra.co",
      password: "demo123",
      role: InternalRoles.SUPPORT_ENGINEER,
      displayName: "Priya Sharma",
    },
    {
      id: "int_deploy",
      label: "Deployment Engineer",
      username: "deployment@spectra.co",
      password: "demo123",
      role: InternalRoles.DEPLOYMENT_ENGINEER,
      displayName: "Amit Patel",
    },
  ],
  customer: [
    // Company Level Users
    {
      id: "cust_company_admin",
      label: "Company Admin",
      username: "company.admin@customer.com",
      password: "demo123",
      role: Roles.ADMIN,
      accessLevel: AccessLevels.COMPANY,
      displayName: "Rahul Kapoor",
      companyId: "COMP_001",
      companyName: "Sample Technologies Pvt Ltd",
    },
    {
      id: "cust_company_manager",
      label: "Company Manager",
      username: "company.manager@customer.com",
      password: "demo123",
      role: Roles.MANAGER,
      accessLevel: AccessLevels.COMPANY,
      displayName: "Meera Reddy",
      companyId: "COMP_001",
      companyName: "Sample Technologies Pvt Ltd",
    },
    {
      id: "cust_company_viewer",
      label: "Company Viewer",
      username: "company.viewer@customer.com",
      password: "demo123",
      role: Roles.VIEWER,
      accessLevel: AccessLevels.COMPANY,
      displayName: "Arun Nair",
      companyId: "COMP_001",
      companyName: "Sample Technologies Pvt Ltd",
    },
    // Site Level Users
    {
      id: "cust_site_admin",
      label: "Site Admin",
      username: "site.admin@customer.com",
      password: "demo123",
      role: Roles.ADMIN,
      accessLevel: AccessLevels.SITE,
      displayName: "Priya Sharma",
      siteId: "SITE-MUM-ENT-001",
      siteName: "Mumbai HQ",
      companyId: "COMP_001",
    },
    {
      id: "cust_site_manager",
      label: "Site Manager",
      username: "site.manager@customer.com",
      password: "demo123",
      role: Roles.MANAGER,
      accessLevel: AccessLevels.SITE,
      displayName: "Neha Singh",
      siteId: "SITE-MUM-ENT-001",
      siteName: "Mumbai HQ",
      companyId: "COMP_001",
    },
    {
      id: "cust_site_user",
      label: "Site User",
      username: "site.user@customer.com",
      password: "demo123",
      role: Roles.USER,
      accessLevel: AccessLevels.SITE,
      displayName: "Vikram Mehta",
      siteId: "SITE-MUM-ENT-001",
      siteName: "Mumbai HQ",
      companyId: "COMP_001",
    },
    {
      id: "cust_site_viewer",
      label: "Site Viewer",
      username: "site.viewer@customer.com",
      password: "demo123",
      role: Roles.VIEWER,
      accessLevel: AccessLevels.SITE,
      displayName: "Anita Desai",
      siteId: "SITE-MUM-ENT-001",
      siteName: "Mumbai HQ",
      companyId: "COMP_001",
    },
  ],
};