// src/constants/sampleReports.js

const sampleReports = [
  {
    id: "site-monthly-active-users",
    name: "Site Monthly Active Users",
    type: "Analytics",
    category: "Usage",
    createdDate: "2024-07-01",
    status: "Completed",
    isCommon: true,
  },
  {
    id: "monthly-data-usage-summary",
    name: "Monthly Data Usage Summary",
    type: "Summary",
    status: "Completed",
    createdDate: "2024-07-01",
    category: "Data Usage",
    isCommon: true,
  },
  {
    id: "daily-average-active-users",
    name: "Daily Average Active Users",
    type: "Analytics",
    status: "Completed",
    createdDate: "2024-07-01",
    category: "User Activity",
    isCommon: true,
  },
  {
    id: "policy-wise-monthly-average-active-users",
    name: "Policy-wise Monthly Average Active Users",
    type: "Policy",
    status: "Completed",
    createdDate: "2024-07-01",
    category: "Policy",
    isCommon: true,
  },

  // New reports aligned with main dashboard charts
  {
    id: "network-usage-report",
    name: "Network Usage (GB)",
    type: "Analytics",
    category: "Usage",
    createdDate: "2025-10-01",
    status: "Completed",
    isCommon: true,
  },
  {
    id: "license-usage-report",
    name: "License Usage by Type",
    type: "Summary",
    category: "Usage",
    createdDate: "2025-10-01",
    status: "Completed",
    isCommon: true,
  },
  {
    id: "alerts-summary-report",
    name: "Alerts Summary",
    type: "Analytics",
    category: "Alerts",
    createdDate: "2025-10-01",
    status: "Completed",
    isCommon: true,
  },
];

export default sampleReports;
