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
    // Create effectiveSiteName in format "Segment - SiteName"
    const segmentLabel = currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1);
    const effectiveSiteName = `${segmentLabel} - ${siteInfo.siteName}`;

    return {
      ...siteConfig,
      siteName: siteInfo.siteName,
      siteId: siteInfo.siteId,
      location: siteInfo.location,
      address: siteInfo.address,
      segment: currentSegment,
      effectiveSiteName,
      guestAccessEnabled: siteInfo.guestAccessEnabled ?? true, // Default to true if not specified
    };
  }, [currentSegment]);

  return segmentSiteData;
};
