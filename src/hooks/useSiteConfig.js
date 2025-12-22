/**
 * ============================================================================
 * useSiteConfig Hook
 * ============================================================================
 *
 * @file src/hooks/useSiteConfig.js
 * @description Provides segment-specific site configuration data.
 *              Returns site details (name, location, features) based on
 *              the current segment selection.
 *
 * @configReturned
 * | Property          | Type    | Description                              |
 * |-------------------|---------|------------------------------------------|
 * | siteName          | string  | Name of the site                         |
 * | siteId            | string  | Unique site identifier                   |
 * | location          | string  | City/region of the site                  |
 * | address           | string  | Full address                             |
 * | segment           | string  | Current segment identifier               |
 * | effectiveSiteName | string  | "Segment - SiteName" format              |
 * | guestAccessEnabled| boolean | Whether guest WiFi is enabled            |
 *
 * @segmentSites
 * Each segment has its own site configuration in siteConfig.js:
 * ```
 * segmentSites: {
 *   enterprise: { siteName: "Corp HQ", siteId: "ENT001", guestAccessEnabled: true },
 *   hotel: { siteName: "Grand Plaza", siteId: "HTL001", guestAccessEnabled: true },
 *   pg: { siteName: "Student Housing", siteId: "PG001", guestAccessEnabled: false },
 * }
 * ```
 *
 * @usage
 * ```jsx
 * import { useSiteConfig } from '@hooks/useSiteConfig';
 *
 * const Header = () => {
 *   const { effectiveSiteName, guestAccessEnabled } = useSiteConfig();
 *
 *   return (
 *     <header>
 *       <h1>{effectiveSiteName}</h1>
 *       {guestAccessEnabled && <GuestAccessBadge />}
 *     </header>
 *   );
 * };
 * ```
 *
 * @guestAccess
 * The `guestAccessEnabled` flag controls:
 * - Whether "Guest Management" appears in sidebar
 * - Whether guest vouchers can be generated
 * - Whether guest WiFi SSID is configured
 *
 * @dependencies
 * - SegmentContext : Provides currentSegment
 * - siteConfig.js  : Static site configuration data
 *
 * @relatedFiles
 * - siteConfig.js    : Source configuration data
 * - Sidebar.js       : Uses guestAccessEnabled for menu
 * - Header.js        : Displays site name
 *
 * ============================================================================
 */

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
