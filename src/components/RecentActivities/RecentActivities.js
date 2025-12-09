/**
 * RecentActivities Component
 *
 * Displays a list of recent activities on the dashboard with i18n support.
 * Activities are fetched from the activity service and displayed with
 * appropriate severity indicators and relative timestamps.
 *
 * Features:
 * - Multilingual activity messages (EN, HI, TE, KN)
 * - Severity-based color coding (success, warning, error, info)
 * - Relative time display (5 minutes ago, yesterday, etc.)
 * - Category filtering
 * - Auto-refresh capability
 * - Loading and error states
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiActivity,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiInfo,
  FiRefreshCw,
  FiFilter,
  FiChevronRight,
} from 'react-icons/fi';
import useRecentActivities, {
  generateSampleActivities,
} from '../../hooks/useRecentActivities';
import { SEVERITY } from '../../constants/activityTypes';
import './RecentActivities.css';

/**
 * Get icon component based on severity
 */
const SeverityIcon = ({ severity, className = '' }) => {
  const iconProps = { className: `activity-icon ${className}`, size: 16 };

  switch (severity) {
    case SEVERITY.SUCCESS:
      return <FiCheckCircle {...iconProps} />;
    case SEVERITY.WARNING:
      return <FiAlertTriangle {...iconProps} />;
    case SEVERITY.ERROR:
      return <FiXCircle {...iconProps} />;
    case SEVERITY.INFO:
    default:
      return <FiInfo {...iconProps} />;
  }
};

/**
 * Individual activity item component
 */
const ActivityItem = ({ activity }) => {
  return (
    <div className={`activity-item ${activity.severityClass}`}>
      <div className="activity-icon-wrapper">
        <SeverityIcon severity={activity.severity} />
      </div>
      <div className="activity-content">
        <p className="activity-message">{activity.formattedMessage}</p>
        <div className="activity-meta">
          <span className="activity-time">{activity.formattedTime}</span>
          {activity.categoryLabel && (
            <>
              <span className="activity-separator">•</span>
              <span className="activity-category">{activity.categoryLabel}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Loading skeleton for activities
 */
const ActivitySkeleton = () => (
  <div className="activity-item activity-skeleton">
    <div className="activity-icon-wrapper skeleton-icon" />
    <div className="activity-content">
      <div className="skeleton-message" />
      <div className="skeleton-meta" />
    </div>
  </div>
);

/**
 * RecentActivities Component
 *
 * @param {Object} props - Component props
 * @param {number} props.limit - Maximum number of activities to display
 * @param {boolean} props.showFilter - Show category filter dropdown
 * @param {boolean} props.showRefresh - Show refresh button
 * @param {boolean} props.showViewAll - Show "View All" link
 * @param {string} props.viewAllLink - URL for "View All" link
 * @param {number} props.refreshInterval - Auto-refresh interval in ms
 * @param {boolean} props.useSampleData - Use sample data for demo (dev only)
 * @param {string} props.className - Additional CSS class
 */
const RecentActivities = ({
  limit = 10,
  showFilter = false,
  showRefresh = true,
  showViewAll = true,
  viewAllLink = '/activity-logs',
  refreshInterval = 0,
  useSampleData = false, // Set to true for demo/development
  className = '',
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch activities using the hook
  const {
    activities: fetchedActivities,
    loading,
    error,
    refresh,
    availableCategories,
    formatActivity,
    formatActivityTime,
    getCategoryLabel,
  } = useRecentActivities({
    limit,
    category: selectedCategory,
    refreshInterval,
  });

  // Use sample data if enabled (for development/demo)
  const activities = useMemo(() => {
    if (useSampleData) {
      const sampleData = generateSampleActivities();
      return sampleData.map((activity) => ({
        ...activity,
        formattedMessage: formatActivity(activity),
        formattedTime: formatActivityTime(activity),
        severityClass: `activity-${activity.severity}`,
        categoryLabel: getCategoryLabel(activity.category),
      }));
    }
    return fetchedActivities;
  }, [
    useSampleData,
    fetchedActivities,
    formatActivity,
    formatActivityTime,
    getCategoryLabel,
  ]);

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value === '' ? null : value);
  };

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    refresh();
  };

  return (
    <div className={`recent-activities ${className}`}>
      {/* Header */}
      <div className="recent-activities-header">
        <div className="header-title">
          <FiActivity className="header-icon" />
          <h3>{t('activities.title')}</h3>
        </div>

        <div className="header-actions">
          {/* Category Filter */}
          {showFilter && availableCategories.length > 0 && (
            <div className="filter-wrapper">
              <FiFilter className="filter-icon" />
              <select
                value={selectedCategory || ''}
                onChange={handleCategoryChange}
                className="category-filter"
                aria-label={t('activities.filterByCategory')}
              >
                <option value="">{t('activities.allCategories')}</option>
                {availableCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Refresh Button */}
          {showRefresh && (
            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={loading}
              aria-label={t('common.refresh')}
              title={t('common.refresh')}
            >
              <FiRefreshCw className={loading ? 'spinning' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Activities List */}
      <div className="activities-list">
        {/* Loading State */}
        {loading && activities.length === 0 && (
          <>
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
          </>
        )}

        {/* Error State */}
        {error && (
          <div className="activities-error">
            <FiXCircle className="error-icon" />
            <p>{t('common.error')}: {error}</p>
            <button className="retry-btn" onClick={handleRefresh}>
              {t('common.refresh')}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && activities.length === 0 && (
          <div className="activities-empty">
            <FiActivity className="empty-icon" />
            <p>{t('activities.noActivities')}</p>
          </div>
        )}

        {/* Activities */}
        {!error &&
          activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
      </div>

      {/* View All Link */}
      {showViewAll && activities.length > 0 && (
        <div className="activities-footer">
          <a href={viewAllLink} className="view-all-link">
            {t('activities.viewAll')}
            <FiChevronRight className="chevron-icon" />
          </a>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
