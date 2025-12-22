/**
 * ============================================================================
 * Segment Context
 * ============================================================================
 *
 * @file src/context/SegmentContext.js
 * @description Manages the business segment context for the current user/site.
 *              Different segments have different features, policies, and UI.
 *
 * @segments
 * The portal supports multiple business verticals (segments):
 *
 * | Segment       | Description                    | Key Features                    |
 * |---------------|--------------------------------|---------------------------------|
 * | ENTERPRISE    | Corporate offices              | MAB auth, unlimited devices     |
 * | OFFICE        | Small/medium offices           | Standard features               |
 * | CO_LIVING     | Co-living spaces               | Room-based users, guest access  |
 * | CO_WORKING    | Co-working spaces              | Flexible desk allocation        |
 * | HOTEL         | Hotels/hospitality             | Guest WiFi, voucher system      |
 * | PG            | Paying Guest accommodations    | Room-based, limited devices     |
 * | MISCELLANEOUS | Other/custom                   | Configurable features           |
 *
 * @segmentImpact
 * Segment affects many portal behaviors:
 * - Device limits per user
 * - Authentication methods (MAB, captive portal, etc.)
 * - Available policy types
 * - Guest access configuration
 * - Dashboard metrics displayed
 * - Report types available
 *
 * @architecture
 * ```
 * ┌──────────────────────────────────────────────────────────────┐
 * │                    SegmentContext Provider                   │
 * ├──────────────────────────────────────────────────────────────┤
 * │  State:                                                      │
 * │  └── currentSegment : string - Active segment identifier     │
 * ├──────────────────────────────────────────────────────────────┤
 * │  Actions:                                                    │
 * │  └── updateSegment() : Change segment (dev/testing)          │
 * └──────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 *              ┌───────────────────────────────┐
 *              │     Component Consumers       │
 *              ├───────────────────────────────┤
 *              │ • Device limits               │
 *              │ • Policy options              │
 *              │ • Guest access settings       │
 *              │ • Dashboard widgets           │
 *              │ • Available features          │
 *              └───────────────────────────────┘
 * ```
 *
 * @usage
 * ```jsx
 * import { useSegment, SEGMENTS } from '@context/SegmentContext';
 *
 * const DeviceForm = () => {
 *   const { currentSegment } = useSegment();
 *
 *   // Determine device limit based on segment
 *   const maxDevices = currentSegment === SEGMENTS.ENTERPRISE ? 10 : 3;
 *
 *   return <form>...</form>;
 * };
 * ```
 *
 * @dataSource
 * In production, segment is determined from:
 * - Site configuration in database
 * - Set during site provisioning
 * - Cannot be changed by customer users
 *
 * @relatedFiles
 * - segmentCompanyData.js    : Sample data per segment
 * - segmentPermissionsConfig.js : Segment-specific permissions
 * - useSiteConfig.js         : Hook that uses segment for config
 * - siteProvisioningConfig.js : Segment options for provisioning
 *
 * ============================================================================
 */

import React, { createContext, useContext, useState, useCallback } from "react";

const SegmentContext = createContext();

export const SEGMENTS = {
  ENTERPRISE: "enterprise",
  OFFICE: "office",
  CO_LIVING: "coLiving",
  CO_WORKING: "coWorking",
  HOTEL: "hotel",
  PG: "pg",
  MISCELLANEOUS: "miscellaneous",
};

export const SEGMENT_LABELS = {
  [SEGMENTS.ENTERPRISE]: "Enterprise",
  [SEGMENTS.OFFICE]: "Office",
  [SEGMENTS.CO_LIVING]: "Co-Living",
  [SEGMENTS.CO_WORKING]: "Co-Working",
  [SEGMENTS.HOTEL]: "Hotel",
  [SEGMENTS.PG]: "PG",
  [SEGMENTS.MISCELLANEOUS]: "Miscellaneous",
};

export const SegmentProvider = ({ children }) => {
  // Default to Enterprise segment for testing
  const [currentSegment, setCurrentSegment] = useState(SEGMENTS.ENTERPRISE);

  const updateSegment = useCallback((newSegment) => {
    if (Object.values(SEGMENTS).includes(newSegment)) {
      setCurrentSegment(newSegment);
    } else {
      console.error('Invalid segment:', newSegment);
    }
  }, []);

  return (
    <SegmentContext.Provider
      value={{
        currentSegment,
        setCurrentSegment,
        updateSegment
      }}
    >
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => {
  const context = useContext(SegmentContext);
  if (!context) {
    throw new Error('useSegment must be used within a SegmentProvider');
  }
  return context;
};
