// src/constants/enhancedSampleReports.js

/**
 * Enhanced Report Metadata with Categories and Filtering - API Format Aligned
 * 
 * MissingForAPI:
 * - None - this is frontend metadata for UI organization
 * 
 * FrontendOnly:
 * - All fields (category, subcategory, description, keywords, etc.)
 * - criteriaFields structure (UI form generation)
 * - exportFormats, hasChart, hasTable (UI capabilities)
 * - Used exclusively for reports dashboard filtering and display
 * - Actual report data sourced from userSampleData and siteConfig
 */

const enhancedSampleReports = [
  // ============================================
  // BILLING REPORTS
  // ============================================
  {
    id: "site-monthly-active-users",
    name: "Monthly Active Users",
    category: "Billing",
    subcategory: "Active Users",
    description: "Monthly average active users across all policies for billing reconciliation",
    keywords: ["billing", "monthly", "active", "users", "reconciliation"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-07-01",
    isCommon: true,
    reportType: "Analytics",
    dataPoints: ["avgActiveUsers", "newUsers", "churnedUsers", "activations", "deactivations"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2024-01",
          end: "2024-06"
        },
        validation: {
          maxRange: 12
        }
      }
    ]
  },
  {
    id: "daily-average-active-users",
    name: "Daily Average Active Users",
    category: "Billing",
    subcategory: "Active Users",
    description: "Daily breakdown of average active users for detailed billing analysis",
    keywords: ["billing", "daily", "active", "users"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-07-01",
    isCommon: true,
    reportType: "Analytics",
    dataPoints: ["date", "avgActiveUsers"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-07"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },
  {
    id: "policy-wise-monthly-average-active-users",
    name: "Policy-wise Monthly Average Active Users",
    category: "Billing",
    subcategory: "Policy Analysis",
    description: "Monthly active users segmented by policy type",
    keywords: ["billing", "policy", "monthly", "active", "users", "segmentation"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-07-01",
    isCommon: true,
    reportType: "Policy",
    dataPoints: ["month", "policy", "avgActiveUsers"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2024-01",
          end: "2024-06"
        },
        validation: {
          maxRange: 12
        }
      },
      {
        type: "multiSelect",
        name: "policies",
        label: "Filter by Policies",
        required: false,
        options: ["Policy A", "Policy B", "Policy C"],
        defaultValue: []
      }
    ]
  },
  {
    id: "company-average-active-users",
    name: "Average Active Users Summary (Company)",
    category: "Billing",
    subcategory: "Active Users",
    description: "Company-wide active user overview for enterprise billing",
    keywords: ["billing", "company", "enterprise", "active", "users", "overview"],
    accessLevel: "company",
    status: "Completed",
    createdDate: "2024-07-05",
    isCommon: false,
    reportType: "Summary",
    dataPoints: ["company", "totalActiveUsers", "yearOverYear"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2024-01",
          end: "2024-12"
        },
        validation: {
          maxRange: 13
        }
      }
    ]
  },

  // ============================================
  // USAGE REPORTS
  // ============================================
  {
    id: "monthly-data-usage-summary",
    name: "Monthly Data Usage Summary (Site)",
    category: "Usage",
    subcategory: "Data Consumption",
    description: "Total, peak, and average data usage per month at site level",
    keywords: ["usage", "data", "monthly", "consumption", "bandwidth"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-07-01",
    isCommon: true,
    reportType: "Summary",
    dataPoints: ["month", "totalUsageGB", "peakUsageGB", "avgUsageGB"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2024-01",
          end: "2024-06"
        },
        validation: {
          maxRange: 12
        }
      }
    ]
  },
  {
    id: "company-monthly-data-usage",
    name: "Monthly Data Usage Summary (Company)",
    category: "Usage",
    subcategory: "Data Consumption",
    description: "Company-wide data usage trends and patterns",
    keywords: ["usage", "data", "monthly", "company", "enterprise", "trends"],
    accessLevel: "company",
    status: "Completed",
    createdDate: "2024-07-08",
    isCommon: false,
    reportType: "Summary",
    dataPoints: ["month", "company", "totalUsageTB", "yearOverYear"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2024-01",
          end: "2024-12"
        },
        validation: {
          maxRange: 13
        }
      }
    ]
  },

  // ============================================
  // WI-FI NETWORK REPORTS
  // ============================================
  {
    id: "network-usage-report",
    name: "Network Usage (GB)",
    category: "Wi-Fi Network",
    subcategory: "Performance",
    description: "Daily network usage tracking for capacity planning",
    keywords: ["network", "wifi", "usage", "bandwidth", "daily", "performance"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2025-10-01",
    isCommon: true,
    reportType: "Analytics",
    dataPoints: ["day", "usageGB"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-07"
        },
        validation: {
          maxRange: 30
        }
      }
    ]
  },
  {
    id: "access-point-list",
    name: "Access Point List",
    category: "Wi-Fi Network",
    subcategory: "Infrastructure",
    description: "Complete inventory of all access points with status",
    keywords: ["network", "access", "point", "infrastructure", "inventory", "hardware"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-08-15",
    isCommon: false,
    reportType: "Inventory",
    dataPoints: ["apName", "mac", "location", "status", "connectedUsers"],
    hasChart: false,
    hasTable: true,
    exportFormats: ["csv", "excel"],
    supportsCriteria: false
  },
  {
    id: "access-point-mac-list",
    name: "Access Point MAC List",
    category: "Wi-Fi Network",
    subcategory: "Infrastructure",
    description: "MAC addresses of all registered access points",
    keywords: ["network", "access", "point", "mac", "address", "inventory"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-08-15",
    isCommon: false,
    reportType: "Inventory",
    dataPoints: ["mac", "apName", "vendor"],
    hasChart: false,
    hasTable: true,
    exportFormats: ["csv", "excel"],
    supportsCriteria: false
  },
  {
    id: "client-list",
    name: "Client List",
    category: "Wi-Fi Network",
    subcategory: "Connected Devices",
    description: "All currently connected clients with connection details",
    keywords: ["network", "clients", "connected", "devices", "active", "sessions"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-09-01",
    isCommon: false,
    reportType: "Real-time",
    dataPoints: ["clientMac", "userName", "apName", "signalStrength", "connectedTime"],
    hasChart: false,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: false
  },
  {
    id: "user-ap-analytics",
    name: "User Access Point Analytics",
    category: "Wi-Fi Network",
    subcategory: "Usage Patterns",
    description: "User distribution and roaming patterns across access points",
    keywords: ["network", "analytics", "access", "point", "users", "distribution", "roaming"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-09-10",
    isCommon: false,
    reportType: "Analytics",
    dataPoints: ["apName", "uniqueUsers", "totalSessions", "avgSessionTime"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-07"
        },
        validation: {
          maxRange: 30
        }
      }
    ]
  },
  {
    id: "rogue-ap-list",
    name: "Rogue AP List",
    category: "Wi-Fi Network",
    subcategory: "Security",
    description: "Detected rogue access points for security monitoring",
    keywords: ["network", "rogue", "security", "unauthorized", "access", "point"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-09-15",
    isCommon: false,
    reportType: "Security",
    dataPoints: ["mac", "ssid", "detectedTime", "signalStrength", "threat"],
    hasChart: false,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: false
  },
  {
    id: "alarm-list",
    name: "Alarm List",
    category: "Wi-Fi Network",
    subcategory: "Alerts",
    description: "System alarms and critical network events",
    keywords: ["network", "alarms", "alerts", "critical", "events", "monitoring"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-09-20",
    isCommon: false,
    reportType: "Alerts",
    dataPoints: ["timestamp", "severity", "message", "affectedDevice", "status"],
    hasChart: false,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-07"
        },
        validation: {
          maxRange: 30
        }
      },
      {
        type: "dropdown",
        name: "severity",
        label: "Severity",
        required: false,
        options: ["All", "Critical", "Warning", "Info"],
        defaultValue: "All"
      }
    ]
  },
  {
    id: "event-list",
    name: "Event List",
    category: "Wi-Fi Network",
    subcategory: "Logs",
    description: "Comprehensive log of all network events",
    keywords: ["network", "events", "logs", "audit", "history"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-09-25",
    isCommon: false,
    reportType: "Logs",
    dataPoints: ["timestamp", "eventType", "user", "device", "details"],
    hasChart: false,
    hasTable: true,
    exportFormats: ["csv", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-07"
        },
        validation: {
          maxRange: 30
        }
      }
    ]
  },

  // ============================================
  // END-USER REPORTS
  // ============================================
  {
    id: "speed-tier-report",
    name: "Users by Speed Tier",
    category: "End-User",
    subcategory: "Policy Distribution",
    description: "User distribution across speed tiers for capacity planning",
    keywords: ["speed", "tier", "users", "distribution", "capacity", "bandwidth"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2025-10-01",
    isCommon: true,
    reportType: "Summary",
    dataPoints: ["speedTier", "userCount"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: false
  },
  {
    id: "user-session-history",
    name: "User Session History",
    category: "End-User",
    subcategory: "Activity",
    description: "Historical session data for individual users",
    keywords: ["user", "session", "history", "activity", "login", "usage"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-01",
    isCommon: false,
    reportType: "Activity",
    dataPoints: ["userId", "sessionStart", "sessionEnd", "dataUsed", "duration"],
    hasChart: false,
    hasTable: true,
    exportFormats: ["csv", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-07"
        },
        validation: {
          maxRange: 30
        }
      }
    ]
  },
  {
    id: "user-data-consumption",
    name: "User Data Consumption",
    category: "End-User",
    subcategory: "Usage",
    description: "Individual user data consumption over time",
    keywords: ["user", "data", "consumption", "bandwidth", "usage", "tracking"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-05",
    isCommon: false,
    reportType: "Usage",
    dataPoints: ["userId", "date", "dataUsedMB", "sessions"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-07"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },

  // ============================================
  // INTERNET REPORTS
  // ============================================
  {
    id: "bandwidth-utilization",
    name: "Bandwidth Utilization",
    category: "Internet",
    subcategory: "Performance",
    description: "Internet bandwidth usage patterns and peak times",
    keywords: ["internet", "bandwidth", "utilization", "performance", "capacity"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-10",
    isCommon: false,
    reportType: "Analytics",
    dataPoints: ["timestamp", "uploadMbps", "downloadMbps", "utilization"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-07"
        },
        validation: {
          maxRange: 30
        }
      }
    ]
  },
  {
    id: "internet-uptime",
    name: "Internet Uptime Report",
    category: "Internet",
    subcategory: "Reliability",
    description: "Internet connectivity uptime and outage tracking",
    keywords: ["internet", "uptime", "downtime", "reliability", "availability", "outage"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-12",
    isCommon: false,
    reportType: "Summary",
    dataPoints: ["date", "uptimePercent", "outages", "totalDowntime"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-31"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },

  // ============================================
  // SLA REPORTS
  // ============================================
  {
    id: "sla-compliance",
    name: "SLA Compliance Report",
    category: "SLA",
    subcategory: "Compliance",
    description: "Service level agreement compliance metrics",
    keywords: ["sla", "compliance", "metrics", "performance", "targets"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-15",
    isCommon: false,
    reportType: "Compliance",
    dataPoints: ["metric", "target", "actual", "compliance"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2024-01",
          end: "2024-06"
        },
        validation: {
          maxRange: 12
        }
      }
    ]
  },

  // ============================================
  // AUTHENTICATION REPORTS
  // ============================================
  {
    id: "authentication-logs",
    name: "Authentication Logs",
    category: "Authentication",
    subcategory: "Security",
    description: "User authentication attempts and outcomes",
    keywords: ["authentication", "login", "security", "access", "logs"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-20",
    isCommon: false,
    reportType: "Security",
    dataPoints: ["timestamp", "userId", "method", "result", "ipAddress"],
    hasChart: false,
    hasTable: true,
    exportFormats: ["csv", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-07"
        },
        validation: {
          maxRange: 30
        }
      }
    ]
  },
  {
    id: "failed-authentication",
    name: "Failed Authentication Report",
    category: "Authentication",
    subcategory: "Security",
    description: "Failed login attempts for security monitoring",
    keywords: ["authentication", "failed", "security", "breach", "monitoring"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-22",
    isCommon: false,
    reportType: "Security",
    dataPoints: ["timestamp", "userId", "attemptCount", "ipAddress", "reason"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-07"
        },
        validation: {
          maxRange: 30
        }
      }
    ]
  },

  // ============================================
  // UPSELL REPORTS
  // ============================================
  {
    id: "addon-usage-report",
    name: "Add-on Usage Report",
    category: "Upsell",
    subcategory: "Revenue",
    description: "User adoption and usage of premium add-ons",
    keywords: ["upsell", "addon", "premium", "revenue", "adoption"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-25",
    isCommon: false,
    reportType: "Revenue",
    dataPoints: ["addonName", "users", "revenue", "purchaseDate"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2024-01",
          end: "2024-06"
        },
        validation: {
          maxRange: 12
        }
      }
    ]
  },
  {
    id: "topup-history",
    name: "Top-up Purchase History",
    category: "Upsell",
    subcategory: "Revenue",
    description: "All user top-up purchases and spending patterns across all topup types",
    keywords: ["upsell", "topup", "revenue", "purchases", "spending", "all"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-28",
    isCommon: false,
    reportType: "Revenue",
    dataPoints: ["userId", "topupType", "topupTypeLabel", "topupAmount", "purchaseDate", "remaining"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-31"
        },
        validation: {
          maxRange: 90
        }
      },
      {
        type: "select",
        name: "topupType",
        label: "Top-up Type",
        required: false,
        options: [
          { value: "", label: "All Types" },
          { value: "speed", label: "Speed Boost" },
          { value: "data", label: "Data Pack" },
          { value: "device", label: "Extra Device" },
          { value: "plan", label: "Plan Upgrade" }
        ],
        defaultValue: ""
      }
    ]
  },
  {
    id: "topup-history-speed",
    name: "Speed Boost Top-up History",
    category: "Upsell",
    subcategory: "Revenue",
    description: "Speed boost top-up purchases - users who upgraded their internet speed",
    keywords: ["upsell", "topup", "speed", "boost", "revenue", "bandwidth"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-28",
    isCommon: false,
    reportType: "Revenue",
    dataPoints: ["userId", "topupType", "topupTypeLabel", "topupAmount", "purchaseDate", "remaining"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-31"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },
  {
    id: "topup-history-data",
    name: "Data Pack Top-up History",
    category: "Upsell",
    subcategory: "Revenue",
    description: "Data pack top-up purchases - users who purchased additional data",
    keywords: ["upsell", "topup", "data", "pack", "revenue", "gb"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-28",
    isCommon: false,
    reportType: "Revenue",
    dataPoints: ["userId", "topupType", "topupTypeLabel", "topupAmount", "purchaseDate", "remaining"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-31"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },
  {
    id: "topup-history-device",
    name: "Extra Device Top-up History",
    category: "Upsell",
    subcategory: "Revenue",
    description: "Extra device top-up purchases - users who added more devices to their account",
    keywords: ["upsell", "topup", "device", "extra", "revenue"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-28",
    isCommon: false,
    reportType: "Revenue",
    dataPoints: ["userId", "topupType", "topupTypeLabel", "topupAmount", "purchaseDate", "remaining"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-31"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },
  {
    id: "topup-history-plan",
    name: "Plan Upgrade Top-up History",
    category: "Upsell",
    subcategory: "Revenue",
    description: "Plan upgrade top-up purchases - users who upgraded to a higher plan",
    keywords: ["upsell", "topup", "plan", "upgrade", "revenue"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-28",
    isCommon: false,
    reportType: "Revenue",
    dataPoints: ["userId", "topupType", "topupTypeLabel", "topupAmount", "purchaseDate", "remaining"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-31"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },

  // ============================================
  // COMPANY-LEVEL REPORTS
  // ============================================
  {
    id: "company-overview-dashboard",
    name: "Company Overview Dashboard",
    category: "Company",
    subcategory: "Overview",
    description: "Executive summary across all sites with key metrics",
    keywords: ["company", "overview", "executive", "summary", "multi-site"],
    accessLevel: "company",
    status: "Completed",
    createdDate: "2024-10-01",
    isCommon: true,
    reportType: "Executive",
    dataPoints: ["totalSites", "totalUsers", "totalDevices", "totalBandwidth"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: false,
    criteriaFields: []
  },
  {
    id: "cross-site-usage-comparison",
    name: "Cross-Site Usage Comparison",
    category: "Company",
    subcategory: "Comparison",
    description: "Compare bandwidth and data usage across all sites",
    keywords: ["company", "comparison", "usage", "sites", "benchmark"],
    accessLevel: "company",
    status: "Completed",
    createdDate: "2024-10-05",
    isCommon: true,
    reportType: "Analytics",
    dataPoints: ["siteName", "totalUsers", "avgBandwidth", "dataUsage"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2024-01",
          end: "2024-06"
        },
        validation: {
          maxRange: 12
        }
      }
    ]
  },
  {
    id: "consolidated-billing-report",
    name: "Consolidated Billing Report",
    category: "Company",
    subcategory: "Billing",
    description: "Combined billing summary for all sites",
    keywords: ["company", "billing", "consolidated", "finance", "invoice"],
    accessLevel: "company",
    status: "Completed",
    createdDate: "2024-10-10",
    isCommon: true,
    reportType: "Billing",
    dataPoints: ["siteName", "activeUsers", "billedAmount", "dueDate"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Billing Period",
        required: true,
        defaultValue: {
          start: "2024-01",
          end: "2024-06"
        },
        validation: {
          maxRange: 12
        }
      }
    ]
  },
  {
    id: "company-license-utilization",
    name: "License Utilization by Site",
    category: "Company",
    subcategory: "Licensing",
    description: "License allocation and utilization across all sites",
    keywords: ["company", "license", "utilization", "allocation", "sites"],
    accessLevel: "company",
    status: "Completed",
    createdDate: "2024-10-15",
    isCommon: true,
    reportType: "Analytics",
    dataPoints: ["siteName", "allocatedLicenses", "usedLicenses", "utilizationRate"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: false,
    criteriaFields: []
  },
  {
    id: "company-user-distribution",
    name: "User Distribution by Site",
    category: "Company",
    subcategory: "Users",
    description: "Distribution of users across all company sites",
    keywords: ["company", "users", "distribution", "sites", "demographics"],
    accessLevel: "company",
    status: "Completed",
    createdDate: "2024-10-20",
    isCommon: false,
    reportType: "Analytics",
    dataPoints: ["siteName", "activeUsers", "suspendedUsers", "newUsers"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2024-01",
          end: "2024-06"
        },
        validation: {
          maxRange: 12
        }
      }
    ]
  },
  {
    id: "company-alerts-summary",
    name: "Company-Wide Alerts Summary",
    category: "Company",
    subcategory: "Alerts",
    description: "Aggregated alerts and incidents across all sites",
    keywords: ["company", "alerts", "incidents", "summary", "monitoring"],
    accessLevel: "company",
    status: "Completed",
    createdDate: "2024-10-25",
    isCommon: false,
    reportType: "Operations",
    dataPoints: ["siteName", "criticalAlerts", "warningAlerts", "resolvedAlerts"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2024-07-01",
          end: "2024-07-31"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },

  // ============================================
  // GUEST ACCESS REPORTS
  // ============================================
  {
    id: "guest-access-summary",
    name: "Guest Access Summary",
    category: "Guest Access",
    subcategory: "Overview",
    description: "Overview of guest access statistics including active guests, check-ins, and usage",
    keywords: ["guest", "visitor", "access", "summary", "overview", "check-in"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2025-01-10",
    isCommon: true,
    reportType: "Analytics",
    dataPoints: ["totalGuests", "activeGuests", "checkedIn", "checkedOut", "dataUsed"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2025-01-01",
          end: "2025-01-31"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },
  {
    id: "guest-activity-log",
    name: "Guest Activity Log",
    category: "Guest Access",
    subcategory: "Activity",
    description: "Detailed log of guest check-ins, check-outs, and access events",
    keywords: ["guest", "activity", "log", "check-in", "check-out", "events"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2025-01-10",
    isCommon: true,
    reportType: "Audit",
    dataPoints: ["timestamp", "guestName", "action", "performedBy", "details"],
    hasChart: false,
    hasTable: true,
    exportFormats: ["csv", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2025-01-01",
          end: "2025-01-07"
        },
        validation: {
          maxRange: 30
        }
      }
    ]
  },
  {
    id: "guest-voucher-report",
    name: "Voucher Usage Report",
    category: "Guest Access",
    subcategory: "Vouchers",
    description: "Guest voucher generation and redemption statistics",
    keywords: ["guest", "voucher", "code", "redemption", "usage", "generated"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2025-01-10",
    isCommon: false,
    reportType: "Analytics",
    dataPoints: ["voucherCode", "status", "guestType", "createdBy", "redeemedBy", "validityHours"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2025-01-01",
          end: "2025-01-31"
        },
        validation: {
          maxRange: 90
        }
      },
      {
        type: "select",
        name: "voucherStatus",
        label: "Voucher Status",
        required: false,
        options: [
          { value: "", label: "All Status" },
          { value: "active", label: "Active" },
          { value: "redeemed", label: "Redeemed" },
          { value: "expired", label: "Expired" }
        ],
        defaultValue: ""
      }
    ]
  },
  {
    id: "guest-type-breakdown",
    name: "Guest Type Breakdown",
    category: "Guest Access",
    subcategory: "Analytics",
    description: "Distribution of guests by type (visitor, contractor, conference, etc.)",
    keywords: ["guest", "type", "breakdown", "distribution", "category", "visitor"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2025-01-10",
    isCommon: false,
    reportType: "Analytics",
    dataPoints: ["guestType", "count", "percentage", "avgDuration", "dataUsed"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2025-01",
          end: "2025-01"
        },
        validation: {
          maxRange: 12
        }
      }
    ]
  },
  {
    id: "guest-data-usage",
    name: "Guest Data Usage Report",
    category: "Guest Access",
    subcategory: "Usage",
    description: "Data consumption by guest users with breakdown by type",
    keywords: ["guest", "data", "usage", "bandwidth", "consumption"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2025-01-10",
    isCommon: false,
    reportType: "Usage",
    dataPoints: ["guestId", "guestName", "guestType", "dataUsed", "sessions", "avgSession"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2025-01-01",
          end: "2025-01-31"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },
  {
    id: "company-guest-overview",
    name: "Company-Wide Guest Overview",
    category: "Company",
    subcategory: "Guest Access",
    description: "Aggregated guest access statistics across all sites",
    keywords: ["company", "guest", "overview", "multi-site", "visitor", "aggregate"],
    accessLevel: "company",
    status: "Completed",
    createdDate: "2025-01-10",
    isCommon: true,
    reportType: "Executive",
    dataPoints: ["siteName", "totalGuests", "activeGuests", "checkedInToday", "dataUsed"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf", "excel"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "dateRange",
        name: "dateRange",
        label: "Date Range",
        required: true,
        defaultValue: {
          start: "2025-01-01",
          end: "2025-01-31"
        },
        validation: {
          maxRange: 90
        }
      }
    ]
  },
  {
    id: "company-guest-comparison",
    name: "Guest Traffic by Site Comparison",
    category: "Company",
    subcategory: "Guest Access",
    description: "Compare guest traffic and usage patterns across all sites",
    keywords: ["company", "guest", "comparison", "sites", "traffic", "benchmark"],
    accessLevel: "company",
    status: "Completed",
    createdDate: "2025-01-10",
    isCommon: false,
    reportType: "Analytics",
    dataPoints: ["siteName", "guestsThisMonth", "avgDuration", "peakDay", "topGuestType"],
    hasChart: true,
    hasTable: true,
    exportFormats: ["csv", "pdf"],
    supportsCriteria: true,
    criteriaFields: [
      {
        type: "monthRange",
        name: "monthRange",
        label: "Month Range",
        required: true,
        defaultValue: {
          start: "2025-01",
          end: "2025-01"
        },
        validation: {
          maxRange: 12
        }
      }
    ]
  },
];

/**
 * Helper Functions - Preserved
 */
export const getCategories = () => {
  const categories = new Set(enhancedSampleReports.map(r => r.category));
  return Array.from(categories).sort();
};

export const getSubcategories = (category) => {
  const subcategories = new Set(
    enhancedSampleReports
      .filter(r => r.category === category)
      .map(r => r.subcategory)
  );
  return Array.from(subcategories).sort();
};

export const getReportsByCategory = (category, subcategory = null) => {
  return enhancedSampleReports.filter(r => {
    if (r.category !== category) return false;
    if (subcategory && r.subcategory !== subcategory) return false;
    return true;
  });
};

export const searchReports = (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return enhancedSampleReports;
  
  const term = searchTerm.toLowerCase().trim();
  return enhancedSampleReports.filter(report => {
    return (
      report.name.toLowerCase().includes(term) ||
      report.description.toLowerCase().includes(term) ||
      report.category.toLowerCase().includes(term) ||
      report.subcategory.toLowerCase().includes(term) ||
      report.keywords.some(k => k.toLowerCase().includes(term))
    );
  });
};

export const getCommonReports = () => {
  return enhancedSampleReports.filter(r => r.isCommon);
};

/**
 * Filter reports by access level (company or site)
 * @param {string} accessLevel - 'company' or 'site'
 * @returns {Array} Filtered reports
 */
export const getReportsByAccessLevel = (accessLevel) => {
  if (!accessLevel) return enhancedSampleReports;
  return enhancedSampleReports.filter(r => r.accessLevel === accessLevel);
};

/**
 * Get reports appropriate for company view (only company-level reports)
 * @returns {Array} Company-level reports only
 */
export const getCompanyReports = () => {
  return enhancedSampleReports.filter(r => r.accessLevel === 'company');
};

/**
 * Get reports appropriate for site view (only site-level reports)
 * @returns {Array} Site-level reports only
 */
export const getSiteReports = () => {
  return enhancedSampleReports.filter(r => r.accessLevel === 'site');
};

export default enhancedSampleReports;