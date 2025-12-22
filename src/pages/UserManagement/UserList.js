/**
 * ============================================================================
 * User List Page (User Management)
 * ============================================================================
 *
 * @file src/pages/UserManagement/UserList.js
 * @description Main user management page displaying all users for the current
 *              site/company with filtering, sorting, pagination, and CRUD actions.
 *              This is one of the core pages of the customer portal.
 *
 * @features
 * - Tabular display of all users with sortable columns
 * - Search and advanced filtering capabilities
 * - Status-based filtering (Active, Suspended, Blocked)
 * - Site filtering for company-level users
 * - Pagination with configurable rows per page
 * - Column visibility toggle (show/hide columns)
 * - Export to CSV functionality
 * - Add/Edit user via modal form
 * - Bulk import from CSV
 * - Status change actions (Suspend, Block, Activate)
 * - License usage indicator
 *
 * @pageStructure
 * ```
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ Page Title: "User Management"                                           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ [Company View Banner - if in company view]                              │
 * ├────────────────────────────────────────────────┬─────────────────────────┤
 * │  UserToolbar:                                  │  License Usage Ring     │
 * │  [Search] [Status Filter] [Add] [Import] [Export] [Add Device]          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Column Controls: [✓ ID] [✓ Policy] [ Location] [✓ Status] ...           │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ [Show Advanced Filters] button                                          │
 * │ ┌──────────────────────────────────────────────────────────────────────┐ │
 * │ │ Advanced Filters Panel (collapsible)                                 │ │
 * │ └──────────────────────────────────────────────────────────────────────┘ │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                         User Data Table                                  │
 * │ ┌────┬────────┬─────────┬─────────┬──────────┬─────────┬─────────┐     │
 * │ │ ID │ Name   │ Mobile  │ Email   │ Policy   │ Status  │ Actions │     │
 * │ ├────┼────────┼─────────┼─────────┼──────────┼─────────┼─────────┤     │
 * │ │ U1 │ John D │ 91-xxx  │ j@e.com │ 50Mbps...│ Active  │ [i][✎] │     │
 * │ │ U2 │ Jane S │ 91-xxx  │ jane@.. │ 100Mb... │ Suspended│ [i][✎] │     │
 * │ └────┴────────┴─────────┴─────────┴──────────┴─────────┴─────────┘     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Pagination: [< 1 2 3 4 5 >]  Rows per page: [10 ▼]                      │
 * └──────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @userStatuses
 * | Status    | Color  | Description                            | Actions Allowed     |
 * |-----------|--------|----------------------------------------|---------------------|
 * | Active    | Green  | User has network access                | Edit, Suspend, Block|
 * | Suspended | Yellow | Temporarily disabled, can reactivate   | Edit, Activate, Block|
 * | Blocked   | Red    | Permanently disabled, CANNOT reactivate| View only           |
 *
 * @permissions
 * - canEditUsers: Add, Edit, Suspend, Block, Activate users
 * - canViewReports: Export user list to CSV
 * - canBulkImportUsers: Access bulk import feature
 * - canAddUserDevice: Add device from this page
 *
 * @companyView
 * When a company-level user views this page:
 * - Shows users from ALL sites with site column
 * - Site filter dropdown appears in banner
 * - Edit actions disabled (read-only aggregated view)
 * - Must drill down to site for editing
 *
 * @dataFlow
 * ```
 * Mount
 *   │
 *   ▼
 * Load users from sample data (TODO: API call)
 *   │
 *   ▼
 * Apply segment filter (from context)
 *   │
 *   ▼
 * Apply search/status filters
 *   │
 *   ▼
 * Sort by selected column
 *   │
 *   ▼
 * Paginate for display
 *   │
 *   ▼
 * Render table with memoized rows
 * ```
 *
 * @stateManagement
 * - users: Array of user objects
 * - editingUser: User being edited (null when adding)
 * - showFormModal: Controls add/edit modal visibility
 * - searchTerm, filters: Filter state from useFilter hook
 * - currentPage, rowsPerPage: Pagination from useTableState
 *
 * @modals
 * - UserFormModal: Add/Edit user form
 * - UserDetailsModal: View full user details
 * - BulkImportModal: CSV import wizard
 * - DeviceFormModal: Add device to user
 * - ConfirmationModal: Status change confirmations
 *
 * @performance
 * - React.memo on UserTableRow to prevent unnecessary re-renders
 * - useMemo for filtered/sorted/paged data
 * - useCallback for event handlers
 * - Skeleton loader during initial load
 *
 * @dependencies
 * - usePermissions: Permission checking
 * - useSegment: Current segment from context
 * - useTableState: Pagination and column visibility
 * - useFilter/useSort: Data filtering and sorting
 * - useAccessLevelView: Company/site view state
 * - useReadOnlyMode: Customer impersonation check
 *
 * @relatedFiles
 * - UserFormModal.js: Add/Edit form
 * - UserDetailsModal.js: User details view
 * - UserToolbar.js: Action toolbar
 * - userSampleData.js: Demo data
 * - UserManagement.css: Page styles
 *
 * ============================================================================
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import UserFormModal from "./UserFormModal";
import UserToolbar from "./UserToolbar";
import UserDetailsModal from "./UserDetailsModal";
import Pagination from "../../components/Pagination";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import DeviceFormModal from "../../components/DeviceFormModal";
import BulkImportModal from "../../components/BulkImportModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  FaInfoCircle, FaEdit, FaTrash, FaSortUp, FaSortDown,
  FaTachometerAlt, FaDatabase, FaTabletAlt, FaBuilding, FaMapMarkerAlt
} from "react-icons/fa";
import "./UserManagement.css";
import { usePermissions } from "../../hooks/usePermissions";
import { useSort } from "../../hooks/useSort";
import { useFilter } from "../../hooks/useFilter";
import { useTableState } from "../../hooks/useTableState";
import { useBulkOperations } from "../../hooks/useBulkOperations";
import { commonColumns, segmentSpecificFields } from "../../utils/columns";
import { useSegment } from "../../context/SegmentContext";
import userSampleData from "../../constants/userSampleData";
import UserLicenseRing from '../../components/common/UserLicenseRing';
import { useLocation } from 'react-router-dom';
import notifications from "../../utils/notifications";
// Note: Segment device permissions now come from usePermissions hook (segmentPermissionsConfig)
import { PAGINATION } from '../../constants/appConstants';
import { useLoading } from "../../context/LoadingContext";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import SkeletonLoader from "../../components/Loading/SkeletonLoader";
import { exportChartDataToCSV } from "../../utils/exportUtils";
import { useAccessLevelView } from "../../context/AccessLevelViewContext";
import { companySites } from "../../constants/companySampleData";
import { useReadOnlyMode } from "../../hooks/useReadOnlyMode";

const PolicyCell = React.memo(({ speed, dataVolume, deviceLimit }) => {
  if (!speed && !dataVolume && !deviceLimit) return <td className="policy-column">--</td>;

  return (
    <td className="policy-column">
      <div className="policy-row">
        <span className="policy-icon speed"><FaTachometerAlt /></span>
        <span className="policy-pill speed">{speed || "--"}</span>
      </div>
      <div className="policy-row">
        <span className="policy-icon data"><FaDatabase /></span>
        <span className="policy-pill data">{dataVolume || "--"}</span>
      </div>
      <div className="policy-row">
        <span className="policy-icon device"><FaTabletAlt /></span>
        <span className="policy-pill device">
          {deviceLimit ? `${deviceLimit} Device${Number(deviceLimit) > 1 ? "s" : ""}` : "--"}
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
  isCompanyView,
  siteName
}) => {
  const isBlocked = user.status === "Blocked" || user.status === "Restricted";

  return (
    <tr>
      {visibleColumns.includes("id") && <td>{user.id}</td>}
      {visibleColumns.includes("firstName") && <td>{user.firstName} {user.lastName}</td>}
      {/* Site column for company view */}
      {isCompanyView && (
        <td className="site-column">
          <span className="site-badge">
            <FaMapMarkerAlt className="site-icon" />
            {user.siteName || siteName || '-'}
          </span>
        </td>
      )}
      {visibleColumns.includes("mobile") && <td>{user.mobile}</td>}
      {visibleColumns.includes("email") && <td>{user.email}</td>}
      {(visibleColumns.includes("userPolicy") || visibleColumns.includes("policy")) && (
        <PolicyCell speed={user.speed} dataVolume={user.dataVolume} deviceLimit={user.deviceLimit} />
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
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            variant="info"
            title="User Details"
            aria-label="View User Details"
            onClick={() => onDetailsClick(user)}
          >
            <FaInfoCircle />
          </Button>
          {hasEditPermission ? (
            <Button
              variant="primary"
              title={isBlocked ? "Cannot edit user with Blocked status" : "Edit User"}
              aria-label={isBlocked ? "Edit User Disabled - Blocked Status" : "Edit User"}
              onClick={() => onEditClick(user)}
              disabled={isBlocked}
            >
              <FaEdit />
            </Button>
          ) : (
            <Button
              variant="primary"
              title={isCompanyView ? "Switch to Site View to edit" : "Edit User - Permission Required"}
              aria-label={isCompanyView ? "Edit Disabled - Company View is read-only" : "Edit Disabled, Permission Required"}
              disabled
            >
              <FaEdit />
            </Button>
          )}
        </div>
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
  const { canEditUsers, canViewReports, canBulkImportUsers, canAddUserDevice, canAddDigitalDevice } = usePermissions();
  const { currentSegment } = useSegment();
  const { canBulkAddUsers } = useBulkOperations();

  // Use segment permissions - canBulkImportUsers from usePermissions takes precedence
  const allowBulkImport = canBulkImportUsers;
  const location = useLocation();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { t } = useTranslation();
  const { isCompanyView, isSiteView, canEditInCurrentView, drillDownToSite } = useAccessLevelView();
  const { isReadOnly: isCustomerViewReadOnly, blockAction } = useReadOnlyMode();

  // Site filter for company view
  const [siteFilter, setSiteFilter] = useState('all');
  // User type filter (regular/guest)
  const [userTypeFilter, setUserTypeFilter] = useState('');

  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  // Use segment from context instead of local state
  const segmentFilter = currentSegment;
  const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [detailsUser, setDetailsUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuspendConfirmation, setShowSuspendConfirmation] = useState(false);
  const [showActivateConfirmation, setShowActivateConfirmation] = useState(false);
  const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);
  const [userToChangeStatus, setUserToChangeStatus] = useState(null);
  const [changingStatus, setChangingStatus] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  // Use segment permissions for device availability (from usePermissions)
  // canAddUserDevice and canAddDigitalDevice are now derived from segmentPermissionsConfig
  const showAddDevice = canAddUserDevice || canAddDigitalDevice;

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
    // Site filter for company view
    if (isCompanyView && siteFilter !== 'all' && user.siteId !== siteFilter) return false;
    // User type filter (regular vs guest)
    if (userTypeFilter === 'guest' && !user.isGuest) return false;
    if (userTypeFilter === 'regular' && user.isGuest) return false;
    
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
  }, [segmentFilter, columns, isCompanyView, siteFilter, userTypeFilter]);

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
        // ========================================
        // TODO: Backend Integration - Fetch Users from Database
        // ========================================
        // Replace sample data with actual API call
        // Endpoint: GET /api/users?siteId={siteId}&segment={segment}
        // 
        // Query parameters:
        // - siteId: Current site identifier
        // - segment: Selected segment filter (enterprise, coLiving, etc.)
        // - page: Current page number (for pagination)
        // - limit: Items per page
        // 
        // Response should include:
        // {
        //   success: true,
        //   data: {
        //     users: [...], // Array of user objects with all fields
        //     totalCount: number,
        //     currentLicenses: number,
        //     maxLicenses: number,
        //     permissions: {...}
        //   }
        // }
        // 
        // Implementation:
        // const response = await fetch(`/api/users?siteId=${siteConfig.siteId}&segment=${segmentFilter}`);
        // const result = await response.json();
        // if (result.success) {
        //   setUsers(result.data.users);
        //   // Update license counts in state/context
        // }
        // 
        // Error handling:
        // - Network failures: Show error notification, retry option
        // - 401 Unauthorized: Redirect to login
        // - 403 Forbidden: Show permission error
        // - 500 Server Error: Show generic error, log to monitoring
        // ========================================
        
        timeoutId = setTimeout(() => {
          if (mounted) {
            setUsers(userSampleData.users || []);
            setDevices([]);
            stopLoading('users');
            setInitialLoad(false);
          }
        }, 800);

        // ========================================
        // TODO: Backend Integration - Establish WebSocket Connection
        // ========================================
        // After initial data load, establish WebSocket for real-time updates
        // 
        // Connection setup:
        // const ws = new WebSocket(`wss://api.example.com/ws/users/${siteConfig.siteId}`);
        // 
        // ws.onmessage = (event) => {
        //   const update = JSON.parse(event.data);
        //   switch(update.type) {
        //     case 'USER_CREATED':
        //       setUsers(prev => [update.data, ...prev]);
        //       break;
        //     case 'USER_UPDATED':
        //       setUsers(prev => prev.map(u => u.id === update.data.id ? update.data : u));
        //       break;
        //     case 'USER_STATUS_CHANGED':
        //       setUsers(prev => prev.map(u => u.id === update.userId ? {...u, status: update.newStatus} : u));
        //       break;
        //     case 'LICENSE_COUNT_CHANGED':
        //       // Update license count in UI
        //       break;
        //   }
        // };
        // 
        // ws.onerror = (error) => {
        //   console.error('WebSocket error:', error);
        //   // Implement reconnection logic with exponential backoff
        // };
        // 
        // Store ws reference for cleanup
        // ========================================
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
      
      // ========================================
      // TODO: Backend Integration - Cleanup on Unmount
      // ========================================
      // Close WebSocket connection
      // Cancel any pending API requests
      // Clear polling intervals if any
      // 
      // if (wsConnection) {
      //   wsConnection.close();
      // }
      // if (abortController) {
      //   abortController.abort();
      // }
      // ========================================
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
    
    // ========================================
    // TODO: Backend Integration - Load User Column Preferences
    // ========================================
    // Fetch saved column preferences from backend
    // Endpoint: GET /api/users/{userId}/preferences/columns
    // 
    // const loadColumnPreferences = async () => {
    //   try {
    //     const response = await fetch(`/api/users/${currentUserId}/preferences/columns`);
    //     const result = await response.json();
    //     if (result.success && result.data.visibleColumns) {
    //       setVisibleColumns(result.data.visibleColumns);
    //     }
    //   } catch (error) {
    //     // Use default columns if fetch fails
    //   }
    // };
    // loadColumnPreferences();
    // ========================================
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
    // Block in read-only mode (customer view impersonation)
    if (blockAction("Adding/editing users")) return;

    setSubmitting(true);
    let timeoutId = null;
    try {
      // ========================================
      // TODO: Backend Integration - Save User to Database
      // ========================================
      // API call to create or update user
      // 
      // Endpoint: 
      // - Create: POST /api/users
      // - Update: PUT /api/users/{userId}
      // 
      // Request payload:
      // {
      //   ...userObj,
      //   siteId: siteConfig.siteId,
      //   segment: segmentFilter,
      //   createdBy: currentUser.id,
      //   timestamp: new Date().toISOString()
      // }
      // 
      // Backend processing steps:
      // 1. Validate all fields against business rules
      // 2. Check license availability (atomic operation with lock)
      // 3. Begin database transaction
      // 4. Create/update user record in UMP database
      // 5. Provision in AAA (Alepo) system:
      //    - Create account with generated password
      //    - Apply policy configurations
      //    - Set bandwidth limits
      // 6. If AAA provisioning fails, rollback database transaction
      // 7. Generate welcome credentials (SMS/Email)
      // 8. Create audit log entry
      // 9. Update license count
      // 10. Commit transaction
      // 
      // Response format:
      // {
      //   success: true,
      //   data: {
      //     userId: string,
      //     accountId: string,
      //     can_id: string,
      //     provisionStatus: 'success' | 'pending',
      //     message: string
      //   }
      // }
      // 
      // Error responses to handle:
      // - 400: Validation error (display field errors)
      // - 409: License limit reached (show license full error)
      // - 422: Duplicate user ID (prompt for different ID)
      // - 500: Server error (generic error, log to monitoring)
      // - 503: AAA system unavailable (queue for retry)
      // 
      // Implementation example:
      // const endpoint = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      // const method = editingUser ? 'PUT' : 'POST';
      // 
      // const response = await fetch(endpoint, {
      //   method,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${authToken}`
      //   },
      //   body: JSON.stringify({
      //     ...userObj,
      //     siteId: siteConfig.siteId,
      //     segment: segmentFilter
      //   })
      // });
      // 
      // const result = await response.json();
      // 
      // if (!response.ok) {
      //   throw new Error(result.message || 'Operation failed');
      // }
      // 
      // // Update local state with response data
      // const updatedUser = { ...userObj, ...result.data };
      // ========================================
      
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 1000);
      });
      
      const userWithActiveStatus = { ...userObj, status: "Active" };
      if (editingUser) {
        setUsers(users => users.map((u) => (u.id === editingUser.id ? userWithActiveStatus : u)));
        notifications.userUpdated();
        
        // ========================================
        // TODO: Backend Integration - Post-Update Actions
        // ========================================
        // After successful user update:
        // 
        // 1. Broadcast update to other connected clients:
        //    WebSocket message: { type: 'USER_UPDATED', data: updatedUser }
        // 
        // 2. If policy changed, trigger immediate AAA sync:
        //    POST /api/users/{userId}/sync-policy
        // 
        // 3. Update cached data in Redis:
        //    Key: `user:${userId}`
        //    TTL: 300 seconds
        // 
        // 4. Refresh dashboard metrics:
        //    POST /api/metrics/refresh
        // 
        // 5. If check-in/check-out dates changed:
        //    - Cancel existing scheduled deactivation
        //    - Create new scheduled job
        //    POST /api/users/{userId}/reschedule-deactivation
        // ========================================
      } else {
        setUsers(users => [userWithActiveStatus, ...users]);
        notifications.userAdded();
        
        // ========================================
        // TODO: Backend Integration - Post-Creation Actions
        // ========================================
        // After successful user creation:
        // 
        // 1. Update license count display:
        //    Fetch latest count: GET /api/licenses/current
        //    Or receive via WebSocket update
        // 
        // 2. Queue welcome message:
        //    POST /api/notifications/queue
        //    Payload: { type: 'welcome', userId, channel: ['sms', 'email'] }
        // 
        // 3. Add to real-time monitoring:
        //    POST /api/monitoring/add-user
        //    Track: session status, bandwidth usage, device connections
        // 
        // 4. Update site statistics:
        //    Increment: total users, active users for segment
        //    WebSocket broadcast: { type: 'SITE_STATS_CHANGED' }
        // 
        // 5. Trigger analytics event:
        //    POST /api/analytics/event
        //    Event: { type: 'user_created', segment, timestamp }
        // ========================================
      }
      setShowFormModal(false);
      setEditingUser(null);
    } catch (error) {
      notifications.operationFailed(editingUser ? "update user" : "add user");
      
      // ========================================
      // TODO: Backend Integration - Error Recovery & Rollback
      // ========================================
      // Implement comprehensive error recovery:
      // 
      // 1. If partial database update occurred:
      //    POST /api/users/{userId}/rollback
      //    Backend: Execute compensating transaction
      // 
      // 2. If AAA provisioned but database failed:
      //    POST /api/aaa/deprovision/{userId}
      //    Clean up AAA account to maintain consistency
      // 
      // 3. Log detailed error for debugging:
      //    POST /api/errors/log
      //    Payload: {
      //      operation: 'user_create/update',
      //      error: error.message,
      //      stack: error.stack,
      //      context: { userId, siteId, segment },
      //      timestamp
      //    }
      // 
      // 4. Revert UI changes:
      //    Remove optimistically added user from state
      //    Or reload users list from backend
      // 
      // 5. Show detailed error to user:
      //    - Network error: "Connection lost. Please try again."
      //    - Validation error: Display specific field errors
      //    - License full: "All licenses in use. Free up or request more."
      //    - AAA error: "Provisioning failed. Contact support."
      // ========================================
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setSubmitting(false);
    }
  }, [editingUser, segmentFilter, blockAction]);

  const handleSuspendClick = useCallback((user) => {
    if (blockAction("Suspending users")) return;
    setUserToChangeStatus({ user, newStatus: "Suspended" });
    setShowSuspendConfirmation(true);
  }, [blockAction]);

  const handleActivateClick = useCallback((user) => {
    if (blockAction("Activating users")) return;
    setUserToChangeStatus({ user, newStatus: "Active" });
    setShowActivateConfirmation(true);
  }, [blockAction]);

  const handleBlockClick = useCallback((user) => {
    if (blockAction("Blocking users")) return;
    setUserToChangeStatus({ user, newStatus: "Blocked" });
    setShowBlockConfirmation(true);
  }, [blockAction]);

  const handleConfirmStatusChange = useCallback(async () => {
    if (!userToChangeStatus) return;

    const { user, newStatus } = userToChangeStatus;
    setChangingStatus(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      // Update user status in state
      setUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u)
      );

      // Show success notification
      if (newStatus === "Suspended") {
        notifications.userSuspended(user.id);
      } else if (newStatus === "Blocked") {
        notifications.userBlocked(user.id);
      } else if (newStatus === "Active") {
        notifications.userActivated(user.id);
      }

      // Close modals
      setShowSuspendConfirmation(false);
      setShowActivateConfirmation(false);
      setShowBlockConfirmation(false);
      setShowDetailsModal(false);
      setUserToChangeStatus(null);

      // ========================================
      // TODO: Backend Integration - Update User Status
      // ========================================
      // Call backend API to change user status in database and AAA system
      // See handleChangeStatus function below for detailed backend integration notes
      // API Endpoint: PUT /api/users/{userId}/status
      // Payload: { status: newStatus, reason: 'admin_action', changedBy: currentUser.id }
      // ========================================
    } catch (error) {
      notifications.operationFailed(`change user status to ${newStatus}`);
    } finally {
      setChangingStatus(false);
    }
  }, [userToChangeStatus]);

  const handleCancelStatusChange = useCallback(() => {
    setShowSuspendConfirmation(false);
    setShowActivateConfirmation(false);
    setShowBlockConfirmation(false);
    setUserToChangeStatus(null);
  }, []);

  const handleChangeStatus = useCallback((id, newStatus) => {
    // ========================================
    // TODO: Backend Integration - Update User Status
    // ========================================
    // API call to change user status in database and AAA system
    // Endpoint: PUT /api/users/{userId}/status
    // 
    // Request payload:
    // {
    //   status: newStatus, // 'Active' | 'Suspended' | 'Blocked'
    //   reason: 'admin_action',
    //   changedBy: currentUser.id,
    //   timestamp: new Date().toISOString()
    // }
    // 
    // Backend processing based on status:
    // 
    // ACTIVE:
    // - Update database status
    // - Enable account in AAA
    // - Restore device MAC bindings
    // - Increment active license count
    // - Send reactivation notification to user
    // 
    // SUSPENDED:
    // - Update database status
    // - Keep AAA account but disable authentication
    // - Maintain device registrations
    // - Keep license allocated
    // - Send suspension notification to user
    // - Schedule auto-reactivation if temporary
    // 
    // BLOCKED:
    // - Update database status to 'Blocked'
    // - Disable AAA account completely
    // - Call AAA API to disconnect all active sessions immediately
    // - Clear device MAC bindings from firewall
    // - Free up license (decrement used count)
    // - Send blocking notification to user (if policy allows)
    // - Mark all scheduled tasks for this user as cancelled
    // 
    // Response format:
    // {
    //   success: true,
    //   data: {
    //     userId: string,
    //     previousStatus: string,
    //     newStatus: string,
    //     activeSessions: number, // disconnected sessions
    //     licenseUpdated: boolean
    //   }
    // }
    // 
    // AAA Integration:
    // - For Blocked: Call Alepo API to force disconnect
    //   POST /alepo/api/disconnect-user
    //   Payload: { accountId: user.accountId, reason: 'admin_block' }
    // 
    // - Update user attributes in AAA:
    //   PUT /alepo/api/user-attributes
    //   Set: enabled=false, blocked=true, disconnect_reason
    // 
    // Implementation example:
    // const response = await fetch(`/api/users/${id}/status`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${authToken}`
    //   },
    //   body: JSON.stringify({ status: newStatus, reason: 'admin_action' })
    // });
    // 
    // const result = await response.json();
    // if (result.success) {
    //   // Update UI
    //   // Show notification with session disconnect count
    // }
    // ========================================
    
    setUsers(users => users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
    
    // ========================================
    // TODO: Backend Integration - Post-Status Change Broadcast
    // ========================================
    // After status change, broadcast update to all connected clients:
    // 
    // WebSocket message:
    // {
    //   type: 'USER_STATUS_CHANGED',
    //   userId: id,
    //   newStatus: newStatus,
    //   timestamp: new Date().toISOString()
    // }
    // 
    // Update monitoring dashboard:
    // POST /api/monitoring/user-status-change
    // 
    // Update license count if applicable:
    // If Blocked: Broadcast license availability increase
    // If reactivated from Blocked: Broadcast license decrease
    // 
    // Trigger analytics event:
    // POST /api/analytics/event
    // Event: { type: 'user_status_change', userId, from, to, reason }
    // 
    // Update SLA metrics:
    // If Blocked: Increment blocked_users counter
    // Track status change frequency for audit reports
    // ========================================
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (blockAction("Deleting users")) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
      startLoading('users');
      let timeoutId = null;
      try {
        // ========================================
        // TODO: Backend Integration - Delete User (Soft Delete Recommended)
        // ========================================
        // API call to mark user as deleted
        // Endpoint: DELETE /api/users/{userId}
        // 
        // Backend processing:
        // 1. Begin database transaction
        // 2. Soft delete user (set deleted_at timestamp, keep data)
        // 3. Update status to 'Deleted' (for audit trail)
        // 4. Deactivate in AAA but retain for compliance/audit
        //    - Do NOT hard delete from AAA
        //    - Set account status to 'archived'
        //    - Keep authentication logs
        // 5. Remove device associations:
        //    - Clear MAC bindings from NAS
        //    - Archive device records (don't delete)
        // 6. Archive session history (move to cold storage)
        // 7. Free up license:
        //    - Decrement used license count
        //    - Update license pool availability
        // 8. Cancel scheduled tasks:
        //    - Auto-deactivation jobs
        //    - Billing reminders
        //    - Notification queues
        // 9. Create detailed audit log entry:
        //    - Who deleted (admin user)
        //    - When deleted
        //    - Reason (if provided)
        //    - User's full state before deletion
        // 10. Commit transaction
        // 
        // Response format:
        // {
        //   success: true,
        //   data: {
        //     userId: string,
        //     deletedAt: ISO8601,
        //     archivedData: boolean,
        //     licenseFreed: boolean
        //   }
        // }
        // 
        // IMPORTANT NOTES:
        // 1. Per FRD requirements, user deletion should be disabled in UI
        // 2. This placeholder is for backend implementation reference
        // 3. Consider implementing "Restrict" status instead of delete
        // 4. Retain data for minimum 7 years for compliance
        // 5. Implement data retention policies according to regulations
        // 
        // Hard Delete (Only if absolutely required by policy):
        // - Must have explicit admin confirmation
        // - Archive full user record before deletion
        // - Notify compliance team
        // - Log to immutable audit trail
        // 
        // Implementation example:
        // const response = await fetch(`/api/users/${id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${authToken}`
        //   },
        //   body: JSON.stringify({ 
        //     reason: 'admin_request',
        //     confirmedBy: currentUser.id 
        //   })
        // });
        // ========================================
        
        await new Promise(resolve => {
          timeoutId = setTimeout(resolve, 500);
        });
        setUsers(users => users.filter((u) => u.id !== id));
        notifications.userDeleted();
        
        // ========================================
        // TODO: Backend Integration - Post-Deletion Actions
        // ========================================
        // After successful deletion:
        // 
        // 1. Update license count display:
        //    Fetch latest: GET /api/licenses/current
        //    Or via WebSocket: { type: 'LICENSE_FREED', count: 1 }
        // 
        // 2. Broadcast deletion to all connected clients:
        //    WebSocket: { type: 'USER_DELETED', userId: id }
        // 
        // 3. Update analytics dashboards:
        //    POST /api/analytics/event
        //    Event: { type: 'user_deleted', segment, timestamp }
        // 
        // 4. Clear cached data:
        //    Redis: DEL user:{userId}
        //    Invalidate related caches
        // 
        // 5. Update site metrics:
        //    Decrement: total_users, segment_users counts
        // 
        // 6. Compliance notification:
        //    If required by policy, send data deletion confirmation
        //    POST /api/compliance/data-deletion-notice
        // ========================================
      } catch (error) {
        notifications.operationFailed("delete user");
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        stopLoading('users');
      }
    }
  }, [startLoading, stopLoading, blockAction]);

  const handleEditClick = useCallback((user) => {
    if (blockAction("Editing users")) return;
    const isBlocked = user.status === "Blocked" || user.status === "Restricted";
    if (isBlocked) {
      notifications.showError("Cannot edit user with Blocked status");
      return;
    }
    setEditingUser(user);
    setShowFormModal(true);
  }, [blockAction]);

  const handleDetailsClick = useCallback((user) => {
    // ========================================
    // TODO: Backend Integration - Fetch Full User Details
    // ========================================
    // When user details modal opens, fetch complete user data
    // Endpoint: GET /api/users/{userId}/details
    // 
    // This should include:
    // - All user fields
    // - Current session data (if active)
    // - Device list with online status
    // - Usage statistics (current month)
    // - Recent activity log (last 10 actions)
    // - Policy details
    // - Scheduled actions (deactivation, etc.)
    // 
    // Response format:
    // {
    //   success: true,
    //   data: {
    //     user: {...},
    //     currentSession: {...} | null,
    //     devices: [...],
    //     usageStats: {...},
    //     recentActivity: [...],
    //     scheduledActions: [...]
    //   }
    // }
    // 
    // Implementation:
    // const fetchUserDetails = async () => {
    //   const response = await fetch(`/api/users/${user.id}/details`);
    //   const result = await response.json();
    //   setDetailsUser(result.data.user);
    // };
    // fetchUserDetails();
    // ========================================
    
    setDetailsUser(user);
    setShowDetailsModal(true);
  }, []);

  const handleDeviceSubmit = useCallback((deviceInfo) => {
    // ========================================
    // TODO: Backend Integration - Register Device
    // ========================================
    // This callback receives device data from DeviceFormModal
    // Need to call backend API to persist device registration
    // Endpoint: POST /api/devices/register
    // 
    // See DeviceFormModal.js for detailed integration requirements
    // 
    // Quick reference:
    // - Validate MAC address uniqueness
    // - Bind to user or register as device user
    // - Update AAA system with MAC binding
    // - Create audit log entry
    // 
    // After successful registration:
    // - Update devices state
    // - Broadcast to monitoring system
    // ========================================
    
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
      // ========================================
      // TODO: Backend Integration - Server-Side Export for Large Datasets
      // ========================================
      // For production with large user counts (>1000), implement server-side export
      // Client-side export (current implementation) works for small datasets
      // 
      // Server-side export flow:
      // Endpoint: POST /api/reports/users/export
      // 
      // Request payload:
      // {
      //   filters: {
      //     segment: segmentFilter,
      //     status: statusFilter,
      //     search: searchTerm,
      //     advancedFilters: {...}
      //   },
      //   columns: visibleColumns,
      //   format: 'csv',
      //   sort: {
      //     column: sortColumn,
      //     direction: sortDirection
      //   }
      // }
      // 
      // Backend processing:
      // 1. Validate user has export permission
      // 2. Apply filters to database query
      // 3. Fetch data in batches (prevent memory issues)
      // 4. Generate CSV file on server
      // 5. Store temporarily in S3 or local storage
      // 6. Return download URL with expiration
      // 7. Schedule cleanup job for temp file (expire after 1 hour)
      // 
      // Response format:
      // {
      //   success: true,
      //   data: {
      //     downloadUrl: 'https://...',
      //     expiresAt: ISO8601,
      //     recordCount: number,
      //     fileSize: string
      //   }
      // }
      // 
      // Client implementation:
      // const response = await fetch('/api/reports/users/export', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ filters, columns, format: 'csv' })
      // });
      // const result = await response.json();
      // if (result.success) {
      //   window.open(result.data.downloadUrl, '_blank');
      // }
      // 
      // Benefits of server-side export:
      // - Handles millions of records
      // - Reduces client memory usage
      // - Faster processing with database optimization
      // - Consistent formatting
      // - Better error handling
      // - Export audit logging
      // ========================================
      
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
      const filename = `Users_${timestamp}.csv`;

      exportChartDataToCSV({ headers, rows }, filename);
      
      notifications.exportSuccess(`${sortedUsers.length} users`);
      
      // ========================================
      // TODO: Backend Integration - Log Export Action for Audit
      // ========================================
      // Create audit trail of export action
      // Endpoint: POST /api/audit/export
      // 
      // Payload:
      // {
      //   action: 'user_list_export',
      //   userId: currentUser.id,
      //   filters: {
      //     segment: segmentFilter,
      //     status: statusFilter,
      //     search: searchTerm
      //   },
      //   recordCount: sortedUsers.length,
      //   columns: visibleColumns,
      //   format: 'csv',
      //   filename: filename,
      //   timestamp: new Date().toISOString(),
      //   ipAddress: userIpAddress,
      //   userAgent: navigator.userAgent
      // }
      // 
      // Backend should:
      // 1. Create audit log entry
      // 2. Track export frequency per user
      // 3. Alert if unusual export patterns detected
      // 4. Maintain compliance report of all data exports
      // 
      // Implementation:
      // fetch('/api/audit/export', {
      //   method: 'POST',
      //   body: JSON.stringify({ ...auditData })
      // }).catch(err => console.error('Audit log failed:', err));
      // ========================================
    } catch (error) {
      console.error('Export error:', error);
      notifications.exportFailed("users");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setExportingCSV(false);
    }
  }, [canViewReports, columns, visibleColumns, sortedUsers, segmentFilter, statusFilter, searchTerm]);

  /**
   * Handle bulk import of users
   */
  const handleBulkImport = useCallback((importedUsers) => {
    try {
      // Generate new user IDs and add segment
      const newUsers = importedUsers.map((userData, index) => ({
        id: `BU${Date.now()}${index}`,
        userId: userData.username,
        name: userData.fullName,
        email: userData.email,
        mobile: userData.phone || '',
        policy: userData.policy,
        status: userData.status || 'Active',
        segment: segmentFilter,
        department: userData.department || '',
        notes: userData.notes || '',
        deviceCount: 0,
        dataUsed: '0 GB',
        lastActive: 'Just now',
        userPolicy: {
          speed: userData.policy === 'Premium Access' ? '100 Mbps' :
                 userData.policy === 'Standard Access' ? '50 Mbps' :
                 userData.policy === 'Basic Access' ? '25 Mbps' : '10 Mbps',
          dataVolume: userData.policy === 'Guest Access' ? '5 GB/day' :
                     userData.policy === 'Basic Access' ? '50 GB/month' : 'Unlimited',
          deviceLimit: userData.policy === 'Premium Access' ? 5 :
                      userData.policy === 'Standard Access' ? 3 :
                      userData.policy === 'Basic Access' ? 2 : 1
        }
      }));

      // Add new users to the existing list
      setUsers(prevUsers => [...newUsers, ...prevUsers]);

      // Show success notification
      notifications.success(`Successfully imported ${newUsers.length} user${newUsers.length > 1 ? 's' : ''}`);

      // TODO: Backend Integration - Bulk User Import
      // Send bulk import data to backend
      // fetch('/api/users/bulk-import', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     users: newUsers,
      //     segment: segmentFilter,
      //     importedBy: currentUser.id,
      //     timestamp: new Date().toISOString()
      //   })
      // });

    } catch (error) {
      console.error('Bulk import error:', error);
      notifications.custom.error('Failed to import users');
    }
  }, [segmentFilter]);

  // ========================================
  // TODO: Backend Integration - Column Customization Persistence
  // ========================================
  // When user toggles columns visibility, save preferences
  // Triggered by: toggleColumnVisibility function
  // 
  // Implement auto-save with debouncing:
  // useEffect(() => {
  //   const saveTimeout = setTimeout(() => {
  //     fetch(`/api/users/${currentUser.id}/preferences/columns`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ 
  //         visibleColumns,
  //         segment: segmentFilter 
  //       })
  //     });
  //   }, 1000); // Debounce 1 second
  //   
  //   return () => clearTimeout(saveTimeout);
  // }, [visibleColumns, segmentFilter]);
  // 
  // Also save: rowsPerPage, sortColumn, sortDirection
  // Load on mount from: GET /api/users/{userId}/preferences/table-config
  // ========================================

  // ========================================
  // TODO: Backend Integration - Pagination Preference
  // ========================================
  // Save rows per page selection
  // useEffect(() => {
  //   localStorage.setItem('userListRowsPerPage', rowsPerPage);
  //   // Also save to backend for cross-device sync
  //   fetch(`/api/users/${currentUser.id}/preferences/pagination`, {
  //     method: 'PUT',
  //     body: JSON.stringify({ rowsPerPage })
  //   });
  // }, [rowsPerPage]);
  // ========================================

  const segmentSpecificCols = segmentSpecificFields[segmentFilter] || [];

  // Calculate segment-specific license counts
  const segmentLicenseLimits = useMemo(() => {
    const segmentLimits = {
      enterprise: { max: 1000, used: 850 },
      coLiving: { max: 400, used: 320 },
      hotel: { max: 500, used: 450 },
      coWorking: { max: 350, used: 280 },
      pg: { max: 250, used: 180 },
      miscellaneous: { max: 150, used: 95 }
    };

    return segmentLimits[segmentFilter] || { max: 1000, used: 500 };
  }, [segmentFilter]);

  if (initialLoad) {
    return (
      <div className="user-list-container">
        <h1 className="user-management-title">{t('users.title')}</h1>
        <div className="user-toolbar-ring-row">
          <div className="user-toolbar">
            <SkeletonLoader variant="rect" height={40} />
          </div>
        </div>
        <SkeletonLoader variant="table" rows={10} />
      </div>
    );
  }

  // Determine if edit actions should be disabled (company view or customer impersonation mode)
  const isReadOnly = isCustomerViewReadOnly || (isCompanyView && !canEditInCurrentView);

  return (
    <div className="user-list-container">
      <LoadingOverlay active={isLoading('users') || exportingCSV} message={exportingCSV ? t('users.exportingUsers') : t('common.processing')} />

      <h1 className="user-management-title">{t('users.title')}</h1>

      {/* Company View Info Banner */}
      {isCompanyView && (
        <div className="company-view-banner">
          <div className="banner-content">
            <FaInfoCircle className="banner-icon" />
            <div className="banner-text">
              <span className="banner-title">Company View</span>
              <span className="banner-subtitle">Viewing users across all sites. Select a site to manage users.</span>
            </div>
          </div>
          <div className="banner-filter">
            <label htmlFor="site-filter">Filter by Site:</label>
            <select
              id="site-filter"
              className="site-filter-select"
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
            >
              <option value="all">All Sites</option>
              {companySites.map(site => (
                <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="user-toolbar-ring-row">
        <div className="user-toolbar">
          <UserToolbar
            searchValue={searchTerm}
            onSearchChange={e => setSearchTerm(e.target.value)}
            statusFilter={statusFilter}
            onStatusChange={e => setFilter('statusFilter', e.target.value)}
            userTypeFilter={userTypeFilter}
            onUserTypeChange={e => setUserTypeFilter(e.target.value)}
            onAdd={canEditUsers && !isReadOnly ? () => setShowFormModal(true) : undefined}
            disableAdd={!canEditUsers || isReadOnly}
            onBulkImport={allowBulkImport && canEditUsers && !isReadOnly ? () => setShowBulkImportModal(true) : undefined}
            disableBulkImport={!allowBulkImport || !canEditUsers || isReadOnly}
            onExport={handleExportUsers}
            disableExport={!canViewReports || exportingCSV || sortedUsers.length === 0}
            exportLoading={exportingCSV}
            onAddDevice={showAddDevice && !isReadOnly ? () => setShowDeviceModal(true) : undefined}
            disableAddDevice={!showAddDevice || isReadOnly}
            segment={segmentFilter}
            isReadOnly={isReadOnly}
          />
        </div>
        <div className="user-license-ring-header">
          <UserLicenseRing current={segmentLicenseLimits.used} total={segmentLicenseLimits.max} size={160} ringWidth={16} />
          {/* ========================================
              TODO: Backend Integration - Real-time License Count
              ========================================
              Replace USED_LICENSES constant with live data
              Option 1: WebSocket updates
              Option 2: Poll every 10 seconds
              
              useEffect(() => {
                const ws = new WebSocket('wss://api.../ws/licenses');
                ws.onmessage = (e) => {
                  const data = JSON.parse(e.data);
                  setLicenseCount(data.used);
                };
                return () => ws.close();
              }, []);
              ======================================== */}
        </div>
      </div>

      <div className="column-controls-compact">
        <div className="column-controls-right">
          <span className="compact-label">{t('common.columns')}:</span>
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
          ? `${t('common.hideAdvancedFilters')}${activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}`
          : `${t('common.showAdvancedFilters')}${activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}`}
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
                .map((col, idx) => (
                  <React.Fragment key={col.key}>
                    <th
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
                    {/* Add Site column after Name in company view */}
                    {isCompanyView && col.key === 'firstName' && (
                      <th
                        onClick={() => onSortClick('siteName')}
                        style={{ cursor: "pointer", userSelect: "none" }}
                        role="columnheader"
                        scope="col"
                        tabIndex={0}
                        aria-sort={sortColumn === 'siteName' ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center" }}>
                          Site
                          {renderSortIndicator('siteName')}
                        </span>
                      </th>
                    )}
                  </React.Fragment>
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
                  hasEditPermission={canEditUsers && !isReadOnly}
                  onDetailsClick={handleDetailsClick}
                  onEditClick={handleEditClick}
                  isCompanyView={isCompanyView}
                  siteName={user.siteName}
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

      <BulkImportModal
        type="users"
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onImport={handleBulkImport}
      />

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
            // Placeholder - actual implementation in UserDetailsModal
          }}
          onSuspend={handleSuspendClick}
          onBlock={handleBlockClick}
          onActivate={handleActivateClick}
          isReadOnly={isReadOnly}
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

      <ConfirmationModal
        open={showSuspendConfirmation}
        onClose={handleCancelStatusChange}
        onConfirm={handleConfirmStatusChange}
        title="Suspend User"
        message={
          userToChangeStatus
            ? `Are you sure you want to suspend user "${userToChangeStatus.user.firstName} ${userToChangeStatus.user.lastName}" (${userToChangeStatus.user.id})? The user will lose network access until reactivated.`
            : ''
        }
        confirmText="Suspend"
        cancelText="Cancel"
        variant="warning"
        loading={changingStatus}
      />

      <ConfirmationModal
        open={showActivateConfirmation}
        onClose={handleCancelStatusChange}
        onConfirm={handleConfirmStatusChange}
        title="Activate User"
        message={
          userToChangeStatus
            ? `Are you sure you want to activate user "${userToChangeStatus.user.firstName} ${userToChangeStatus.user.lastName}" (${userToChangeStatus.user.id})? The user will regain network access.`
            : ''
        }
        confirmText="Activate"
        cancelText="Cancel"
        variant="primary"
        loading={changingStatus}
      />

      <ConfirmationModal
        open={showBlockConfirmation}
        onClose={handleCancelStatusChange}
        onConfirm={handleConfirmStatusChange}
        title="Block User - Irreversible Action"
        message={
          userToChangeStatus
            ? `⚠️ WARNING: Are you sure you want to block user "${userToChangeStatus.user.firstName} ${userToChangeStatus.user.lastName}" (${userToChangeStatus.user.id})?\n\nThis action is IRREVERSIBLE. The user will:\n• Be immediately disconnected from the network\n• Lose all network access permanently\n• NOT be able to be activated again\n\nPlease confirm this is intended.`
            : ''
        }
        confirmText="Block Permanently"
        cancelText="Cancel"
        variant="danger"
        loading={changingStatus}
      />
    </div>
  );
};

export default UserList;