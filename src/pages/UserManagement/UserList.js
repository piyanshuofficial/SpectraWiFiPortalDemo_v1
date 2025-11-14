// src/pages/UserManagement/UserList.js

import React, { useState, useMemo, useEffect, useCallback } from "react";
import UserFormModal from "./UserFormModal";
import UserToolbar from "./UserToolbar";
import UserDetailsModal from "./UserDetailsModal";
import Pagination from "../../components/Pagination";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import DeviceFormModal from "../../components/DeviceFormModal";
import {
  FaInfoCircle, FaEdit, FaTrash, FaSortUp, FaSortDown,
  FaTachometerAlt, FaDatabase, FaTabletAlt
} from "react-icons/fa";
import "./UserManagement.css";
import { usePermissions } from "../../hooks/usePermissions";
import { useSort } from "../../hooks/useSort";
import { useFilter } from "../../hooks/useFilter";
import { useTableState } from "../../hooks/useTableState";
import { commonColumns, segmentSpecificFields } from "../../utils/columns";
import userSampleData from "../../constants/userSampleData";
import UserLicenseRing from '../../components/common/UserLicenseRing';
import { useLocation } from 'react-router-dom';
import notifications from "../../utils/notifications";
import SEGMENT_DEVICE_AVAILABILITY from '../../config/segmentDeviceConfig';
import siteConfig from '../../config/siteConfig';
import { PAGINATION } from '../../constants/appConstants';
import { useLoading } from "../../context/LoadingContext";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import SkeletonLoader from "../../components/Loading/SkeletonLoader";
import { exportChartDataToCSV } from "../../utils/exportUtils";

const MAX_LICENSES = siteConfig.licenses.maxLicenses;
const USED_LICENSES = siteConfig.licenses.usedLicenses;

const PolicyCell = React.memo(({ userPolicy }) => {
  if (!userPolicy) return <td className="policy-column">--</td>;
  
  return (
    <td className="policy-column">
      <div className="policy-row">
        <span className="policy-icon speed"><FaTachometerAlt /></span>
        <span className="policy-pill speed">{userPolicy.speed}</span>
      </div>
      <div className="policy-row">
        <span className="policy-icon data"><FaDatabase /></span>
        <span className="policy-pill data">{userPolicy.dataVolume}</span>
      </div>
      <div className="policy-row">
        <span className="policy-icon device"><FaTabletAlt /></span>
        <span className="policy-pill device">
          {userPolicy.deviceLimit} Device{userPolicy.deviceLimit > 1 ? "s" : ""}
        </span>
      </div>
    </td>
  );
});

PolicyCell.displayName = 'PolicyCell';

const UserTableRow = React.memo(({ 
  user, 
  visibleColumns, 
  segmentSpecificFields,
  segmentFilter,
  hasEditPermission,
  onDetailsClick,
  onEditClick,
  onDeleteClick
}) => {
  const isBlocked = user.status === "Blocked" || user.status === "Restricted";
  
  return (
    <tr>
      {visibleColumns.includes("id") && <td>{user.id}</td>}
      {visibleColumns.includes("firstName") && <td>{user.firstName} {user.lastName}</td>}
      {visibleColumns.includes("mobile") && <td>{user.mobile}</td>}
      {visibleColumns.includes("email") && <td>{user.email}</td>}
      {(visibleColumns.includes("userPolicy") || visibleColumns.includes("policy")) && (
        <PolicyCell userPolicy={user.userPolicy} />
      )}
      {visibleColumns.includes("devicesCount") && <td>{user.devicesCount}</td>}
      {visibleColumns.includes("status") && (
        <td><Badge variant={user.status.toLowerCase()} size="table">{user.status}</Badge></td>
      )}
      {visibleColumns.includes("registration") && <td>{user.registration}</td>}
      {visibleColumns.includes("lastOnline") && <td>{user.lastOnline}</td>}
      {(segmentSpecificFields || []).map((col) => (
        visibleColumns.includes(col.key) ? <td key={col.key}>{user[col.key] || "-"}</td> : null
      ))}
      <td>
        <Button
          variant="info"
          title="User Details"
          aria-label="View User Details"
          onClick={() => onDetailsClick(user)}
        >
          <FaInfoCircle />
        </Button>
        {hasEditPermission ? (
          <>
            <Button
              variant="primary"
              title={isBlocked ? "Cannot edit user with Blocked status" : "Edit User"}
              aria-label={isBlocked ? "Edit User Disabled - Blocked Status" : "Edit User"}
              onClick={() => onEditClick(user)}
              disabled={isBlocked}
            >
              <FaEdit />
            </Button>
            <Button 
              variant="danger" 
              title="Delete User - Disabled" 
              aria-label="Delete User Disabled" 
              disabled
            >
              <FaTrash />
            </Button>
          </>
        ) : (
          <Button 
            variant="primary" 
            title="Edit User - Permission Required" 
            aria-label="Edit Disabled, Permission Required" 
            disabled
          >
            <FaEdit />
          </Button>
        )}
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.status === nextProps.user.status &&
    prevProps.user.firstName === nextProps.user.firstName &&
    prevProps.user.lastName === nextProps.user.lastName &&
    prevProps.user.mobile === nextProps.user.mobile &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.visibleColumns.length === nextProps.visibleColumns.length &&
    prevProps.segmentFilter === nextProps.segmentFilter &&
    JSON.stringify(prevProps.user.userPolicy) === JSON.stringify(nextProps.user.userPolicy)
  );
});

