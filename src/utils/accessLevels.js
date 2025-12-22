/**
 * ============================================================================
 * Access Levels & Permissions Configuration
 * ============================================================================
 *
 * @file src/utils/accessLevels.js
 * @description Central configuration for Role-Based Access Control (RBAC).
 *              Defines user types, access levels, roles, and the complete
 *              permissions matrix used throughout both portals.
 *
 * @architecture
 * ```
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                    ACCESS CONTROL HIERARCHY                             │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │  UserType                                                               │
 * │  ├── INTERNAL (Spectra Staff)                                          │
 * │  │   └── InternalRoles                                                 │
 * │  │       ├── SUPER_ADMIN (Full access)                                 │
 * │  │       ├── OPERATIONS_MANAGER                                        │
 * │  │       ├── SUPPORT_ENGINEER                                          │
 * │  │       ├── DEPLOYMENT_ENGINEER                                       │
 * │  │       └── SALES_REPRESENTATIVE                                      │
 * │  │                                                                      │
 * │  └── CUSTOMER (Portal Users)                                           │
 * │      ├── AccessLevel                                                   │
 * │      │   ├── COMPANY (Multi-site, aggregated)                         │
 * │      │   └── SITE (Single location)                                   │
 * │      └── Roles                                                         │
 * │          ├── ADMIN (Full control)                                     │
 * │          ├── MANAGER (Limited admin)                                  │
 * │          └── USER (View + limited edit)                               │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @permissionMatrix
 * Customer Portal Permissions (AccessLevel + Role):
 *
 * | Permission      | Company-Admin | Company-Manager | Site-Admin | Site-Manager | User |
 * |-----------------|---------------|-----------------|------------|--------------|------|
 * | canEditUsers    | Drill-down    | Drill-down      | ✓          | ✓            | ✗    |
 * | canViewReports  | ✓             | ✓               | ✓          | ✓            | ✓    |
 * | canManageDevices| Drill-down    | Drill-down      | ✓          | ✓            | ✗    |
 * | canExportData   | ✓             | ✓               | ✓          | ✗            | ✗    |
 * | canViewLogs     | ✓             | ✓               | ✓          | ✓            | ✗    |
 *
 * Note: "Drill-down" means the permission only applies when viewing
 *       a specific site, not in aggregated company view.
 *
 * @companyViewBehavior
 * COMPANY level users have special behavior:
 * - Aggregated view: READ-ONLY across all sites
 * - Must drill down to specific site for editing
 * - canDrillDownToSite permission enables this
 * - Site filter dropdown appears in header
 *
 * @internalPermissions
 * Internal Portal Permissions (by InternalRole):
 *
 * | Permission               | Super Admin | Ops Manager | Support | Deployment |
 * |--------------------------|-------------|-------------|---------|------------|
 * | canAccessInternalPortal  | ✓           | ✓           | ✓       | ✓          |
 * | canProvisionSites        | ✓           | ✓           | ✗       | ✓          |
 * | canAccessBulkOperations  | ✓           | ✗           | ✗       | ✗          |
 * | canViewAsCustomer        | ✓           | ✓           | ✓       | ✗          |
 * | canRotateCredentials     | ✓           | ✓           | ✗       | ✗          |
 *
 * @guestPermissions
 * Guest management permissions (subset):
 * - canViewGuestManagement: See guest list
 * - canManageGuests: Add/edit/delete guests
 * - canExtendGuestStay: Extend check-out dates
 * - canGenerateVouchers: Create WiFi vouchers
 *
 * @usage
 * ```jsx
 * import { Permissions, AccessLevels, Roles } from '@utils/accessLevels';
 *
 * // Get permissions for user
 * const userPerms = Permissions[AccessLevels.SITE][Roles.ADMIN];
 *
 * // Check specific permission
 * if (userPerms.canEditUsers) {
 *   // Show edit button
 * }
 * ```
 *
 * @helperFunctions
 * - getPermissionsForUser(user): Returns combined permission object
 * - hasPermission(user, permission): Check single permission
 * - getDefaultRole(userType): Default role for new users
 *
 * @relatedFiles
 * - AuthContext.js: Uses for login/permission checking
 * - usePermissions.js: Hook wrapper for components
 * - ProtectedRoute.js: Route-level permission guards
 * - Sidebar.js: Menu item visibility
 *
 * ============================================================================
 */

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
  DEMO: "demo",
};

