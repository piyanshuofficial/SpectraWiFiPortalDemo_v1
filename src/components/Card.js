// src/components/Card.js

import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import '@components/Card.css';

const Card = ({ title, icon, children, trendData, trendIncrease, style }) => {
  const trendValue = trendData && trendData.length > 0 
    ? Math.abs(trendData[trendData.length - 1] - trendData[0]).toFixed(2)
    : 0;

  return (
    <div className="card-container" style={style}>
      <div className="card-header">
        {icon && (
          <span className="card-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {title && <h3 className="card-title">{title}</h3>}
      </div>
      <div className="card-content">{children}</div>
      {trendData && trendData.length > 0 && (
        <div 
          className={`card-trend ${trendIncrease ? 'trend-up' : 'trend-down'}`}
          role="status"
          aria-live="polite"
        >
          <span className="trend-indicator">
            <span aria-hidden="true">{trendIncrease ? "▲" : "▼"}</span>
            <span className="sr-only">{trendIncrease ? "Increased" : "Decreased"} by</span>
            {" "}{trendIncrease ? "Up " : "Down "}{trendValue}%
          </span>
          <div 
            className="trend-sparkline" 
            role="img"
            aria-label={`Trend chart showing ${trendIncrease ? 'upward' : 'downward'} movement`}
          >
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