/**
 * ============================================================================
 * Device List Page (Device Management)
 * ============================================================================
 *
 * @file src/pages/DeviceManagement/DeviceList.js
 * @description Main device management page displaying all registered devices
 *              for the current site/company. Supports grid and list views,
 *              device registration, and disconnect functionality.
 *
 * @features
 * - Grid view (cards) and List view (table) display modes
 * - Device summary statistics cards (Total, Online, Offline, Blocked)
 * - Search and filter by status, category, user
 * - Site filtering for company-level users
 * - Add new device via modal form
 * - Bulk import devices from CSV
 * - Disconnect device from network
 * - Export device list to CSV
 * - Real-time online/offline status indicators
 *
 * @deviceCategories
 * | Category    | Icon        | Description                     |
 * |-------------|-------------|---------------------------------|
 * | Laptop      | FaLaptop    | Desktop/laptop computers        |
 * | Mobile      | FaMobileAlt | Smartphones                     |
 * | Tablet      | FaTablet    | Tablet devices                  |
 * | IoT/Digital | FaGlobeAmericas | Smart devices, IoT            |
 *
 * @deviceStatuses
 * | Status   | Indicator | Description                       |
 * |----------|-----------|-----------------------------------|
 * | Online   | Green dot | Device currently connected        |
 * | Offline  | Gray dot  | Device not connected              |
 * | Blocked  | Red       | Device access revoked             |
 *
 * @pageStructure
 * ```
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ Page Title: "Device Management"                                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Summary Cards:                                                           │
 * │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                         │
 * │ │ Total   │ │ Online  │ │ Offline │ │ Blocked │                         │
 * │ │   156   │ │   89    │ │   64    │ │    3    │                         │
 * │ └─────────┘ └─────────┘ └─────────┘ └─────────┘                         │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Toolbar: [Search] [Status Filter] [Add Device] [Import] [Grid|List]     │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Grid View:                          │ List View:                         │
 * │ ┌────────┐ ┌────────┐ ┌────────┐   │ ┌────────────────────────────────┐ │
 * │ │ [icon] │ │ [icon] │ │ [icon] │   │ │ Name │ MAC │ User │ Status    │ │
 * │ │ Device1│ │ Device2│ │ Device3│   │ ├────────────────────────────────┤ │
 * │ │ Online │ │ Offline│ │ Online │   │ │ Dev1 │ xx  │ John │ Online    │ │
 * │ └────────┘ └────────┘ └────────┘   │ │ Dev2 │ xx  │ Jane │ Offline   │ │
 * │ ┌────────┐ ┌────────┐              │ └────────────────────────────────┘ │
 * │ │ ...    │ │ ...    │              │                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Pagination: [< 1 2 3 4 5 >]  Items per page: [12 ▼]                     │
 * └──────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @permissions
 * - canManageDevices: Add, Edit, Delete, Disconnect devices
 * - canViewReports: Export device list
 * - canBulkImportDevices: Access bulk import
 * - canDisconnectDevice: Force disconnect from network
 *
 * @companyView
 * When in company view:
 * - Shows devices from ALL sites with site column
 * - Site filter dropdown available
 * - Edit/disconnect actions disabled (read-only)
 * - Must drill down to site for device actions
 *
 * @disconnectFeature
 * The disconnect feature:
 * - Forces immediate disconnection from NAS
 * - Calls AAA system to terminate session
 * - Device can reconnect automatically (not blocked)
 * - Used for troubleshooting or session refresh
 *
 * @deviceData
 * Each device object contains:
 * - id, name: Device identifiers
 * - mac: MAC address (unique)
 * - category: Device type (Laptop, Mobile, etc.)
 * - owner: Associated user name
 * - online: Current connection status
 * - siteId, siteName: Site association
 * - vendor: OUI-based vendor name
 * - lastSeen: Last connection timestamp
 *
 * @dependencies
 * - usePermissions: Permission checking
 * - useSegment: Current segment
 * - useAccessLevelView: Company/site view state
 * - useReadOnlyMode: Customer impersonation check
 * - DeviceFormModal: Add/Edit device form
 *
 * @relatedFiles
 * - DeviceFormModal.js: Device registration form
 * - DeviceToolbar.js: Action toolbar
 * - segmentDeviceConfig.js: Segment-specific device rules
 * - DeviceList.css: Page styles
 *
 * ============================================================================
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FaDesktop, FaGlobeAmericas, FaBan, FaWifi, FaMobileAlt, FaLaptop, FaTablet, FaTh, FaList, FaEdit, FaTrash, FaPowerOff, FaBuilding, FaInfoCircle } from "react-icons/fa";
import { usePermissions } from "../../hooks/usePermissions";
import { useFilter } from "../../hooks/useFilter";
import { useTableState } from "../../hooks/useTableState";
import { useBulkOperations } from "../../hooks/useBulkOperations";
import { useLoading } from "../../context/LoadingContext";
import { useSegment } from "../../context/SegmentContext";
import { useAccessLevelView } from "../../context/AccessLevelViewContext";
import { useReadOnlyMode } from "../../hooks/useReadOnlyMode";
import { useTranslation } from "react-i18next";
import { companySites } from "../../constants/companySampleData";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import DeviceFormModal from "../../components/DeviceFormModal";
import DeviceToolbar from "./DeviceToolbar";
import BulkImportModal from "../../components/BulkImportModal";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import SkeletonLoader from "../../components/Loading/SkeletonLoader";
import ConfirmationModal from "../../components/ConfirmationModal";
import notifications from "../../utils/notifications";
import { exportChartDataToCSV } from "../../utils/exportUtils";
import "./DeviceList.css";
import { PAGINATION } from "../../constants/appConstants";
import SEGMENT_DEVICE_AVAILABILITY from "../../config/segmentDeviceConfig";
import userSampleData from "../../constants/userSampleData";
import siteConfig from "../../config/siteConfig";

const getDeviceIcon = (category) => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('tablet')) return FaTablet;
  if (categoryLower.includes('phone') || categoryLower.includes('mobile')) return FaMobileAlt;
  return FaLaptop;
};

const getDeviceType = (category) => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('tablet')) return 'tablet';
  if (categoryLower.includes('phone') || categoryLower.includes('mobile')) return 'mobile';
  return 'laptop';
};

const SummaryCard = React.memo(({ stat }) => (
  <div className={`device-summary-card ${stat.colorClass}`}>
    <div className="devsc-toprow">
      <div className="devsc-title">{stat.label}</div>
      <stat.Icon className="devsc-icon" />
    </div>
    <div className="devsc-valuecard">
      <span className="devsc-value">{stat.value.toLocaleString()}</span>
      {stat.labelKey === "onlineNow" && <span className="devsc-dot green"></span>}
      {stat.labelKey === "blocked" && <span className="devsc-dot red"></span>}
    </div>
  </div>
));

SummaryCard.displayName = 'SummaryCard';

const DeviceCard = React.memo(({
  device,
  onEdit,
  onDisconnect,
  onDelete,
  canEdit,
  canDelete,
  disconnectingDeviceId,
  t,
  isCompanyView
}) => {
  // Always get site name for devices - show in both site view and company view
  const siteName = device.siteId
    ? companySites.find(s => s.siteId === device.siteId)?.siteName || device.siteName || 'Unknown Site'
    : device.siteName || null;

  return (
    <div className="device-card">
      <div className="device-icon-bg">
        <device.Icon className="device-main-icon" />
        <span
          className={`device-status-indicator ${device.online ? "status-online" : "status-offline"}`}
          title={device.online ? t('status.online') : t('status.offline')}
          aria-label={device.online ? t('devices.deviceOnline') : t('devices.deviceOffline')}
        >
          {device.online ? "●" : "●"}
        </span>
      </div>
      <div className="device-meta-col">
        <div className="device-card-title">{device.name}</div>
        {/* Always show site name - in both site view and company view */}
        {siteName && (
          <div className="device-detail device-card-site">
            <FaBuilding className="device-card-site-icon" />
            <span>{siteName}</span>
          </div>
        )}
        <div className="device-detail">{t('devices.deviceType')}: {device.category}</div>
        <div className="device-detail">{t('devices.macAddress')}: {device.mac}</div>
        <div className="device-detail">{t('devices.user')}: {device.owner}</div>
        <div className="device-card-info-row">
          <span>
            {t('devices.ipAddress')}:{" "}
            <span className="device-link">{device.ip}</span>
          </span>
          <span>
            {t('devices.connected')}:{" "}
            <span className="device-link">{device.lastUsageDate}</span>
          </span>
          <span>
            {t('devices.dataUsageSession')}:{" "}
            <span className="device-link">{device.dataUsage}</span>
          </span>
        </div>
      </div>
      <div className="device-card-actions">
        {canEdit && (
          <Button
            variant="primary"
            onClick={() => onEdit(device)}
            aria-label={t('devices.editDeviceAria', { name: device.name })}
            disabled={disconnectingDeviceId === device.id}
            title={t('devices.editDeviceTitle')}
          >
            {t('common.edit')}
          </Button>
        )}
        <Button
          variant="warning"
          onClick={() => onDisconnect(device)}
          aria-label={t('devices.disconnectDeviceAria', { name: device.name })}
          disabled={!device.online}
          loading={disconnectingDeviceId === device.id}
          title={!device.online ? t('devices.alreadyOffline') : t('devices.disconnectTitle')}
        >
          {t('devices.disconnect')}
        </Button>
        {canDelete && (
          <Button
            variant="danger"
            onClick={() => onDelete(device)}
            aria-label={t('devices.deleteDeviceAria', { name: device.name })}
            disabled={disconnectingDeviceId === device.id}
            title={t('devices.deleteDeviceTitle')}
          >
            {t('common.delete')}
          </Button>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.device.id === nextProps.device.id &&
    prevProps.device.online === nextProps.device.online &&
    prevProps.device.name === nextProps.device.name &&
    prevProps.device.mac === nextProps.device.mac &&
    prevProps.device.category === nextProps.device.category &&
    prevProps.device.siteId === nextProps.device.siteId &&
    prevProps.device.siteName === nextProps.device.siteName &&
    prevProps.canEdit === nextProps.canEdit &&
    prevProps.canDelete === nextProps.canDelete &&
    prevProps.disconnectingDeviceId === nextProps.disconnectingDeviceId &&
    prevProps.isCompanyView === nextProps.isCompanyView
  );
});

