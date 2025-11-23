// src/hooks/useSegmentActivities.js

import { useMemo } from 'react';
import { useSegment } from '@context/SegmentContext';

/**
 * Hook to get segment-specific recent activities
 * Returns activities tailored to the current segment
 */
export const useSegmentActivities = () => {
  const { currentSegment } = useSegment();

  const activities = useMemo(() => {
    const segmentActivities = {
      enterprise: [
        { text: "User 'Amit Mishra' logged in from Mumbai Office", time: "10 mins ago" },
        { text: "License allocation updated for Enterprise segment", time: "1 hour ago" },
        { text: "Bulk user import completed - 25 employees added", time: "2 hours ago" },
        { text: "Network health check passed for all access points", time: "3 hours ago" },
        { text: "Security policy updated for corporate WiFi", time: "4 hours ago" },
      ],
      coLiving: [
        { text: "New resident 'Priya Sharma' registered in Building A", time: "15 mins ago" },
        { text: "Device 'MacBook Pro' connected to common area WiFi", time: "30 mins ago" },
        { text: "Monthly usage report generated for Co-Living", time: "1 hour ago" },
        { text: "Guest WiFi access granted for Room 204", time: "2 hours ago" },
        { text: "Bandwidth limit updated for shared spaces", time: "3 hours ago" },
      ],
      hotel: [
        { text: "Guest 'John Smith' checked in - WiFi access activated", time: "5 mins ago" },
        { text: "Device 'iPad Air' connected in Room 305", time: "20 mins ago" },
        { text: "Conference hall WiFi bandwidth increased", time: "1 hour ago" },
        { text: "Guest 'Sarah Johnson' checked out - access revoked", time: "2 hours ago" },
        { text: "Lobby WiFi password rotated for security", time: "3 hours ago" },
      ],
      coWorking: [
        { text: "New member 'Startups Inc' registered", time: "25 mins ago" },
        { text: "Meeting room WiFi access granted for 2 hours", time: "45 mins ago" },
        { text: "Day pass activated for visitor 'Alex Brown'", time: "1 hour ago" },
        { text: "Monthly bandwidth limit reached for premium desk", time: "3 hours ago" },
        { text: "Dedicated desk WiFi configuration updated", time: "4 hours ago" },
      ],
      pg: [
        { text: "New tenant 'Rahul Kumar' moved into Room 12", time: "30 mins ago" },
        { text: "Device 'Samsung Galaxy' connected", time: "1 hour ago" },
        { text: "Weekly network maintenance completed", time: "2 hours ago" },
        { text: "Password reset request for tenant 'Neeta Patil'", time: "4 hours ago" },
        { text: "Common area WiFi bandwidth increased", time: "5 hours ago" },
      ],
      miscellaneous: [
        { text: "New user registered", time: "20 mins ago" },
        { text: "Device connected to network", time: "1 hour ago" },
        { text: "System backup completed successfully", time: "2 hours ago" },
        { text: "Network configuration updated", time: "3 hours ago" },
        { text: "Routine maintenance scheduled", time: "4 hours ago" },
      ]
    };

    return segmentActivities[currentSegment] || segmentActivities.enterprise;
  }, [currentSegment]);

  return activities;
};

export default useSegmentActivities;
