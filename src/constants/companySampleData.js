// src/constants/companySampleData.js

/**
 * Sample Company Data for Company-Level Dashboard
 * Contains company hierarchy, sites, and aggregated statistics
 */

export const sampleCompany = {
  id: "COMP_001",
  name: "Sample Technologies Pvt Ltd",
  industry: "Information Technology",
  registeredAddress: "Tower A, Tech Park, Mumbai, Maharashtra 400001",
  contactEmail: "admin@sampletechnologies.com",
  contactPhone: "+91-22-1234-5678",
  createdAt: "2023-01-15",
  licenseType: "Enterprise",
  licenseExpiry: "2025-12-31",
  contractStartDate: "2023-01-01",
  totalSites: 6,
  totalUsers: 2850,
  totalDevices: 4200,
  totalLicensedBandwidth: "2 Gbps",
  usedBandwidth: "1.4 Gbps",
  bandwidthUtilization: 70,
};

export const companySites = [
  {
    siteId: "SITE-MUM-ENT-001",
    siteName: "Mumbai HQ",
    segment: "enterprise",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Tower A, Tech Park, Andheri East, Mumbai",
    status: "active",
    totalUsers: 850,
    activeUsers: 742,
    totalDevices: 1200,
    activeDevices: 1085,
    bandwidth: "500 Mbps",
    bandwidthUsage: 68,
    licenseStatus: "Active",
    contactPerson: "Priya Sharma",
    contactEmail: "priya.sharma@sampletechnologies.com",
    lastActivity: "2 min ago",
    alerts: 2,
    criticalAlerts: 0,
    setupDate: "2023-01-20",
    activationDate: "2023-01-20T10:30:00Z",
  },
  {
    siteId: "SITE-DEL-ENT-002",
    siteName: "Delhi Branch",
    segment: "enterprise",
    city: "Delhi",
    state: "Delhi",
    address: "Plot 45, Sector 18, Noida, Delhi NCR",
    status: "active",
    totalUsers: 650,
    activeUsers: 580,
    totalDevices: 800,
    activeDevices: 720,
    bandwidth: "400 Mbps",
    bandwidthUsage: 72,
    licenseStatus: "Active",
    contactPerson: "Amit Verma",
    contactEmail: "amit.verma@sampletechnologies.com",
    lastActivity: "5 min ago",
    alerts: 1,
    criticalAlerts: 0,
    setupDate: "2023-03-15",
    activationDate: "2023-03-15T14:00:00Z",
  },
  {
    siteId: "SITE-BLR-ENT-003",
    siteName: "Bangalore Tech Center",
    segment: "enterprise",
    city: "Bangalore",
    state: "Karnataka",
    address: "Tower B, Electronic City, Bangalore",
    status: "active",
    totalUsers: 520,
    activeUsers: 485,
    totalDevices: 750,
    activeDevices: 690,
    bandwidth: "350 Mbps",
    bandwidthUsage: 65,
    licenseStatus: "Active",
    contactPerson: "Sneha Rao",
    contactEmail: "sneha.rao@sampletechnologies.com",
    lastActivity: "10 min ago",
    alerts: 0,
    criticalAlerts: 0,
    setupDate: "2023-05-10",
    activationDate: "2023-05-10T11:30:00Z",
  },
  {
    siteId: "SITE-HYD-ENT-004",
    siteName: "Hyderabad Office",
    segment: "enterprise",
    city: "Hyderabad",
    state: "Telangana",
    address: "Cyber Towers, HITEC City, Hyderabad",
    status: "active",
    totalUsers: 380,
    activeUsers: 342,
    totalDevices: 520,
    activeDevices: 475,
    bandwidth: "300 Mbps",
    bandwidthUsage: 58,
    licenseStatus: "Active",
    contactPerson: "Kiran Reddy",
    contactEmail: "kiran.reddy@sampletechnologies.com",
    lastActivity: "15 min ago",
    alerts: 1,
    criticalAlerts: 0,
    setupDate: "2023-07-01",
    activationDate: "2023-07-01T09:00:00Z",
  },
  {
    siteId: "SITE-CHN-ENT-005",
    siteName: "Chennai Branch",
    segment: "enterprise",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "IT Corridor, OMR, Chennai",
    status: "active",
    totalUsers: 280,
    activeUsers: 245,
    totalDevices: 420,
    activeDevices: 380,
    bandwidth: "250 Mbps",
    bandwidthUsage: 62,
    licenseStatus: "Active",
    contactPerson: "Lakshmi Iyer",
    contactEmail: "lakshmi.iyer@sampletechnologies.com",
    lastActivity: "8 min ago",
    alerts: 0,
    criticalAlerts: 0,
    setupDate: "2023-09-15",
    activationDate: "2023-09-15T16:00:00Z",
  },
  {
    siteId: "SITE-PUN-ENT-006",
    siteName: "Pune Development Center",
    segment: "enterprise",
    city: "Pune",
    state: "Maharashtra",
    address: "Hinjewadi IT Park, Phase 2, Pune",
    status: "active",
    totalUsers: 170,
    activeUsers: 152,
    totalDevices: 510,
    activeDevices: 465,
    bandwidth: "200 Mbps",
    bandwidthUsage: 75,
    licenseStatus: "Active",
    contactPerson: "Rahul Joshi",
    contactEmail: "rahul.joshi@sampletechnologies.com",
    lastActivity: "3 min ago",
    alerts: 3,
    criticalAlerts: 1,
    setupDate: "2024-01-10",
    activationDate: "2024-01-10T12:30:00Z",
  },
];

