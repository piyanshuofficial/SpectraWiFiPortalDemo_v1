// src/config/siteConfig.js

import * as reportGen from '../utils/reportDataGenerator';

const siteConfig = {
  // Default site (can be overridden based on segment)
  siteName: "Mumbai Corporate Office",
  siteId: "SITE-MUM-ENT-001",
  company: "Sample Technologies",
  segment: "Enterprise",
  accessLevel: "Site",
  
  // Segment-specific site configurations
  // bandwidthType: "fixed" - Speed can be any value <= maxBandwidth, data/device options are independent
  // bandwidthType: "userLevel" - Only specific policy combinations are allowed (cascading dropdowns)
  // For userLevel sites: userPolicies (mandatory) and digitalDevicePolicies (optional) are separate
  segmentSites: {
    enterprise: {
      siteName: "Mumbai Corporate Office",
      siteId: "SITE-MUM-ENT-001",
      location: "Mumbai, Maharashtra",
      address: "Corporate Business Park, Andheri East, Mumbai - 400069",
      bandwidthType: "fixed",
      maxBandwidth: 200, // Maximum allowed speed in Mbps
      dataCycleType: "Monthly",
      totalLicenseLimit: 500, // Overall site license limit
      guestAccessEnabled: true, // Enable/disable guest WiFi access management for this site
      digitalDevicePolicies: [
        { policyId: "ENT_DEVICE_50Mbps_Unlimited_1Device_Monthly", name: "Enterprise Digital Device", speed: "50 Mbps", limit: "unlimited", licenseLimit: 100 },
        { policyId: "ENT_DEVICE_100Mbps_Unlimited_1Device_Monthly", name: "Enterprise Digital Device Premium", speed: "100 Mbps", limit: "unlimited", licenseLimit: 50 }
      ]
    },
    office: {
      siteName: "Hyderabad Tech Park",
      siteId: "SITE-HYD-OFF-007",
      location: "Hyderabad, Telangana",
      address: "HITEC City, Madhapur, Hyderabad - 500081",
      bandwidthType: "userLevel",
      dataCycleType: "Monthly",
      totalLicenseLimit: 200,
      guestAccessEnabled: true, // Enable/disable guest WiFi access management for this site
      userPolicies: [
        { policyId: "OFF_WIFI_50Mbps_150GB_3Devices_Monthly", licenseLimit: 200 }
      ],
      digitalDevicePolicies: [
        { policyId: "OFF_DEVICE_25Mbps_Unlimited_1Device_Monthly", name: "Office Digital Device", speed: "25 Mbps", limit: "unlimited", licenseLimit: 40 }
      ]
    },
    coLiving: {
      siteName: "Urban Living - Bangalore",
      siteId: "SITE-BLR-COL-002",
      location: "Bangalore, Karnataka",
      address: "Koramangala, Bangalore - 560034",
      bandwidthType: "userLevel",
      dataCycleType: "Monthly",
      totalLicenseLimit: 300,
      guestAccessEnabled: true, // Enable/disable guest WiFi access management for this site
      userPolicies: [
        { policyId: "COL_WIFI_10Mbps_50GB_1Devices_Monthly", licenseLimit: 100 },
        { policyId: "COL_WIFI_20Mbps_100GB_2Devices_Monthly", licenseLimit: 100 },
        { policyId: "COL_WIFI_30Mbps_150GB_3Devices_Monthly", licenseLimit: 75 },
        { policyId: "COL_WIFI_50Mbps_Unlimited_4Devices_Monthly", licenseLimit: 50 }
      ],
      digitalDevicePolicies: [
        { policyId: "COL_DEVICE_10Mbps_Unlimited_1Device_Monthly", name: "CoLiving Digital Device", speed: "10 Mbps", limit: "unlimited", licenseLimit: 50 }
      ]
    },
    coWorking: {
      siteName: "WorkHub - Pune",
      siteId: "SITE-PUN-COW-003",
      location: "Pune, Maharashtra",
      address: "Hinjewadi IT Park, Pune - 411057",
      bandwidthType: "userLevel",
      dataCycleType: "Daily",
      totalLicenseLimit: 250,
      guestAccessEnabled: true, // Enable/disable guest WiFi access management for this site
      userPolicies: [
        { policyId: "COW_WIFI_15Mbps_5GB_1Devices_Daily", licenseLimit: 80 },
        { policyId: "COW_WIFI_25Mbps_10GB_2Devices_Daily", licenseLimit: 80 },
        { policyId: "COW_WIFI_50Mbps_20GB_3Devices_Daily", licenseLimit: 60 },
        { policyId: "COW_WIFI_100Mbps_Unlimited_5Devices_Daily", licenseLimit: 30 }
      ],
      digitalDevicePolicies: [
        { policyId: "COW_DEVICE_20Mbps_Unlimited_1Device_Daily", name: "CoWorking Digital Device", speed: "20 Mbps", limit: "unlimited", licenseLimit: 30 }
      ]
    },
    hotel: {
      siteName: "Grand Resort Goa",
      siteId: "SITE-GOA-HTL-001",
      location: "Goa",
      address: "Calangute Beach Road, Goa - 403516",
      bandwidthType: "userLevel",
      dataCycleType: "Daily",
      totalLicenseLimit: 400,
      guestAccessEnabled: true, // Enable/disable guest WiFi access management for this site
      userPolicies: [
        { policyId: "HTL_WIFI_10Mbps_2GB_1Devices_Daily", licenseLimit: 200 },
        { policyId: "HTL_WIFI_20Mbps_5GB_2Devices_Daily", licenseLimit: 150 },
        { policyId: "HTL_WIFI_50Mbps_Unlimited_3Devices_Daily", licenseLimit: 50 }
      ],
      digitalDevicePolicies: [
        { policyId: "HTL_DEVICE_10Mbps_Unlimited_1Device_Daily", name: "Hotel Digital Device", speed: "10 Mbps", limit: "unlimited", licenseLimit: 100 }
      ]
    },
    pg: {
      siteName: "PG Residency - Chennai",
      siteId: "SITE-CHN-PGR-005",
      location: "Chennai, Tamil Nadu",
      address: "Adyar, Chennai - 600020",
      bandwidthType: "userLevel",
      dataCycleType: "Monthly",
      totalLicenseLimit: 150,
      guestAccessEnabled: false, // Enable/disable guest WiFi access management for this site
      userPolicies: [
        { policyId: "PG_WIFI_25Mbps_100GB_2Devices_Monthly", licenseLimit: 150 }
      ],
      digitalDevicePolicies: [
        { policyId: "PG_DEVICE_10Mbps_Unlimited_1Device_Monthly", name: "PG Digital Device", speed: "10 Mbps", limit: "unlimited", licenseLimit: 30 }
      ]
    },
    miscellaneous: {
      siteName: "Community Hub - Delhi",
      siteId: "SITE-DEL-MIS-006",
      location: "Delhi",
      address: "Connaught Place, New Delhi - 110001",
      bandwidthType: "fixed",
      maxBandwidth: 100, // Maximum allowed speed in Mbps
      dataCycleType: "Monthly",
      totalLicenseLimit: 200,
      guestAccessEnabled: true // Enable/disable guest WiFi access management for this site
    }
  },
  
  licenses: {
    maxLicenses: 250,
    usedLicenses: 142,
    availableLicenses: 108,
    licenseType: "Active User Licenses",
    lowThreshold: 75,
    criticalThreshold: 90
  },
  
  dashboard: {
    activeUsers: 850,
    totalDevices: 3892,
    avgDataUsage: "152 GB",
    networkUptime: "99.8%",
    quickActions: [
      {
        id: "add-user",
        label: "Add User",
        icon: "UserPlus",
        path: "/users",
        color: "#0066cc",
        permission: "user.create"
      },
      {
        id: "view-reports",
        label: "View Reports",
        icon: "BarChart2",
        path: "/reports",
        color: "#00a86b",
        permission: "reports.view"
      },
      {
        id: "manage-devices",
        label: "Manage Devices",
        icon: "Smartphone",
        path: "/devices",
        color: "#ff6b35",
        permission: "devices.manage"
      },
      {
        id: "view-alerts",
        label: "View Alerts",
        icon: "Bell",
        path: "/alerts",
        color: "#e63946",
        permission: "alerts.view"
      }
    ],
    recentActivities: [
      {
        id: 1,
        text: "New user 'john.doe' registered",
        time: "2 mins ago"
      },
      {
        id: 2,
        text: "Device 'iPhone 13' connected",
        time: "5 mins ago"
      },
      {
        id: 3,
        text: "Monthly report generated",
        time: "15 mins ago"
      },
      {
        id: 4,
        text: "User 'jane.smith' password reset",
        time: "1 hour ago"
      },
      {
        id: 5,
        text: "Network maintenance completed",
        time: "2 hours ago"
      }
    ]
  },
  
  devices: {
    totalDevices: 3892,
    onlineDevices: 2145,
    offlineDevices: 1724,
    blockedDevices: 23,
    accessPoints: 48,
    mobileDevices: 2234,
    laptopDevices: 1658,
    categories: {
      mobile: 1687,
      tablets: 547,
      laptops: 1658,
      iot: 0
    }
  },
  
  users: {
    totalUsers: 850,
    activeUsers: 785,
    inactiveUsers: 45,
    restrictedUsers: 20,
    defaultPolicy: "Standard Access",
    maxDevicesPerUser: 5
  },
  
  network: {
    ssids: ["Spectra-Guest", "Spectra-Staff", "Spectra-Admin"],
    bandwidth: {
      total: "1 Gbps",
      used: "654 Mbps",
      available: "346 Mbps"
    },
    uptime: "99.8%",
    activeConnections: 2145,
    avgSpeed: {
      download: "85 Mbps",
      upload: "42 Mbps"
    }
  },

  // Policies are now defined per segment in segmentSites
  // Policy IDs follow format: {SEGMENT}_WIFI_{SPEED}_{DATA}_{DEVICES}Devices
  // Example: ENT_WIFI_50Mbps_Unlimited_3Devices
  // Policy IDs are NEVER exposed to users - they only see speed, data, and device count

  permissions: {
    "user.create": ["admin", "userManager"],
    "user.edit": ["admin", "userManager"],
    "user.delete": ["admin"],
    "user.view": ["admin", "userManager", "viewer"],
    "devices.manage": ["admin", "networkAdmin"],
    "devices.view": ["admin", "networkAdmin", "viewer"],
    "reports.view": ["admin", "userManager", "networkAdmin", "viewer"],
    "reports.export": ["admin", "userManager", "networkAdmin"],
    "alerts.view": ["admin", "networkAdmin"],
    "alerts.manage": ["admin", "networkAdmin"],
    "settings.manage": ["admin"]
  },

  userRoles: [
    {
      id: "admin",
      name: "Administrator",
      description: "Full system access"
    },
    {
      id: "userManager",
      name: "User Manager",
      description: "Manage users and view reports"
    },
    {
      id: "networkAdmin",
      name: "Network Administrator",
      description: "Manage devices and network settings"
    },
    {
      id: "viewer",
      name: "Viewer",
      description: "Read-only access to data"
    }
  ],

  support: {
    email: "support@spectra.co",
    phone: "+1800 121 5678",
    helpdesk: "https://www.spectra.co",
    documentation: "https://www.spectra.co"
  }
};

