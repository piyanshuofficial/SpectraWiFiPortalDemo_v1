// src/components/CustomerViewBanner.js

/**
 * CustomerViewBanner
 * Persistent banner shown when internal staff is viewing as a customer
 * Displays impersonation info and provides exit button
 */

import React from "react";
import {
  FiEye,
  FiLogOut,
  FiLock,
  FiClock,
  FiChevronDown,
} from "react-icons/fi";
import { useCustomerView, IMPERSONATION_ROLE_LABELS } from "../context/CustomerViewContext";
import { SEGMENT_LABELS } from "../context/SegmentContext";
import "./CustomerViewBanner.css";

const CustomerViewBanner = () => {
  const {
    isImpersonating,
    impersonatedCustomer,
    impersonatedSite,
    impersonatedRole,
    exitCustomerView,
    impersonationDuration,
  } = useCustomerView();

  // Don't render if not impersonating
  if (!isImpersonating) {
    return null;
  }

  const customerName = impersonatedCustomer?.name || "Unknown Customer";
  const siteName = impersonatedSite?.name || "Company Level";
  const segment = impersonatedCustomer?.segment;
  const segmentLabel = segment ? SEGMENT_LABELS[segment] : "";
  const roleName = IMPERSONATION_ROLE_LABELS[impersonatedRole] || impersonatedRole;

  // Format duration
  const formatDuration = (minutes) => {
    if (minutes < 1) return "Just started";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="customer-view-banner">
      <div className="banner-content">
        <div className="banner-left">
          <div className="banner-icon">
            <FiEye />
          </div>
          <div className="banner-info">
            <span className="banner-label">VIEWING AS:</span>
            <span className="banner-customer">{customerName}</span>
            <FiChevronDown className="separator-icon" />
            <span className="banner-site">{siteName}</span>
            <span className="banner-role">({roleName})</span>
            {segmentLabel && (
              <span className="banner-segment">{segmentLabel}</span>
            )}
          </div>
        </div>

        <div className="banner-right">
          <div className="banner-read-only">
            <FiLock className="lock-icon" />
            <span>READ-ONLY MODE</span>
          </div>

          <div className="banner-duration">
            <FiClock className="clock-icon" />
            <span>{formatDuration(impersonationDuration)}</span>
          </div>

          <button
            className="banner-exit-btn"
            onClick={exitCustomerView}
            title="Exit customer view and return to internal portal"
          >
            <FiLogOut />
            <span>Exit Customer View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerViewBanner;