/**
 * Get aggregated company statistics
 */
export const getCompanyStats = () => {
  const totalUsers = companySites.reduce((sum, site) => sum + site.totalUsers, 0);
  const activeUsers = companySites.reduce((sum, site) => sum + site.activeUsers, 0);
  const totalDevices = companySites.reduce((sum, site) => sum + site.totalDevices, 0);
  const activeDevices = companySites.reduce((sum, site) => sum + site.activeDevices, 0);
  const totalAlerts = companySites.reduce((sum, site) => sum + site.alerts, 0);
  const criticalAlerts = companySites.reduce((sum, site) => sum + site.criticalAlerts, 0);
  const avgBandwidthUsage = Math.round(
    companySites.reduce((sum, site) => sum + site.bandwidthUsage, 0) / companySites.length
  );

  return {
    totalSites: companySites.length,
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    userActivityRate: Math.round((activeUsers / totalUsers) * 100),
    totalDevices,
    activeDevices,
    inactiveDevices: totalDevices - activeDevices,
    deviceActivityRate: Math.round((activeDevices / totalDevices) * 100),
    totalAlerts,
    criticalAlerts,
    avgBandwidthUsage,
    sitesWithAlerts: companySites.filter((site) => site.alerts > 0).length,
    sitesWithCriticalAlerts: companySites.filter((site) => site.criticalAlerts > 0).length,
  };
};

/**
 * Get site by ID
 */
export const getSiteById = (siteId) => {
  return companySites.find((site) => site.siteId === siteId);
};

/**
 * Get sites by segment
 */
export const getSitesBySegment = (segment) => {
  return companySites.filter((site) => site.segment === segment);
};

/**
 * Get sites by city
 */
export const getSitesByCity = (city) => {
  return companySites.filter((site) => site.city.toLowerCase() === city.toLowerCase());
};

/**
 * Get sites with alerts
 */
export const getSitesWithAlerts = () => {
  return companySites.filter((site) => site.alerts > 0);
};

/**
 * Get active sites visible to customers
 * Only sites with status 'active' should be visible on customer portal
 * Sites in configuration_pending, under_testing, rfs_pending are not visible to customers
 */
export const getActiveSitesForCustomer = () => {
  return companySites.filter((site) => site.status?.toLowerCase() === 'active');
};

/**
 * Check if a site is visible to customers
 * @param {Object} site - Site object
 * @returns {boolean} - True if site should be visible to customers
 */
export const isSiteVisibleToCustomer = (site) => {
  return site.status?.toLowerCase() === 'active';
};

/**
 * Get site statistics for charts
 */
export const getSiteChartData = () => {
  return {
    usersBysite: companySites.map((site) => ({
      name: site.siteName,
      value: site.totalUsers,
      active: site.activeUsers,
    })),
    devicesBySite: companySites.map((site) => ({
      name: site.siteName,
      value: site.totalDevices,
      active: site.activeDevices,
    })),
    bandwidthBySite: companySites.map((site) => ({
      name: site.siteName,
      usage: site.bandwidthUsage,
      bandwidth: site.bandwidth,
    })),
    alertsBySite: companySites.map((site) => ({
      name: site.siteName,
      alerts: site.alerts,
      critical: site.criticalAlerts,
    })),
  };
};

/**
 * Company activity log sample data
 */
export const companyActivityLogs = [
  {
    id: "LOG001",
    timestamp: "2024-12-11T10:30:00Z",
    action: "User Created",
    site: "Mumbai HQ",
    siteId: "SITE-MUM-ENT-001",
    user: "Priya Sharma",
    details: "New user Rahul Mehta added",
    severity: "info",
  },
  {
    id: "LOG002",
    timestamp: "2024-12-11T10:15:00Z",
    action: "Device Registered",
    site: "Delhi Branch",
    siteId: "SITE-DEL-ENT-002",
    user: "Amit Verma",
    details: "MacBook Pro registered (MAC: AA:BB:CC:DD:EE:01)",
    severity: "info",
  },
  {
    id: "LOG003",
    timestamp: "2024-12-11T09:45:00Z",
    action: "Policy Changed",
    site: "Bangalore Tech Center",
    siteId: "SITE-BLR-ENT-003",
    user: "Sneha Rao",
    details: "Bandwidth limit updated for Engineering team",
    severity: "warning",
  },
  {
    id: "LOG004",
    timestamp: "2024-12-11T09:30:00Z",
    action: "High Bandwidth Alert",
    site: "Pune Development Center",
    siteId: "SITE-PUN-ENT-006",
    user: "System",
    details: "Bandwidth usage exceeded 90% threshold",
    severity: "critical",
  },
  {
    id: "LOG005",
    timestamp: "2024-12-11T09:00:00Z",
    action: "User Deactivated",
    site: "Chennai Branch",
    siteId: "SITE-CHN-ENT-005",
    user: "Lakshmi Iyer",
    details: "User account suspended due to policy violation",
    severity: "warning",
  },
];

export default {
  sampleCompany,
  companySites,
  getCompanyStats,
  getSiteById,
  getSitesBySegment,
  getSitesByCity,
  getSitesWithAlerts,
  getActiveSitesForCustomer,
  isSiteVisibleToCustomer,
  getSiteChartData,
  companyActivityLogs,
};
