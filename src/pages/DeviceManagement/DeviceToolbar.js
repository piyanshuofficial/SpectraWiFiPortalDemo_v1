// src/pages/DeviceManagement/DeviceToolbar.js

import React from "react";
import { FaPlusCircle, FaQuestionCircle, FaUpload } from "react-icons/fa";
import Button from "../../components/Button";
import "./DeviceToolbar.css";

function DeviceToolbar({
  searchValue,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  onRegisterDevice,
  disableRegisterDevice,
  onBulkImportHuman,
  disableBulkImportHuman,
  onBulkImportOther,
  disableBulkImportOther,
  deviceTypes = [],
  statusOptions = [],
  segment = "enterprise"
}) {
  return (
    <div className="device-toolbar-content">
      <div className="device-toolbar">
        <div className="device-toolbar-inner">
          <div className="toolbar-left">
            <Button
              onClick={onRegisterDevice}
              variant="primary"
              disabled={disableRegisterDevice}
              title={
                disableRegisterDevice
                  ? "Permission required or not available for this segment"
                  : "Register New Device"
              }
              aria-disabled={disableRegisterDevice}
              aria-label={
                disableRegisterDevice
                  ? "Register Device button disabled"
                  : "Register New Device"
              }
            >
              <FaPlusCircle style={{ marginRight: 6 }} />
              Register Device
            </Button>

            {onBulkImportHuman && (
              <Button
                onClick={onBulkImportHuman}
                variant="success"
                disabled={disableBulkImportHuman}
                title={
                  disableBulkImportHuman
                    ? "Permission required to bulk import human devices"
                    : "Bulk import human devices from CSV"
                }
                aria-label="Bulk Import Human Devices"
              >
                <FaUpload style={{ marginRight: 6 }} />
                Bulk Import Human
              </Button>
            )}

            {onBulkImportOther && (
              <Button
                onClick={onBulkImportOther}
                variant="success"
                disabled={disableBulkImportOther}
                title={
                  disableBulkImportOther
                    ? "Permission required to bulk import other devices"
                    : "Bulk import IoT and other devices from CSV"
                }
                aria-label="Bulk Import Other Devices"
              >
                <FaUpload style={{ marginRight: 6 }} />
                Bulk Import Other
              </Button>
            )}
          </div>

          <div className="toolbar-right">
            <input
              type="search"
              className="toolbar-search"
              placeholder="Search devices..."
              value={searchValue}
              onChange={onSearchChange}
              aria-label="Search devices"
            />
            <select
              className="toolbar-select"
              value={typeFilter}
              onChange={onTypeChange}
              aria-label="Filter by device type"
            >
              {deviceTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              className="toolbar-select"
              value={statusFilter}
              onChange={onStatusChange}
              aria-label="Filter by status"
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <FaQuestionCircle
              className="help-icon"
              title="Device management help"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceToolbar;
