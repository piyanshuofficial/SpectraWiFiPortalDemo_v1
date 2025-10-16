// src/components/Card.js

import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

const Card = ({ title, icon, children, trendData, trendIncrease, style }) => {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: "8px",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
        padding: "16px 20px",
        margin: 0,
        minHeight: "90px",
        color: "var(--text-color)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        {icon && <span style={{ marginRight: "8px", fontSize: "1.1em", color: "#004aad" }}>{icon}</span>}
        {title && <h3 style={{ fontWeight: "600", margin: 0, color: "var(--text-color)", fontSize: "0.9em" }}>{title}</h3>}
      </div>
      <div style={{ fontSize: "0.9em" }}>{children}</div>
      {trendData && (
        <div style={{ display: "flex", alignItems: "center", marginTop: "8px", color: trendIncrease ? "#4caf50" : "#f44336", fontWeight: "600", fontSize: "0.8em" }}>
          {trendIncrease ? "▲" : "▼"} {trendIncrease ? "Up" : "Down"} {Math.abs(trendData[trendData.length - 1] - trendData[0]).toFixed(2)}%
          <div style={{ width: "60px", height: "16px", marginLeft: "auto" }}>
            <Sparklines data={trendData}>
              <SparklinesLine color={trendIncrease ? "#4caf50" : "#f44336"} />
            </Sparklines>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;