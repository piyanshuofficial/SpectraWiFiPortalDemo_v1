// src/config/masterReportConfig.js

/**
 * Master Report Configuration for Spectra Internal Admin
 *
 * This configuration defines which reports are available for each combination of:
 * - Solution Type (managed_wifi, managed_wifi_infra)
 * - Segment (enterprise, office, hotel, coLiving, coWorking, pg, miscellaneous)
 * - Bandwidth Type (fixed, userLevel)
 * - Product (spectra_wifi_basic, spectra_wifi_standard, spectra_wifi_premium, etc.)
 * - Access Level (site, company)
 *
 * Spectra internal admin can modify this configuration to control which reports
 * are available for different product/segment combinations.
 */

// ============================================
// SOLUTION TYPES
// ============================================
export const SOLUTION_TYPES = {
  MANAGED_WIFI: 'managed_wifi',
  MANAGED_WIFI_INFRA: 'managed_wifi_infra'
};

// ============================================
// SEGMENT TYPES
// ============================================
export const SEGMENTS = {
  ENTERPRISE: 'enterprise',
  OFFICE: 'office',
  HOTEL: 'hotel',
  CO_LIVING: 'coLiving',
  CO_WORKING: 'coWorking',
  PG: 'pg',
  MISCELLANEOUS: 'miscellaneous'
};

export const ALL_SEGMENTS = Object.values(SEGMENTS);

// ============================================
// BANDWIDTH TYPES
// ============================================
export const BANDWIDTH_TYPES = {
  FIXED: 'fixed',
  USER_LEVEL: 'userLevel'
};

export const ALL_BANDWIDTH_TYPES = Object.values(BANDWIDTH_TYPES);

// ============================================
// PRODUCTS
// ============================================
export const PRODUCTS = {
  WIFI_BASIC: 'spectra_wifi_basic',
  WIFI_STANDARD: 'spectra_wifi_standard',
  WIFI_PREMIUM: 'spectra_wifi_premium',
  WIFI_ENTERPRISE: 'spectra_wifi_enterprise',
  MANAGED_WIFI: 'spectra_managed_wifi',
  HOTSPOT: 'spectra_hotspot'
};

export const ALL_PRODUCTS = Object.values(PRODUCTS);

// ============================================
// ACCESS LEVELS
// ============================================
export const ACCESS_LEVELS = {
  SITE: 'site',
  COMPANY: 'company'
};

// ============================================
// REPORT CATEGORIES
// ============================================
export const REPORT_CATEGORIES = {
  BILLING: 'Billing',
  USAGE: 'Usage',
  WIFI_NETWORK: 'Wi-Fi Network',
  END_USER: 'End-User',
  INTERNET: 'Internet',
  SLA: 'SLA',
  AUTHENTICATION: 'Authentication',
  UPSELL: 'Upsell',
  COMPANY: 'Company'
};

