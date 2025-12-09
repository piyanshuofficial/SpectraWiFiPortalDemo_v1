// src/pages/ActivityLogs/ActivityLogs.js

import React, { useState, useMemo, useCallback } from 'react';
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
  FaQuestionCircle
} from 'react-icons/fa';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Pagination from '../../components/Pagination';
import { usePermissions } from '../../hooks/usePermissions';
import { useTableState } from '../../hooks/useTableState';
import { useSegment } from '../../context/SegmentContext';
import { exportChartDataToCSV } from '../../utils/exportUtils';
import notifications from '../../utils/notifications';
import { PAGINATION } from '../../constants/appConstants';
import './ActivityLogs.css';

// Sample activity log data - would come from backend in production
const generateActivityLogs = (segment) => {
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

  // Generate logs for the past 30 days
  const logs = [];
  for (let i = 0; i < 100; i++) {
    const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
    const user = users[Math.floor(Math.random() * users.length)];
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
    });
  }

  // Sort by timestamp descending (most recent first)
  return logs.sort((a, b) => b.timestamp - a.timestamp);
};

// Memoized table row component
const LogTableRow = React.memo(({ log, formatTimestamp, getActionVariant }) => (
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
  const { hasPermission } = usePermissions();

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('7');
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

  // Generate logs based on segment
  const allLogs = useMemo(() => generateActivityLogs(currentSegment), [currentSegment]);

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

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        log.target.toLowerCase().includes(query) ||
        log.performedBy.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.id.toLowerCase().includes(query) ||
        log.entity.toLowerCase().includes(query)
      );
    }

    return true;
  }, [searchQuery, categoryFilter, actionFilter, dateRangeFilter]);

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

  const handleExportCSV = async () => {
    if (filteredLogs.length === 0) {
      notifications.showWarning('No logs to export');
      return;
    }

    setExportingCSV(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const headers = ['Log ID', 'Timestamp', 'Action', 'Entity', 'Target', 'Performed By', 'Role', 'Details', 'IP Address'];
      const rows = filteredLogs.map(log => [
        log.id,
        formatTimestamp(log.timestamp),
        log.action,
        log.entity,
        log.target,
        log.performedBy,
        log.performedByRole,
        log.details,
        log.ipAddress
      ]);

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
      <main className="main-content" role="main" aria-label="Activity Logs">
        <div className="logs-container">
          <div className="logs-permission-denied">
            <FaClipboardList className="permission-denied-icon" />
            <h2>Access Restricted</h2>
            <p>You don't have permission to view activity logs.</p>
            <p className="permission-denied-help">
              Only administrators and managers can access this section.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content" role="main" aria-label="Activity Logs">
      <div className="logs-container">
        <h1 className="logs-page-title">Activity Logs</h1>

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
                  title={filteredLogs.length === 0 ? 'No logs to export' : 'Export logs to CSV'}
                  aria-label="Export logs to CSV"
                >
                  <FaFileCsv style={{ marginRight: 6 }} />
                  Export CSV
                </Button>
              </div>
              <div className="toolbar-right">
                <input
                  type="search"
                  className="toolbar-search"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)}
                  aria-label="Search activity logs"
                />
                <select
                  className="toolbar-select"
                  value={categoryFilter}
                  onChange={(e) => handleFilterChange(setCategoryFilter)(e.target.value)}
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  <option value="user">User Management</option>
                  <option value="device">Device Management</option>
                  <option value="system">System Config</option>
                </select>
                <select
                  className="toolbar-select"
                  value={actionFilter}
                  onChange={(e) => handleFilterChange(setActionFilter)(e.target.value)}
                  aria-label="Filter by action"
                >
                  <option value="all">All Actions</option>
                  <option value="CREATE">Created</option>
                  <option value="UPDATE">Updated</option>
                  <option value="DELETE">Deleted</option>
                </select>
                <select
                  className="toolbar-select"
                  value={dateRangeFilter}
                  onChange={(e) => handleFilterChange(setDateRangeFilter)(e.target.value)}
                  aria-label="Filter by date range"
                >
                  <option value="1">Last 24 hours</option>
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                </select>
                <FaQuestionCircle
                  className="help-icon"
                  title="Activity logs help"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="logs-summary-bar">
          <span className="logs-count">
            Showing {paginatedLogs.length} of {filteredLogs.length} logs
            {filteredLogs.length !== allLogs.length && ` (filtered from ${allLogs.length} total)`}
          </span>
        </div>

        {/* Table */}
        <div className="logs-table-outer">
          {filteredLogs.length === 0 ? (
            <div className="logs-empty-state">
              <FaClipboardList className="empty-icon" />
              <p>No activity logs found matching your criteria.</p>
            </div>
          ) : (
            <table className="logs-table" role="grid" aria-label="Activity logs table">
              <thead>
                <tr>
                  <th
                    className="sortable-header"
                    onClick={() => handleSort('timestamp')}
                    aria-sort={sortColumn === 'timestamp' ? sortDirection : 'none'}
                  >
                    <span>Timestamp</span>
                    {renderSortIcon('timestamp')}
                  </th>
                  <th
                    className="sortable-header"
                    onClick={() => handleSort('action')}
                    aria-sort={sortColumn === 'action' ? sortDirection : 'none'}
                  >
                    <span>Action</span>
                    {renderSortIcon('action')}
                  </th>
                  <th
                    className="sortable-header"
                    onClick={() => handleSort('entity')}
                    aria-sort={sortColumn === 'entity' ? sortDirection : 'none'}
                  >
                    <span>Entity</span>
                    {renderSortIcon('entity')}
                  </th>
                  <th
                    className="sortable-header"
                    onClick={() => handleSort('target')}
                    aria-sort={sortColumn === 'target' ? sortDirection : 'none'}
                  >
                    <span>Target</span>
                    {renderSortIcon('target')}
                  </th>
                  <th
                    className="sortable-header"
                    onClick={() => handleSort('performedBy')}
                    aria-sort={sortColumn === 'performedBy' ? sortDirection : 'none'}
                  >
                    <span>Performed By</span>
                    {renderSortIcon('performedBy')}
                  </th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <LogTableRow
                    key={log.id}
                    log={log}
                    formatTimestamp={formatTimestamp}
                    getActionVariant={getActionVariant}
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
