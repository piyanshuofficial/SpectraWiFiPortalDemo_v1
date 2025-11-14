// src/constants/siteSampleData.js

/**
 * Centralized Site Sample Data
 * 
 * This is the SINGLE source of truth for all site-level data.
 * Consolidates data from:
 * - siteConfig.js (site configuration, policies, permissions)
 * - sampleReportsData.js (site-level report data)
 * - enhancedSampleReports.js metadata (kept separate)
 * 
 * This file REPLACES:
 * - siteConfig.js
 * - sampleReportsData.js (site reports only)
 */

// ============================================
// SITE CONFIGURATION
// (Migrated from siteConfig.js - EXACT structure preserved)
// ============================================

export const siteConfig = {
  // Default site (can be overridden based on segment)
  siteName: "Mumbai Corporate Office",
  siteId: "SITE-MUM-ENT-001",
  company: "Spectra Technologies",
  segment: "Enterprise",
  accessLevel: "Site",
  
  // Segment-specific site configurations
  segmentSites: {
    enterprise: {
      siteName: "Mumbai Corporate Office",
      siteId: "SITE-MUM-ENT-001",
      location: "Mumbai, Maharashtra",
      address: "Spectra Business Park, Andheri East, Mumbai - 400069"
    },
    coLiving: {
      siteName: "Spectra Urban Living - Bangalore",
      siteId: "SITE-BLR-COL-002",
      location: "Bangalore, Karnataka",
      address: "Koramangala, Bangalore - 560034"
    },
    coWorking: {
      siteName: "Spectra WorkHub - Pune",
      siteId: "SITE-PUN-COW-003",
      location: "Pune, Maharashtra",
      address: "Hinjewadi IT Park, Pune - 411057"
    },
    hotel: {
      siteName: "Spectra Grand Hotel - Goa",
      siteId: "SITE-GOA-HTL-004",
      location: "Goa",
      address: "Calangute Beach Road, Goa - 403516"
    },
    pg: {
      siteName: "Spectra PG Residency - Chennai",
      siteId: "SITE-CHN-PGR-005",
      location: "Chennai, Tamil Nadu",
      address: "Adyar, Chennai - 600020"
    },
    miscellaneous: {
      siteName: "Spectra Community Hub - Delhi",
      siteId: "SITE-DEL-MIS-006",
      location: "Delhi",
      address: "Connaught Place, New Delhi - 110001"
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

  policies: [
    {
      id: "standard",
      name: "Standard Access",
      speed: "50 Mbps",
      dataLimit: "Unlimited",
      maxDevices: 3,
      duration: "Unlimited"
    },
    {
      id: "premium",
      name: "Premium Access",
      speed: "100 Mbps",
      dataLimit: "Unlimited",
      maxDevices: 5,
      duration: "Unlimited"
    },
    {
      id: "basic",
      name: "Basic Access",
      speed: "25 Mbps",
      dataLimit: "50 GB/month",
      maxDevices: 2,
      duration: "30 days"
    },
    {
      id: "guest",
      name: "Guest Access",
      speed: "10 Mbps",
      dataLimit: "5 GB/day",
      maxDevices: 1,
      duration: "24 hours"
    }
  ],

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
// SITE METRICS
// ============================================

export const siteMetrics = {
  activeUsers: 850,
  totalDevices: 3892,
  onlineDevices: 2145,
  offlineDevices: 1724,
  blockedDevices: 23,
  accessPoints: 48,
  dataUsageTB: 1.2,
  licenseUsagePercent: 57,
  currentAlerts: 0,
  networkUptime: "99.8%",
  avgDataUsage: "152 GB"
};

// ============================================
// SITE REPORT DATA
// (Migrated from sampleReportsData.js - EXACT data preserved)
// ============================================

export const siteReportData = {
  // Original reports from sampleReportsData.js - EXACT structure
  "site-monthly-active-users": [
    {
      month: "2024-01",
      avgActiveUsers: 120,
      newUsers: 15,
      churnedUsers: 8,
      activations: 22,
      deactivations: 10,
      changeFromPrevMonth: 5,
    },
    {
      month: "2024-02",
      avgActiveUsers: 127,
      newUsers: 18,
      churnedUsers: 7,
      activations: 17,
      deactivations: 8,
      changeFromPrevMonth: 7,
    },
  ],
  
  "monthly-data-usage-summary": [
    { month: "2024-01", totalUsageGB: 1200, peakUsageGB: 150, avgUsageGB: 40 },
    { month: "2024-02", totalUsageGB: 1300, peakUsageGB: 170, avgUsageGB: 43 },
  ],
  
  "daily-average-active-users": [
    { date: "2024-07-01", avgActiveUsers: 350 },
    { date: "2024-07-02", avgActiveUsers: 360 },
  ],
  
  "policy-wise-monthly-average-active-users": [
    { month: "2024-01", policy: "Policy A", avgActiveUsers: 120 },
    { month: "2024-01", policy: "Policy B", avgActiveUsers: 80 },
  ],

  "network-usage-report": [
    { day: "Mon", usageGB: 120 },
    { day: "Tue", usageGB: 200 },
    { day: "Wed", usageGB: 170 },
    { day: "Thu", usageGB: 250 },
    { day: "Fri", usageGB: 220 },
    { day: "Sat", usageGB: 300 },
    { day: "Sun", usageGB: 280 },
  ],

  "license-usage-report": [
    { licenseType: "License A", usageCount: 65 },
    { licenseType: "License B", usageCount: 59 },
    { licenseType: "License C", usageCount: 80 },
    { licenseType: "License D", usageCount: 81 },
  ],

  "alerts-summary-report": [
    { alertType: "Success", count: 300 },
    { alertType: "Warning", count: 50 },
    { alertType: "Critical", count: 100 },
  ],

  // Additional site-level reports (expanded data)
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
    { company: "Spectra Technologies", totalActiveUsers: 8700, yearOverYear: 15.2 }
  ],

  "company-monthly-data-usage": [
    { month: "2024-01", company: "Spectra Technologies", totalUsageTB: 38.5, yearOverYear: 18.7 }
  ],

  "access-point-list": [
    { apName: "AP-Floor1-01", mac: "00:1A:2B:3C:4D:01", location: "Floor 1 - Lobby", status: "Online", connectedUsers: 45 },
    { apName: "AP-Floor1-02", mac: "00:1A:2B:3C:4D:02", location: "Floor 1 - Conference Room", status: "Online", connectedUsers: 32 },
    { apName: "AP-Floor2-01", mac: "00:1A:2B:3C:4D:03", location: "Floor 2 - East Wing", status: "Online", connectedUsers: 38 },
    { apName: "AP-Floor2-02", mac: "00:1A:2B:3C:4D:04", location: "Floor 2 - West Wing", status: "Online", connectedUsers: 41 },
    { apName: "AP-Floor3-01", mac: "00:1A:2B:3C:4D:05", location: "Floor 3 - Cafeteria", status: "Offline", connectedUsers: 0 }
  ],

  "access-point-mac-list": [
    { mac: "00:1A:2B:3C:4D:01", apName: "AP-Floor1-01", vendor: "Cisco" },
    { mac: "00:1A:2B:3C:4D:02", apName: "AP-Floor1-02", vendor: "Cisco" },
    { mac: "00:1A:2B:3C:4D:03", apName: "AP-Floor2-01", vendor: "Aruba" },
    { mac: "00:1A:2B:3C:4D:04", apName: "AP-Floor2-02", vendor: "Aruba" },
    { mac: "00:1A:2B:3C:4D:05", apName: "AP-Floor3-01", vendor: "Cisco" }
  ],

  "client-list": [
    { clientMac: "AA:BB:CC:DD:EE:01", userName: "Amit Sharma", apName: "AP-Floor1-01", signalStrength: "-65 dBm", connectedTime: "2h 35m" },
    { clientMac: "AA:BB:CC:DD:EE:02", userName: "Neeta Singh", apName: "AP-Floor2-01", signalStrength: "-58 dBm", connectedTime: "1h 20m" },
    { clientMac: "AA:BB:CC:DD:EE:03", userName: "Rajesh Kumar", apName: "AP-Floor1-02", signalStrength: "-72 dBm", connectedTime: "3h 45m" },
    { clientMac: "AA:BB:CC:DD:EE:04", userName: "Vikram Chatterjee", apName: "AP-Floor2-02", signalStrength: "-61 dBm", connectedTime: "0h 55m" }
  ],

  "user-ap-analytics": [
    { apName: "AP-Floor1-01", uniqueUsers: 125, totalSessions: 450, avgSessionTime: "2h 15m" },
    { apName: "AP-Floor1-02", uniqueUsers: 98, totalSessions: 380, avgSessionTime: "1h 50m" },
    { apName: "AP-Floor2-01", uniqueUsers: 142, totalSessions: 520, avgSessionTime: "2h 40m" },
    { apName: "AP-Floor2-02", uniqueUsers: 156, totalSessions: 590, avgSessionTime: "2h 55m" },
    { apName: "AP-Floor3-01", uniqueUsers: 88, totalSessions: 310, avgSessionTime: "1h 30m" }
  ],

  "rogue-ap-list": [
    { mac: "FF:EE:DD:CC:BB:01", ssid: "FreeWiFi", detectedTime: "2024-07-01 10:30", signalStrength: "-45 dBm", threat: "High" },
    { mac: "FF:EE:DD:CC:BB:02", ssid: "GuestNetwork", detectedTime: "2024-07-02 14:20", signalStrength: "-52 dBm", threat: "Medium" }
  ],

  "alarm-list": [
    { timestamp: "2024-07-01 09:15", severity: "Critical", message: "AP-Floor3-01 offline", affectedDevice: "AP-Floor3-01", status: "Resolved" },
    { timestamp: "2024-07-02 11:30", severity: "Warning", message: "High bandwidth usage detected", affectedDevice: "AP-Floor2-02", status: "Active" },
    { timestamp: "2024-07-03 15:45", severity: "Info", message: "Firmware update available", affectedDevice: "All APs", status: "Pending" }
  ],

  "event-list": [
    { timestamp: "2024-07-01 08:00", eventType: "User Login", user: "Amit Sharma", device: "iPhone 14 Pro", details: "Successful authentication" },
    { timestamp: "2024-07-01 09:15", eventType: "AP Offline", user: "System", device: "AP-Floor3-01", details: "Access point disconnected" },
    { timestamp: "2024-07-01 10:30", eventType: "Rogue AP Detected", user: "System", device: "Unknown", details: "Unauthorized access point found" },
    { timestamp: "2024-07-02 11:30", eventType: "Bandwidth Alert", user: "System", device: "AP-Floor2-02", details: "Threshold exceeded" }
  ],

  "bandwidth-utilization": [
    { timestamp: "2024-07-01 00:00", uploadMbps: 45, downloadMbps: 230, utilization: 68 },
    { timestamp: "2024-07-01 06:00", uploadMbps: 38, downloadMbps: 195, utilization: 58 },
    { timestamp: "2024-07-01 12:00", uploadMbps: 52, downloadMbps: 280, utilization: 83 },
    { timestamp: "2024-07-01 18:00", uploadMbps: 48, downloadMbps: 250, utilization: 74 }
  ],

  "internet-uptime": [
    { date: "2024-07-01", uptimePercent: 99.8, outages: 1, totalDowntime: "12 min" },
    { date: "2024-07-02", uptimePercent: 100, outages: 0, totalDowntime: "0 min" },
    { date: "2024-07-03", uptimePercent: 99.5, outages: 2, totalDowntime: "36 min" },
    { date: "2024-07-04", uptimePercent: 100, outages: 0, totalDowntime: "0 min" }
  ],

  "sla-compliance": [
    { metric: "Network Uptime", target: 99.5, actual: 99.8, compliance: "Above Target" },
    { metric: "Response Time", target: 100, actual: 85, compliance: "Below Target" },
    { metric: "Bandwidth Availability", target: 95, actual: 97, compliance: "Above Target" },
    { metric: "Support Resolution", target: 90, actual: 92, compliance: "Above Target" }
  ],

  "authentication-logs": [
    { timestamp: "2024-07-01 08:00", userId: "USER001", method: "Password", result: "Success", ipAddress: "192.168.1.142" },
    { timestamp: "2024-07-01 08:15", userId: "USER012", method: "Password", result: "Success", ipAddress: "192.168.1.156" },
    { timestamp: "2024-07-01 08:30", userId: "USER003", method: "Password", result: "Failed", ipAddress: "192.168.1.143" },
    { timestamp: "2024-07-01 09:00", userId: "USER007", method: "Password", result: "Success", ipAddress: "192.168.1.157" }
  ],

  "failed-authentication": [
    { timestamp: "2024-07-01 08:30", userId: "USER003", attemptCount: 3, ipAddress: "192.168.1.143", reason: "Invalid Password" },
    { timestamp: "2024-07-02 10:15", userId: "USER005", attemptCount: 2, ipAddress: "192.168.1.158", reason: "Account Locked" },
    { timestamp: "2024-07-03 14:45", userId: "USER008", attemptCount: 1, ipAddress: "192.168.1.161", reason: "Invalid Username" }
  ],

  "addon-usage-report": [
    { addonName: "Premium Bandwidth", users: 45, revenue: 4500, purchaseDate: "2024-01" },
    { addonName: "Extended Data Pack", users: 32, revenue: 3200, purchaseDate: "2024-02" },
    { addonName: "Priority Support", users: 28, revenue: 5600, purchaseDate: "2024-03" }
  ],

  "topup-history": [
    { userId: "USER001", topupAmount: 50, purchaseDate: "2024-07-01", remaining: 35 },
    { userId: "USER012", topupAmount: 100, purchaseDate: "2024-07-05", remaining: 85 },
    { userId: "USER009", topupAmount: 75, purchaseDate: "2024-07-10", remaining: 60 }
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get site report data by report ID
 * @param {string} reportId - The report identifier
 * @returns {Array|null} Report data array or null if not found
 */
export const getSiteReportData = (reportId) => {
  return siteReportData[reportId] || null;
};

/**
 * Check if a report is site-level
 * @param {string} reportId - The report identifier
 * @returns {boolean} True if report exists in site data
 */
export const isSiteReport = (reportId) => {
  return reportId in siteReportData;
};

/**
 * Get all available site report IDs
 * @returns {Array<string>} Array of report IDs
 */
export const getSiteReportIds = () => {
  return Object.keys(siteReportData);
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  config: siteConfig,
  metrics: siteMetrics,
  reportData: siteReportData,
  getSiteReportData,
  isSiteReport,
  getSiteReportIds
};