// src/pages/DeviceManagement/DeviceToolbar.js

import React, { useState, useRef, useEffect } from "react";
import { FaPlusCircle, FaQuestionCircle, FaUpload, FaFileCsv, FaChevronDown } from "react-icons/fa";
import Button from "../../components/Button";
import "./DeviceToolbar.css";

function DeviceToolbar({
  searchValue,
  onSearchChange,
  primaryTypeFilter,
  onPrimaryTypeChange,
  subTypeFilter,
  onSubTypeChange,
  statusFilter,
  onStatusChange,
  onRegisterDevice,
  disableRegisterDevice,
  onBulkImport,
  disableBulkImport,
  showBulkImportUser,
  showBulkImportSmartDigital,
  onExportCSV,
  disableExportCSV,
  primaryDeviceTypes = [],
  subDeviceTypes = [],
  statusOptions = [],
  segment = "enterprise"
}) {
  const [showBulkImportMenu, setShowBulkImportMenu] = useState(false);
  const bulkImportRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bulkImportRef.current && !bulkImportRef.current.contains(event.target)) {
        setShowBulkImportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBulkImportClick = (type) => {
    setShowBulkImportMenu(false);
    onBulkImport(type);
  };
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

            {(showBulkImportUser || showBulkImportSmartDigital) && (
              <div style={{ position: 'relative' }} ref={bulkImportRef}>
                <Button
                  onClick={() => setShowBulkImportMenu(!showBulkImportMenu)}
                  variant="success"
                  disabled={disableBulkImport}
                  title={
                    disableBulkImport
                      ? "Permission required to bulk import devices"
                      : "Bulk import devices from CSV"
                  }
                  aria-label="Bulk Import Devices"
                  aria-haspopup="true"
                  aria-expanded={showBulkImportMenu}
                >
                  <FaUpload style={{ marginRight: 6 }} />
                  Bulk Import
                  <FaChevronDown style={{ marginLeft: 6, fontSize: '0.75em' }} />
                </Button>

                {showBulkImportMenu && (
                  <div className="bulk-import-dropdown">
                    {showBulkImportUser && (
                      <button
                        className="bulk-import-option"
                        onClick={() => handleBulkImportClick('userDevices')}
                        aria-label="Bulk Import User Devices"
                      >
                        <FaUpload style={{ marginRight: 8 }} />
                        User Devices
                      </button>
                    )}
                    {showBulkImportSmartDigital && (
                      <button
                        className="bulk-import-option"
                        onClick={() => handleBulkImportClick('smartDigitalDevices')}
                        aria-label="Bulk Import Smart/Digital Devices"
                      >
                        <FaUpload style={{ marginRight: 8 }} />
                        Smart/Digital Devices
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {onExportCSV && (
              <Button
                onClick={onExportCSV}
                variant="secondary"
                disabled={disableExportCSV}
                title={
                  disableExportCSV
                    ? "No devices to export"
                    : "Export device list to CSV"
                }
                aria-label="Export Devices to CSV"
              >
                <FaFileCsv style={{ marginRight: 6 }} />
                Export CSV
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
              value={primaryTypeFilter}
              onChange={onPrimaryTypeChange}
              aria-label="Filter by primary device type"
            >
              {primaryDeviceTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              className="toolbar-select"
              value={subTypeFilter}
              onChange={onSubTypeChange}
              aria-label="Filter by device sub-type"
            >
              {subDeviceTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              className="toolbar-select"
              value={statusFilter}
              onChange={onStatusChange}
              aria-label="Filter by device status"
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
