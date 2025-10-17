// src/components/Loading/SkeletonLoader.js

import React from 'react';
import './SkeletonLoader.css';

/**
 * Skeleton loader for content placeholders
 * @param {string} variant - Type: 'text', 'title', 'rect', 'circle', 'table'
 * @param {number} width - Width in pixels or percentage string
 * @param {number} height - Height in pixels
 * @param {number} rows - Number of rows (for table variant)
 */
const SkeletonLoader = ({ 
  variant = 'text', 
  width, 
  height, 
  rows = 5,
  className = '' 
}) => {
  // Table skeleton
  if (variant === 'table') {
    return (
      <div className={`skeleton-table ${className}`}>
        <div className="skeleton-table-header">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-rect skeleton-animate" />
          ))}
        </div>
        <div className="skeleton-table-body">
          {[...Array(rows)].map((_, rowIdx) => (
            <div key={rowIdx} className="skeleton-table-row">
              {[...Array(4)].map((_, colIdx) => (
                <div key={colIdx} className="skeleton-rect skeleton-animate" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Card skeleton
  if (variant === 'card') {
    return (
      <div className={`skeleton-card ${className}`}>
        <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: '60%', marginBottom: 12 }} />
        <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: '100%', marginBottom: 8 }} />
        <div className="skeleton-rect skeleton-animate" style={{ height: 16, width: '80%' }} />
      </div>
    );
  }

  // Single skeleton element
  const styles = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: height ? `${height}px` : undefined
  };

  return (
    <div 
      className={`skeleton-${variant} skeleton-animate ${className}`}
      style={styles}
      aria-hidden="true"
    />
  );
};

export default SkeletonLoader;