/**
 * Internal Portal Roles - 6 roles for Spectra staff
 */
export const InternalRoles = {
  SUPER_ADMIN: "super_admin",
  OPERATIONS_MANAGER: "operations_manager",
  SUPPORT_ENGINEER: "support_engineer",
  DEPLOYMENT_ENGINEER: "deployment_engineer",
  SALES_REPRESENTATIVE: "sales_representative",
  DEMO_ACCOUNT: "demo_account",
};

/**
 * Permissions Matrix
 *
 * Access Level Hierarchy:
 * COMPANY > SITE
 *
 * Role Hierarchy (highest to lowest):
 * ADMIN > MANAGER > USER
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
      // Guest Management
      canViewGuestManagement: true,
      canManageGuests: true,
      canExtendGuestStay: true,
      // Support
      canViewSupportTickets: true,
      canCreateSupportTickets: true,
      // System
      canManageNotifications: true,
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
      // Guest Management
      canViewGuestManagement: true,
      canManageGuests: true,
      canExtendGuestStay: true,
      // Support
      canViewSupportTickets: true,
      canCreateSupportTickets: true,
      // System
      canManageNotifications: false,
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
      // Guest Management
      canViewGuestManagement: true,
      canManageGuests: false,
      canExtendGuestStay: false,
      // Support
      canViewSupportTickets: true,
      canCreateSupportTickets: true,
      // System
      canManageNotifications: false,
    },
    [Roles.DEMO]: {
      // Demo role - Full access for testing and demonstrations
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
      // Guest Management
      canViewGuestManagement: true,
      canManageGuests: true,
      canExtendGuestStay: true,
      // Support
      canViewSupportTickets: true,
      canCreateSupportTickets: true,
      // System
      canManageNotifications: true,
      isDemoMode: true,
      useSampleDataOnly: true,
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
      // Guest Management
      canViewGuestManagement: true,
      canManageGuests: true,
      canExtendGuestStay: true,
      // Support
      canViewSupportTickets: true,
      canCreateSupportTickets: true,
      // System
      canManageNotifications: true,
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
      // Guest Management
      canViewGuestManagement: true,
      canManageGuests: true,
      canExtendGuestStay: true,
      // Support
      canViewSupportTickets: true,
      canCreateSupportTickets: true,
      // System
      canManageNotifications: false,
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
      // Guest Management
      canViewGuestManagement: true,
      canManageGuests: false,
      canExtendGuestStay: false,
      // Support
      canViewSupportTickets: true,
      canCreateSupportTickets: true,
      // System
      canManageNotifications: false,
    },
    [Roles.DEMO]: {
      // Demo role at COMPANY level - Full access for testing and demonstrations
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
      canDrillDownToSite: true,
      canEditAtSiteLevel: true,
      // Guest Management
      canViewGuestManagement: true,
      canManageGuests: true,
      canExtendGuestStay: true,
      // Support
      canViewSupportTickets: true,
      canCreateSupportTickets: true,
      // System
      canManageNotifications: true,
      isDemoMode: true,
      useSampleDataOnly: true,
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
    // Site Provisioning Queue
    canAccessProvisioningQueue: true,
    // Customer Impersonation
    canImpersonateCustomer: true,
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
    // Site Provisioning Queue (Not Available)
    canAccessProvisioningQueue: false,
    // Customer Impersonation (Allowed for troubleshooting)
    canImpersonateCustomer: true,
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
    // Site Provisioning Queue (Primary Access - This is their main responsibility!)
    canAccessProvisioningQueue: true,
    // Customer Impersonation (Not Available)
    canImpersonateCustomer: false,
  },
  [InternalRoles.OPERATIONS_MANAGER]: {
    // Operations Manager - Oversees daily operations across sites
    canEditUsers: true,
    canViewReports: true,
    canManageDevices: true,
    canManagePolicies: true,
    canViewAnalytics: true,
    canExportData: true,
    canManageSegments: true,
    canViewMultipleSites: true,
    canManageBilling: true,
    canConfigureSystem: false,
    canManageRoles: false,
    canViewLogs: true,
    // Internal-specific permissions
    canAccessInternalPortal: true,
    canProvisionSites: false,
    canConfigureSites: true,
    canManageAllSites: true,
    canViewAllCustomers: true,
    canManageInternalUsers: false,
    canAccessSystemSettings: false,
    canViewAuditLogs: true,
    canManageLicenses: true,
    canAccessSupportTools: true,
    // Bulk Operations (Limited)
    canAccessBulkOperations: true,
    canBulkRegisterUsers: false,
    canBulkRegisterDevices: false,
    canBulkActivateUsers: true,
    canBulkSuspendUsers: true,
    canBulkBlockUsers: false,
    canBulkChangePolicies: true,
    canBulkRenameDevices: false,
    canBulkResendPasswords: true,
    canScheduleBulkOperations: true,
    // Device Editing (Allowed)
    canEditDeviceMAC: true,
    canEditDeviceCategory: true,
    // Single User Scheduling (Allowed)
    canScheduleUserActions: true,
    // Site Provisioning Queue (Allowed)
    canAccessProvisioningQueue: true,
    // Customer Impersonation (Allowed for oversight)
    canImpersonateCustomer: true,
  },
  [InternalRoles.SALES_REPRESENTATIVE]: {
    // Sales Representative - View-only access for demos and customer presentations
    canEditUsers: false,
    canViewReports: true,
    canManageDevices: false,
    canManagePolicies: false,
    canViewAnalytics: true,
    canExportData: true,
    canManageSegments: false,
    canViewMultipleSites: true,
    canManageBilling: true,
    canConfigureSystem: false,
    canManageRoles: false,
    canViewLogs: false,
    // Internal-specific permissions
    canAccessInternalPortal: true,
    canProvisionSites: false,
    canConfigureSites: false,
    canManageAllSites: false,
    canViewAllCustomers: true,
    canManageInternalUsers: false,
    canAccessSystemSettings: false,
    canViewAuditLogs: false,
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
    // Site Provisioning Queue (Not Available)
    canAccessProvisioningQueue: false,
    // Customer Impersonation (Allowed for demos)
    canImpersonateCustomer: true,
  },
  [InternalRoles.DEMO_ACCOUNT]: {
    // Demo Account - Full view access with sample data, persists after go-live
    // This role always shows sample/demo data for training and presentations
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
    canManageInternalUsers: false,
    canAccessSystemSettings: true,
    canViewAuditLogs: true,
    canManageLicenses: true,
    canAccessSupportTools: true,
    // Bulk Operations (Full Access for demo)
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
    // Device Editing (Full Access for demo)
    canEditDeviceMAC: true,
    canEditDeviceCategory: true,
    // Single User Scheduling (Full Access for demo)
    canScheduleUserActions: true,
    // Special Demo Account flag - always use sample data
    isDemoMode: true,
    useSampleDataOnly: true,
    // Site Provisioning Queue (Full Access for demo)
    canAccessProvisioningQueue: true,
    // Customer Impersonation (Full Access for demo)
    canImpersonateCustomer: true,
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
      id: "int_ops_mgr",
      label: "Operations Manager",
      username: "operations@spectra.co",
      password: "demo123",
      role: InternalRoles.OPERATIONS_MANAGER,
      displayName: "Sunita Verma",
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
    {
      id: "int_sales",
      label: "Sales Representative",
      username: "sales@spectra.co",
      password: "demo123",
      role: InternalRoles.SALES_REPRESENTATIVE,
      displayName: "Vikram Singh",
    },
    {
      id: "int_demo",
      label: "Demo Account",
      username: "demo@spectra.co",
      password: "demo123",
      role: InternalRoles.DEMO_ACCOUNT,
      displayName: "Demo User",
      isDemoMode: true,
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
    // Demo Account - Full access for testing customer portal
    {
      id: "cust_demo_company",
      label: "Demo Account (Company)",
      username: "demo@customer.com",
      password: "demo123",
      role: Roles.DEMO,
      accessLevel: AccessLevels.COMPANY,
      displayName: "Demo Customer",
      companyId: "COMP_001",
      companyName: "Sample Technologies Pvt Ltd",
      isDemoMode: true,
    },
    {
      id: "cust_demo_site",
      label: "Demo Account (Site)",
      username: "demo.site@customer.com",
      password: "demo123",
      role: Roles.DEMO,
      accessLevel: AccessLevels.SITE,
      displayName: "Demo Site User",
      siteId: "SITE-MUM-ENT-001",
      siteName: "Mumbai HQ",
      companyId: "COMP_001",
      isDemoMode: true,
    },
  ],
};