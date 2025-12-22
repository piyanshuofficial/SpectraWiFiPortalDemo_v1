/**
 * ============================================================================
 * useSegmentCompanyData Hook (and related hooks)
 * ============================================================================
 *
 * @file src/hooks/useSegmentCompanyData.js
 * @description Collection of hooks that provide segment-specific data.
 *              Used throughout the portal to get company, site, user, and
 *              policy data that matches the current user's segment.
 *
 * @concept
 * The portal serves multiple business segments (Enterprise, Hotel, PG, etc.).
 * Each segment has its own sample/demo data. These hooks provide that data
 * filtered by the current segment from SegmentContext.
 *
 * @hooksProvided
 * | Hook                      | Returns                              | Use Case                    |
 * |---------------------------|--------------------------------------|-----------------------------|
 * | useSegmentCompanyData     | All segment data (company, sites...) | Dashboard, main views       |
 * | useSegmentSites           | ACTIVE sites only                    | Customer portal site lists  |
 * | useAllSegmentSites        | ALL sites (inc. pending)             | Internal admin views        |
 * | useSegmentUsers           | Users for segment                    | User management             |
 * | useSegmentStats           | Statistics/metrics                   | Dashboard cards             |
 * | useSegmentPolicies        | Policies for segment                 | Policy dropdown             |
 * | useSegmentActivityLogs    | Activity logs                        | Activity log page           |
 * | useSegmentChartData       | Chart datasets                       | Dashboard charts            |
 *
 * @siteStatuses
 * useSegmentSites returns only ACTIVE sites. Sites can have these statuses:
 * - active            : Live and visible to customers
 * - inactive          : Temporarily disabled
 * - configuration_pending : Still being configured (not visible)
 * - under_testing     : Being tested before go-live (not visible)
 * - rfs_pending       : Ready For Service pending (not visible)
 *
 * @dataStructure
 * ```
 * segmentCompanyData
 * ├── enterprise
 * │   ├── company: { id, name, industry, contact }
 * │   ├── sites: [{ siteId, siteName, location, status }]
 * │   ├── users: [{ userId, name, email, role }]
 * │   ├── policies: [{ policyId, name, speed }]
 * │   ├── stats: { activeUsers, totalDevices, bandwidth }
 * │   └── chartData: { usage[], devices[] }
 * ├── hotel
 * │   └── ... (same structure, hotel-specific data)
 * └── ... (other segments)
 * ```
 *
 * @usage
 * ```jsx
 * // Get all segment data at once
 * const { company, sites, users, stats } = useSegmentCompanyData();
 *
 * // Get just sites (active only for customer portal)
 * const { sites } = useSegmentSites();
 *
 * // Get all sites including pending (for internal admin)
 * const { sites } = useAllSegmentSites();
 *
 * // Get chart data for dashboard
 * const { chartData } = useSegmentChartData();
 * ```
 *
 * @memoization
 * All data is memoized and only recalculated when currentSegment changes.
 * This prevents unnecessary re-renders when parent components update.
 *
 * @backendIntegration
 * In production, these hooks would call APIs instead of returning static data:
 * - GET /api/v1/company/{companyId}/sites
 * - GET /api/v1/sites/{siteId}/users
 * - GET /api/v1/sites/{siteId}/policies
 *
 * @dependencies
 * - SegmentContext          : Provides currentSegment
 * - segmentCompanyData.js   : Static data organized by segment
 *
 * @relatedFiles
 * - segmentCompanyData.js   : Data source with getter functions
 * - SegmentContext.js       : Segment state management
 * - Dashboard.js            : Primary consumer of these hooks
 * - UserList.js             : Uses useSegmentUsers
 *
 * ============================================================================
 */

import { useMemo } from 'react';
import { useSegment } from '../context/SegmentContext';
import {
  getCompanyBySegment,
  getSitesBySegment,
  getActiveSitesBySegment,
  getUsersBySegment,
  getPoliciesBySegment,
  getActivityLogsBySegment,
  getSegmentStats,
  getSegmentChartData,
} from '../constants/segmentCompanyData';

/**
 * Main hook for segment-specific company data
 */
export const useSegmentCompanyData = () => {
  const { currentSegment } = useSegment();

  // Get all segment-specific data
  const company = useMemo(() => getCompanyBySegment(currentSegment), [currentSegment]);
  const sites = useMemo(() => getSitesBySegment(currentSegment), [currentSegment]);
  const users = useMemo(() => getUsersBySegment(currentSegment), [currentSegment]);
  const policies = useMemo(() => getPoliciesBySegment(currentSegment), [currentSegment]);
  const activityLogs = useMemo(() => getActivityLogsBySegment(currentSegment), [currentSegment]);
  const stats = useMemo(() => getSegmentStats(currentSegment), [currentSegment]);
  const chartData = useMemo(() => getSegmentChartData(currentSegment), [currentSegment]);

  return {
    currentSegment,
    company,
    sites,
    users,
    policies,
    activityLogs,
    stats,
    chartData,
  };
};

/**
 * Hook for segment-specific sites only
 * Returns only ACTIVE sites that should be visible to customers
 * Sites in configuration_pending, under_testing, rfs_pending are NOT returned
 */
export const useSegmentSites = () => {
  const { currentSegment } = useSegment();
  // Only return active sites that are visible to customers on the customer portal
  const sites = useMemo(() => getActiveSitesBySegment(currentSegment), [currentSegment]);
  return { sites, currentSegment };
};

/**
 * Hook for ALL segment-specific sites (including non-active)
 * Use this for internal admin views that need to see all sites
 */
export const useAllSegmentSites = () => {
  const { currentSegment } = useSegment();
  const sites = useMemo(() => getSitesBySegment(currentSegment), [currentSegment]);
  return { sites, currentSegment };
};

/**
 * Hook for segment-specific users only
 */
export const useSegmentUsers = () => {
  const { currentSegment } = useSegment();
  const users = useMemo(() => getUsersBySegment(currentSegment), [currentSegment]);
  return { users, currentSegment };
};

/**
 * Hook for segment-specific stats only
 */
export const useSegmentStats = () => {
  const { currentSegment } = useSegment();
  const stats = useMemo(() => getSegmentStats(currentSegment), [currentSegment]);
  return { stats, currentSegment };
};

/**
 * Hook for segment-specific policies only
 */
export const useSegmentPolicies = () => {
  const { currentSegment } = useSegment();
  const policies = useMemo(() => getPoliciesBySegment(currentSegment), [currentSegment]);
  return { policies, currentSegment };
};

/**
 * Hook for segment-specific activity logs only
 */
export const useSegmentActivityLogs = () => {
  const { currentSegment } = useSegment();
  const activityLogs = useMemo(() => getActivityLogsBySegment(currentSegment), [currentSegment]);
  return { activityLogs, currentSegment };
};

/**
 * Hook for segment-specific chart data only
 */
export const useSegmentChartData = () => {
  const { currentSegment } = useSegment();
  const chartData = useMemo(() => getSegmentChartData(currentSegment), [currentSegment]);
  return { chartData, currentSegment };
};

export default useSegmentCompanyData;
