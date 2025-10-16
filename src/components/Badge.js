// src/components/Badge.js

import React from "react";
import PropTypes from "prop-types";

const Badge = ({ children, variant, size = "table" }) => {
  // Determine base class for size
  const baseClass = size === "modal" ? "badge-modal" : "badge-table";

  // Compose final CSS class names
  const className = `badge ${baseClass} badge-${variant}`;

  return <span className={className}>{children}</span>;
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string, // e.g. 'active', 'suspended', 'blocked'
  size: PropTypes.oneOf(["table", "modal"]),
};

export default Badge;