// ============================================
// SITE REPORT DATA - Sample Data for Reports
// ============================================

export const siteReportData = {
  // BILLING REPORTS - 12 months of comprehensive data
  "site-monthly-active-users": reportGen.generateMonthlyActiveUsers('2024-01', 12),
  "daily-average-active-users": reportGen.generateDailyActiveUsers('2024-01-01', 90),
  "policy-wise-monthly-average-active-users": reportGen.generatePolicyWiseUsers('2024-01', 12),

  // USAGE REPORTS - 12 months of data
  "monthly-data-usage-summary": reportGen.generateMonthlyDataUsage('2024-01', 12),
  "network-usage-report": reportGen.generateNetworkUsage('2024-01-01', 90),

  // SPEED TIER REPORTS
  "speed-tier-report": [
    { speedTier: "Up to 25 Mbps", userCount: 180 },
    { speedTier: "26-50 Mbps", userCount: 320 },
    { speedTier: "51-100 Mbps", userCount: 250 },
    { speedTier: "Above 100 Mbps", userCount: 100 },
  ],

  // COMPANY REPORTS - Static data (no filtering needed)
  "company-average-active-users": [
    { company: "Sample Technologies", totalActiveUsers: 8700, yearOverYear: 15.2 }
  ],

  "company-monthly-data-usage": [
    { month: "2024-01", company: "Sample Technologies", totalUsageTB: 38.5, yearOverYear: 18.7 }
  ],

  // WI-FI NETWORK REPORTS
  "access-point-list": reportGen.generateAccessPointList(),
  "access-point-mac-list": reportGen.generateAccessPointList().map(ap => ({
    mac: ap.mac,
    apName: ap.apName,
    vendor: Math.random() > 0.5 ? 'Cisco' : 'Aruba'
  })),
  "client-list": reportGen.generateClientList(),
  "user-ap-analytics": reportGen.generateUserAPAnalytics('2024-01-01', 30),
  "rogue-ap-list": reportGen.generateRogueAPList(),
  "alarm-list": reportGen.generateAlarmList('2024-07-01', 30),
  "event-list": reportGen.generateEventList('2024-07-01', 30),

  // INTERNET REPORTS - 90 days of data
  "bandwidth-utilization": reportGen.generateBandwidthUtilization('2024-07-01', 30),
  "internet-uptime": reportGen.generateInternetUptime('2024-01-01', 90),

  // SLA REPORTS - 12 months of data
  "sla-compliance": reportGen.generateSLACompliance('2024-01', 12),

  // AUTHENTICATION REPORTS - 30 days of data
  "authentication-logs": reportGen.generateAuthenticationLogs('2024-07-01', 30),
  "failed-authentication": reportGen.generateFailedAuthentication('2024-07-01', 30),

  // UPSELL REPORTS - 12 months of data
  "addon-usage-report": reportGen.generateAddonUsage('2024-01', 12),
  "topup-history": reportGen.generateTopupHistory('2024-01-01', 90),
  "topup-history-speed": reportGen.generateTopupHistory('2024-01-01', 90, 'speed'),
  "topup-history-data": reportGen.generateTopupHistory('2024-01-01', 90, 'data'),
  "topup-history-device": reportGen.generateTopupHistory('2024-01-01', 90, 'device'),
  "topup-history-plan": reportGen.generateTopupHistory('2024-01-01', 90, 'plan'),

  // GUEST ACCESS REPORTS - Site level
  "guest-access-summary": reportGen.generateGuestAccessSummary('2025-01-01', 31),
  "guest-activity-log": reportGen.generateGuestActivityLog('2025-01-01', 7),
  "guest-voucher-report": reportGen.generateGuestVoucherReport('2025-01-01', 31),
  "guest-type-breakdown": reportGen.generateGuestTypeBreakdown('2025-01', 1),
  "guest-data-usage": reportGen.generateGuestDataUsage('2025-01-01', 31),

  // COMPANY-LEVEL REPORTS
  "company-overview-dashboard": reportGen.generateCompanyOverviewDashboard(),
  "cross-site-usage-comparison": reportGen.generateCrossSiteUsageComparison('2024-01', 6),
  "consolidated-billing-report": reportGen.generateConsolidatedBillingReport('2024-01', 6),
  "company-license-utilization": reportGen.generateCompanyLicenseUtilization(),
  "company-user-distribution": reportGen.generateCompanyUserDistribution('2024-01', 6),
  "company-alerts-summary": reportGen.generateCompanyAlertsSummary('2024-07-01', 31),
  "company-guest-overview": reportGen.generateCompanyGuestOverview('2025-01-01', 31),
  "company-guest-comparison": reportGen.generateCompanyGuestComparison('2025-01', 1),
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getSiteReportData = (reportId) => {
  return siteReportData[reportId] || null;
};

export const isSiteReport = (reportId) => {
  return reportId in siteReportData;
};

export const getSiteReportIds = () => {
  return Object.keys(siteReportData);
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default siteConfig;