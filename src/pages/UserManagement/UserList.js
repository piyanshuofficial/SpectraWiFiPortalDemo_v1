// src/pages/UserManagement/UserList.js
import React, { useState, useMemo, useEffect } from "react";
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
import { useAuth } from "../../context/AuthContext";
import { Permissions } from "../../utils/accessLevels";
import { commonColumns, segmentSpecificFields } from "../../utils/columns";
import sampleUsers from "../../constants/sampleUsers";
import UserLicenseRing from '../../components/common/UserLicenseRing';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import SEGMENT_DEVICE_AVAILABILITY from '../../config/segmentDeviceConfig';
import siteConfig from '../../config/siteConfig';
import { PAGINATION } from '../../constants/appConstants';


const MAX_LICENSES = siteConfig.licenses.maxLicenses;
const USED_LICENSES = siteConfig.licenses.usedLicenses;

const UserList = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const rolePermissions = Permissions[currentUser.accessLevel]?.[currentUser.role] || {};

  const [users, setUsers] = useState(sampleUsers);
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("enterprise");
  const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [detailsUser, setDetailsUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.DEFAULT_ROWS_PER_PAGE);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const segmentDeviceConfig = SEGMENT_DEVICE_AVAILABILITY[segmentFilter] || {};
  const allowHuman = segmentDeviceConfig.allowHuman ?? false;
  const allowNonHuman = segmentDeviceConfig.allowNonHuman ?? false;
  const showAddDevice = allowHuman || allowNonHuman;

  const columns = useMemo(() => {
    const segmentCols = segmentSpecificFields[segmentFilter] || [];
    return [...commonColumns, ...segmentCols];
  }, [segmentFilter]);

  useEffect(() => {
    const defaultCols = columns
      .filter(
        (col) =>
          !col.optional ||
          ["userPolicy", "registration", "lastOnline"].includes(col.key)
      )
      .map((col) => col.key);
    setVisibleColumns(defaultCols);
  }, [segmentFilter, columns]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === '1') {
      setShowFormModal(true);
    }
  }, [location.search]);

  const toggleColumnVisibility = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (segmentFilter !== "all" && user.segment !== segmentFilter) return false;
      if (statusFilter && user.status !== statusFilter) return false;
      const searchLower = searchTerm.toLowerCase().trim();
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
      if (
        searchLower &&
        !allSearchFields.some((f) => f?.toString().toLowerCase().includes(searchLower))
      ) {
        return false;
      }
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
      return true;
    });
  }, [users, searchTerm, statusFilter, segmentFilter, advancedFilters, columns]);

  const sortedUsers = useMemo(() => {
    if (!sortColumn) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      const isNumber = typeof valA === "number" && typeof valB === "number";
      if (isNumber) {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });
  }, [filteredUsers, sortColumn, sortDirection]);

  const pagedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedUsers, currentPage, rowsPerPage]);

  useEffect(() => setCurrentPage(1), [
    filteredUsers,
    rowsPerPage,
    sortColumn,
    sortDirection,
    visibleColumns,
  ]);

  const onSortClick = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (column) =>
    sortColumn === column ? (
      sortDirection === "asc" ? (
        <FaSortUp aria-label="sorted ascending" />
      ) : (
        <FaSortDown aria-label="sorted descending" />
      )
    ) : null;

  const activeFilterCount = Object.values(advancedFilters).filter(Boolean).length;

  const handleUserSubmit = (userObj) => {
    const userWithActiveStatus = { ...userObj, status: "Active" };
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? userWithActiveStatus : u)));
      toast.success("User updated successfully");
    } else {
      setUsers([userWithActiveStatus, ...users]);
      toast.success("User added successfully");
    }
    setShowFormModal(false);
    setEditingUser(null);
  };

  const handleChangeStatus = (id, newStatus) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    }
  };

  const handleDeviceSubmit = (deviceInfo) => {
    toast.success(`Device "${deviceInfo.deviceName}" registered successfully`);
    setDevices([deviceInfo, ...devices]);
    setShowDeviceModal(false);
  };

  const renderPolicyCell = (user) => (
    <td className="policy-column">
      {user.userPolicy ? (
        <>
          <div className="policy-row">
            <span className="policy-icon speed"><FaTachometerAlt /></span>
            <span className="policy-pill speed">{user.userPolicy.speed}</span>
          </div>
          <div className="policy-row">
            <span className="policy-icon data"><FaDatabase /></span>
            <span className="policy-pill data">{user.userPolicy.dataVolume}</span>
          </div>
          <div className="policy-row">
            <span className="policy-icon device"><FaTabletAlt /></span>
            <span className="policy-pill device">{user.userPolicy.deviceLimit} Device{user.userPolicy.deviceLimit > 1 ? "s" : ""}</span>
          </div>
        </>
      ) : "--"}
    </td>
  );

  return (
    <div className="user-list-container">
      {/* Segment Selector - Top Right Corner (Testing Only) */}
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
            onStatusChange={e => setStatusFilter(e.target.value)}
            onAdd={rolePermissions.canEditUsers ? () => setShowFormModal(true) : undefined}
            disableAdd={!rolePermissions.canEditUsers}
            onExport={() => toast.info("Export functionality to be implemented")}
            onAddDevice={showAddDevice ? () => setShowDeviceModal(true) : undefined}
            disableAddDevice={!showAddDevice}
            segment={segmentFilter}
          />
        </div>
        <div className="user-license-ring-header">
          <UserLicenseRing current={USED_LICENSES} total={MAX_LICENSES} size={160} ringWidth={16} />
        </div>
      </div>

      {/* Compact Column Controls */}
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
              .filter((c) => c.optional)
              .map((col) => (
                <div key={col.key}>
                  <label htmlFor={`filter-${col.key}`} className="advanced-filter-label">
                    {col.label}
                  </label>
                  {col.key === "userPolicy" ? (
                    <input
                      id={`filter-${col.key}`}
                      type="text"
                      value={advancedFilters[col.key] || ""}
                      onChange={(e) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          [col.key]: e.target.value,
                        }))
                      }
                      placeholder={`Filter by ${col.label}`}
                      aria-label={`Filter by ${col.label}`}
                      autoComplete="off"
                    />
                  ) : col.key === "status" ? (
                    <select
                      id={`filter-${col.key}`}
                      value={advancedFilters[col.key] || ""}
                      onChange={(e) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          [col.key]: e.target.value,
                        }))
                      }
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
                      value={advancedFilters[col.key] || ""}
                      onChange={(e) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          [col.key]: e.target.value,
                        }))
                      }
                      placeholder={`Filter by ${col.label}`}
                      aria-label={`Filter by ${col.label}`}
                      autoComplete="off"
                    />
                  )}
                </div>
              ))}
          </div>
          <div className="advanced-filter-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setAdvancedFilters({})}>
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
                <tr key={user.id}>
                  {visibleColumns.includes("id") && <td>{user.id}</td>}
                  {visibleColumns.includes("firstName") && <td>{user.firstName} {user.lastName}</td>}
                  {visibleColumns.includes("mobile") && <td>{user.mobile}</td>}
                  {visibleColumns.includes("email") && <td>{user.email}</td>}
                  {(visibleColumns.includes("userPolicy") || visibleColumns.includes("policy")) && renderPolicyCell(user)}
                  {visibleColumns.includes("devicesCount") && <td>{user.devicesCount}</td>}
                  {visibleColumns.includes("status") && (
                    <td><Badge variant={user.status.toLowerCase()} size="table">{user.status}</Badge></td>
                  )}
                  {visibleColumns.includes("registration") && <td>{user.registration}</td>}
                  {visibleColumns.includes("lastOnline") && <td>{user.lastOnline}</td>}
                  {segmentSpecificFields[segmentFilter]?.map((col) => (
                    visibleColumns.includes(col.key) ? <td key={col.key}>{user[col.key] || "-"}</td> : null
                  ))}
                  <td>
                    <Button
                      variant="info"
                      title="User Details"
                      aria-label="View User Details"
                      onClick={() => {
                        setDetailsUser(user);
                        setShowDetailsModal(true);
                      }}
                    >
                      <FaInfoCircle />
                    </Button>
                    {rolePermissions.canEditUsers ? (
                      <>
                        <Button
                          variant="primary"
                          title="Edit User"
                          aria-label="Edit User"
                          onClick={() => {
                            setEditingUser(user);
                            setShowFormModal(true);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button variant="danger" title="Delete User - Disabled" aria-label="Delete User Disabled" disabled>
                          <FaTrash />
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" title="Edit User - Permission Required" aria-label="Edit Disabled, Permission Required" disabled>
                        <FaEdit />
                      </Button>
                    )}
                  </td>
                </tr>
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
        />
      )}

      {showDetailsModal && detailsUser && (
        <UserDetailsModal
          user={detailsUser}
          onClose={() => setShowDetailsModal(false)}
          onEdit={(u) => {
            setUsers(users.map((usr) => (usr.id === u.id ? u : usr)));
            setShowDetailsModal(false);
          }}
          onResendPassword={(id) => toast.info(`Resend password for ${id} not implemented`)}
          onSuspend={(id) => {
            handleChangeStatus(id, "Suspended");
            toast.warn(`User ${id} suspended`);
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