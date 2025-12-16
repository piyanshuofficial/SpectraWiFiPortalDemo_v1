// src/components/Loading/PageLoadingSkeleton.js

import React from 'react';
import SkeletonLoader from '@components/Loading/SkeletonLoader';
import '@components/Loading/PageLoadingSkeleton.css';

/**
 * Page-level loading skeleton for different page types
 * @param {string} pageType - Type of page: 'dashboard', 'list', 'detail', 'form', 'report', 'internal-dashboard', 'knowledge'
 * @param {string} title - Optional title to show while loading
 * @param {number} rows - Number of rows for list/table skeletons
 * @param {number} cols - Number of columns for table skeletons
 */
const PageLoadingSkeleton = ({
  pageType = 'list',
  title = '',
  rows = 5,
  cols = 6,
}) => {
  // Dashboard page skeleton
  if (pageType === 'dashboard') {
    return (
      <div className="page-loading-skeleton dashboard-skeleton" role="status" aria-label="Loading dashboard">
        {/* Page Header */}
        <div className="skeleton-page-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 32, width: 200 }} />
        </div>

        {/* Section Title */}
        <div className="skeleton-section-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 120 }} />
        </div>

        {/* Metric Cards */}
        <div className="skeleton-metrics-row">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} variant="metric" />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="skeleton-section-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 120 }} />
        </div>
        <SkeletonLoader variant="quickActions" count={5} />

        {/* Charts Section */}
        <div className="skeleton-section-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 160 }} />
        </div>
        <div className="skeleton-charts-row">
          {[...Array(3)].map((_, i) => (
            <SkeletonLoader key={i} variant="chart" />
          ))}
        </div>

        {/* Activities */}
        <div className="skeleton-section-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 140 }} />
        </div>
        <div className="skeleton-activity-card">
          <SkeletonLoader variant="activity" count={5} />
        </div>

        <span className="sr-only">Loading dashboard, please wait</span>
      </div>
    );
  }

  // Internal Dashboard skeleton (more complex)
  if (pageType === 'internal-dashboard') {
    return (
      <div className="page-loading-skeleton internal-dashboard-skeleton" role="status" aria-label="Loading internal dashboard">
        {/* Welcome Header */}
        <div className="skeleton-welcome-header">
          <div className="skeleton-welcome-text">
            <div className="skeleton-rect skeleton-animate" style={{ height: 28, width: 250, marginBottom: 8 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 16, width: 200 }} />
          </div>
          <div className="skeleton-welcome-actions">
            <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: 140 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: 120 }} />
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="skeleton-quick-actions-bar">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-quick-action-btn">
              <div className="skeleton-circle skeleton-animate" style={{ width: 28, height: 28 }} />
              <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: 50, marginTop: 8 }} />
            </div>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="skeleton-metrics-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-metric-card">
              <div className="skeleton-metric-icon">
                <div className="skeleton-circle skeleton-animate" style={{ width: 48, height: 48 }} />
              </div>
              <div className="skeleton-metric-content">
                <div className="skeleton-rect skeleton-animate" style={{ height: 28, width: 60, marginBottom: 4 }} />
                <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: 90, marginBottom: 4 }} />
                <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: 70 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="skeleton-two-column">
          {/* Alerts Section */}
          <div className="skeleton-section">
            <div className="skeleton-section-header">
              <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 120 }} />
              <div className="skeleton-rect skeleton-animate" style={{ height: 28, width: 80 }} />
            </div>
            <SkeletonLoader variant="alert" count={4} />
          </div>

          {/* Sites Section */}
          <div className="skeleton-section">
            <div className="skeleton-section-header">
              <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 160 }} />
            </div>
            <SkeletonLoader variant="list" count={4} />
          </div>
        </div>

        {/* Activity Log */}
        <div className="skeleton-section">
          <div className="skeleton-section-header">
            <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 140 }} />
          </div>
          <SkeletonLoader variant="activity" count={6} />
        </div>

        <span className="sr-only">Loading internal dashboard, please wait</span>
      </div>
    );
  }

  // List page skeleton (User List, Device List, etc.)
  if (pageType === 'list') {
    return (
      <div className="page-loading-skeleton list-skeleton" role="status" aria-label="Loading list">
        {/* Page Header */}
        <div className="skeleton-page-header">
          <div className="skeleton-header-left">
            <div className="skeleton-rect skeleton-animate" style={{ height: 28, width: 180 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 16, width: 280, marginTop: 8 }} />
          </div>
          <div className="skeleton-header-right">
            <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: 120 }} />
          </div>
        </div>

        {/* Stats/Info Bar */}
        <div className="skeleton-info-bar">
          <div className="skeleton-rect skeleton-animate" style={{ height: 50, width: '100%' }} />
        </div>

        {/* Toolbar */}
        <SkeletonLoader variant="toolbar" />

        {/* Table */}
        <SkeletonLoader variant="table" rows={rows} cols={cols} />

        {/* Pagination */}
        <div className="skeleton-pagination">
          <div className="skeleton-rect skeleton-animate" style={{ height: 32, width: 200 }} />
          <div className="skeleton-rect skeleton-animate" style={{ height: 32, width: 150 }} />
        </div>

        <span className="sr-only">Loading list, please wait</span>
      </div>
    );
  }

  // Detail page skeleton (User Details, Customer Details, etc.)
  if (pageType === 'detail') {
    return (
      <div className="page-loading-skeleton detail-skeleton" role="status" aria-label="Loading details">
        {/* Back Button */}
        <div className="skeleton-back-button">
          <div className="skeleton-rect skeleton-animate" style={{ height: 32, width: 100 }} />
        </div>

        {/* Profile Header */}
        <SkeletonLoader variant="profile" />

        {/* Tabs */}
        <div className="skeleton-tabs">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-rect skeleton-animate" style={{ height: 40, width: 100 }} />
          ))}
        </div>

        {/* Content Section */}
        <div className="skeleton-detail-content">
          <div className="skeleton-detail-section">
            <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 150, marginBottom: 16 }} />
            <SkeletonLoader variant="form" rows={4} />
          </div>
        </div>

        <span className="sr-only">Loading details, please wait</span>
      </div>
    );
  }

  // Form page skeleton
  if (pageType === 'form') {
    return (
      <div className="page-loading-skeleton form-skeleton" role="status" aria-label="Loading form">
        {/* Page Header */}
        <div className="skeleton-page-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 28, width: 200 }} />
          <div className="skeleton-rect skeleton-animate" style={{ height: 16, width: 300, marginTop: 8 }} />
        </div>

        {/* Form Card */}
        <div className="skeleton-form-card">
          <SkeletonLoader variant="form" rows={rows || 6} />
        </div>

        <span className="sr-only">Loading form, please wait</span>
      </div>
    );
  }

  // Report page skeleton
  if (pageType === 'report') {
    return (
      <div className="page-loading-skeleton report-skeleton" role="status" aria-label="Loading reports">
        {/* Page Header */}
        <div className="skeleton-page-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 28, width: 150 }} />
          <div className="skeleton-rect skeleton-animate" style={{ height: 16, width: 280, marginTop: 8 }} />
        </div>

        {/* Search Bar */}
        <div className="skeleton-search-bar">
          <div className="skeleton-rect skeleton-animate" style={{ height: 44, width: '100%' }} />
        </div>

        {/* Pinned Reports */}
        <div className="skeleton-section-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 120 }} />
        </div>
        <div className="skeleton-pinned-reports">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-report-card">
              <div className="skeleton-circle skeleton-animate" style={{ width: 40, height: 40, marginBottom: 12 }} />
              <div className="skeleton-rect skeleton-animate" style={{ height: 16, width: '80%', marginBottom: 8 }} />
              <div className="skeleton-rect skeleton-animate" style={{ height: 12, width: '60%', marginBottom: 12 }} />
              <div className="skeleton-rect skeleton-animate" style={{ height: 32, width: 80 }} />
            </div>
          ))}
        </div>

        {/* Report Categories */}
        <div className="skeleton-section-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 100 }} />
        </div>
        <div className="skeleton-categories">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-rect skeleton-animate" style={{ height: 36, width: 100 }} />
          ))}
        </div>

        {/* Report List */}
        <div className="skeleton-report-list">
          <SkeletonLoader variant="grid" count={6} />
        </div>

        <span className="sr-only">Loading reports, please wait</span>
      </div>
    );
  }

  // Knowledge Center skeleton
  if (pageType === 'knowledge') {
    return (
      <div className="page-loading-skeleton knowledge-skeleton" role="status" aria-label="Loading knowledge center">
        {/* Page Header */}
        <div className="skeleton-page-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 28, width: 180 }} />
          <div className="skeleton-rect skeleton-animate" style={{ height: 16, width: 320, marginTop: 8 }} />
        </div>

        {/* Search */}
        <div className="skeleton-search-bar">
          <div className="skeleton-rect skeleton-animate" style={{ height: 48, width: '100%' }} />
        </div>

        {/* Quick Links */}
        <div className="skeleton-quick-links">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-quick-link">
              <div className="skeleton-circle skeleton-animate" style={{ width: 48, height: 48, marginBottom: 12 }} />
              <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: 80 }} />
            </div>
          ))}
        </div>

        {/* Featured Articles */}
        <div className="skeleton-section-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 140 }} />
        </div>
        <SkeletonLoader variant="list" count={3} />

        {/* Video Tutorials */}
        <div className="skeleton-section-header">
          <div className="skeleton-rect skeleton-animate" style={{ height: 20, width: 130 }} />
        </div>
        <div className="skeleton-videos">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-video-card">
              <div className="skeleton-rect skeleton-animate" style={{ height: 120, width: '100%', marginBottom: 12 }} />
              <div className="skeleton-rect skeleton-animate" style={{ height: 14, width: '80%' }} />
            </div>
          ))}
        </div>

        <span className="sr-only">Loading knowledge center, please wait</span>
      </div>
    );
  }

  // Grid page skeleton (Customers, Sites, etc.)
  if (pageType === 'grid') {
    return (
      <div className="page-loading-skeleton grid-page-skeleton" role="status" aria-label="Loading grid">
        {/* Page Header */}
        <div className="skeleton-page-header">
          <div className="skeleton-header-left">
            <div className="skeleton-rect skeleton-animate" style={{ height: 28, width: 180 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 16, width: 280, marginTop: 8 }} />
          </div>
          <div className="skeleton-header-right">
            <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: 140 }} />
          </div>
        </div>

        {/* View Toggle & Filters */}
        <div className="skeleton-filters-bar">
          <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: 250 }} />
          <div className="skeleton-filter-actions">
            <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: 100 }} />
            <div className="skeleton-rect skeleton-animate" style={{ height: 40, width: 80 }} />
          </div>
        </div>

        {/* Grid */}
        <SkeletonLoader variant="grid" count={rows || 6} />

        {/* Pagination */}
        <div className="skeleton-pagination">
          <div className="skeleton-rect skeleton-animate" style={{ height: 32, width: 200 }} />
          <div className="skeleton-rect skeleton-animate" style={{ height: 32, width: 150 }} />
        </div>

        <span className="sr-only">Loading grid, please wait</span>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="page-loading-skeleton default-skeleton" role="status" aria-label="Loading">
      <div className="skeleton-page-header">
        {title && <h1 className="skeleton-title-text">{title}</h1>}
        <div className="skeleton-rect skeleton-animate" style={{ height: 28, width: 200 }} />
      </div>
      <SkeletonLoader variant="card" />
      <span className="sr-only">Loading, please wait</span>
    </div>
  );
};

export default PageLoadingSkeleton;
