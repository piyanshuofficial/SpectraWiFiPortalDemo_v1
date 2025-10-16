// src/constants/sampleReportsData.js

const sampleReportsData = {
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
    // ...
  ],
  "monthly-data-usage-summary": [
    { month: "2024-01", totalUsageGB: 1200, peakUsageGB: 150, avgUsageGB: 40 },
    { month: "2024-02", totalUsageGB: 1300, peakUsageGB: 170, avgUsageGB: 43 },
    // ...
  ],
  "daily-average-active-users": [
    { date: "2024-07-01", avgActiveUsers: 350 },
    { date: "2024-07-02", avgActiveUsers: 360 },
    // ...
  ],
  "policy-wise-monthly-average-active-users": [
    { month: "2024-01", policy: "Policy A", avgActiveUsers: 120 },
    { month: "2024-01", policy: "Policy B", avgActiveUsers: 80 },
    // ...
  ],

  // New report: Network Usage (GB)
  "network-usage-report": [
    { day: "Mon", usageGB: 120 },
    { day: "Tue", usageGB: 200 },
    { day: "Wed", usageGB: 170 },
    { day: "Thu", usageGB: 250 },
    { day: "Fri", usageGB: 220 },
    { day: "Sat", usageGB: 300 },
    { day: "Sun", usageGB: 280 },
  ],

  // New report: License Usage by Type
  "license-usage-report": [
    { licenseType: "License A", usageCount: 65 },
    { licenseType: "License B", usageCount: 59 },
    { licenseType: "License C", usageCount: 80 },
    { licenseType: "License D", usageCount: 81 },
  ],

  // New report: Alerts Summary
  "alerts-summary-report": [
    { alertType: "Success", count: 300 },
    { alertType: "Warning", count: 50 },
    { alertType: "Critical", count: 100 },
  ],
};

export default sampleReportsData;
