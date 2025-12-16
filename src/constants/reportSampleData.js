// src/constants/reportSampleData.js

/**
 * Centralized Report Sample Data
 * Provides sample data for all reports with support for different date periods
 *
 * This file consolidates all sample data generation for reports, ensuring
 * consistent data availability across default and custom date ranges.
 */

import * as reportGen from '../utils/reportDataGenerator';

// ============================================
// DATE PERIOD HELPERS
// ============================================

/**
 * Get date range based on period preset
 * @param {string} periodType - Period type (today, last7days, last30days, last90days, thisMonth, last6months, last12months, custom)
 * @param {Object} customRange - Custom date range { start, end }
 * @returns {Object} Date range { startDate, endDate, days, months }
 */
export const getDateRangeFromPeriod = (periodType, customRange = null) => {
  const today = new Date();
  let startDate, endDate, days, months;

  switch (periodType) {
    case 'today':
      startDate = today.toISOString().split('T')[0];
      endDate = startDate;
      days = 1;
      months = 0;
      break;

    case 'last7days':
      startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
      endDate = new Date().toISOString().split('T')[0];
      days = 7;
      months = 0;
      break;

    case 'last30days':
      startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
      endDate = new Date().toISOString().split('T')[0];
      days = 30;
      months = 1;
      break;

    case 'last90days':
      startDate = new Date(today.setDate(today.getDate() - 90)).toISOString().split('T')[0];
      endDate = new Date().toISOString().split('T')[0];
      days = 90;
      months = 3;
      break;

    case 'thisMonth':
      startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
      endDate = new Date().toISOString().split('T')[0];
      days = new Date().getDate();
      months = 1;
      break;

    case 'last6months':
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      startDate = sixMonthsAgo.toISOString().split('T')[0];
      endDate = new Date().toISOString().split('T')[0];
      days = 180;
      months = 6;
      break;

    case 'last12months':
      const twelveMonthsAgo = new Date(today);
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      startDate = twelveMonthsAgo.toISOString().split('T')[0];
      endDate = new Date().toISOString().split('T')[0];
      days = 365;
      months = 12;
      break;

    case 'custom':
      if (customRange) {
        startDate = customRange.start;
        endDate = customRange.end;
        const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        months = Math.max(1, Math.ceil(days / 30));
      } else {
        // Default to last 30 days if no custom range provided
        startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        days = 30;
        months = 1;
      }
      break;

    default:
      // Default to last 30 days
      startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
      endDate = new Date().toISOString().split('T')[0];
      days = 30;
      months = 1;
  }

  return { startDate, endDate, days, months };
};

/**
 * Get month range from date range
 */
const getMonthFromDate = (date) => {
  return date.substring(0, 7); // YYYY-MM
};

// ============================================
// REPORT DATA GENERATORS
// Each function generates sample data for a specific report
// ============================================

/**
 * Site Monthly Active Users
 */
export const getSiteMonthlyActiveUsersData = (periodType = 'last6months', customRange = null) => {
  const { startDate, months } = getDateRangeFromPeriod(periodType, customRange);
  const startMonth = getMonthFromDate(startDate);
  return reportGen.generateMonthlyActiveUsers(startMonth, Math.max(1, months));
};

/**
 * Daily Average Active Users
 */
export const getDailyAverageActiveUsersData = (periodType = 'last30days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateDailyActiveUsers(startDate, days);
};

/**
 * Policy-wise Monthly Average Active Users
 */
export const getPolicyWiseActiveUsersData = (periodType = 'last6months', customRange = null) => {
  const { startDate, months } = getDateRangeFromPeriod(periodType, customRange);
  const startMonth = getMonthFromDate(startDate);
  return reportGen.generatePolicyWiseUsers(startMonth, Math.max(1, months));
};

/**
 * Monthly Data Usage Summary
 */
export const getMonthlyDataUsageData = (periodType = 'last6months', customRange = null) => {
  const { startDate, months } = getDateRangeFromPeriod(periodType, customRange);
  const startMonth = getMonthFromDate(startDate);
  return reportGen.generateMonthlyDataUsage(startMonth, Math.max(1, months));
};

/**
 * Network Usage Report
 */
export const getNetworkUsageData = (periodType = 'last30days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateNetworkUsage(startDate, days);
};

/**
 * Speed Tier Report
 */
export const getSpeedTierData = () => {
  return [
    { speedTier: '10 Mbps', userCount: reportGen.randomInRange(50, 100) },
    { speedTier: '25 Mbps', userCount: reportGen.randomInRange(80, 150) },
    { speedTier: '50 Mbps', userCount: reportGen.randomInRange(120, 200) },
    { speedTier: '100 Mbps', userCount: reportGen.randomInRange(60, 120) },
    { speedTier: '200 Mbps', userCount: reportGen.randomInRange(30, 70) },
    { speedTier: 'Unlimited', userCount: reportGen.randomInRange(20, 50) }
  ];
};

