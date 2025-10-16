// src/config/siteConfig.js

const siteConfig = {
  siteName: "Sample Site",
  
  // License Management
  licenses: {
    maxLicenses: 100,
    usedLicenses: 70,
  },
  
  // Dashboard Metrics
  metrics: {
    activeUsers: 1234,
    activeUsersDelta: 134.00,
    licenseUsagePercent: 78,
    licenseUsageDelta: 6.00,
    dataUsageTB: 78,
    dataUsageDelta: 1.00,
    currentAlerts: 6,
    alertsDelta: 8.00
  }
};

export default siteConfig;