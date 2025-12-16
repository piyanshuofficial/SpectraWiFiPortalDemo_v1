// src/components/Loading/SkeletonLoader.js

import React from 'react';
import '@components/Loading/SkeletonLoader.css';

/**
 * Skeleton loader for content placeholders
 * @param {string} variant - Type: 'text', 'title', 'rect', 'circle', 'table', 'card', 'metric', 'chart', 'list', 'dashboard', 'form', 'profile', 'grid'
 * @param {number|string} width - Width in pixels or percentage string
 * @param {number} height - Height in pixels
 * @param {number} rows - Number of rows (for table variant)
 * @param {number} cols - Number of columns (for grid/table variants)
 * @param {number} count - Number of items (for list, grid variants)
 * @param {string} className - Additional CSS classes
 */
const SkeletonLoader = ({
  variant = 'text',
  width,
  height,
  rows = 5,
  cols = 4,
  count = 4,
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
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="skeleton-rect skeleton-animate" />
          ))}
        </div>
        <div className="skeleton-table-body" aria-hidden="true">
          {[...Array(rows)].map((_, rowIdx) => (
            <div key={rowIdx} className="skeleton-table-row">
              {[...Array(cols)].map((_, colIdx) => (
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

  // Metric card skeleton (for dashboard stats)
  if (variant === 'metric') {
    return (
      <div
        className={`skeleton-metric ${className}`}
        role="status"
        aria-label="Loading metric"
        aria-live="polite"
      >
        <div className="skeleton-metric-header" aria-hidden="true">
          <div className="skeleton-circle skeleton-animate" style={{ width: 40, height: 40 }} />
          <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: '60%' }} />
        </div>
        <div className="skeleton-rect skeleton-animate skeleton-metric-value" style={{ height: 32, width: '45%', marginTop: 12 }} aria-hidden="true" />
        <div className="skeleton-metric-trend" aria-hidden="true">
          <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '30%' }} />
        </div>
        <span className="sr-only">Loading metric, please wait</span>
      </div>
    );
  }

  // Chart skeleton
  if (variant === 'chart') {
    return (
      <div
        className={`skeleton-chart ${className}`}
        role="status"
        aria-label="Loading chart"
        aria-live="polite"
      >
        <div className="skeleton-chart-header" aria-hidden="true">
          <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: '40%' }} />
          <div className="skeleton-chart-legend">
            <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: 60 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: 60 }} />
          </div>
        </div>
        <div className="skeleton-chart-body" aria-hidden="true">
          <div className="skeleton-chart-bars">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="skeleton-rect skeleton-animate skeleton-chart-bar"
                style={{ height: `${30 + Math.random() * 50}%` }}
              />
            ))}
          </div>
          <div className="skeleton-chart-axis">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="skeleton-rect skeleton-animate" style={{ height: 10, width: 30 }} />
            ))}
          </div>
        </div>
        <span className="sr-only">Loading chart, please wait</span>
      </div>
    );
  }

  // List skeleton
  if (variant === 'list') {
    return (
      <div
        className={`skeleton-list ${className}`}
        role="status"
        aria-label="Loading list"
        aria-live="polite"
      >
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton-list-item" aria-hidden="true">
            <div className="skeleton-circle skeleton-animate" style={{ width: 36, height: 36 }} />
            <div className="skeleton-list-content">
              <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: '70%', marginBottom: 6 }} />
              <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '40%' }} />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading list, please wait</span>
      </div>
    );
  }

  // Grid skeleton (for card grids)
  if (variant === 'grid') {
    return (
      <div
        className={`skeleton-grid ${className}`}
        role="status"
        aria-label="Loading grid content"
        aria-live="polite"
      >
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton-grid-item" aria-hidden="true">
            <div className="skeleton-rect skeleton-animate" style={{ height: 16, width: '50%', marginBottom: 8 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 24, width: '70%', marginBottom: 12 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '90%', marginBottom: 4 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '60%' }} />
          </div>
        ))}
        <span className="sr-only">Loading grid content, please wait</span>
      </div>
    );
  }

  // Form skeleton
  if (variant === 'form') {
    return (
      <div
        className={`skeleton-form ${className}`}
        role="status"
        aria-label="Loading form"
        aria-live="polite"
      >
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="skeleton-form-field" aria-hidden="true">
            <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '25%', marginBottom: 8 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: '100%' }} />
          </div>
        ))}
        <div className="skeleton-form-actions" aria-hidden="true">
          <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: 100 }} />
          <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: 100 }} />
        </div>
        <span className="sr-only">Loading form, please wait</span>
      </div>
    );
  }

  // Profile skeleton
  if (variant === 'profile') {
    return (
      <div
        className={`skeleton-profile ${className}`}
        role="status"
        aria-label="Loading profile"
        aria-live="polite"
      >
        <div className="skeleton-profile-header" aria-hidden="true">
          <div className="skeleton-circle skeleton-animate" style={{ width: 80, height: 80 }} />
          <div className="skeleton-profile-info">
            <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: '60%', marginBottom: 8 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: '40%', marginBottom: 8 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '50%' }} />
          </div>
        </div>
        <div className="skeleton-profile-body" aria-hidden="true">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-profile-row">
              <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: '30%' }} />
              <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: '50%' }} />
            </div>
          ))}
        </div>
        <span className="sr-only">Loading profile, please wait</span>
      </div>
    );
  }

  // Dashboard skeleton (combined metrics + charts)
  if (variant === 'dashboard') {
    return (
      <div
        className={`skeleton-dashboard ${className}`}
        role="status"
        aria-label="Loading dashboard"
        aria-live="polite"
      >
        {/* Metrics Row */}
        <div className="skeleton-dashboard-metrics" aria-hidden="true">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-metric">
              <div className="skeleton-metric-header">
                <div className="skeleton-circle skeleton-animate" style={{ width: 40, height: 40 }} />
                <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: '60%' }} />
              </div>
              <div className="skeleton-rect skeleton-animate skeleton-metric-value" style={{ height: 32, width: '45%', marginTop: 12 }} />
              <div className="skeleton-metric-trend">
                <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '30%' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="skeleton-dashboard-charts" aria-hidden="true">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="skeleton-chart">
              <div className="skeleton-chart-header">
                <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: '40%' }} />
              </div>
              <div className="skeleton-chart-body">
                <div className="skeleton-chart-bars">
                  {[...Array(6)].map((_, j) => (
                    <div
                      key={j}
                      className="skeleton-rect skeleton-animate skeleton-chart-bar"
                      style={{ height: `${30 + Math.random() * 50}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only">Loading dashboard, please wait</span>
      </div>
    );
  }

  // Quick actions skeleton
  if (variant === 'quickActions') {
    return (
      <div
        className={`skeleton-quick-actions ${className}`}
        role="status"
        aria-label="Loading quick actions"
        aria-live="polite"
      >
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton-quick-action-item" aria-hidden="true">
            <div className="skeleton-circle skeleton-animate" style={{ width: 32, height: 32 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '60%', marginTop: 8 }} />
          </div>
        ))}
        <span className="sr-only">Loading quick actions, please wait</span>
      </div>
    );
  }

  // Activity list skeleton
  if (variant === 'activity') {
    return (
      <div
        className={`skeleton-activity ${className}`}
        role="status"
        aria-label="Loading activities"
        aria-live="polite"
      >
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton-activity-item" aria-hidden="true">
            <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: '80%', marginBottom: 4 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '30%' }} />
          </div>
        ))}
        <span className="sr-only">Loading activities, please wait</span>
      </div>
    );
  }

  // Toolbar skeleton
  if (variant === 'toolbar') {
    return (
      <div
        className={`skeleton-toolbar ${className}`}
        role="status"
        aria-label="Loading toolbar"
        aria-live="polite"
      >
        <div className="skeleton-toolbar-left" aria-hidden="true">
          <div className="skeleton-rect skeleton-animate" style={{ height: 36, width: 200 }} />
          <div className="skeleton-rect skeleton-animate" style={{ height: 36, width: 120 }} />
          <div className="skeleton-rect skeleton-animate" style={{ height: 36, width: 120 }} />
        </div>
        <div className="skeleton-toolbar-right" aria-hidden="true">
          <div className="skeleton-rect skeleton-animate" style={{ height: 36, width: 100 }} />
        </div>
        <span className="sr-only">Loading toolbar, please wait</span>
      </div>
    );
  }

  // Alert/notification skeleton
  if (variant === 'alert') {
    return (
      <div
        className={`skeleton-alert ${className}`}
        role="status"
        aria-label="Loading alerts"
        aria-live="polite"
      >
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton-alert-item" aria-hidden="true">
            <div className="skeleton-circle skeleton-animate" style={{ width: 24, height: 24 }} />
            <div className="skeleton-alert-content">
              <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: '70%', marginBottom: 4 }} />
              <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '50%' }} />
            </div>
            <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: 60 }} />
          </div>
        ))}
        <span className="sr-only">Loading alerts, please wait</span>
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
