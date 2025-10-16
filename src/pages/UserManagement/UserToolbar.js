// src/pages/UserManagement/UserToolbar.js

import React from "react";
import { FaPlus, FaDownload, FaQuestionCircle, FaPlusCircle } from "react-icons/fa";
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
  onExport,
  onAddDevice,
  segment = "enterprise"
}) {


const allowHuman = SEGMENTDEVICEAVAILABILITY[segment]?.allowHuman ?? false;
const allowNonHuman = SEGMENTDEVICEAVAILABILITY[segment]?.allowNonHuman ?? false;
const showAddDevice = allowHuman || allowNonHuman;

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
