// src/pages/ActivityLogs/ActivityLogs.js

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FaFileCsv,
  FaUser,
  FaLaptop,
  FaCog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSortUp,
  FaSortDown,
  FaClipboardList,
  FaQuestionCircle,
  FaBuilding,
  FaInfoCircle
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Pagination from '../../components/Pagination';
import { usePermissions } from '../../hooks/usePermissions';
import { useTableState } from '../../hooks/useTableState';
import { useSegment } from '../../context/SegmentContext';
import { useAccessLevelView } from '../../context/AccessLevelViewContext';
import { companySites as sampleCompanySites } from '../../constants/companySampleData';
import { exportChartDataToCSV } from '../../utils/exportUtils';
import notifications from '../../utils/notifications';
import { PAGINATION } from '../../constants/appConstants';
import PageLoadingSkeleton from '../../components/Loading/PageLoadingSkeleton';
import './ActivityLogs.css';

// Sample activity log data - would come from backend in production
const generateActivityLogs = (segment, companySites = []) => {
  const baseTimestamp = new Date();

  const logTemplates = [
    // User management logs
    { action: 'CREATE', entity: 'User', icon: FaPlus, category: 'user', details: 'New user account created' },
    { action: 'UPDATE', entity: 'User', icon: FaEdit, category: 'user', details: 'User profile updated' },
    { action: 'DELETE', entity: 'User', icon: FaTrash, category: 'user', details: 'User account deactivated' },
    { action: 'UPDATE', entity: 'User Policy', icon: FaEdit, category: 'user', details: 'User policy changed' },

    // Device management logs
    { action: 'CREATE', entity: 'Device', icon: FaPlus, category: 'device', details: 'New device registered' },
    { action: 'UPDATE', entity: 'Device', icon: FaEdit, category: 'device', details: 'Device configuration updated' },
    { action: 'DELETE', entity: 'Device', icon: FaTrash, category: 'device', details: 'Device removed from system' },
    { action: 'UPDATE', entity: 'Device MAC', icon: FaLaptop, category: 'device', details: 'Device MAC address updated' },

    // System configuration logs
    { action: 'UPDATE', entity: 'Policy', icon: FaCog, category: 'system', details: 'Policy configuration modified' },
    { action: 'UPDATE', entity: 'Settings', icon: FaCog, category: 'system', details: 'System settings changed' },
  ];

  const users = [
    { name: 'Rajesh Kumar', role: 'Admin' },
    { name: 'Priya Sharma', role: 'Manager' },
    { name: 'Amit Patel', role: 'Admin' },
    { name: 'System', role: 'Automated' },
  ];

  const targetUsers = [
    'Vikram Singh', 'Neha Gupta', 'Arjun Reddy', 'Kavitha Nair',
    'Suresh Menon', 'Anita Das', 'Rohit Verma', 'Deepa Iyer'
  ];

  const deviceNames = [
    'Living Room TV', 'Office Laptop', 'Conference Room Display',
    'Reception Tablet', 'Security DVR', 'Smart Speaker'
  ];

  // Use company sites if available, otherwise use default sites
  const sites = companySites.length > 0 ? companySites : [
    { siteId: 'SITE-DEFAULT', siteName: 'Main Site' }
  ];

  // Generate logs for the past 30 days
  const logs = [];
  for (let i = 0; i < 100; i++) {
    const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const site = sites[Math.floor(Math.random() * sites.length)];
    const hoursAgo = Math.floor(Math.random() * 720); // Up to 30 days
    const timestamp = new Date(baseTimestamp.getTime() - hoursAgo * 60 * 60 * 1000);

    let target = '';
    if (template.category === 'user') {
      target = targetUsers[Math.floor(Math.random() * targetUsers.length)];
    } else if (template.category === 'device') {
      target = deviceNames[Math.floor(Math.random() * deviceNames.length)];
    } else {
      target = 'System Configuration';
    }

    logs.push({
      id: `LOG-${segment.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(4, '0')}`,
      timestamp,
      action: template.action,
      entity: template.entity,
      category: template.category,
      details: template.details,
      target,
      performedBy: user.name,
      performedByRole: user.role,
      icon: template.icon,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      siteId: site.siteId,
      siteName: site.siteName,
    });
  }

  // Sort by timestamp descending (most recent first)
  return logs.sort((a, b) => b.timestamp - a.timestamp);
};

