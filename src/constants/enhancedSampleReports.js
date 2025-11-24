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
    id: "cluster-average-active-users",
    name: "Average Active Users Summary (Cluster)",
    category: "Billing",
    subcategory: "Active Users",
    description: "Cluster-level aggregation of active users for multi-site billing",
    keywords: ["billing", "cluster", "active", "users", "summary", "aggregate"],
    accessLevel: "cluster",
    status: "Completed",
    createdDate: "2024-07-05",
    isCommon: false,
    reportType: "Summary",
    dataPoints: ["cluster", "totalActiveUsers", "monthlyGrowth"],
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
          end: "2024-01"
        },
        validation: {
          maxRange: 1
        }
      }
    ]
  },
  {
    id: "city-average-active-users",
    name: "Average Active Users Summary (City)",
    category: "Billing",
    subcategory: "Active Users",
    description: "City-wide active user metrics for regional billing",
    keywords: ["billing", "city", "active", "users", "regional", "summary"],
    accessLevel: "city",
    status: "Completed",
    createdDate: "2024-07-05",
    isCommon: false,
    reportType: "Summary",
    dataPoints: ["city", "totalActiveUsers", "monthlyGrowth"],
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
          end: "2024-01"
        },
        validation: {
          maxRange: 1
        }
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
    id: "cluster-monthly-data-usage",
    name: "Monthly Data Usage Summary (Cluster)",
    category: "Usage",
    subcategory: "Data Consumption",
    description: "Aggregated data usage across cluster sites",
    keywords: ["usage", "data", "monthly", "cluster", "aggregate", "bandwidth"],
    accessLevel: "cluster",
    status: "Completed",
    createdDate: "2024-07-08",
    isCommon: false,
    reportType: "Summary",
    dataPoints: ["month", "cluster", "totalUsageGB", "peakUsageGB"],
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
          end: "2024-01"
        },
        validation: {
          maxRange: 1
        }
      }
    ]
  },
  {
    id: "city-monthly-data-usage",
    name: "Monthly Data Usage Summary (City)",
    category: "Usage",
    subcategory: "Data Consumption",
    description: "City-level monthly data consumption metrics",
    keywords: ["usage", "data", "monthly", "city", "regional", "consumption"],
    accessLevel: "city",
    status: "Completed",
    createdDate: "2024-07-08",
    isCommon: false,
    reportType: "Summary",
    dataPoints: ["month", "city", "totalUsageGB", "avgUsageGB"],
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
          end: "2024-01"
        },
        validation: {
          maxRange: 1
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
    id: "alerts-summary-report",
    name: "Alerts Summary",
    category: "SLA",
    subcategory: "Performance",
    description: "Summary of system alerts by severity and type",
    keywords: ["sla", "alerts", "performance", "monitoring", "critical"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2025-10-01",
    isCommon: true,
    reportType: "Analytics",
    dataPoints: ["alertType", "count"],
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
    description: "User top-up purchases and spending patterns",
    keywords: ["upsell", "topup", "revenue", "purchases", "spending"],
    accessLevel: "site",
    status: "Completed",
    createdDate: "2024-10-28",
    isCommon: false,
    reportType: "Revenue",
    dataPoints: ["userId", "topupAmount", "purchaseDate", "remaining"],
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

export default enhancedSampleReports;