// src/components/common/UserLicenseBar.js

import React from "react";

function UserLicenseBar({ current, total, width = 280, height = 26 }) {
  const usagePct = Math.min(current / total, 1);
  let barColor = "#32ad4e";
  if (usagePct >= 0.9) barColor = "#e14b4b";
  else if (usagePct >= 0.75) barColor = "#ffc735";

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
            fontSize: "0.9rem", // Smaller font
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