UserTableRow.displayName = 'UserTableRow';

const UserList = () => {
  const { canEditUsers, canViewReports } = usePermissions();
  const location = useLocation();
  const { startLoading, stopLoading, isLoading } = useLoading();
  
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState("enterprise");
  const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [detailsUser, setDetailsUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const segmentDeviceConfig = SEGMENT_DEVICE_AVAILABILITY[segmentFilter] || {};
  const allowHuman = segmentDeviceConfig.allowHuman ?? false;
  const allowNonHuman = segmentDeviceConfig.allowNonHuman ?? false;
  const showAddDevice = allowHuman || allowNonHuman;

  const columns = useMemo(() => {
    const segmentCols = segmentSpecificFields[segmentFilter] || [];
    return [...commonColumns, ...segmentCols].filter(col => col && col.key);
  }, [segmentFilter]);

  const {
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    visibleColumns,
    toggleColumn: toggleColumnVisibility,
    setVisibleColumns,
    resetToPage1
  } = useTableState(PAGINATION.DEFAULT_ROWS_PER_PAGE);

  const userFilterFunction = useCallback((user, { searchTerm = '', statusFilter = '', advancedFilters = {} }) => {
    if (segmentFilter !== "all" && user.segment !== segmentFilter) return false;
    if (statusFilter && user.status !== statusFilter) return false;
    
    const searchLower = searchTerm.toLowerCase().trim();
    if (searchLower) {
      const allSearchFields = [
        user.id,
        user.firstName,
        user.lastName,
        user.mobile,
        user.email,
        user.userPolicy ? `${user.userPolicy.speed} ${user.userPolicy.dataVolume} ${user.userPolicy.deviceLimit} ${user.userPolicy.dataCycleType}` : "",
        user.status,
        user.registration,
        user.lastOnline,
        user.location,
        ...columns.filter((c) => c.optional).map((c) => user[c.key] || ""),
      ];
      if (!allSearchFields.some((f) => f?.toString().toLowerCase().includes(searchLower))) {
        return false;
      }
    }
    
    if (advancedFilters && typeof advancedFilters === 'object') {
      for (const [key, value] of Object.entries(advancedFilters)) {
        if (value) {
          const userVal =
            key === "policy" || key === "userPolicy"
              ? user.userPolicy ? `${user.userPolicy.speed} ${user.userPolicy.dataVolume} ${user.userPolicy.deviceLimit} ${user.userPolicy.dataCycleType}` : ""
              : (user[key] || "").toString().toLowerCase();
          if (!userVal.includes(value.toLowerCase())) {
            return false;
          }
        }
      }
    }
    return true;
  }, [segmentFilter, columns]);

  const {
    filteredData: filteredUsers,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    activeFilterCount
  } = useFilter(users, userFilterFunction);

  const statusFilter = filters.statusFilter || "";
  const advancedFilters = filters.advancedFilters || {};

  const {
    sortedData: sortedUsers,
    sortColumn,
    sortDirection,
    handleSort: onSortClick,
    getSortIndicator
  } = useSort(filteredUsers, null, 'asc');

  const renderSortIndicator = useCallback((column) => {
    const direction = getSortIndicator(column);
    if (!direction) return null;
    return direction === 'asc' ? (
      <FaSortUp aria-label="sorted ascending" />
    ) : (
      <FaSortDown aria-label="sorted descending" />
    );
  }, [getSortIndicator]);

  useEffect(() => {
    let mounted = true;
    let timeoutId = null;

    const loadInitialData = async () => {
      startLoading('users');
      try {
        timeoutId = setTimeout(() => {
          if (mounted) {
            setUsers(userSampleData.users || []);
            setDevices([]);
            stopLoading('users');
            setInitialLoad(false);
          }
        }, 800);
      } catch (error) {
        if (mounted) {
          notifications.operationFailed("load users");
          stopLoading('users');
          setInitialLoad(false);
        }
      }
    };

    loadInitialData();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [startLoading, stopLoading]);

  useEffect(() => {
    const defaultCols = columns
      .filter(
        (col) =>
          !col.optional ||
          ["userPolicy", "registration", "lastOnline"].includes(col.key)
      )
      .map((col) => col.key);
    setVisibleColumns(defaultCols);
  }, [segmentFilter, columns, setVisibleColumns]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === '1') {
      setShowFormModal(true);
    }
  }, [location.search]);

  const pagedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedUsers, currentPage, rowsPerPage]);

  useEffect(() => {
    resetToPage1();
  }, [
    filteredUsers,
    rowsPerPage,
    sortColumn,
    sortDirection,
    visibleColumns,
    resetToPage1
  ]);

  const handleUserSubmit = useCallback(async (userObj) => {
    setSubmitting(true);
    let timeoutId = null;
    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 1000);
      });
      
      const userWithActiveStatus = { ...userObj, status: "Active" };
      if (editingUser) {
        setUsers(users => users.map((u) => (u.id === editingUser.id ? userWithActiveStatus : u)));
        notifications.userUpdated();
      } else {
        setUsers(users => [userWithActiveStatus, ...users]);
        notifications.userAdded();
      }
      setShowFormModal(false);
      setEditingUser(null);
    } catch (error) {
      notifications.operationFailed(editingUser ? "update user" : "add user");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setSubmitting(false);
    }
  }, [editingUser]);

  const handleChangeStatus = useCallback((id, newStatus) => {
    setUsers(users => users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      startLoading('users');
      let timeoutId = null;
      try {
        await new Promise(resolve => {
          timeoutId = setTimeout(resolve, 500);
        });
        setUsers(users => users.filter((u) => u.id !== id));
        notifications.userDeleted();
      } catch (error) {
        notifications.operationFailed("delete user");
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        stopLoading('users');
      }
    }
  }, [startLoading, stopLoading]);

  const handleEditClick = useCallback((user) => {
    const isBlocked = user.status === "Blocked" || user.status === "Restricted";
    if (isBlocked) {
      notifications.showError("Cannot edit user with Blocked status");
      return;
    }
    setEditingUser(user);
    setShowFormModal(true);
  }, []);

  const handleDetailsClick = useCallback((user) => {
    setDetailsUser(user);
    setShowDetailsModal(true);
  }, []);

  const handleDeviceSubmit = useCallback((deviceInfo) => {
    notifications.deviceRegistered(deviceInfo.deviceName);
    setDevices(devices => [deviceInfo, ...devices]);
    setShowDeviceModal(false);
  }, []);

  const handleExportUsers = useCallback(async () => {
    if (!canViewReports) {
      notifications.noPermission("export reports");
      return;
    }

    setExportingCSV(true);
    let timeoutId = null;

    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 600);
      });

      const visibleColumnDefs = columns.filter(col => visibleColumns.includes(col.key));
      const headers = visibleColumnDefs.map(col => col.label);

      const rows = sortedUsers.map(user => {
        return visibleColumnDefs.map(col => {
          const key = col.key;
          
          if (key === 'userPolicy' || key === 'policy') {
            if (user.userPolicy) {
              return `${user.userPolicy.speed} | ${user.userPolicy.dataVolume} | ${user.userPolicy.deviceLimit} Device(s) | ${user.userPolicy.dataCycleType}`;
            }
            return '--';
          }
          
          if (key === 'firstName') {
            return `${user.firstName} ${user.lastName}`;
          }
          
          return user[key] || '--';
        });
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const segmentName = segmentFilter.charAt(0).toUpperCase() + segmentFilter.slice(1);
      const filename = `Users_${segmentName}_${timestamp}.csv`;

      exportChartDataToCSV({ headers, rows }, filename);
      
      notifications.exportSuccess(`${sortedUsers.length} users`);
    } catch (error) {
      console.error('Export error:', error);
      notifications.exportFailed("users");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setExportingCSV(false);
    }
  }, [canViewReports, columns, visibleColumns, sortedUsers, segmentFilter]);

  const segmentSpecificCols = segmentSpecificFields[segmentFilter] || [];

  if (initialLoad) {
    return (
      <div className="user-list-container">
        <div className="user-toolbar-ring-row">
          <div className="user-toolbar">
            <SkeletonLoader variant="rect" height={40} />
          </div>
        </div>
        <SkeletonLoader variant="table" rows={10} />
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <LoadingOverlay active={isLoading('users') || exportingCSV} message={exportingCSV ? "Exporting users..." : "Processing..."} />
      
      <div className="segment-selector-test">
        <label htmlFor="segment-test-select">Segment:</label>
        <select
          id="segment-test-select"
          value={segmentFilter}
          onChange={(e) => setSegmentFilter(e.target.value)}
          className="segment-test-dropdown"
        >
          {Object.keys(segmentSpecificFields).map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="user-toolbar-ring-row">
        <div className="user-toolbar">
          <UserToolbar
            searchValue={searchTerm}
            onSearchChange={e => setSearchTerm(e.target.value)}
            statusFilter={statusFilter}
            onStatusChange={e => setFilter('statusFilter', e.target.value)}
            onAdd={canEditUsers ? () => setShowFormModal(true) : undefined}
            disableAdd={!canEditUsers}
            onExport={handleExportUsers}
            disableExport={!canViewReports || exportingCSV}
            exportLoading={exportingCSV}
            onAddDevice={showAddDevice ? () => setShowDeviceModal(true) : undefined}
            disableAddDevice={!showAddDevice}
            segment={segmentFilter}
          />
        </div>
        <div className="user-license-ring-header">
          <UserLicenseRing current={USED_LICENSES} total={MAX_LICENSES} size={160} ringWidth={16} />
        </div>
      </div>

      <div className="column-controls-compact">
        <div className="column-controls-left">
          <label htmlFor="rows-per-page-select" className="compact-label">
            Rows:
          </label>
          <select
            id="rows-per-page-select"
            className="compact-select"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {PAGINATION.ROWS_PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="column-controls-right">
          <span className="compact-label">Columns:</span>
          <div className="column-checkbox-compact">
            {columns
              .filter((c) => c.optional)
              .map((col) => (
                <label key={col.key} className="column-checkbox-chip-compact">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => toggleColumnVisibility(col.key)}
                  />
                  <span>{col.label}</span>
                </label>
              ))}
          </div>
        </div>
      </div>

      <button
        className="btn btn-secondary"
        onClick={() => setAdvancedFilterVisible((v) => !v)}
        style={{ marginBottom: "12px" }}
        aria-expanded={advancedFilterVisible}
        aria-controls="advanced-filters-panel"
      >
        {advancedFilterVisible
          ? `Hide Advanced Filters${activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}`
          : `Show Advanced Filters${activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}`}
      </button>

      {advancedFilterVisible && (
        <form
          id="advanced-filters-panel"
          className="advanced-filters-panel"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
          spellCheck={false}
        >
          <div className="advanced-filters-grid">
            {columns
              .filter((c) => c && c.optional)
              .map((col) => (
                <div key={col.key}>
                  <label htmlFor={`filter-${col.key}`} className="advanced-filter-label">
                    {col.label}
                  </label>
                  {col.key === "userPolicy" ? (
                    <input
                      id={`filter-${col.key}`}
                      type="text"
                      value={(advancedFilters && advancedFilters[col.key]) || ""}
                      onChange={(e) => {
                        const currentFilters = filters.advancedFilters || {};
                        setFilter('advancedFilters', {
                          ...currentFilters,
                          [col.key]: e.target.value,
                        });
                      }}
                      placeholder={`Filter by ${col.label}`}
                      aria-label={`Filter by ${col.label}`}
                      autoComplete="off"
                    />
                  ) : col.key === "status" ? (
                    <select
                      id={`filter-${col.key}`}
                      value={(advancedFilters && advancedFilters[col.key]) || ""}
                      onChange={(e) => {
                        const currentFilters = filters.advancedFilters || {};
                        setFilter('advancedFilters', {
                          ...currentFilters,
                          [col.key]: e.target.value,
                        });
                      }}
                      aria-label={`Filter by ${col.label}`}
                    >
                      <option value="">Any</option>
                      {["Active", "Suspended", "Blocked"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`filter-${col.key}`}
                      type="text"
                      value={(advancedFilters && advancedFilters[col.key]) || ""}
                      onChange={(e) => {
                        const currentFilters = filters.advancedFilters || {};
                        setFilter('advancedFilters', {
                          ...currentFilters,
                          [col.key]: e.target.value,
                        });
                      }}
                      placeholder={`Filter by ${col.label}`}
                      aria-label={`Filter by ${col.label}`}
                      autoComplete="off"
                    />
                  )}
                </div>
              ))}
          </div>
          <div className="advanced-filter-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setFilter('advancedFilters', {})}
            >
              Clear All
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setAdvancedFilterVisible(false)}>
              Hide Filters
            </button>
          </div>
        </form>
      )}

      <div className="user-table-outer">
        <table className="user-table" role="table">
          <thead>
            <tr>
              {columns
                .filter((c) => visibleColumns.includes(c.key))
                .map((col) => (
                  <th
                    key={col.key}
                    onClick={() => onSortClick(col.key)}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    role="columnheader"
                    scope="col"
                    tabIndex={0}
                    aria-sort={sortColumn === col.key ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onSortClick(col.key);
                        e.preventDefault();
                      }
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      {col.label}
                      {renderSortIndicator(col.key)}
                    </span>
                  </th>
                ))}
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            ) : (
              pagedUsers.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  visibleColumns={visibleColumns}
                  segmentSpecificFields={segmentSpecificCols}
                  segmentFilter={segmentFilter}
                  hasEditPermission={canEditUsers}
                  onDetailsClick={handleDetailsClick}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      {showFormModal && (
        <UserFormModal
          user={editingUser}
          segment={segmentFilter}
          onSubmit={handleUserSubmit}
          onClose={() => {
            setShowFormModal(false);
            setEditingUser(null);
          }}
          submitting={submitting}
        />
      )}

      {showDetailsModal && detailsUser && (
        <UserDetailsModal
          user={detailsUser}
          onClose={() => {
            setShowDetailsModal(false);
            setDetailsUser(null);
          }}
          onEdit={(u) => {
            setEditingUser(u);
            setShowDetailsModal(false);
            setShowFormModal(true);
          }}
          onSendMessage={(user) => {
          }}
          onSuspend={(user) => {
            handleChangeStatus(user.id, "Suspended");
            notifications.userSuspended(user.id);
            setShowDetailsModal(false);
          }}
          onBlock={(user) => {
            handleChangeStatus(user.id, "Blocked");
            notifications.userBlocked(user.id);
            setShowDetailsModal(false);
          }}
          onActivate={(user) => {
            handleChangeStatus(user.id, "Active");
            notifications.userActivated(user.id);
            setShowDetailsModal(false);
          }}
        />
      )}

      {showDeviceModal && (
        <DeviceFormModal
          open={showDeviceModal}
          onClose={() => setShowDeviceModal(false)}
          onSubmit={handleDeviceSubmit}
          users={users}
          devices={devices}
          segment={segmentFilter}
          siteUserList={users}
        />
      )}
    </div>
  );
};

export default UserList;