/**
 * User Session History
 */
export const getUserSessionHistoryData = (periodType = 'last7days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateUserSessions(startDate, days);
};

/**
 * User Data Consumption
 */
export const getUserDataConsumptionData = (periodType = 'last30days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateUserDataConsumption(startDate, days);
};

/**
 * Access Point List
 */
export const getAccessPointListData = () => {
  return reportGen.generateAccessPointList();
};

/**
 * Access Point MAC List
 */
export const getAccessPointMACListData = () => {
  const apList = reportGen.generateAccessPointList();
  return apList.map(ap => ({
    mac: ap.mac,
    apName: ap.apName,
    vendor: ['Cisco', 'Aruba', 'Ubiquiti', 'Ruckus', 'Fortinet'][Math.floor(Math.random() * 5)]
  }));
};

/**
 * Client List
 */
export const getClientListData = () => {
  return reportGen.generateClientList();
};

/**
 * User AP Analytics
 */
export const getUserAPAnalyticsData = (periodType = 'last30days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateUserAPAnalytics(startDate, days);
};

/**
 * Rogue AP List
 */
export const getRogueAPListData = () => {
  return reportGen.generateRogueAPList();
};

/**
 * Alarm List
 */
export const getAlarmListData = (periodType = 'last7days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateAlarmList(startDate, days);
};

/**
 * Event List
 */
export const getEventListData = (periodType = 'last7days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateEventList(startDate, days);
};

/**
 * Bandwidth Utilization
 */
export const getBandwidthUtilizationData = (periodType = 'last7days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateBandwidthUtilization(startDate, days);
};

/**
 * Internet Uptime
 */
export const getInternetUptimeData = (periodType = 'last30days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateInternetUptime(startDate, days);
};

/**
 * SLA Compliance
 */
export const getSLAComplianceData = (periodType = 'last6months', customRange = null) => {
  const { startDate, months } = getDateRangeFromPeriod(periodType, customRange);
  const startMonth = getMonthFromDate(startDate);
  return reportGen.generateSLACompliance(startMonth, Math.max(1, months));
};

/**
 * Authentication Logs
 */
export const getAuthenticationLogsData = (periodType = 'last7days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateAuthenticationLogs(startDate, days);
};

/**
 * Failed Authentication
 */
export const getFailedAuthenticationData = (periodType = 'last7days', customRange = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateFailedAuthentication(startDate, days);
};

/**
 * Add-on Usage Report
 */
export const getAddonUsageData = (periodType = 'last6months', customRange = null) => {
  const { startDate, months } = getDateRangeFromPeriod(periodType, customRange);
  const startMonth = getMonthFromDate(startDate);
  return reportGen.generateAddonUsage(startMonth, Math.max(1, months));
};

/**
 * Top-up History (All Types)
 */
export const getTopupHistoryData = (periodType = 'last30days', customRange = null, topupType = null) => {
  const { startDate, days } = getDateRangeFromPeriod(periodType, customRange);
  return reportGen.generateTopupHistory(startDate, days, topupType);
};

/**
 * Top-up History by Type (Speed Boost)
 */
export const getTopupHistorySpeedData = (periodType = 'last30days', customRange = null) => {
  return getTopupHistoryData(periodType, customRange, 'speed');
};

/**
 * Top-up History by Type (Data Pack)
 */
export const getTopupHistoryDataData = (periodType = 'last30days', customRange = null) => {
  return getTopupHistoryData(periodType, customRange, 'data');
};

/**
 * Top-up History by Type (Extra Device)
 */
export const getTopupHistoryDeviceData = (periodType = 'last30days', customRange = null) => {
  return getTopupHistoryData(periodType, customRange, 'device');
};

/**
 * Top-up History by Type (Plan Upgrade)
 */
export const getTopupHistoryPlanData = (periodType = 'last30days', customRange = null) => {
  return getTopupHistoryData(periodType, customRange, 'plan');
};

// ============================================
// COMPANY-LEVEL REPORT DATA GENERATORS
// ============================================

/**
 * Company Overview Dashboard Data
 */
export const getCompanyOverviewData = () => {
  return {
    totalSites: 6,
    totalUsers: 2850,
    totalDevices: 4200,
    totalBandwidth: '2 Gbps',
    usedBandwidth: '1.4 Gbps',
    bandwidthUtilization: 70,
    activeAlerts: 7,
    criticalAlerts: 1
  };
};

/**
 * Cross-Site Usage Comparison Data
 */
