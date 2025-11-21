// src/hooks/useSiteConfig.js

import { useMemo } from 'react';
import { useSegment } from '../context/SegmentContext';
import siteConfig from '../config/siteConfig';

/**
 * Custom hook to get segment-specific site configuration
 *
 * Returns site data that matches the current segment selection
 */
export const useSiteConfig = () => {
  const { currentSegment } = useSegment();

  const segmentSiteData = useMemo(() => {
    // Get segment-specific site info
    const siteInfo = siteConfig.segmentSites[currentSegment] || siteConfig.segmentSites.enterprise;

    return {
      ...siteConfig,
      siteName: siteInfo.siteName,
      siteId: siteInfo.siteId,
      location: siteInfo.location,
      address: siteInfo.address,
      segment: currentSegment,
    };
  }, [currentSegment]);

  return segmentSiteData;
};
