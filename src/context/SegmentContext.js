// src/context/SegmentContext.js

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
