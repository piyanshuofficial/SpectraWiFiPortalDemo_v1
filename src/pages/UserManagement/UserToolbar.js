// src/pages/UserManagement/UserToolbar.js

import React from "react";
import { FaPlus, FaDownload, FaQuestionCircle, FaPlusCircle, FaUpload } from "react-icons/fa";
import Button from "../../components/Button";
import SEGMENTDEVICEAVAILABILITY from "../../config/segmentDeviceConfig";
import "./UserToolbar.css";

function UserToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onAdd,
  disableAdd,
  onBulkImport,
  disableBulkImport,
  onExport,
  disableExport,
  exportLoading,
  onAddDevice,
  segment = "enterprise"
}) {

  const allowHuman = SEGMENTDEVICEAVAILABILITY[segment]?.allowHuman ?? false;
  const allowNonHuman = SEGMENTDEVICEAVAILABILITY[segment]?.allowNonHuman ?? false;
  const showAddDevice = allowHuman || allowNonHuman;

  // ========================================
  // TODO: Backend Integration - Search Debouncing
  // ========================================
  // Implement debounced search to reduce server load
  // Current: Client-side filtering only
  // 
  // For large user datasets (>1000 users), implement server-side search:
  // 
  // useEffect(() => {
  //   const searchTimer = setTimeout(async () => {
  //     if (searchValue.length >= 3) {
  //       try {
  //         const response = await fetch(
  //           `/api/users/search?q=${encodeURIComponent(searchValue)}&siteId=${siteId}&segment=${segment}&limit=50`
  //         );
  //         const result = await response.json();
  //         // Update parent component with search results
  //         onSearchResults(result.data.users);
  //       } catch (error) {
  //         console.error('Search failed:', error);
  //       }
  //     }
  //   }, 300); // Debounce 300ms
  //   
  //   return () => clearTimeout(searchTimer);
  // }, [searchValue]);
  // 
  // Backend Endpoint: GET /api/users/search
  // Query Parameters:
  // - q: search term (min 3 chars)
  // - siteId: current site
  // - segment: filter by segment
  // - limit: max results (default 50)
  // 
  // Backend should implement full-text search on:
  // - User ID
  // - First/Last Name
  // - Email
  // - Mobile Number
  // - Policy details
  // 
  // Response Format:
  // {
  //   success: true,
  //   data: {
  //     users: [...],
  //     totalMatches: number,
  //     searchTerm: string
  //   }
  // }
  // ========================================

  return (
    <div className="user-toolbar-content">
      <div className="user-toolbar">
        <div className="user-toolbar-inner">
          <div className="toolbar-left">
            <Button
              onClick={onAdd}
              variant="primary"
              disabled={disableAdd}
              title={disableAdd ? "Permission required to add users" : "Add New User"}
              aria-disabled={disableAdd}
              aria-label={disableAdd ? "Add New User button disabled due to lack of permission" : "Add New User"}
            >
              <FaPlus style={{ marginRight: 6 }} />
              Add New User
            </Button>
            {onBulkImport && (
              <Button
                onClick={onBulkImport}
                variant="success"
                disabled={disableBulkImport}
                title={disableBulkImport ? "Permission required to bulk import users" : "Bulk import users from CSV"}
                aria-label="Bulk Import Users"
              >
                <FaUpload style={{ marginRight: 6 }} />
                Bulk Import
              </Button>
            )}
            {showAddDevice && (
              <Button
                onClick={onAddDevice}
                variant="info"
                title="Add Device"
                aria-label="Add Device"
              >
                <FaPlusCircle style={{ marginRight: 6 }} />
                Add Device
              </Button>
            )}
            <Button
              onClick={onExport}
              variant="secondary"
              aria-label="Export Users"
              disabled={disableExport}
              loading={exportLoading}
              title={disableExport ? "Permission required to export users" : "Export users to CSV"}
            >
              <FaDownload style={{ marginRight: 6 }} />
              Export
            </Button>
          </div>
          <div className="toolbar-right">
            <input
              type="search"
              className="toolbar-search"
              placeholder="Search users..."
              value={searchValue}
              onChange={onSearchChange}
              aria-label="Search users"
            />
            <select
              className="toolbar-select"
              value={statusFilter}
              onChange={onStatusChange}
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Blocked">Blocked</option>
            </select>
            <FaQuestionCircle className="help-icon" title="User management help" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserToolbar;