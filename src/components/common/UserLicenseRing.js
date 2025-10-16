// src/components/common/UserLicenseRing.js

import React from "react";
import { LICENSE_THRESHOLDS, COMPONENT_SIZES } from "../../constants/appConstants";

function UserLicenseRing({ 
  current, 
  total, 
  size = COMPONENT_SIZES.LICENSE_RING_SIZE, 
  ringWidth = COMPONENT_SIZES.LICENSE_RING_WIDTH 
}) {
  const radius = size / 2 - ringWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = current / total;
  const strokeDashoffset = circumference * (1 - progress);
  const valueString = `${current}/${total}`;
  const digitCount = valueString.length;
  
  let fontSize = Math.floor(size * 0.18);
  if (digitCount >= 7) fontSize = Math.floor(size * 0.11);
  else if (digitCount === 6) fontSize = Math.floor(size * 0.13);
  else if (digitCount === 5) fontSize = Math.floor(size * 0.15);

  let strokeColor = LICENSE_THRESHOLDS.COLOR_NORMAL;
  if (progress >= LICENSE_THRESHOLDS.CRITICAL_PERCENT) {
    strokeColor = LICENSE_THRESHOLDS.COLOR_CRITICAL;
  } else if (progress >= LICENSE_THRESHOLDS.WARNING_PERCENT) {
    strokeColor = LICENSE_THRESHOLDS.COLOR_WARNING;
  }

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e6eaf0"
          strokeWidth={ringWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={ringWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s, stroke 0.5s"
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none"
        }}
      >
        <span
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: 600,
            color: "#2652a9",
            textAlign: "center",
            whiteSpace: "nowrap",
            maxWidth: "85%"
          }}
        >
          {valueString}
        </span>
        <span
          style={{
            fontSize: `${Math.floor(fontSize * 0.5)}px`,
            color: "#8fa0ca",
            textAlign: "center",
            lineHeight: 1.1
          }}
        >
          Active User
          <br />
          Licenses
        </span>
      </div>
    </div>
  );
}

export default UserLicenseRing;