// ============================================
// MASTER REPORT CONFIGURATION
// Each report has applicability settings that can be modified by Spectra admin
// ============================================
export const MASTER_REPORT_CONFIG = {
  // ==========================================
  // BILLING REPORTS
  // ==========================================
  'site-monthly-active-users': {
    id: 'site-monthly-active-users',
    name: 'Monthly Active Users',
    category: REPORT_CATEGORIES.BILLING,
    subcategory: 'Active Users',
    description: 'Monthly average active users across all policies for billing reconciliation',
    accessLevel: ACCESS_LEVELS.SITE,
    // Applicability - admin can modify these arrays
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    // Default selection when provisioning new site
    defaultSelected: true,
    // Whether this is a commonly used report
    isCommon: true
  },

  'daily-average-active-users': {
    id: 'daily-average-active-users',
    name: 'Daily Average Active Users',
    category: REPORT_CATEGORIES.BILLING,
    subcategory: 'Active Users',
    description: 'Daily breakdown of average active users for detailed billing analysis',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: true
  },

  'policy-wise-monthly-average-active-users': {
    id: 'policy-wise-monthly-average-active-users',
    name: 'Policy-wise Monthly Average Active Users',
    category: REPORT_CATEGORIES.BILLING,
    subcategory: 'Policy Analysis',
    description: 'Monthly active users segmented by policy type',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: [BANDWIDTH_TYPES.USER_LEVEL], // Only for user-level bandwidth
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: true
  },

  'company-average-active-users': {
    id: 'company-average-active-users',
    name: 'Average Active Users Summary (Company)',
    category: REPORT_CATEGORIES.BILLING,
    subcategory: 'Active Users',
    description: 'Company-wide active user overview for enterprise billing',
    accessLevel: ACCESS_LEVELS.COMPANY,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  // ==========================================
  // USAGE REPORTS
  // ==========================================
  'monthly-data-usage-summary': {
    id: 'monthly-data-usage-summary',
    name: 'Monthly Data Usage Summary (Site)',
    category: REPORT_CATEGORIES.USAGE,
    subcategory: 'Data Consumption',
    description: 'Total, peak, and average data usage per month at site level',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: true
  },

  'company-monthly-data-usage': {
    id: 'company-monthly-data-usage',
    name: 'Monthly Data Usage Summary (Company)',
    category: REPORT_CATEGORIES.USAGE,
    subcategory: 'Data Consumption',
    description: 'Company-wide data usage trends and patterns',
    accessLevel: ACCESS_LEVELS.COMPANY,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  // ==========================================
  // WI-FI NETWORK REPORTS
  // ==========================================
  'network-usage-report': {
    id: 'network-usage-report',
    name: 'Network Usage (GB)',
    category: REPORT_CATEGORIES.WIFI_NETWORK,
    subcategory: 'Performance',
    description: 'Daily network usage tracking for capacity planning',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: true
  },

  'access-point-list': {
    id: 'access-point-list',
    name: 'Access Point List',
    category: REPORT_CATEGORIES.WIFI_NETWORK,
    subcategory: 'Infrastructure',
    description: 'Complete inventory of all access points with status',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  'access-point-mac-list': {
    id: 'access-point-mac-list',
    name: 'Access Point MAC List',
    category: REPORT_CATEGORIES.WIFI_NETWORK,
    subcategory: 'Infrastructure',
    description: 'MAC addresses of all registered access points',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  'client-list': {
    id: 'client-list',
    name: 'Client List',
    category: REPORT_CATEGORIES.WIFI_NETWORK,
    subcategory: 'Connected Devices',
    description: 'All currently connected clients with connection details',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  'user-ap-analytics': {
    id: 'user-ap-analytics',
    name: 'User Access Point Analytics',
    category: REPORT_CATEGORIES.WIFI_NETWORK,
    subcategory: 'Usage Patterns',
    description: 'User distribution and roaming patterns across access points',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  'rogue-ap-list': {
    id: 'rogue-ap-list',
    name: 'Rogue AP List',
    category: REPORT_CATEGORIES.WIFI_NETWORK,
    subcategory: 'Security',
    description: 'Detected rogue access points for security monitoring',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  'alarm-list': {
    id: 'alarm-list',
    name: 'Alarm List',
    category: REPORT_CATEGORIES.WIFI_NETWORK,
    subcategory: 'Alerts',
    description: 'System alarms and critical network events',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  'event-list': {
    id: 'event-list',
    name: 'Event List',
    category: REPORT_CATEGORIES.WIFI_NETWORK,
    subcategory: 'Logs',
    description: 'Comprehensive log of all network events',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  // ==========================================
  // END-USER REPORTS
  // ==========================================
  'speed-tier-report': {
    id: 'speed-tier-report',
    name: 'Users by Speed Tier',
    category: REPORT_CATEGORIES.END_USER,
    subcategory: 'Policy Distribution',
    description: 'User distribution across speed tiers for capacity planning',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: [BANDWIDTH_TYPES.USER_LEVEL], // Only for user-level bandwidth
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: true
  },

  'user-session-history': {
    id: 'user-session-history',
    name: 'User Session History',
    category: REPORT_CATEGORIES.END_USER,
    subcategory: 'Activity',
    description: 'Historical session data for individual users',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  'user-data-consumption': {
    id: 'user-data-consumption',
    name: 'User Data Consumption',
    category: REPORT_CATEGORIES.END_USER,
    subcategory: 'Usage',
    description: 'Individual user data consumption over time',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  // ==========================================
  // INTERNET REPORTS
  // These are ONLY applicable for Managed WiFi (not Managed WiFi Infra)
  // because Spectra manages internet only in Managed WiFi solution
  // ==========================================
  'bandwidth-utilization': {
    id: 'bandwidth-utilization',
    name: 'Bandwidth Utilization',
    category: REPORT_CATEGORIES.INTERNET,
    subcategory: 'Performance',
    description: 'Internet bandwidth usage patterns and peak times',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI], // Not available for Managed WiFi Infra
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  'internet-uptime': {
    id: 'internet-uptime',
    name: 'Internet Uptime Report',
    category: REPORT_CATEGORIES.INTERNET,
    subcategory: 'Reliability',
    description: 'Internet connectivity uptime and outage tracking',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI], // Not available for Managed WiFi Infra
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  // ==========================================
  // SLA REPORTS
  // ==========================================
  'sla-compliance': {
    id: 'sla-compliance',
    name: 'SLA Compliance Report',
    category: REPORT_CATEGORIES.SLA,
    subcategory: 'Compliance',
    description: 'Service level agreement compliance metrics',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  // ==========================================
  // AUTHENTICATION REPORTS
  // ==========================================
  'authentication-logs': {
    id: 'authentication-logs',
    name: 'Authentication Logs',
    category: REPORT_CATEGORIES.AUTHENTICATION,
    subcategory: 'Security',
    description: 'User authentication attempts and outcomes',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  'failed-authentication': {
    id: 'failed-authentication',
    name: 'Failed Authentication Report',
    category: REPORT_CATEGORIES.AUTHENTICATION,
    subcategory: 'Security',
    description: 'Failed login attempts for security monitoring',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  // ==========================================
  // UPSELL REPORTS
  // These are ONLY applicable for Managed WiFi with User-Level Bandwidth
  // Top-ups are not available for Managed WiFi Infra or Fixed Bandwidth
  // ==========================================
  'addon-usage-report': {
    id: 'addon-usage-report',
    name: 'Add-on Usage Report',
    category: REPORT_CATEGORIES.UPSELL,
    subcategory: 'Revenue',
    description: 'User adoption and usage of premium add-ons',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI], // Not available for Managed WiFi Infra
    segments: ALL_SEGMENTS,
    bandwidthTypes: [BANDWIDTH_TYPES.USER_LEVEL], // Only for user-level bandwidth
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  'topup-history': {
    id: 'topup-history',
    name: 'Top-up Purchase History (All Types)',
    category: REPORT_CATEGORIES.UPSELL,
    subcategory: 'Revenue',
    description: 'All user top-up purchases and spending patterns across all topup types',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI], // Not available for Managed WiFi Infra
    segments: ALL_SEGMENTS,
    bandwidthTypes: [BANDWIDTH_TYPES.USER_LEVEL], // Only for user-level bandwidth
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: false
  },

  'topup-history-speed': {
    id: 'topup-history-speed',
    name: 'Speed Boost Top-up History',
    category: REPORT_CATEGORIES.UPSELL,
    subcategory: 'Revenue',
    description: 'Speed boost top-up purchases - users who upgraded their internet speed',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI],
    segments: ALL_SEGMENTS,
    bandwidthTypes: [BANDWIDTH_TYPES.USER_LEVEL],
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  'topup-history-data': {
    id: 'topup-history-data',
    name: 'Data Pack Top-up History',
    category: REPORT_CATEGORIES.UPSELL,
    subcategory: 'Revenue',
    description: 'Data pack top-up purchases - users who purchased additional data',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI],
    segments: ALL_SEGMENTS,
    bandwidthTypes: [BANDWIDTH_TYPES.USER_LEVEL],
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  'topup-history-device': {
    id: 'topup-history-device',
    name: 'Extra Device Top-up History',
    category: REPORT_CATEGORIES.UPSELL,
    subcategory: 'Revenue',
    description: 'Extra device top-up purchases - users who added more devices',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI],
    segments: ALL_SEGMENTS,
    bandwidthTypes: [BANDWIDTH_TYPES.USER_LEVEL],
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  'topup-history-plan': {
    id: 'topup-history-plan',
    name: 'Plan Upgrade Top-up History',
    category: REPORT_CATEGORIES.UPSELL,
    subcategory: 'Revenue',
    description: 'Plan upgrade top-up purchases - users who upgraded to a higher plan',
    accessLevel: ACCESS_LEVELS.SITE,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI],
    segments: ALL_SEGMENTS,
    bandwidthTypes: [BANDWIDTH_TYPES.USER_LEVEL],
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  // ==========================================
  // COMPANY-LEVEL REPORTS
  // ==========================================
  'company-overview-dashboard': {
    id: 'company-overview-dashboard',
    name: 'Company Overview Dashboard',
    category: REPORT_CATEGORIES.COMPANY,
    subcategory: 'Overview',
    description: 'Executive summary across all sites with key metrics',
    accessLevel: ACCESS_LEVELS.COMPANY,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: true
  },

  'cross-site-usage-comparison': {
    id: 'cross-site-usage-comparison',
    name: 'Cross-Site Usage Comparison',
    category: REPORT_CATEGORIES.COMPANY,
    subcategory: 'Comparison',
    description: 'Compare bandwidth and data usage across all sites',
    accessLevel: ACCESS_LEVELS.COMPANY,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: true
  },

  'consolidated-billing-report': {
    id: 'consolidated-billing-report',
    name: 'Consolidated Billing Report',
    category: REPORT_CATEGORIES.COMPANY,
    subcategory: 'Billing',
    description: 'Combined billing summary for all sites',
    accessLevel: ACCESS_LEVELS.COMPANY,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: true
  },

  'company-license-utilization': {
    id: 'company-license-utilization',
    name: 'License Utilization by Site',
    category: REPORT_CATEGORIES.COMPANY,
    subcategory: 'Licensing',
    description: 'License allocation and utilization across all sites',
    accessLevel: ACCESS_LEVELS.COMPANY,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: true,
    isCommon: true
  },

  'company-user-distribution': {
    id: 'company-user-distribution',
    name: 'User Distribution by Site',
    category: REPORT_CATEGORIES.COMPANY,
    subcategory: 'Users',
    description: 'Distribution of users across all company sites',
    accessLevel: ACCESS_LEVELS.COMPANY,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  },

  'company-alerts-summary': {
    id: 'company-alerts-summary',
    name: 'Company-Wide Alerts Summary',
    category: REPORT_CATEGORIES.COMPANY,
    subcategory: 'Alerts',
    description: 'Aggregated alerts and incidents across all sites',
    accessLevel: ACCESS_LEVELS.COMPANY,
    solutionTypes: [SOLUTION_TYPES.MANAGED_WIFI, SOLUTION_TYPES.MANAGED_WIFI_INFRA],
    segments: ALL_SEGMENTS,
    bandwidthTypes: ALL_BANDWIDTH_TYPES,
    products: ALL_PRODUCTS,
    defaultSelected: false,
    isCommon: false
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all available reports
 * @returns {Array} Array of all report configurations
 */
export const getAllReports = () => {
  return Object.values(MASTER_REPORT_CONFIG);
};

/**
 * Get report by ID
 * @param {string} reportId - The report ID
 * @returns {Object|null} Report configuration or null
 */
export const getReportById = (reportId) => {
  return MASTER_REPORT_CONFIG[reportId] || null;
};

/**
 * Check if a report is available for given criteria
 * @param {string} reportId - The report ID
 * @param {Object} criteria - Filter criteria
 * @param {string} criteria.solutionType - Solution type
 * @param {string} criteria.segment - Segment type
 * @param {string} criteria.bandwidthType - Bandwidth type
 * @param {string} criteria.product - Product name
 * @param {string} criteria.accessLevel - Access level (site/company)
 * @returns {boolean} Whether the report is available
 */
export const isReportAvailable = (reportId, criteria = {}) => {
  const report = MASTER_REPORT_CONFIG[reportId];
  if (!report) return false;

  const { solutionType, segment, bandwidthType, product, accessLevel } = criteria;

  // Check solution type
  if (solutionType && !report.solutionTypes.includes(solutionType)) {
    return false;
  }

  // Check segment
  if (segment && !report.segments.includes(segment)) {
    return false;
  }

  // Check bandwidth type
  if (bandwidthType && !report.bandwidthTypes.includes(bandwidthType)) {
    return false;
  }

  // Check product
  if (product && !report.products.includes(product)) {
    return false;
  }

  // Check access level
  if (accessLevel && report.accessLevel !== accessLevel) {
    return false;
  }

  return true;
};

/**
 * Get available reports based on criteria
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Array of available report configurations
 */
export const getAvailableReports = (criteria = {}) => {
  return getAllReports().filter(report => isReportAvailable(report.id, criteria));
};

/**
 * Get available site-level reports for given criteria
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Array of site-level report configurations
 */
export const getSiteReports = (criteria = {}) => {
  return getAvailableReports({ ...criteria, accessLevel: ACCESS_LEVELS.SITE });
};

/**
 * Get available company-level reports for given criteria
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Array of company-level report configurations
 */
export const getCompanyReports = (criteria = {}) => {
  return getAvailableReports({ ...criteria, accessLevel: ACCESS_LEVELS.COMPANY });
};

/**
 * Get reports by category
 * @param {string} category - Report category
 * @param {Object} criteria - Optional filter criteria
 * @returns {Array} Array of reports in the category
 */
export const getReportsByCategory = (category, criteria = {}) => {
  return getAvailableReports(criteria).filter(report => report.category === category);
};

/**
 * Get default selected reports for site provisioning
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Array of default selected report objects
 */
export const getDefaultSelectedReports = (criteria = {}) => {
  return getAvailableReports(criteria)
    .filter(report => report.defaultSelected && report.accessLevel === ACCESS_LEVELS.SITE)
    .map(report => ({
      id: report.id,
      label: report.name,
      selected: true
    }));
};

/**
 * Get all report categories with their reports
 * @param {Object} criteria - Optional filter criteria
 * @returns {Object} Object with categories as keys and report arrays as values
 */
export const getReportsByCategories = (criteria = {}) => {
  const reports = getAvailableReports(criteria);
  const categories = {};

  reports.forEach(report => {
    if (!categories[report.category]) {
      categories[report.category] = [];
    }
    categories[report.category].push(report);
  });

  return categories;
};

/**
 * Get report availability summary
 * @param {string} reportId - The report ID
 * @returns {Object} Summary of report availability
 */
export const getReportAvailabilitySummary = (reportId) => {
  const report = MASTER_REPORT_CONFIG[reportId];
  if (!report) return null;

  return {
    id: report.id,
    name: report.name,
    category: report.category,
    accessLevel: report.accessLevel,
    availableFor: {
      solutionTypes: report.solutionTypes,
      segments: report.segments,
      bandwidthTypes: report.bandwidthTypes,
      products: report.products
    },
    restrictions: {
      managedWifiOnly: !report.solutionTypes.includes(SOLUTION_TYPES.MANAGED_WIFI_INFRA),
      userLevelOnly: report.bandwidthTypes.length === 1 && report.bandwidthTypes[0] === BANDWIDTH_TYPES.USER_LEVEL
    }
  };
};

/**
 * Export configuration for admin UI
 * @returns {Object} Complete configuration for admin management
 */
export const getAdminConfiguration = () => {
  return {
    solutionTypes: Object.entries(SOLUTION_TYPES).map(([key, value]) => ({
      key,
      value,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    })),
    segments: Object.entries(SEGMENTS).map(([key, value]) => ({
      key,
      value,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    })),
    bandwidthTypes: Object.entries(BANDWIDTH_TYPES).map(([key, value]) => ({
      key,
      value,
      label: key === 'USER_LEVEL' ? 'User Level' : 'Fixed'
    })),
    products: Object.entries(PRODUCTS).map(([key, value]) => ({
      key,
      value,
      label: value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    })),
    accessLevels: Object.entries(ACCESS_LEVELS).map(([key, value]) => ({
      key,
      value,
      label: key.charAt(0) + key.slice(1).toLowerCase()
    })),
    categories: Object.values(REPORT_CATEGORIES),
    reports: getAllReports()
  };
};

export default MASTER_REPORT_CONFIG;
