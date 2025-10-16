// src/components/common/UserLicenseBar.js

import React from "react";
import { LICENSE_THRESHOLDS, COMPONENT_SIZES } from "../../constants/appConstants";

function UserLicenseBar({ 
  current, 
  total, 
  width = COMPONENT_SIZES.LICENSE_BAR_WIDTH, 
  height = COMPONENT_SIZES.LICENSE_BAR_HEIGHT 
}) {
  const usagePct = Math.min(current / total, 1);
  let barColor = LICENSE_THRESHOLDS.COLOR_NORMAL;
  
  if (usagePct >= LICENSE_THRESHOLDS.CRITICAL_PERCENT) {
    barColor = LICENSE_THRESHOLDS.COLOR_CRITICAL;
  } else if (usagePct >= LICENSE_THRESHOLDS.WARNING_PERCENT) {
    barColor = LICENSE_THRESHOLDS.COLOR_WARNING;
  }

  const backgroundColor = "#e6eaf0";
  const pctWidth = Math.max(Math.floor(usagePct * width), 6);

  return (
    <div style={{ width, margin: "8px 0 16px 0" }}>
      <div
        style={{
          position: "relative",
          height,
          borderRadius: 14,
          background: backgroundColor,
          boxShadow: "0 1px 4px rgba(86,120,180,0.06)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: pctWidth,
            height: "100%",
            background: barColor,
            borderRadius: 14,
            transition: "width 0.5s, background 0.5s"
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "#234",
            whiteSpace: "nowrap"
          }}
        >
          {current} / {total} Active User Licenses
        </div>
      </div>
    </div>
  );
}

export default UserLicenseBar;