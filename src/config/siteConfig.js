// src/config/siteConfig.js

const siteConfig = {
  siteName: "Sample Site",
  metrics: {
    activeUsers: 1234,
    activeUsersDelta: 134.00,
    licenseUsagePercent: 78,
    licenseUsageDelta: 6.00,
    dataUsageTB: 78,     // or your sample value
    dataUsageDelta: 1.00,
    currentAlerts: 6,
    alertsDelta: 8.00   // <- negative value means DOWN, e.g. Down 8%
    
  }
};

export default siteConfig;
