// src/components/Card.js

import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import './Card.css';

const Card = ({ title, icon, children, trendData, trendIncrease, style }) => {
  return (
    <div className="card-container" style={style}>
      <div className="card-header">
        {icon && <span className="card-icon">{icon}</span>}
        {title && <h3 className="card-title">{title}</h3>}
      </div>
      <div className="card-content">{children}</div>
      {trendData && (
        <div className={`card-trend ${trendIncrease ? 'trend-up' : 'trend-down'}`}>
          <span className="trend-indicator">
            {trendIncrease ? "▲" : "▼"} {trendIncrease ? "Up " : "Down "} 
            {Math.abs(trendData[trendData.length - 1] - trendData[0]).toFixed(2)}%
          </span>
          <div className="trend-sparkline">
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