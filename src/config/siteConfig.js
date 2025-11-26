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
  segmentSites: {
    enterprise: {
      siteName: "Mumbai Corporate Office",
      siteId: "SITE-MUM-ENT-001",
      location: "Mumbai, Maharashtra",
      address: "Corporate Business Park, Andheri East, Mumbai - 400069",
      policies: [
        { policyId: "ENT_WIFI_10Mbps_50GB_3Devices" },
        { policyId: "ENT_WIFI_25Mbps_100GB_3Devices" },
        { policyId: "ENT_WIFI_50Mbps_200GB_4Devices" },
        { policyId: "ENT_WIFI_50Mbps_Unlimited_3Devices" },
        { policyId: "ENT_WIFI_100Mbps_Unlimited_5Devices" },
        { policyId: "ENT_WIFI_150Mbps_500GB_5Devices" },
        { policyId: "ENT_WIFI_200Mbps_Unlimited_5Devices" }
      ]
    },
    coLiving: {
      siteName: "Urban Living - Bangalore",
      siteId: "SITE-BLR-COL-002",
      location: "Bangalore, Karnataka",
      address: "Koramangala, Bangalore - 560034",
      policies: [
        { policyId: "COL_WIFI_10Mbps_50GB_1Devices" },
        { policyId: "COL_WIFI_15Mbps_75GB_2Devices" },
        { policyId: "COL_WIFI_20Mbps_100GB_3Devices" },
        { policyId: "COL_WIFI_25Mbps_150GB_3Devices" },
        { policyId: "COL_WIFI_30Mbps_200GB_4Devices" },
        { policyId: "COL_WIFI_50Mbps_300GB_5Devices" },
        { policyId: "COL_WIFI_75Mbps_Unlimited_5Devices" }
      ]
    },
    coWorking: {
      siteName: "WorkHub - Pune",
      siteId: "SITE-PUN-COW-003",
      location: "Pune, Maharashtra",
      address: "Hinjewadi IT Park, Pune - 411057",
      policies: [
        { policyId: "COW_WIFI_10Mbps_50GB_1Devices" },
        { policyId: "COW_WIFI_15Mbps_75GB_2Devices" },
        { policyId: "COW_WIFI_20Mbps_100GB_3Devices" },
        { policyId: "COW_WIFI_30Mbps_200GB_4Devices" },
        { policyId: "COW_WIFI_50Mbps_300GB_5Devices" },
        { policyId: "COW_WIFI_75Mbps_500GB_5Devices" },
        { policyId: "COW_WIFI_100Mbps_Unlimited_5Devices" }
      ]
    },
    hotel: {
      siteName: "Grand Hotel - Goa",
      siteId: "SITE-GOA-HTL-004",
      location: "Goa",
      address: "Calangute Beach Road, Goa - 403516",
      policies: [
        { policyId: "HTL_WIFI_10Mbps_5GB_1Devices" },
        { policyId: "HTL_WIFI_15Mbps_10GB_2Devices" },
        { policyId: "HTL_WIFI_20Mbps_Unlimited_3Devices" },
        { policyId: "HTL_WIFI_25Mbps_5GB_2Devices" },
        { policyId: "HTL_WIFI_30Mbps_10GB_3Devices" },
        { policyId: "HTL_WIFI_50Mbps_Unlimited_4Devices" },
        { policyId: "HTL_WIFI_75Mbps_Unlimited_5Devices" }
      ]
    },
    pg: {
      siteName: "PG Residency - Chennai",
      siteId: "SITE-CHN-PGR-005",
      location: "Chennai, Tamil Nadu",
      address: "Adyar, Chennai - 600020",
      policies: [
        { policyId: "PG_WIFI_10Mbps_50GB_1Devices" },
        { policyId: "PG_WIFI_15Mbps_75GB_2Devices" },
        { policyId: "PG_WIFI_20Mbps_100GB_3Devices" },
        { policyId: "PG_WIFI_25Mbps_100GB_4Devices" },
        { policyId: "PG_WIFI_30Mbps_150GB_4Devices" },
        { policyId: "PG_WIFI_40Mbps_200GB_5Devices" },
        { policyId: "PG_WIFI_50Mbps_300GB_5Devices" }
      ]
    },
    miscellaneous: {
      siteName: "Community Hub - Delhi",
      siteId: "SITE-DEL-MIS-006",
      location: "Delhi",
      address: "Connaught Place, New Delhi - 110001",
      // Data cycle type configuration (set during site provisioning)
      // ========================================
      // TODO: Backend Integration - Site Provisioning Configuration
      // ========================================
      // This should be configured during site setup by IT team
      // Backend endpoint: POST /api/sites/{siteId}/configure
      // Payload: { dataCycleType: 'Daily' | 'Monthly' }
      // Store in site_config table and fetch during site load
      // ========================================
      dataCycleType: "Monthly", // Default for demo portal, can be 'Daily' or 'Monthly'
      policies: [
        { policyId: "MIS_WIFI_10Mbps_10GB_1Devices" },
        { policyId: "MIS_WIFI_20Mbps_50GB_3Devices" },
        { policyId: "MIS_WIFI_30Mbps_75GB_3Devices" },
        { policyId: "MIS_WIFI_50Mbps_100GB_4Devices" },
        { policyId: "MIS_WIFI_75Mbps_200GB_5Devices" },
        { policyId: "MIS_WIFI_100Mbps_500GB_5Devices" },
        { policyId: "MIS_WIFI_Unlimited_Unlimited_5Devices" }
      ]
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
      smartphones: 1687,
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

  // ALERTS - Summary counts only (not time-series)
  "alerts-summary-report": [
    { alertType: "Critical", count: 12 },
    { alertType: "Warning", count: 47 },
    { alertType: "Info", count: 156 },
  ],

  // CLUSTER/CITY/COMPANY REPORTS - Static data (no filtering needed)
  "cluster-average-active-users": [
    { cluster: "West Region", totalActiveUsers: 1250, monthlyGrowth: 8.5 },
    { cluster: "East Region", totalActiveUsers: 1420, monthlyGrowth: 12.3 },
    { cluster: "North Region", totalActiveUsers: 980, monthlyGrowth: 6.7 }
  ],

  "cluster-monthly-data-usage": [
    { month: "2024-01", cluster: "West Region", totalUsageGB: 5200, peakUsageGB: 650 },
    { month: "2024-01", cluster: "East Region", totalUsageGB: 6100, peakUsageGB: 780 },
    { month: "2024-01", cluster: "North Region", totalUsageGB: 4300, peakUsageGB: 520 }
  ],

  "city-average-active-users": [
    { city: "Mumbai", totalActiveUsers: 2850, monthlyGrowth: 9.2 },
    { city: "Bangalore", totalActiveUsers: 3200, monthlyGrowth: 11.5 },
    { city: "Delhi", totalActiveUsers: 2650, monthlyGrowth: 7.8 }
  ],

  "city-monthly-data-usage": [
    { month: "2024-01", city: "Mumbai", totalUsageGB: 12500, avgUsageGB: 4.2 },
    { month: "2024-01", city: "Bangalore", totalUsageGB: 14200, avgUsageGB: 4.5 },
    { month: "2024-01", city: "Delhi", totalUsageGB: 11800, avgUsageGB: 4.0 }
  ],

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