// Memoized table row component
const LogTableRow = React.memo(({ log, formatTimestamp, getActionVariant, isCompanyView, onSiteClick }) => (
  <tr>
    <td>
      <div className="log-timestamp-cell">
        <span className="log-date">{formatTimestamp(log.timestamp)}</span>
        <span className="log-id">{log.id}</span>
      </div>
    </td>
    <td>
      <Badge variant={getActionVariant(log.action)} size="table">
        {log.action}
      </Badge>
    </td>
    <td>
      <div className="log-entity-cell">
        {log.category === 'user' && <FaUser className="entity-icon" />}
        {log.category === 'device' && <FaLaptop className="entity-icon" />}
        {log.category === 'system' && <FaCog className="entity-icon" />}
        <span>{log.entity}</span>
      </div>
    </td>
    <td className="log-target-cell">{log.target}</td>
    {isCompanyView && (
      <td className="log-site-cell">
        <span
          className="log-site-badge clickable"
          onClick={() => onSiteClick && onSiteClick(log.siteId)}
          title={`Navigate to ${log.siteName}`}
        >
          <FaBuilding className="log-site-icon" />
          {log.siteName}
        </span>
      </td>
    )}
    <td>
      <div className="log-performer-cell">
        <span className="performer-name">{log.performedBy}</span>
        <span className="performer-role">{log.performedByRole}</span>
      </div>
    </td>
    <td className="log-details-cell">{log.details}</td>
    <td className="log-ip-cell">{log.ipAddress}</td>
  </tr>
));

LogTableRow.displayName = 'LogTableRow';

