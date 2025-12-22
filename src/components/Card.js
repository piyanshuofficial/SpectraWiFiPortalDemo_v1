/**
 * ============================================================================
 * Card Component
 * ============================================================================
 *
 * @file src/components/Card.js
 * @description Dashboard metric card component that displays key statistics
 *              with optional trend visualization. Used primarily on the
 *              Dashboard page to show KPIs like Active Users, Data Usage, etc.
 *
 * @usage
 * ```jsx
 * // Basic metric card
 * <Card title="Active Users" icon={<FaUsers />}>
 *   1,234
 * </Card>
 *
 * // With trend sparkline
 * <Card
 *   title="Data Usage"
 *   icon={<FaWifi />}
 *   trendData={[1.0, 1.2, 1.5, 1.8, 2.0]}
 *   trendIncrease={true}
 * >
 *   2.0 TB
 * </Card>
 * ```
 *
 * @features
 * - Icon and title header for visual identification
 * - Main content area for displaying values
 * - Sparkline trend visualization showing historical data
 * - Trend indicator (up/down arrow with percentage)
 * - Responsive design for different screen sizes
 *
 * @trendCalculation
 * The component calculates percentage change between first and last
 * values in trendData array to show growth/decline percentage.
 *
 * @dependencies
 * - react-sparklines : For sparkline chart visualization
 * - react-icons      : For trend arrow icons
 * - Card.css         : Styling for card layout and colors
 *
 * @usedIn
 * - Dashboard.js     : Main dashboard metric cards
 * - InternalDashboard.js : Internal portal dashboard
 *
 * @accessibility
 * - ARIA live region for trend updates
 * - Proper img role for sparkline with descriptive label
 *
 * ============================================================================
 */

import React from "react";
import PropTypes from "prop-types";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./Card.css";

/**
 * Card - Dashboard metric display component with trend visualization
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Card header title
 * @param {React.ReactNode} props.icon - Icon element for visual identification
 * @param {React.ReactNode} props.children - Main content (typically a metric value)
 * @param {number[]} props.trendData - Array of numbers for sparkline visualization
 * @param {boolean} props.trendIncrease - Direction of trend (true=up, false=down)
 * @param {Object} props.style - Custom inline styles
 * @returns {JSX.Element} Rendered card element
 */
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

Card.propTypes = {
  /** Card title displayed in header */
  title: PropTypes.string,
  /** Icon element displayed next to title */
  icon: PropTypes.node,
  /** Card content */
  children: PropTypes.node,
  /** Array of numbers for sparkline trend visualization */
  trendData: PropTypes.arrayOf(PropTypes.number),
  /** Whether the trend direction is increasing (true) or decreasing (false) */
  trendIncrease: PropTypes.bool,
  /** Custom inline styles for the card container */
  style: PropTypes.object,
};

Card.defaultProps = {
  title: undefined,
  icon: undefined,
  children: undefined,
  trendData: [],
  trendIncrease: true,
  style: undefined,
};

export default Card;