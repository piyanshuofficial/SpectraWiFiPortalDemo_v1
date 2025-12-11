// src/pages/DeviceManagement/DeviceToolbar.js

import React, { useState, useRef, useEffect } from "react";
import { FaPlusCircle, FaQuestionCircle, FaUpload, FaFileCsv, FaChevronDown, FaTh, FaList } from "react-icons/fa";
import { useTranslation } from "react-i18next";
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
  segment = "enterprise",
  viewMode = "grid",
  onViewModeChange
}) {
  const { t } = useTranslation();
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
              title={disableRegisterDevice ? t('devices.permissionRequired') : t('devices.registerDevice')}
              aria-disabled={disableRegisterDevice}
              aria-label={disableRegisterDevice ? t('devices.registerDisabled') : t('devices.registerDevice')}
            >
              <FaPlusCircle style={{ marginRight: 6 }} />
              {t('devices.registerDevice')}
            </Button>

            {(showBulkImportUser || showBulkImportSmartDigital) && (
              <div style={{ position: 'relative' }} ref={bulkImportRef}>
                <Button
                  onClick={() => setShowBulkImportMenu(!showBulkImportMenu)}
                  variant="success"
                  disabled={disableBulkImport}
                  title={disableBulkImport ? t('devices.bulkImportDisabled') : t('common.bulkImport')}
                  aria-label={t('common.bulkImport')}
                  aria-haspopup="true"
                  aria-expanded={showBulkImportMenu}
                >
                  <FaUpload style={{ marginRight: 6 }} />
                  {t('common.bulkImport')}
                  <FaChevronDown style={{ marginLeft: 6, fontSize: '0.75em' }} />
                </Button>

                {showBulkImportMenu && (
                  <div className="bulk-import-dropdown">
                    {showBulkImportUser && (
                      <button
                        className="bulk-import-option"
                        onClick={() => handleBulkImportClick('userDevices')}
                        aria-label={t('devices.bulkImportUserDevices')}
                      >
                        <FaUpload style={{ marginRight: 8 }} />
                        {t('devices.userDevices')}
                      </button>
                    )}
                    {showBulkImportSmartDigital && (
                      <button
                        className="bulk-import-option"
                        onClick={() => handleBulkImportClick('smartDigitalDevices')}
                        aria-label={t('devices.bulkImportSmartDigital')}
                      >
                        <FaUpload style={{ marginRight: 8 }} />
                        {t('devices.smartDigitalDevices')}
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
                title={disableExportCSV ? t('devices.noDevicesToExport') : t('common.exportCsv')}
                aria-label={t('common.exportCsv')}
              >
                <FaFileCsv style={{ marginRight: 6 }} />
                {t('common.exportCsv')}
              </Button>
            )}
          </div>

          <div className="toolbar-right">
            <input
              type="search"
              className="toolbar-search"
              placeholder={t('devices.searchDevices')}
              value={searchValue}
              onChange={onSearchChange}
              aria-label={t('devices.searchDevices')}
            />
            <select
              className="toolbar-select"
              value={primaryTypeFilter}
              onChange={onPrimaryTypeChange}
              aria-label={t('devices.filterByPrimaryType')}
            >
              {primaryDeviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              className="toolbar-select"
              value={subTypeFilter}
              onChange={onSubTypeChange}
              aria-label={t('devices.filterBySubType')}
            >
              {subDeviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              className="toolbar-select"
              value={statusFilter}
              onChange={onStatusChange}
              aria-label={t('devices.filterByStatus')}
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            {onViewModeChange && (
              <div className="view-toggle-group">
                <button
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('grid')}
                  title={t('common.gridView')}
                  aria-label={t('common.gridView')}
                  aria-pressed={viewMode === 'grid'}
                >
                  <FaTh />
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('list')}
                  title={t('common.listView')}
                  aria-label={t('common.listView')}
                  aria-pressed={viewMode === 'list'}
                >
                  <FaList />
                </button>
              </div>
            )}

            <FaQuestionCircle
              className="help-icon"
              title={t('devices.managementHelp')}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceToolbar;