const ActivityLogs = () => {
  const { currentSegment } = useSegment();
  const { isCompanyView, drillDownToSite } = useAccessLevelView();
  const { hasPermission } = usePermissions();
  const { t } = useTranslation();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    /* ========================================================================
     * BACKEND INTEGRATION: Load Activity Logs
     * ========================================================================
     * API Endpoint: GET /api/v1/activity-logs
     *
     * Query Parameters:
     * - siteId (optional): Filter by site (null for company view)
     * - segment: Current segment
     * - category (optional): Filter by category (user|device|system)
     * - action (optional): Filter by action (CREATE|UPDATE|DELETE)
     * - dateRange: Days to fetch (7, 14, 30, 90)
     * - startDate (optional): Custom date range start
     * - endDate (optional): Custom date range end
     * - performedBy (optional): Filter by admin user
     * - search: Search term for target/entity
     * - page: Page number
     * - limit: Items per page
     * - sortBy: Sort column (timestamp, action, entity)
     * - sortOrder: Sort direction (asc, desc)
     *
     * Expected Response (Success - 200):
     * {
     *   "success": true,
     *   "data": {
     *     "logs": [{
     *       "id": "string",               // Unique log ID
     *       "timestamp": "ISO8601",
     *       "action": "CREATE|UPDATE|DELETE|LOGIN|LOGOUT|EXPORT|CONFIG",
     *       "entity": "string",           // User, Device, Policy, Settings, etc.
     *       "category": "user|device|system|auth",
     *       "target": "string",           // Name of affected resource
     *       "targetId": "string",         // ID of affected resource
     *       "details": "string",          // Human-readable description
     *       "performedBy": {
     *         "id": "string",
     *         "name": "string",
     *         "role": "string",
     *         "email": "string"
     *       },
     *       "ipAddress": "string",
     *       "userAgent": "string",
     *       "siteId": "string",
     *       "siteName": "string",
     *       "metadata": {                 // Additional context
     *         "oldValue": object,         // Previous state (for updates)
     *         "newValue": object,         // New state (for updates)
     *         "reason": "string"          // Optional reason for action
     *       }
     *     }],
     *     "totalCount": number,
     *     "page": number,
     *     "limit": number,
     *     "filters": {                    // Available filter options
     *       "categories": ["user", "device", "system"],
     *       "actions": ["CREATE", "UPDATE", "DELETE"],
     *       "performers": [{ id, name }]
     *     }
     *   }
     * }
     *
     * Backend Processing:
     * 1. Verify user has canViewActivityLogs permission
     * 2. Query activity_logs table with filters
     * 3. For company view, aggregate logs across all sites
     * 4. For site view, filter by specific siteId
     * 5. Include performer details from users table
     * 6. Paginate and sort results
     *
     * Audit Log Storage Best Practices:
     * - Store logs in append-only table (no updates/deletes)
     * - Use separate database/partition for high write volumes
     * - Implement log rotation and archival policy
     * - Index on: timestamp, siteId, category, performedBy
     * - Consider Elasticsearch for advanced search/filtering
     *
     * Sample Integration Code:
     * ------------------------
     * const fetchActivityLogs = async () => {
     *   setIsLoading(true);
     *   try {
     *     const params = new URLSearchParams({
     *       segment: currentSegment,
     *       dateRange: dateRangeFilter,
     *       page: currentPage,
     *       limit: rowsPerPage,
     *       sortBy: sortColumn,
     *       sortOrder: sortDirection,
     *       ...(categoryFilter !== 'all' && { category: categoryFilter }),
     *       ...(actionFilter !== 'all' && { action: actionFilter }),
     *       ...(siteFilter !== 'all' && { siteId: siteFilter }),
     *       ...(searchQuery && { search: searchQuery })
     *     });
     *     const response = await fetch(`/api/v1/activity-logs?${params}`, {
     *       headers: { 'Authorization': `Bearer ${authToken}` }
     *     });
     *     const result = await response.json();
     *     if (result.success) {
     *       setActivityLogs(result.data.logs);
     *       setTotalCount(result.data.totalCount);
     *     }
     *   } catch (error) {
     *     notifications.operationFailed('load activity logs');
     *   } finally {
     *     setIsLoading(false);
     *   }
     * };
     * ======================================================================== */

    // TODO: Remove mock and implement actual API call above
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('7');
  const [siteFilter, setSiteFilter] = useState('all'); // Site filter for company view
  const [sortColumn, setSortColumn] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [exportingCSV, setExportingCSV] = useState(false);

  // Pagination state using the portal's hook
  const {
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    resetToPage1
  } = useTableState(PAGINATION.DEFAULT_ROWS_PER_PAGE);

  // Get company sites for logs generation
  const availableSites = useMemo(() => {
    return sampleCompanySites || [];
  }, []);

  // Generate logs based on segment and company sites
  const allLogs = useMemo(() => generateActivityLogs(currentSegment, availableSites), [currentSegment, availableSites]);

  // Filter function
  const filterLogs = useCallback((log) => {
    const now = new Date();
    const daysAgo = parseInt(dateRangeFilter, 10);
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Date filter
    if (log.timestamp < cutoffDate) return false;

    // Category filter
    if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;

    // Action filter
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;

    // Site filter (only in company view)
    if (isCompanyView && siteFilter !== 'all' && log.siteId !== siteFilter) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        log.target.toLowerCase().includes(query) ||
        log.performedBy.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.id.toLowerCase().includes(query) ||
        log.entity.toLowerCase().includes(query) ||
        (log.siteName && log.siteName.toLowerCase().includes(query))
      );
    }

    return true;
  }, [searchQuery, categoryFilter, actionFilter, dateRangeFilter, isCompanyView, siteFilter]);

  // Filtered and sorted logs
  const filteredLogs = useMemo(() => {
    let result = allLogs.filter(filterLogs);

    // Sort
    result.sort((a, b) => {
      let aVal, bVal;
      switch (sortColumn) {
        case 'timestamp':
          aVal = a.timestamp.getTime();
          bVal = b.timestamp.getTime();
          break;
        case 'action':
          aVal = a.action;
          bVal = b.action;
          break;
        case 'entity':
          aVal = a.entity;
          bVal = b.entity;
          break;
        case 'target':
          aVal = a.target;
          bVal = b.target;
          break;
        case 'siteName':
          aVal = a.siteName || '';
          bVal = b.siteName || '';
          break;
        case 'performedBy':
          aVal = a.performedBy;
          bVal = b.performedBy;
          break;
        default:
          aVal = a.timestamp.getTime();
          bVal = b.timestamp.getTime();
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [allLogs, filterLogs, sortColumn, sortDirection]);

  // Paginated logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredLogs.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLogs, currentPage, rowsPerPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = useCallback((setter) => (value) => {
    setter(value);
    resetToPage1();
  }, [resetToPage1]);

  const formatTimestamp = (date) => {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getActionVariant = (action) => {
    switch (action) {
      case 'CREATE': return 'active';
      case 'UPDATE': return 'info';
      case 'DELETE': return 'blocked';
      default: return 'default';
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Handle site click to navigate to site view
  const handleSiteClick = useCallback((siteId) => {
    // Find the site name from available sites
    const site = availableSites.find(s => s.siteId === siteId);
    if (drillDownToSite && site) {
      drillDownToSite(siteId, site.siteName);
    }
  }, [drillDownToSite, availableSites]);

  const handleExportCSV = async () => {
    if (filteredLogs.length === 0) {
      notifications.showWarning(t('logs.noLogsToExport'));
      return;
    }

    setExportingCSV(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      // Include site column only in company view
      const headers = isCompanyView
        ? ['Log ID', 'Timestamp', 'Action', 'Entity', 'Target', 'Site', 'Performed By', 'Role', 'Details', 'IP Address']
        : ['Log ID', 'Timestamp', 'Action', 'Entity', 'Target', 'Performed By', 'Role', 'Details', 'IP Address'];
      const rows = filteredLogs.map(log => {
        const baseRow = [
          log.id,
          formatTimestamp(log.timestamp),
          log.action,
          log.entity,
          log.target,
        ];
        if (isCompanyView) {
          baseRow.push(log.siteName || 'Unknown Site');
        }
        baseRow.push(
          log.performedBy,
          log.performedByRole,
          log.details,
          log.ipAddress
        );
        return baseRow;
      });

      exportChartDataToCSV({ headers, rows }, `activity_logs_${currentSegment}.csv`);
      notifications.exportSuccess('CSV');
    } catch (error) {
      notifications.exportFailed('CSV');
    } finally {
      setExportingCSV(false);
    }
  };

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Check permission
  if (!hasPermission('canViewLogs')) {
    return (
      <main className="main-content" role="main" aria-label={t('logs.pageAriaLabel')}>
        <div className="logs-container">
          <div className="logs-permission-denied">
            <FaClipboardList className="permission-denied-icon" />
            <h2>{t('logs.accessRestricted')}</h2>
            <p>{t('logs.noPermission')}</p>
            <p className="permission-denied-help">
              {t('logs.permissionHelp')}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Show loading skeleton during initial load
  if (isLoading) {
    return <PageLoadingSkeleton pageType="list" rows={10} cols={5} />;
  }

  return (
    <main className="main-content" role="main" aria-label={t('logs.pageAriaLabel')}>
      <div className="logs-container">
        <h1 className="logs-page-title">{t('logs.title')}</h1>

        {/* Company View Info Banner */}
        {isCompanyView && (
          <div className="company-view-banner">
            <div className="banner-content">
              <FaInfoCircle className="banner-icon" />
              <div className="banner-text">
                <span className="banner-title">Company View</span>
                <span className="banner-subtitle">Viewing activity logs across all sites. Select a site to filter.</span>
              </div>
            </div>
            <div className="banner-filter">
              <label htmlFor="logs-site-filter">Filter by Site:</label>
              <select
                id="logs-site-filter"
                className="site-filter-select"
                value={siteFilter}
                onChange={(e) => handleFilterChange(setSiteFilter)(e.target.value)}
              >
                <option value="all">All Sites</option>
                {availableSites.map(site => (
                  <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Toolbar - matches DeviceToolbar pattern */}
        <div className="logs-toolbar-content">
          <div className="logs-toolbar">
            <div className="logs-toolbar-inner">
              <div className="toolbar-left">
                <Button
                  variant="secondary"
                  onClick={handleExportCSV}
                  loading={exportingCSV}
                  disabled={filteredLogs.length === 0}
                  title={filteredLogs.length === 0 ? t('logs.noLogsToExport') : t('logs.exportCsvAria')}
                  aria-label={t('logs.exportCsvAria')}
                >
                  <FaFileCsv style={{ marginRight: 6 }} />
                  {t('logs.exportCsv')}
                </Button>
              </div>
              <div className="toolbar-right">
                <input
                  type="search"
                  className="toolbar-search"
                  placeholder={t('logs.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)}
                  aria-label={t('logs.searchAriaLabel')}
                />
                <select
                  className="toolbar-select"
                  value={categoryFilter}
                  onChange={(e) => handleFilterChange(setCategoryFilter)(e.target.value)}
                  aria-label={t('logs.filterByCategory')}
                >
                  <option value="all">{t('logs.allCategories')}</option>
                  <option value="user">{t('logs.categories.user')}</option>
                  <option value="device">{t('logs.categories.device')}</option>
                  <option value="system">{t('logs.categories.system')}</option>
                </select>
                <select
                  className="toolbar-select"
                  value={actionFilter}
                  onChange={(e) => handleFilterChange(setActionFilter)(e.target.value)}
                  aria-label={t('logs.filterByAction')}
                >
                  <option value="all">{t('logs.allActions')}</option>
                  <option value="CREATE">{t('logs.actions.created')}</option>
                  <option value="UPDATE">{t('logs.actions.updated')}</option>
                  <option value="DELETE">{t('logs.actions.deleted')}</option>
                </select>
                <select
                  className="toolbar-select"
                  value={dateRangeFilter}
                  onChange={(e) => handleFilterChange(setDateRangeFilter)(e.target.value)}
                  aria-label={t('logs.filterByDateRange')}
                >
                  <option value="1">{t('logs.dateRanges.last24Hours')}</option>
                  <option value="7">{t('logs.dateRanges.last7Days')}</option>
                  <option value="14">{t('logs.dateRanges.last14Days')}</option>
                  <option value="30">{t('logs.dateRanges.last30Days')}</option>
                </select>
                {isCompanyView && (
                  <select
                    className="toolbar-select"
                    value={siteFilter}
                    onChange={(e) => handleFilterChange(setSiteFilter)(e.target.value)}
                    aria-label="Filter by site"
                  >
                    <option value="all">All Sites</option>
                    {availableSites.map(site => (
                      <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
                    ))}
                  </select>
                )}
                <FaQuestionCircle
                  className="help-icon"
                  title={t('logs.activityLogsHelp')}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="logs-summary-bar">
          <span className="logs-count">
            {t('logs.showingLogs', { showing: paginatedLogs.length, total: filteredLogs.length })}
            {filteredLogs.length !== allLogs.length && ` ${t('logs.filteredFrom', { allTotal: allLogs.length })}`}
          </span>
        </div>

        {/* Table */}
        <div className="logs-table-outer">
          {filteredLogs.length === 0 ? (
            <div className="logs-empty-state">
              <FaClipboardList className="empty-icon" />
              <p>{t('logs.noLogsFound')}</p>
            </div>
          ) : (
            <table className="logs-table" role="grid" aria-label={t('logs.tableAriaLabel')}>
              <thead>
                <tr>
                  <th
                    className="sortable-header"
                    onClick={() => handleSort('timestamp')}
                    aria-sort={sortColumn === 'timestamp' ? sortDirection : 'none'}
                  >
                    <span>{t('logs.timestamp')}</span>
                    {renderSortIcon('timestamp')}
                  </th>
                  <th
                    className="sortable-header"
                    onClick={() => handleSort('action')}
                    aria-sort={sortColumn === 'action' ? sortDirection : 'none'}
                  >
                    <span>{t('logs.action')}</span>
                    {renderSortIcon('action')}
                  </th>
                  <th
                    className="sortable-header"
                    onClick={() => handleSort('entity')}
                    aria-sort={sortColumn === 'entity' ? sortDirection : 'none'}
                  >
                    <span>{t('logs.entity')}</span>
                    {renderSortIcon('entity')}
                  </th>
                  <th
                    className="sortable-header"
                    onClick={() => handleSort('target')}
                    aria-sort={sortColumn === 'target' ? sortDirection : 'none'}
                  >
                    <span>{t('logs.target')}</span>
                    {renderSortIcon('target')}
                  </th>
                  {isCompanyView && (
                    <th
                      className="sortable-header"
                      onClick={() => handleSort('siteName')}
                      aria-sort={sortColumn === 'siteName' ? sortDirection : 'none'}
                    >
                      <span>Site</span>
                      {renderSortIcon('siteName')}
                    </th>
                  )}
                  <th
                    className="sortable-header"
                    onClick={() => handleSort('performedBy')}
                    aria-sort={sortColumn === 'performedBy' ? sortDirection : 'none'}
                  >
                    <span>{t('logs.performedBy')}</span>
                    {renderSortIcon('performedBy')}
                  </th>
                  <th>{t('logs.details')}</th>
                  <th>{t('logs.ipAddress')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <LogTableRow
                    key={log.id}
                    log={log}
                    formatTimestamp={formatTimestamp}
                    getActionVariant={getActionVariant}
                    isCompanyView={isCompanyView}
                    onSiteClick={handleSiteClick}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <Pagination
            totalItems={filteredLogs.length}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(newRows) => {
              setRowsPerPage(newRows);
              resetToPage1();
            }}
          />
        )}
      </div>
    </main>
  );
};

export default ActivityLogs;
