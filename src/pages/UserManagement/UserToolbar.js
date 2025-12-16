// src/pages/UserManagement/UserToolbar.js

import React from "react";
import { useTranslation } from 'react-i18next';
import { FaPlus, FaDownload, FaQuestionCircle, FaPlusCircle, FaUpload } from "react-icons/fa";
import Button from "../../components/Button";
import SEGMENTDEVICEAVAILABILITY from "../../config/segmentDeviceConfig";
import "./UserToolbar.css";

function UserToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  userTypeFilter = "",
  onUserTypeChange,
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

  const { t } = useTranslation();
  const allowUserDevices = SEGMENTDEVICEAVAILABILITY[segment]?.allowUserDevices ?? false;
  const allowDigitalDevices = SEGMENTDEVICEAVAILABILITY[segment]?.allowDigitalDevices ?? false;
  const showAddDevice = allowUserDevices || allowDigitalDevices;

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
              title={disableAdd ? t('users.editPermissionRequired') : t('users.addUser')}
              aria-disabled={disableAdd}
              aria-label={disableAdd ? t('users.editPermissionRequired') : t('users.addUser')}
            >
              <FaPlus style={{ marginRight: 6 }} />
              {t('users.addUser')}
            </Button>
            {onBulkImport && (
              <Button
                onClick={onBulkImport}
                variant="success"
                disabled={disableBulkImport}
                title={disableBulkImport ? t('devices.bulkImportDisabled') : t('common.bulkImport')}
                aria-label={t('common.bulkImport')}
              >
                <FaUpload style={{ marginRight: 6 }} />
                {t('common.bulkImport')}
              </Button>
            )}
            {showAddDevice && (
              <Button
                onClick={onAddDevice}
                variant="info"
                title={t('devices.addDevice')}
                aria-label={t('devices.addDevice')}
              >
                <FaPlusCircle style={{ marginRight: 6 }} />
                {t('devices.addDevice')}
              </Button>
            )}
            <Button
              onClick={onExport}
              variant="secondary"
              aria-label={t('common.export')}
              disabled={disableExport}
              loading={exportLoading}
              title={disableExport ? t('notifications.noPermission', { action: t('common.export').toLowerCase() }) : t('common.export')}
            >
              <FaDownload style={{ marginRight: 6 }} />
              {t('common.export')}
            </Button>
          </div>
          <div className="toolbar-right">
            <input
              type="search"
              className="toolbar-search"
              placeholder={t('users.searchUsers')}
              value={searchValue}
              onChange={onSearchChange}
              aria-label={t('users.searchUsers')}
            />
            {onUserTypeChange && (
              <select
                className="toolbar-select"
                value={userTypeFilter}
                onChange={onUserTypeChange}
                aria-label={t('common.filterBy', { field: t('users.userType', { defaultValue: 'User Type' }) })}
              >
                <option value="">{t('users.allUserTypes', { defaultValue: 'All User Types' })}</option>
                <option value="regular">{t('users.regularUsers', { defaultValue: 'Regular Users' })}</option>
                <option value="guest">{t('users.guestUsers', { defaultValue: 'Guest Users' })}</option>
              </select>
            )}
            <select
              className="toolbar-select"
              value={statusFilter}
              onChange={onStatusChange}
              aria-label={t('common.filterBy', { field: t('common.status') })}
            >
              <option value="">{t('users.allStatus', { defaultValue: 'All Status' })}</option>
              <option value="Active">{t('status.active')}</option>
              <option value="Suspended">{t('status.suspended')}</option>
              <option value="Blocked">{t('status.blocked')}</option>
            </select>
            <FaQuestionCircle className="help-icon" title={t('common.help')} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserToolbar;