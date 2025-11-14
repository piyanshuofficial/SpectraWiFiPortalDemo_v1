// src/components/Badge.js

import React from "react";
import PropTypes from "prop-types";

const Badge = ({ children, variant, size = "table" }) => {
  // Determine base class for size
  const baseClass = size === "modal" ? "badge-modal" : "badge-table";

  // Compose final CSS class names
  const className = `badge ${baseClass} badge-${variant}`;

  // Get screen reader friendly text for variant
  const getAriaLabel = () => {
    const variantLabels = {
      active: "Status: Active",
      suspended: "Status: Suspended",
      blocked: "Status: Blocked",
      success: "Status: Success",
      warning: "Status: Warning",
      danger: "Status: Danger",
      secondary: "Status: Secondary"
    };
    return variantLabels[variant] || children;
  };

  return (
    <span 
      className={className}
      role="status"
      aria-label={getAriaLabel()}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string, // e.g. 'active', 'suspended', 'blocked'
  size: PropTypes.oneOf(["table", "modal"]),
};

export default Badge;