export const getCrossSiteUsageData = (periodType = 'last6months', customRange = null) => {
  const sites = [
    'Mumbai HQ',
    'Delhi Branch',
    'Bangalore Tech Center',
    'Hyderabad Office',
    'Chennai Branch',
    'Pune Development Center'
  ];

  return sites.map(siteName => ({
    siteName,
    totalUsers: reportGen.randomInRange(150, 850),
    avgBandwidth: `${reportGen.randomInRange(50, 300)} Mbps`,
    dataUsage: `${reportGen.randomFloat(100, 800, 1)} GB`
  }));
};

/**
 * Consolidated Billing Report Data
 */
export const getConsolidatedBillingData = (periodType = 'last6months', customRange = null) => {
  const { startDate, months } = getDateRangeFromPeriod(periodType, customRange);
  const sites = [
    'Mumbai HQ',
    'Delhi Branch',
    'Bangalore Tech Center',
    'Hyderabad Office',
    'Chennai Branch',
    'Pune Development Center'
  ];

  return sites.map(siteName => ({
    siteName,
    activeUsers: reportGen.randomInRange(100, 500),
    billedAmount: `₹${reportGen.randomInRange(50000, 250000).toLocaleString()}`,
    dueDate: `${startDate.substring(0, 7)}-28`
  }));
};

/**
 * License Utilization by Site Data
 */
export const getLicenseUtilizationData = () => {
  const sites = [
    { name: 'Mumbai HQ', allocated: 1000 },
    { name: 'Delhi Branch', allocated: 700 },
    { name: 'Bangalore Tech Center', allocated: 600 },
    { name: 'Hyderabad Office', allocated: 450 },
    { name: 'Chennai Branch', allocated: 350 },
    { name: 'Pune Development Center', allocated: 250 }
  ];

  return sites.map(site => {
    const used = reportGen.randomInRange(Math.round(site.allocated * 0.6), Math.round(site.allocated * 0.95));
    return {
      siteName: site.name,
      allocatedLicenses: site.allocated,
      usedLicenses: used,
      utilizationRate: `${Math.round((used / site.allocated) * 100)}%`
    };
  });
};

/**
 * User Distribution by Site Data
 */
export const getUserDistributionData = (periodType = 'last6months', customRange = null) => {
  const sites = [
    'Mumbai HQ',
    'Delhi Branch',
    'Bangalore Tech Center',
    'Hyderabad Office',
    'Chennai Branch',
    'Pune Development Center'
  ];

  return sites.map(siteName => {
    const activeUsers = reportGen.randomInRange(200, 700);
    const suspendedUsers = reportGen.randomInRange(10, 50);
    const newUsers = reportGen.randomInRange(5, 30);

    return {
      siteName,
      activeUsers,
      suspendedUsers,
      newUsers
    };
  });
};

/**
 * Company Alerts Summary Data
 */
export const getCompanyAlertsSummaryData = (periodType = 'last30days', customRange = null) => {
  const sites = [
    'Mumbai HQ',
    'Delhi Branch',
    'Bangalore Tech Center',
    'Hyderabad Office',
    'Chennai Branch',
    'Pune Development Center'
  ];

  return sites.map(siteName => ({
    siteName,
    criticalAlerts: reportGen.randomInRange(0, 3),
    warningAlerts: reportGen.randomInRange(2, 15),
    resolvedAlerts: reportGen.randomInRange(10, 50)
  }));
};

/**
 * Company Average Active Users Summary Data
 */
export const getCompanyActiveUsersData = (periodType = 'last12months', customRange = null) => {
  const { startDate, months } = getDateRangeFromPeriod(periodType, customRange);
  const startMonth = getMonthFromDate(startDate);
  const monthsArray = reportGen.generateMonthRange(startMonth, Math.max(1, months));

  return monthsArray.map((month, index) => ({
    month,
    company: 'Sample Technologies Pvt Ltd',
    totalActiveUsers: reportGen.trendingValue(2500, index, 1.03, 0.08),
    yearOverYear: reportGen.randomFloat(-5, 15, 1)
  }));
};

/**
 * Company Monthly Data Usage Data
 */
export const getCompanyDataUsageData = (periodType = 'last12months', customRange = null) => {
  const { startDate, months } = getDateRangeFromPeriod(periodType, customRange);
  const startMonth = getMonthFromDate(startDate);
  const monthsArray = reportGen.generateMonthRange(startMonth, Math.max(1, months));

  return monthsArray.map((month, index) => ({
    month,
    company: 'Sample Technologies Pvt Ltd',
    totalUsageTB: reportGen.trendingValue(1.2, index, 1.08, 0.1).toFixed(2),
    yearOverYear: reportGen.randomFloat(-3, 20, 1)
  }));
};

