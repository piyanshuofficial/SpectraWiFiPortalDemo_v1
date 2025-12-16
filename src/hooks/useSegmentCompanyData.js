// src/hooks/useSegmentCompanyData.js

/**
 * Hook to provide segment-specific company data for company-level views
 * Returns data filtered by the currently selected segment
 */

import { useMemo } from 'react';
import { useSegment } from '../context/SegmentContext';
import {
  getCompanyBySegment,
  getSitesBySegment,
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
 */
export const useSegmentSites = () => {
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
