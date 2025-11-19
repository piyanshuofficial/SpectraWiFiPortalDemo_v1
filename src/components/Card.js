// src/components/Card.js
import React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./Card.css";

const Card = ({ 
  title, 
  icon, 
  children, 
  trendData = [], 
  trendIncrease = true, 
  style 
}) => {
  // Validate trend data
  const hasTrendData = trendData && trendData.length > 1;
  
  // Compute trend value (percentage change)
  const calculateTrendValue = () => {
    if (!hasTrendData) return "0.00";
    
    const startValue = trendData[0];
    const endValue = trendData[trendData.length - 1];
    
    // Handle edge cases
    if (startValue === 0 || startValue === null || startValue === undefined) {
      return "0.00";
    }
    
    const percentChange = ((endValue - startValue) / Math.abs(startValue)) * 100;
    return Math.abs(percentChange).toFixed(2);
  };

  const trendValue = calculateTrendValue();
  const hasTrend = parseFloat(trendValue) !== 0.0;

  // Build trend classes
  const trendClass = hasTrend
    ? `card-trend ${trendIncrease ? "trend-up" : "trend-down"}`
    : "card-trend";

  return (
    <div className="card-container" style={style}>
      {/* Header Section */}
      <div className="card-header">
        {icon && (
          <span className="card-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {title && <h3 className="card-title">{title}</h3>}
      </div>

      {/* Main Content */}
      <div className="card-content">{children}</div>

      {/* Trend Section */}
      {hasTrendData && hasTrend && (
        <div 
          className={trendClass} 
          role="status" 
          aria-live="polite"
        >
          <div className="trend-indicator">
            {trendIncrease ? (
              <FaArrowUp className="trend-arrow" aria-hidden="true" />
            ) : (
              <FaArrowDown className="trend-arrow" aria-hidden="true" />
            )}
            <span className="trend-text">
              {trendIncrease ? "Up" : "Down"} {trendValue}%
            </span>
          </div>

          <div 
            className="trend-sparkline" 
            role="img" 
            aria-label={`Trend chart showing ${trendIncrease ? "upward" : "downward"} movement of ${trendValue} percent`}
          >
            <Sparklines data={trendData} width={100} height={20}>
              <SparklinesLine 
                color={trendIncrease ? "#4caf50" : "#f44336"} 
                style={{ strokeWidth: 2 }}
              />
            </Sparklines>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;