// ============================================
// MASTER REPORT DATA MAPPING
// Maps report IDs to their data generator functions
// ============================================

export const REPORT_DATA_GENERATORS = {
  // Billing Reports
  'site-monthly-active-users': getSiteMonthlyActiveUsersData,
  'daily-average-active-users': getDailyAverageActiveUsersData,
  'policy-wise-monthly-average-active-users': getPolicyWiseActiveUsersData,
  'company-average-active-users': getCompanyActiveUsersData,

  // Usage Reports
  'monthly-data-usage-summary': getMonthlyDataUsageData,
  'company-monthly-data-usage': getCompanyDataUsageData,

  // Wi-Fi Network Reports
  'network-usage-report': getNetworkUsageData,
  'access-point-list': getAccessPointListData,
  'access-point-mac-list': getAccessPointMACListData,
  'client-list': getClientListData,
  'user-ap-analytics': getUserAPAnalyticsData,
  'rogue-ap-list': getRogueAPListData,
  'alarm-list': getAlarmListData,
  'event-list': getEventListData,

  // End-User Reports
  'speed-tier-report': getSpeedTierData,
  'user-session-history': getUserSessionHistoryData,
  'user-data-consumption': getUserDataConsumptionData,

  // Internet Reports
  'bandwidth-utilization': getBandwidthUtilizationData,
  'internet-uptime': getInternetUptimeData,

  // SLA Reports
  'sla-compliance': getSLAComplianceData,

  // Authentication Reports
  'authentication-logs': getAuthenticationLogsData,
  'failed-authentication': getFailedAuthenticationData,

  // Upsell Reports
  'addon-usage-report': getAddonUsageData,
  'topup-history': getTopupHistoryData,
  'topup-history-speed': getTopupHistorySpeedData,
  'topup-history-data': getTopupHistoryDataData,
  'topup-history-device': getTopupHistoryDeviceData,
  'topup-history-plan': getTopupHistoryPlanData,

  // Company Reports
  'company-overview-dashboard': getCompanyOverviewData,
  'cross-site-usage-comparison': getCrossSiteUsageData,
  'consolidated-billing-report': getConsolidatedBillingData,
  'company-license-utilization': getLicenseUtilizationData,
  'company-user-distribution': getUserDistributionData,
  'company-alerts-summary': getCompanyAlertsSummaryData
};

/**
 * Get sample data for a specific report
 * @param {string} reportId - Report ID
 * @param {string} periodType - Period type preset
 * @param {Object} customRange - Custom date range
 * @returns {Array|Object} Sample data for the report
 */
export const getReportSampleData = (reportId, periodType = null, customRange = null) => {
  const generator = REPORT_DATA_GENERATORS[reportId];

  if (!generator) {
    console.warn(`No sample data generator found for report: ${reportId}`);
    return [];
  }

  // If the generator doesn't accept period parameters, just call it directly
  if (generator.length === 0) {
    return generator();
  }

  // Call with period parameters
  return generator(periodType, customRange);
};

/**
 * Get sample data for multiple reports
 * @param {Array<string>} reportIds - Array of report IDs
 * @param {string} periodType - Period type preset
 * @param {Object} customRange - Custom date range
 * @returns {Object} Map of reportId to sample data
 */
export const getMultipleReportsSampleData = (reportIds, periodType = null, customRange = null) => {
  const result = {};

  reportIds.forEach(reportId => {
    result[reportId] = getReportSampleData(reportId, periodType, customRange);
  });

  return result;
};

/**
 * Available period presets with labels
 */
export const PERIOD_PRESETS = [
  { value: 'today', label: 'Today', days: 1 },
  { value: 'last7days', label: 'Last 7 Days', days: 7 },
  { value: 'last30days', label: 'Last 30 Days', days: 30 },
  { value: 'last90days', label: 'Last 90 Days', days: 90 },
  { value: 'thisMonth', label: 'This Month', days: null },
  { value: 'last6months', label: 'Last 6 Months', months: 6 },
  { value: 'last12months', label: 'Last 12 Months', months: 12 },
  { value: 'custom', label: 'Custom Range', days: null }
];

/**
 * Get default period for a report based on its criteria type
 * @param {string} criteriaType - monthRange or dateRange
 * @returns {string} Default period preset value
 */
export const getDefaultPeriodForReport = (criteriaType) => {
  switch (criteriaType) {
    case 'monthRange':
      return 'last6months';
    case 'dateRange':
      return 'last30days';
    default:
      return 'last30days';
  }
};

export default {
  getDateRangeFromPeriod,
  getReportSampleData,
  getMultipleReportsSampleData,
  REPORT_DATA_GENERATORS,
  PERIOD_PRESETS,
  getDefaultPeriodForReport
};