DeviceCard.displayName = 'DeviceCard';

const DeviceList = () => {
  const { hasPermission } = usePermissions();
  const { isLoading } = useLoading();
  const { currentSegment } = useSegment();
  const { canBulkAddUserDevices, canBulkAddSmartDigitalDevices } = useBulkOperations();
  const { t } = useTranslation();
  const { isCompanyView, canEditInCurrentView, drillDownToSite } = useAccessLevelView();
  const { isReadOnly: isCustomerViewReadOnly, blockAction } = useReadOnlyMode();

  const [devices, setDevices] = useState([]);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkImportType, setBulkImportType] = useState(null); // 'userDevices' or 'smartDigitalDevices'
  const [initialLoad, setInitialLoad] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [disconnectingDeviceId, setDisconnectingDeviceId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDisconnectConfirmation, setShowDisconnectConfirmation] = useState(false);
  const [deviceToDisconnect, setDeviceToDisconnect] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Use segment from context instead of local state
  const segmentFilter = currentSegment;

  const {
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    resetToPage1
  } = useTableState(PAGINATION.DEVICE_LIST_DEFAULT);

  const segmentDeviceConfig = SEGMENT_DEVICE_AVAILABILITY[segmentFilter] || {};
  const allowUserDevices = segmentDeviceConfig.allowUserDevices ?? false;
  const allowDigitalDevices = segmentDeviceConfig.allowDigitalDevices ?? false;
  const allowDeviceEdit = segmentDeviceConfig.allowDeviceEdit ?? false;
  const allowDeviceDelete = segmentDeviceConfig.allowDeviceDelete ?? false;
  const showRegisterDevice = allowUserDevices || allowDigitalDevices;

  const hasDevicePermission = hasPermission('canManageDevices');
  const canRegisterDevice = hasDevicePermission && showRegisterDevice;
  const canEditDevice = hasDevicePermission && allowDeviceEdit;
  const canDeleteDevice = hasDevicePermission && allowDeviceDelete;

  // Read-only mode in company view or customer impersonation mode
  const isReadOnly = isCustomerViewReadOnly || (isCompanyView && !canEditInCurrentView);

  const segmentUsers = useMemo(() => {
    return (userSampleData.users || []).filter(user => user.segment === segmentFilter);
  }, [segmentFilter]);

  const segmentUserIds = useMemo(() => {
    return new Set(segmentUsers.map(user => user.id));
  }, [segmentUsers]);

  const deviceFilterFunction = useCallback((device, { searchTerm = '', primaryTypeFilter = 'all', subTypeFilter = 'all', statusFilter = 'all', siteFilter = 'all' }) => {
    if (!segmentUserIds.has(device.userId)) return false;

    // Site filter for company view
    if (siteFilter && siteFilter !== 'all') {
      if (device.siteId !== siteFilter) return false;
    }

    // Primary type filter (User Devices vs Smart/Digital Devices)
    if (primaryTypeFilter && primaryTypeFilter !== "all") {
      const userDeviceCategories = ['Mobile', 'Laptop', 'Tablet', 'iPad', 'Smart Speaker', 'Miscellaneous'];
      const isUserDevice = userDeviceCategories.some(cat =>
        device.category && device.category.toLowerCase().includes(cat.toLowerCase())
      );

      if (primaryTypeFilter === "user" && !isUserDevice) return false;
      if (primaryTypeFilter === "smartDigital" && isUserDevice) return false;
    }

    // Sub-type filter (specific device type)
    // For user devices, check device.type; for digital devices, check device.subtype
    if (subTypeFilter && subTypeFilter !== "all") {
      const deviceSubtype = device.type === "digital" ? device.subtype : device.type;
      if (deviceSubtype !== subTypeFilter) return false;
    }

    // Status filter
    if (statusFilter === "online" && !device.online) return false;
    if (statusFilter === "offline" && device.online) return false;
    if (statusFilter === "blocked" && device.blocked !== true) return false;

    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (
        !(
          device.name.toLowerCase().includes(searchLower) ||
          device.mac.toLowerCase().includes(searchLower) ||
          device.owner.toLowerCase().includes(searchLower) ||
          (device.category && device.category.toLowerCase().includes(searchLower))
        )
      ) {
        return false;
      }
    }
    return true;
  }, [segmentUserIds]);

  const {
    filteredData: filteredDevices,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter
  } = useFilter(devices, deviceFilterFunction);

  const primaryTypeFilter = filters.primaryTypeFilter || "all";
  const subTypeFilter = filters.subTypeFilter || "all";
  const statusFilter = filters.statusFilter || "all";
  const siteFilter = filters.siteFilter || "all";

  const segmentDeviceStats = useMemo(() => {
    const segmentDevices = devices.filter(device => segmentUserIds.has(device.userId));
    const onlineDevices = segmentDevices.filter(d => d.online).length;
    const offlineDevices = segmentDevices.filter(d => !d.online).length;

    return [
      {
        label: t('devices.totalDevices'),
        labelKey: "totalDevices",
        value: segmentDevices.length,
        Icon: FaDesktop,
        colorClass: "stat-blue"
      },
      {
        label: t('devices.onlineNow'),
        labelKey: "onlineNow",
        value: onlineDevices,
        Icon: FaGlobeAmericas,
        colorClass: "stat-green"
      },
      {
        label: t('status.offline'),
        labelKey: "offline",
        value: offlineDevices,
        Icon: FaBan,
        colorClass: "stat-gray"
      },
      {
        label: t('devices.accessPoints'),
        labelKey: "accessPoints",
        value: siteConfig.devices.accessPoints,
        Icon: FaWifi,
        colorClass: "stat-yellow"
      }
    ];
  }, [devices, segmentUserIds, t]);

  // Primary device types - dynamic based on segment configuration
  const primaryDeviceTypes = useMemo(() => {
    const types = [{ value: "all", label: t('devices.allDeviceTypes') }];

    // Only show User Devices option if segment allows user devices
    if (allowUserDevices) {
      types.push({ value: "user", label: t('devices.userDevices') });
    }

    // Only show Smart/Digital Devices option if segment allows digital devices
    if (allowDigitalDevices) {
      types.push({ value: "smartDigital", label: t('devices.smartDigitalDevices') });
    }

    return types;
  }, [allowUserDevices, allowDigitalDevices, t]);

  // Get segment-specific device subtypes from config
  const subDeviceTypes = useMemo(() => {
    let baseOptions = [{ value: "all", label: t('devices.allSubTypes') }];

    if (primaryTypeFilter === "user") {
      // Use segment-specific user device subtypes from config
      const userSubTypes = segmentDeviceConfig.userDeviceSubtypes || [];
      return [...baseOptions, ...userSubTypes];
    } else if (primaryTypeFilter === "smartDigital") {
      // Use segment-specific smart/digital device subtypes from config
      const smartDigitalSubTypes = segmentDeviceConfig.smartDigitalSubtypes || [];
      return [...baseOptions, ...smartDigitalSubTypes];
    }
    return baseOptions;
  }, [primaryTypeFilter, segmentDeviceConfig, t]);

  const statusOptions = useMemo(() => [
    { value: "all", label: t('common.all') },
    { value: "online", label: t('status.online') },
    { value: "offline", label: t('status.offline') },
    { value: "blocked", label: t('status.blocked') }
  ], [t]);

  useEffect(() => {
    let mounted = true;
    let timeoutId = null;

    const loadDevices = () => {
      // ========================================
      // TODO: Backend Integration - Fetch Devices from Database
      // ========================================
      // Replace sample data with actual API call to retrieve device list
      // 
      // API Endpoint: GET /api/devices
      // Query Parameters:
      // - siteId: Current site identifier
      // - segment: Selected segment filter (enterprise, coLiving, etc.)
      // - includeOffline: true/false
      // - page: Current page number (for pagination)
      // - limit: Items per page
      // 
      // Response Format:
      // {
      //   success: true,
      //   data: {
      //     devices: [
      //       {
      //         id: string,
      //         userId: string, // Human user ID or device user ID
      //         name: string,
      //         type: 'mobile' | 'laptop',
      //         category: string,
      //         mac: string,
      //         ip: string,
      //         additionDate: ISO8601,
      //         lastUsageDate: ISO8601,
      //         dataUsage: string,
      //         online: boolean,
      //         blocked: boolean,
      //         vendor: string, // from OUI lookup
      //         currentAP: string | null, // if online
      //         signalStrength: string | null, // if online
      //         owner: {
      //           id: string,
      //           name: string,
      //           segment: string
      //         }
      //       }
      //     ],
      //     totalCount: number,
      //     onlineCount: number,
      //     blockedCount: number,
      //     stats: {
      //       totalDevices: number,
      //       mobileDevices: number,
      //       laptopDevices: number,
      //       accessPoints: number
      //     }
      //   }
      // }
      // 
      // Backend Processing:
      // 1. Fetch devices from database with site/segment filters
      // 2. Query network monitoring system for real-time online status
      // 3. Join with users table to get owner information
      // 4. Calculate aggregate statistics
      // 5. Enrich with MAC vendor information from OUI database
      // 6. Include current AP and signal strength for online devices
      // 
      // Implementation Example:
      // const fetchDevices = async () => {
      //   try {
      //     const response = await fetch(
      //       `/api/devices?siteId=${siteConfig.siteId}&segment=${segmentFilter}&includeOffline=true`
      //     );
      //     const result = await response.json();
      //     
      //     if (result.success) {
      //       const enrichedDevices = result.data.devices.map(device => ({
      //         ...device,
      //         Icon: getDeviceIcon(device.category),
      //         owner: device.owner.name,
      //         ownerSegment: device.owner.segment
      //       }));
      //       
      //       setDevices(enrichedDevices);
      //       // Update stats if needed
      //     }
      //   } catch (error) {
      //     console.error('Failed to load devices:', error);
      //     notifications.operationFailed("load devices");
      //   }
      // };
      // 
      // Error Handling:
      // - Network failures: Retry with exponential backoff
      // - 401: Redirect to login
      // - 403: Show permission error
      // - 500: Display error, log to monitoring
      // 
      // Performance Considerations:
      // - Implement pagination at database level for large device lists
      // - Cache online status for 30 seconds to reduce monitoring system load
      // - Use database indexes on: site_id, user_id, mac_address, online status
      // - Consider lazy loading device details (load basic info first, enrich on scroll)
      // ========================================
      
      const sampleDevices = userSampleData.devices || [];
      const sampleUsers = userSampleData.users || [];
      
      const enrichedData = sampleDevices.map(device => {
        const owner = sampleUsers.find(user => user.id === device.userId);
        return {
          ...device,
          Icon: getDeviceIcon(device.category),
          owner: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown',
          ownerSegment: owner?.segment || 'unknown',
          siteId: owner?.siteId || null,
          siteName: owner?.siteName || null
        };
      });
      
      setDevices(enrichedData);
      setInitialLoad(false);
    };

    timeoutId = setTimeout(loadDevices, 300);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      // ========================================
      // TODO: Backend Integration - Cleanup on Unmount
      // ========================================
      // Close WebSocket connections for real-time device status updates
      // Cancel any pending API requests
      // Clear polling intervals if any
      // 
      // if (wsConnection) {
      //   wsConnection.close();
      // }
      // if (abortController) {
      //   abortController.abort();
      // }
      // if (pollingInterval) {
      //   clearInterval(pollingInterval);
      // }
      // ========================================
    };
  }, []);

  // ========================================
  // TODO: Backend Integration - Real-time Device Status Updates
  // ========================================
  // Implement WebSocket or polling to keep device online/offline status current
  // 
  // Option 1: WebSocket Connection
  // useEffect(() => {
  //   const ws = new WebSocket(`wss://api.example.com/ws/devices/${siteConfig.siteId}`);
  //   
  //   ws.onmessage = (event) => {
  //     const update = JSON.parse(event.data);
  //     
  //     switch(update.type) {
  //       case 'DEVICE_ONLINE':
  //         setDevices(prev => prev.map(d => 
  //           d.mac === update.mac 
  //             ? { ...d, online: true, currentAP: update.ap, ip: update.ip }
  //             : d
  //         ));
  //         break;
  //         
  //       case 'DEVICE_OFFLINE':
  //         setDevices(prev => prev.map(d => 
  //           d.mac === update.mac 
  //             ? { ...d, online: false, currentAP: null, lastUsageDate: update.lastSeen }
  //             : d
  //         ));
  //         break;
  //         
  //       case 'DEVICE_BLOCKED':
  //         setDevices(prev => prev.map(d => 
  //           d.id === update.deviceId 
  //             ? { ...d, blocked: true, online: false }
  //             : d
  //         ));
  //         break;
  //         
  //       case 'DEVICE_REGISTERED':
  //         // Add newly registered device to list
  //         fetchDeviceDetails(update.deviceId).then(newDevice => {
  //           setDevices(prev => [newDevice, ...prev]);
  //         });
  //         break;
  //         
  //       case 'DATA_USAGE_UPDATE':
  //         setDevices(prev => prev.map(d => 
  //           d.mac === update.mac 
  //             ? { ...d, dataUsage: update.dataUsage }
  //             : d
  //         ));
  //         break;
  //     }
  //   };
  //   
  //   ws.onerror = (error) => {
  //     console.error('Device status WebSocket error:', error);
  //     // Implement reconnection logic
  //   };
  //   
  //   ws.onclose = () => {
  //     console.log('Device status WebSocket closed, attempting reconnect...');
  //     // Implement reconnection with exponential backoff
  //   };
  //   
  //   return () => {
  //     ws.close();
  //   };
  // }, [siteConfig.siteId]);
  // 
  // Option 2: Polling (fallback if WebSocket unavailable)
  // useEffect(() => {
  //   const pollDeviceStatus = async () => {
  //     try {
  //       const response = await fetch(`/api/devices/status-delta?since=${lastUpdateTimestamp}`);
  //       const result = await response.json();
  //       
  //       if (result.success && result.data.changes.length > 0) {
  //         // Update only devices that have changed
  //         setDevices(prev => {
  //           const updated = [...prev];
  //           result.data.changes.forEach(change => {
  //             const index = updated.findIndex(d => d.id === change.deviceId);
  //             if (index !== -1) {
  //               updated[index] = { ...updated[index], ...change.updates };
  //             }
  //           });
  //           return updated;
  //         });
  //         setLastUpdateTimestamp(result.data.timestamp);
  //       }
  //     } catch (error) {
  //       console.error('Device status poll error:', error);
  //     }
  //   };
  //   
  //   // Poll every 10 seconds
  //   const intervalId = setInterval(pollDeviceStatus, 10000);
  //   
  //   return () => clearInterval(intervalId);
  // }, [lastUpdateTimestamp]);
  // 
  // Backend Requirements:
  // - Monitor NAS (Network Access Server) for client associations
  // - Track RADIUS authentication/deauthentication events
  // - Query wireless controller for connected clients
  // - Aggregate device status from multiple sources
  // - Publish updates via WebSocket or provide delta endpoint
  // - Include: online status, current AP, IP address, data usage
  // ========================================

  const pagedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredDevices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDevices, currentPage, rowsPerPage]);

  useEffect(() => {
    resetToPage1();
  }, [primaryTypeFilter, subTypeFilter, statusFilter, siteFilter, searchTerm, rowsPerPage, segmentFilter, resetToPage1]);

  const handleDeviceSubmit = useCallback(async (deviceInfo) => {
    // Block in read-only mode (customer view impersonation)
    if (blockAction("Adding/editing devices")) return;

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const sampleUsers = userSampleData.users || [];

      if (deviceInfo.isEdit) {
        // Editing existing device
        const updatedDevice = {
          ...devices.find(d => d.id === deviceInfo.id),
          name: deviceInfo.deviceName,
          category: deviceInfo.deviceCategory,
          Icon: getDeviceIcon(deviceInfo.deviceCategory),
          mac: deviceInfo.macAddress,
          type: getDeviceType(deviceInfo.deviceCategory),
        };

        setDevices(prev => prev.map(dev => dev.id === deviceInfo.id ? updatedDevice : dev));
        notifications.success(`Device "${deviceInfo.deviceName}" updated successfully`);

        // TODO: Backend Integration - Update Device
        // fetch(`/api/devices/${deviceInfo.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     name: deviceInfo.deviceName,
        //     category: deviceInfo.deviceCategory,
        //     macAddress: deviceInfo.macAddress,
        //     segment: segmentFilter,
        //     updatedBy: currentUser.id
        //   })
        // });
      } else {
        // Creating new device
        const newDevice = {
          id: `dev${String(devices.length + 1).padStart(3, '0')}`,
          userId: deviceInfo.mode === 'bindUser' ? deviceInfo.userId : 'system',
          name: deviceInfo.deviceName,
          type: getDeviceType(deviceInfo.deviceCategory),
          category: deviceInfo.deviceCategory,
          Icon: getDeviceIcon(deviceInfo.deviceCategory),
          mac: deviceInfo.macAddress,
          owner: deviceInfo.mode === 'bindUser' ?
            (() => {
              const user = sampleUsers.find(u => u.id === deviceInfo.userId);
              return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
            })() : 'System',
          ip: `192.168.1.${Math.floor(Math.random() * 200) + 1}`,
          additionDate: new Date().toISOString().split('T')[0],
          lastUsageDate: 'Just now',
          dataUsage: '0 MB',
          online: true,
          blocked: false
        };

        setDevices(prev => [newDevice, ...prev]);
        notifications.deviceRegistered(deviceInfo.deviceName);
      }

      setShowDeviceModal(false);
      setEditingDevice(null);
    } catch (error) {
      notifications.operationFailed(deviceInfo.isEdit ? "update device" : "register device");
    } finally {
      setSubmitting(false);
    }
  }, [devices, segmentFilter]);

  const handleDeleteDevice = useCallback((device) => {
    if (blockAction("Deleting devices")) return;

    if (!hasDevicePermission) {
      notifications.noPermission("delete devices");
      return;
    }

    if (!allowDeviceDelete) {
      notifications.showError("Device deletion is not available for your account type.");
      return;
    }

    setDeviceToDelete(device);
    setShowDeleteConfirmation(true);
  }, [hasDevicePermission, allowDeviceDelete, segmentFilter, blockAction]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deviceToDelete) return;

    setDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      // ========================================
      // TODO: Backend Integration - Delete Device
      // ========================================
      // API Endpoint: DELETE /api/devices/{deviceId}
      //
      // Request Payload:
      // {
      //   deviceId: deviceToDelete.id,
      //   macAddress: deviceToDelete.mac,
      //   userId: deviceToDelete.userId,
      //   segment: segmentFilter,
      //   deletedBy: currentUser.id,
      //   reason: 'admin_deletion',
      //   timestamp: new Date().toISOString()
      // }
      //
      // Backend Processing:
      // 1. Verify user has permission to delete devices
      // 2. Check if device is currently online/connected
      //    - If online: Disconnect device first (call disconnect endpoint)
      //    - Remove MAC address from AAA system
      //    - Call AAA API to force disconnect: POST /aaa/api/disconnect-mac
      //    - Clear MAC from firewall rules/whitelist
      // 3. Remove device from database (soft delete recommended)
      //    - Set deleted_at timestamp instead of hard delete
      //    - Preserve device history for audit trail
      // 4. Update user's device count
      //    - Decrement active device count for the user
      //    - Free up device slot for the user
      // 5. Clean up related data:
      //    - Remove device from monitoring system
      //    - Clear any pending notifications for this device
      //    - Remove from network access lists
      //    - Clean up usage history (optional, or archive)
      // 6. Create audit log entry
      //    - Log device deletion with admin details
      //    - Include device info: name, MAC, owner, segment
      // 7. Send notification to device owner (optional)
      //    - Email/SMS notification about device removal
      //    - Include reason if provided
      //
      // Response Format:
      // {
      //   success: true,
      //   data: {
      //     deviceId: string,
      //     deviceName: string,
      //     macAddress: string,
      //     deletedAt: ISO8601,
      //     wasOnline: boolean,
      //     disconnected: boolean
      //   }
      // }
      //
      // Error Handling:
      // - 404: Device not found
      // - 403: Insufficient permissions or segment restriction
      // - 409: Device cannot be deleted (e.g., active critical connection)
      // - 500: Database or AAA system error (log and retry)
      //
      // Implementation Example:
      // const response = await fetch(`/api/devices/${deviceToDelete.id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${authToken}`
      //   },
      //   body: JSON.stringify({
      //     segment: segmentFilter,
      //     reason: 'admin_deletion',
      //     deletedBy: currentUser.id
      //   })
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`Failed to delete device: ${response.statusText}`);
      // }
      //
      // const result = await response.json();
      //
      // Security Considerations:
      // - Verify segment-based permissions on backend
      // - Prevent deletion of system/infrastructure devices
      // - Rate limit deletion requests to prevent abuse
      // - Require additional confirmation for bulk deletions
      // - Log all deletion attempts (successful and failed)
      // ========================================

      setDevices(prev => prev.filter(dev => dev.id !== deviceToDelete.id));
      notifications.success(`Device "${deviceToDelete.name}" has been deleted successfully`);
      setShowDeleteConfirmation(false);
      setDeviceToDelete(null);
    } catch (error) {
      notifications.operationFailed(`delete ${deviceToDelete.name}`);
    } finally {
      setDeleting(false);
    }
  }, [deviceToDelete, segmentFilter]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirmation(false);
    setDeviceToDelete(null);
  }, []);

  const handleDisconnectDevice = useCallback((device) => {
    if (blockAction("Disconnecting devices")) return;

    if (!device.online) {
      notifications.showInfo(`${device.name} is already offline`);
      return;
    }

    setDeviceToDisconnect(device);
    setShowDisconnectConfirmation(true);
  }, [blockAction]);

  const handleConfirmDisconnect = useCallback(async () => {
    if (!deviceToDisconnect) return;

    setDisconnectingDeviceId(deviceToDisconnect.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      // ========================================
      // TODO: Backend Integration - Disconnect Device
      // ========================================
      // API Endpoint: POST /api/devices/{deviceId}/disconnect
      //
      // Request Payload:
      // {
      //   deviceId: device.id,
      //   macAddress: device.mac,
      //   userId: device.userId,
      //   reason: 'admin_disconnect',
      //   disconnectedBy: currentUser.id,
      //   timestamp: new Date().toISOString()
      // }
      //
      // Backend Processing:
      // 1. Identify the user account associated with this device
      // 2. Remove MAC address from user's allowed devices list in AAA system
      // 3. Call AAA API to force disconnect active sessions for this MAC
      //    - Endpoint: POST /aaa/api/disconnect-mac
      //    - Payload: { macAddress, reason: 'admin_disconnect' }
      // 4. Update NAS (Network Access Server) to revoke MAC binding
      // 5. Clear MAC from firewall rules/whitelist
      // 6. Update device status in database to offline
      // 7. Create audit log entry for disconnect action
      // 8. Send notification to device owner (optional)
      //
      // Response Format:
      // {
      //   success: true,
      //   data: {
      //     deviceId: string,
      //     macAddress: string,
      //     disconnectedAt: ISO8601,
      //     sessionsTerminated: number
      //   }
      // }
      //
      // Error Handling:
      // - 404: Device not found
      // - 409: Device already disconnected
      // - 500: AAA system error (log and retry)
      // ========================================

      setDevices(prev =>
        prev.map(dev =>
          dev.id === deviceToDisconnect.id
            ? { ...dev, online: false, lastUsageDate: 'Just now' }
            : dev
        )
      );
      notifications.success(`${deviceToDisconnect.name} has been disconnected from the network`);
      setShowDisconnectConfirmation(false);
      setDeviceToDisconnect(null);
    } catch (error) {
      notifications.operationFailed(`disconnect ${deviceToDisconnect.name}`);
    } finally {
      setDisconnectingDeviceId(null);
    }
  }, [deviceToDisconnect]);

  const handleCancelDisconnect = useCallback(() => {
    setShowDisconnectConfirmation(false);
    setDeviceToDisconnect(null);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      notifications.showInfo(`Searching for: ${searchTerm}`);
    } else {
      notifications.showInfo("Enter search criteria");
    }
  }, [searchTerm]);

  const handleRegisterDeviceClick = useCallback(() => {
    if (blockAction("Registering devices")) return;

    if (!hasDevicePermission) {
      notifications.noPermission("register devices");
      return;
    }

    if (!showRegisterDevice) {
      notifications.showError("Device registration is not available for your account type.");
      return;
    }

    setEditingDevice(null);
    setShowDeviceModal(true);
  }, [hasDevicePermission, showRegisterDevice, segmentFilter, blockAction]);

  const handleEditDevice = useCallback((device) => {
    if (blockAction("Editing devices")) return;

    if (!hasDevicePermission) {
      notifications.noPermission("edit devices");
      return;
    }

    if (!allowDeviceEdit) {
      notifications.showError("Device editing is not available for your account type.");
      return;
    }

    setEditingDevice(device);
    setShowDeviceModal(true);
  }, [hasDevicePermission, allowDeviceEdit, segmentFilter, blockAction]);

  /**
   * Handle bulk import of devices
   */
  const handleBulkImportDevices = useCallback((importedDevices) => {
    try {
      const isUserDevice = bulkImportType === 'userDevices';

      // Generate new device entries
      const newDevices = importedDevices.map((deviceData, index) => {
        if (isUserDevice) {
          // User device mapping
          return {
            id: `HD${Date.now()}${index}`,
            name: `${deviceData.deviceType}-${deviceData.assignedUserId}`,
            mac: `00:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}`,
            owner: deviceData.fullName,
            ownerEmail: deviceData.email,
            ip: `192.168.1.${100 + index}`,
            category: deviceData.deviceType,
            Icon: getDeviceIcon(deviceData.deviceType),
            lastUsageDate: 'Just now',
            dataUsage: '0 GB',
            online: true,
            blocked: false,
            segment: segmentFilter,
            deviceType: 'user',
            assignedUserId: deviceData.assignedUserId,
            priority: deviceData.priority || 'medium',
            notes: deviceData.notes || ''
          };
        } else {
          // Smart/Digital device mapping
          return {
            id: `OD${Date.now()}${index}`,
            name: deviceData.deviceName,
            mac: deviceData.macAddress,
            owner: deviceData.assignedTo || 'Unassigned',
            ip: `192.168.1.${100 + index}`,
            category: deviceData.deviceType,
            Icon: FaDesktop,
            lastUsageDate: 'Just now',
            dataUsage: '0 GB',
            online: deviceData.status === 'active',
            blocked: deviceData.status === 'blocked',
            segment: segmentFilter,
            deviceType: 'smartDigital',
            manufacturer: deviceData.manufacturer || '',
            location: deviceData.location || '',
            status: deviceData.status || 'active',
            notes: deviceData.notes || ''
          };
        }
      });

      // Add new devices to the existing list
      setDevices(prevDevices => [...newDevices, ...prevDevices]);

      // Show success notification
      const deviceTypeLabel = isUserDevice ? 'user device' : 'smart/digital device';
      notifications.success(`Successfully imported ${newDevices.length} ${deviceTypeLabel}${newDevices.length > 1 ? 's' : ''}`);

      // Close modal and reset type
      setShowBulkImportModal(false);
      setBulkImportType(null);

      // TODO: Backend Integration - Bulk Device Import
      // Send bulk import data to backend
      // fetch('/api/devices/bulk-import', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     devices: newDevices,
      //     segment: segmentFilter,
      //     deviceType: bulkImportType,
      //     importedBy: currentUser.id,
      //     timestamp: new Date().toISOString()
      //   })
      // });

    } catch (error) {
      console.error('Bulk device import error:', error);
      notifications.error('Failed to import devices');
    }
  }, [bulkImportType, segmentFilter]);

  /**
   * Handle bulk import with type selection
   */
  const handleBulkImport = useCallback((type) => {
    if (blockAction("Importing devices")) return;

    if (!hasDevicePermission) {
      notifications.noPermission("import devices");
      return;
    }

    if (type === 'userDevices' && !canBulkAddUserDevices) {
      notifications.showError("Bulk import of user devices is not available for your account type.");
      return;
    }

    if (type === 'smartDigitalDevices' && !canBulkAddSmartDigitalDevices) {
      notifications.showError("Bulk import of smart/digital devices is not available for your account type.");
      return;
    }

    setBulkImportType(type);
    setShowBulkImportModal(true);
  }, [hasDevicePermission, canBulkAddUserDevices, canBulkAddSmartDigitalDevices, segmentFilter, blockAction]);

  /**
   * Export device list to CSV
   */
  const handleExportCSV = useCallback(() => {
    if (!filteredDevices || filteredDevices.length === 0) {
      notifications.showError('No devices to export');
      return;
    }

    try {
      // Prepare CSV headers
      const headers = [
        'Device Name',
        'MAC Address',
        'User',
        'Category',
        'IP Address',
        'Status',
        'Last Connected',
        'Data Usage (Current Session)'
      ];

      // Prepare CSV rows
      const rows = filteredDevices.map(device => [
        device.name || '',
        device.mac || '',
        device.owner || '',
        device.category || '',
        device.ip || '',
        device.online ? 'Online' : (device.blocked ? 'Blocked' : 'Offline'),
        device.lastUsageDate || '',
        device.dataUsage || ''
      ]);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `devices_${segmentFilter}_${timestamp}.csv`;

      // Export to CSV
      exportChartDataToCSV({ headers, rows }, filename);
      notifications.exportSuccess('CSV');
    } catch (error) {
      console.error('Export failed:', error);
      notifications.exportFailed('CSV');
    }
  }, [filteredDevices, segmentFilter]);

  if (initialLoad) {
    return (
      <main className="device-mgmt-main">
        <h1 className="device-mgmt-title">{t('devices.title')}</h1>

        <div className="device-summary-cards">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </div>

        <SkeletonLoader variant="rect" height={60} style={{ marginBottom: '20px' }} />

        <div className="device-card-list">
          {[...Array(6)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="device-mgmt-main">
      <LoadingOverlay
        active={isLoading('devices')}
        message={t('common.processing')}
        fullPage={false}
      />

      <h1 className="device-mgmt-title" style={{ marginBottom: '1.5rem' }}>{t('devices.title')}</h1>

      {/* Company View Info Banner */}
      {isCompanyView && (
        <div className="device-company-view-banner">
          <div className="company-banner-content">
            <FaInfoCircle className="company-banner-icon" />
            <div className="company-banner-text">
              <span className="company-banner-title">Company View</span>
              <span className="company-banner-subtitle">
                Viewing devices across all sites. Select a site to manage devices.
              </span>
            </div>
          </div>
          <div className="company-banner-filter">
            <label htmlFor="site-filter">Filter by Site:</label>
            <select
              id="site-filter"
              value={siteFilter}
              onChange={e => setFilter('siteFilter', e.target.value)}
              className="device-site-filter-select"
            >
              <option value="all">All Sites</option>
              {companySites.map(site => (
                <option key={site.siteId} value={site.siteId}>
                  {site.siteName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="device-summary-cards">
        {segmentDeviceStats.map(stat => (
          <SummaryCard key={stat.label} stat={stat} />
        ))}
      </div>

      <DeviceToolbar
        searchValue={searchTerm}
        onSearchChange={e => setSearchTerm(e.target.value)}
        primaryTypeFilter={primaryTypeFilter}
        onPrimaryTypeChange={e => {
          setFilter('primaryTypeFilter', e.target.value);
          setFilter('subTypeFilter', 'all'); // Reset sub-type when primary changes
        }}
        subTypeFilter={subTypeFilter}
        onSubTypeChange={e => setFilter('subTypeFilter', e.target.value)}
        statusFilter={statusFilter}
        onStatusChange={e => setFilter('statusFilter', e.target.value)}
        onRegisterDevice={handleRegisterDeviceClick}
        disableRegisterDevice={!canRegisterDevice || isLoading('devices') || submitting || isReadOnly}
        onBulkImport={handleBulkImport}
        disableBulkImport={!hasDevicePermission || isLoading('devices') || submitting || isReadOnly}
        showBulkImportUser={canBulkAddUserDevices && !isReadOnly}
        showBulkImportSmartDigital={canBulkAddSmartDigitalDevices && !isReadOnly}
        onExportCSV={handleExportCSV}
        disableExportCSV={!filteredDevices || filteredDevices.length === 0}
        primaryDeviceTypes={primaryDeviceTypes}
        subDeviceTypes={subDeviceTypes}
        statusOptions={statusOptions}
        segment={segmentFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isReadOnly={isReadOnly}
      />

      {viewMode === "grid" ? (
        <div className="device-card-list">
          {pagedDevices.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px",
              color: "#666",
              gridColumn: "1 / -1",
              fontSize: "1.1rem"
            }}>
              {t('devices.noDevicesFound')}
            </div>
          ) : (
            pagedDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onEdit={handleEditDevice}
                onDisconnect={handleDisconnectDevice}
                onDelete={handleDeleteDevice}
                canEdit={canEditDevice && !isReadOnly}
                canDelete={canDeleteDevice && !isReadOnly}
                disconnectingDeviceId={disconnectingDeviceId}
                t={t}
                isCompanyView={isCompanyView}
              />
            ))
          )}
        </div>
      ) : (
        <div className="device-list-table-container">
          {pagedDevices.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px",
              color: "#666",
              fontSize: "1.1rem"
            }}>
              {t('devices.noDevicesFound')}
            </div>
          ) : (
            <table className="device-list-table">
              <thead>
                <tr>
                  <th>{t('devices.deviceName')}</th>
                  <th>{t('devices.macAddress')}</th>
                  <th>{t('devices.deviceType')}</th>
                  <th>Site</th>
                  <th>{t('devices.user')}</th>
                  <th>{t('devices.ipAddress')}</th>
                  <th>{t('status.status')}</th>
                  <th>{t('devices.dataUsageSession')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {pagedDevices.map(device => {
                  // Always get site name - shown in both views
                  const siteName = device.siteId
                    ? companySites.find(s => s.siteId === device.siteId)?.siteName || device.siteName || 'Unknown Site'
                    : device.siteName || 'Unknown Site';
                  return (
                    <tr key={device.id}>
                      <td className="device-name-cell">
                        <device.Icon className="device-table-icon" />
                        <span>{device.name}</span>
                      </td>
                      <td className="device-mac-cell">{device.mac}</td>
                      <td>{device.category}</td>
                      <td className="device-site-cell">
                        <span
                          className={`device-site-badge ${isCompanyView ? 'clickable' : ''}`}
                          onClick={() => isCompanyView && device.siteId && drillDownToSite(device.siteId, siteName)}
                          title={isCompanyView && device.siteId ? `View ${siteName}` : siteName}
                          style={{ cursor: isCompanyView && device.siteId ? 'pointer' : 'default' }}
                        >
                          <FaBuilding className="device-site-icon" />
                          {siteName}
                        </span>
                      </td>
                      <td>{device.owner}</td>
                      <td>{device.ip}</td>
                      <td>
                        <span className={`status-badge ${device.online ? "online" : device.blocked ? "blocked" : "offline"}`}>
                          {device.online ? t('status.online') : device.blocked ? t('status.blocked') : t('status.offline')}
                        </span>
                      </td>
                      <td>{device.dataUsage}</td>
                      <td className="device-actions-cell">
                        {canEditDevice && !isReadOnly && (
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEditDevice(device)}
                            title={t('devices.editDeviceTitle')}
                            disabled={disconnectingDeviceId === device.id}
                          >
                            <FaEdit />
                          </button>
                        )}
                        <button
                          className="action-btn disconnect-btn"
                          onClick={() => handleDisconnectDevice(device)}
                          title={!device.online ? t('devices.alreadyOffline') : t('devices.disconnectTitle')}
                          disabled={!device.online || disconnectingDeviceId === device.id || isReadOnly}
                        >
                          <FaPowerOff />
                        </button>
                        {canDeleteDevice && !isReadOnly && (
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteDevice(device)}
                            title={t('devices.deleteDeviceTitle')}
                            disabled={disconnectingDeviceId === device.id}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {filteredDevices.length > 0 && (
        <Pagination
          totalItems={filteredDevices.length}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}

      {showDeviceModal && (
        <DeviceFormModal
          open={showDeviceModal}
          onClose={() => {
            setShowDeviceModal(false);
            setEditingDevice(null);
          }}
          onSubmit={handleDeviceSubmit}
          device={editingDevice}
          users={segmentUsers}
          devices={devices}
          segment={segmentFilter}
          siteUserList={segmentUsers}
          submitting={submitting}
        />
      )}

      {showBulkImportModal && bulkImportType && (
        <BulkImportModal
          type={bulkImportType}
          isOpen={showBulkImportModal}
          onClose={() => {
            setShowBulkImportModal(false);
            setBulkImportType(null);
          }}
          onImport={handleBulkImportDevices}
        />
      )}

      <ConfirmationModal
        open={showDisconnectConfirmation}
        onClose={handleCancelDisconnect}
        onConfirm={handleConfirmDisconnect}
        title={t('devices.disconnectDevice')}
        message={
          deviceToDisconnect
            ? t('devices.disconnectConfirm', { name: deviceToDisconnect.name })
            : ''
        }
        confirmText={t('devices.disconnect')}
        cancelText={t('common.cancel')}
        variant="warning"
        loading={disconnectingDeviceId === deviceToDisconnect?.id}
      />

      <ConfirmationModal
        open={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={t('devices.deleteDevice')}
        message={
          deviceToDelete
            ? t('devices.deleteConfirm', { name: deviceToDelete.name, mac: deviceToDelete.mac })
            : ''
        }
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
        loading={deleting}
      />
    </main>
  );
};

export default DeviceList;