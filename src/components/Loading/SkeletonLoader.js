// src/components/Loading/SkeletonLoader.js

import React from 'react';
import '@components/Loading/SkeletonLoader.css';

/**
 * Skeleton loader for content placeholders
 * @param {string} variant - Type: 'text', 'title', 'rect', 'circle', 'table', 'card'
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
      <div 
        className={`skeleton-table ${className}`}
        role="status"
        aria-label="Loading table content"
        aria-live="polite"
      >
        <div className="skeleton-table-header" aria-hidden="true">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-rect skeleton-animate" />
          ))}
        </div>
        <div className="skeleton-table-body" aria-hidden="true">
          {[...Array(rows)].map((_, rowIdx) => (
            <div key={rowIdx} className="skeleton-table-row">
              {[...Array(4)].map((_, colIdx) => (
                <div key={colIdx} className="skeleton-rect skeleton-animate" />
              ))}
            </div>
          ))}
        </div>
        <span className="sr-only">Loading content, please wait</span>
      </div>
    );
  }

  // Card skeleton
  if (variant === 'card') {
    return (
      <div 
        className={`skeleton-card ${className}`}
        role="status"
        aria-label="Loading card content"
        aria-live="polite"
      >
        <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: '60%', marginBottom: 12 }} aria-hidden="true" />
        <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: '100%', marginBottom: 8 }} aria-hidden="true" />
        <div className="skeleton-rect skeleton-animate" style={{ height: 16, width: '80%' }} aria-hidden="true" />
        <span className="sr-only">Loading content, please wait</span>
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
      role="status"
      aria-label="Loading content"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default SkeletonLoader;