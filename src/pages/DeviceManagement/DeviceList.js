// src/pages/DeviceManagement/DeviceList.js

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FaDesktop, FaGlobeAmericas, FaBan, FaWifi, FaMobileAlt, FaLaptop, FaTablet } from "react-icons/fa";
import { usePermissions } from "../../hooks/usePermissions";
import { useFilter } from "../../hooks/useFilter";
import { useTableState } from "../../hooks/useTableState";
import { useBulkOperations } from "../../hooks/useBulkOperations";
import { useLoading } from "../../context/LoadingContext";
import { useSegment } from "../../context/SegmentContext";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import DeviceFormModal from "../../components/DeviceFormModal";
import DeviceToolbar from "./DeviceToolbar";
import BulkImportModal from "../../components/BulkImportModal";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import SkeletonLoader from "../../components/Loading/SkeletonLoader";
import notifications from "../../utils/notifications";
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

const SummaryCard = React.memo(({ stat }) => (
  <div className={`device-summary-card ${stat.colorClass}`}>
    <div className="devsc-toprow">
      <div className="devsc-title">{stat.label}</div>
      <stat.Icon className="devsc-icon" />
    </div>
    <div className="devsc-valuecard">
      <span className="devsc-value">{stat.value.toLocaleString()}</span>
      {stat.label === "Online Now" && <span className="devsc-dot green"></span>}
      {stat.label === "Blocked" && <span className="devsc-dot red"></span>}
    </div>
  </div>
));

SummaryCard.displayName = 'SummaryCard';

const DeviceCard = React.memo(({
  device,
  onEdit,
  onDisconnect,
  canEdit,
  disconnectingDeviceId
}) => (
  <div className="device-card">
    <div className="device-icon-bg">
      <device.Icon className="device-main-icon" />
      <span
        className={`device-status-indicator ${device.online ? "status-online" : "status-offline"}`}
        title={device.online ? "Online" : "Offline"}
        aria-label={device.online ? "Device is online" : "Device is offline"}
      >
        {device.online ? "●" : "●"}
      </span>
    </div>
    <div className="device-meta-col">
      <div className="device-card-title">{device.name}</div>
      <div className="device-detail">Type: {device.category}</div>
      <div className="device-detail">MAC: {device.mac}</div>
      <div className="device-detail">Owner: {device.owner}</div>
      <div className="device-card-info-row">
        <span>
          IP Address:{" "}
          <span className="device-link">{device.ip}</span>
        </span>
        <span>
          Connected:{" "}
          <span className="device-link">{device.lastUsageDate}</span>
        </span>
        <span>
          Data Usage:{" "}
          <span className="device-link">{device.dataUsage}</span>
        </span>
      </div>
    </div>
    <div className="device-card-actions">
      {canEdit && (
        <Button
          variant="primary"
          onClick={() => onEdit(device)}
          aria-label={`Edit ${device.name}`}
          disabled={disconnectingDeviceId === device.id}
          title="Edit device name, type, and MAC address"
        >
          Edit
        </Button>
      )}
      <Button
        variant="danger"
        onClick={() => onDisconnect(device)}
        aria-label={`Disconnect ${device.name}`}
        disabled={!device.online}
        loading={disconnectingDeviceId === device.id}
        title={!device.online ? "Device is already offline" : "Disconnect device from network"}
      >
        Disconnect
      </Button>
    </div>
  </div>
), (prevProps, nextProps) => {
  return (
    prevProps.device.id === nextProps.device.id &&
    prevProps.device.online === nextProps.device.online &&
    prevProps.device.name === nextProps.device.name &&
    prevProps.device.mac === nextProps.device.mac &&
    prevProps.device.category === nextProps.device.category &&
    prevProps.canEdit === nextProps.canEdit &&
    prevProps.disconnectingDeviceId === nextProps.disconnectingDeviceId
  );
});

DeviceCard.displayName = 'DeviceCard';

const DeviceList = () => {
  const { hasPermission } = usePermissions();
  const { isLoading } = useLoading();
  const { currentSegment } = useSegment();
  const { canBulkAddHumanDevices, canBulkAddOtherDevices } = useBulkOperations();

  const [devices, setDevices] = useState([]);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkImportType, setBulkImportType] = useState(null); // 'humanDevices' or 'otherDevices'
  const [initialLoad, setInitialLoad] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [disconnectingDeviceId, setDisconnectingDeviceId] = useState(null);

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
  const allowHuman = segmentDeviceConfig.allowHuman ?? false;
  const allowNonHuman = segmentDeviceConfig.allowNonHuman ?? false;
  const allowDeviceEdit = segmentDeviceConfig.allowDeviceEdit ?? false;
  const showRegisterDevice = allowHuman || allowNonHuman;

  const hasDevicePermission = hasPermission('canManageDevices');
  const canRegisterDevice = hasDevicePermission && showRegisterDevice;
  const canEditDevice = hasDevicePermission && allowDeviceEdit;

  const segmentUsers = useMemo(() => {
    return (userSampleData.users || []).filter(user => user.segment === segmentFilter);
  }, [segmentFilter]);

  const segmentUserIds = useMemo(() => {
    return new Set(segmentUsers.map(user => user.id));
  }, [segmentUsers]);

  const deviceFilterFunction = useCallback((device, { searchTerm = '', typeFilter = 'all', statusFilter = 'all' }) => {
    if (!segmentUserIds.has(device.userId)) return false;
    if (typeFilter && typeFilter !== "all" && device.type !== typeFilter) return false;
    if (statusFilter === "online" && !device.online) return false;
    if (statusFilter === "blocked" && device.blocked !== true) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (
        !(
          device.name.toLowerCase().includes(searchLower) ||
          device.mac.toLowerCase().includes(searchLower) ||
          device.owner.toLowerCase().includes(searchLower)
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

  const typeFilter = filters.typeFilter || "all";
  const statusFilter = filters.statusFilter || "all";

  const segmentDeviceStats = useMemo(() => {
    const segmentDevices = devices.filter(device => segmentUserIds.has(device.userId));
    const onlineDevices = segmentDevices.filter(d => d.online).length;
    const offlineDevices = segmentDevices.filter(d => !d.online).length;

    return [
      {
        label: "Total Devices",
        value: segmentDevices.length,
        Icon: FaDesktop,
        colorClass: "stat-blue"
      },
      {
        label: "Online Now",
        value: onlineDevices,
        Icon: FaGlobeAmericas,
        colorClass: "stat-green"
      },
      {
        label: "Offline",
        value: offlineDevices,
        Icon: FaBan,
        colorClass: "stat-gray"
      },
      {
        label: "Access Points",
        value: siteConfig.devices.accessPoints,
        Icon: FaWifi,
        colorClass: "stat-yellow"
      }
    ];
  }, [devices, segmentUserIds]);

  const deviceTypes = useMemo(() => [
    { value: "all", label: "All Device Types" },
    { value: "mobile", label: "Mobile" },
    { value: "laptop", label: "Laptop" }
  ], []);

  const statusOptions = useMemo(() => [
    { value: "all", label: "All Status" },
    { value: "online", label: "Online" },
    { value: "blocked", label: "Blocked" }
  ], []);

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
          ownerSegment: owner?.segment || 'unknown'
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
  }, [typeFilter, statusFilter, searchTerm, rowsPerPage, segmentFilter, resetToPage1]);

  const handleDeviceSubmit = useCallback(async (deviceInfo) => {
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
          type: deviceInfo.deviceCategory.toLowerCase().includes('mobile') || deviceInfo.deviceCategory.toLowerCase().includes('tablet') || deviceInfo.deviceCategory.toLowerCase().includes('phone') ? 'mobile' : 'laptop',
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
          type: deviceInfo.deviceCategory.toLowerCase().includes('mobile') || deviceInfo.deviceCategory.toLowerCase().includes('tablet') || deviceInfo.deviceCategory.toLowerCase().includes('phone') ? 'mobile' : 'laptop',
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

  const handleDisconnectDevice = useCallback(async (device) => {
    if (!device.online) {
      notifications.showInfo(`${device.name} is already offline`);
      return;
    }

    if (!window.confirm(`Are you sure you want to disconnect ${device.name} from the network?`)) {
      return;
    }

    setDisconnectingDeviceId(device.id);
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
          dev.id === device.id
            ? { ...dev, online: false, lastUsageDate: 'Just now' }
            : dev
        )
      );
      notifications.success(`${device.name} has been disconnected from the network`);
    } catch (error) {
      notifications.operationFailed(`disconnect ${device.name}`);
    } finally {
      setDisconnectingDeviceId(null);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      notifications.showInfo(`Searching for: ${searchTerm}`);
    } else {
      notifications.showInfo("Enter search criteria");
    }
  }, [searchTerm]);

  const handleRegisterDeviceClick = useCallback(() => {
    if (!hasDevicePermission) {
      notifications.noPermission("register devices");
      return;
    }

    if (!showRegisterDevice) {
      notifications.showError(`Device registration is not available for ${segmentFilter} segment.`);
      return;
    }

    setEditingDevice(null);
    setShowDeviceModal(true);
  }, [hasDevicePermission, showRegisterDevice, segmentFilter]);

  const handleEditDevice = useCallback((device) => {
    if (!hasDevicePermission) {
      notifications.noPermission("edit devices");
      return;
    }

    if (!allowDeviceEdit) {
      notifications.showError(`Device editing is not available for ${segmentFilter} segment.`);
      return;
    }

    setEditingDevice(device);
    setShowDeviceModal(true);
  }, [hasDevicePermission, allowDeviceEdit, segmentFilter]);

  /**
   * Handle bulk import of devices
   */
  const handleBulkImportDevices = useCallback((importedDevices) => {
    try {
      const isHumanDevice = bulkImportType === 'humanDevices';

      // Generate new device entries
      const newDevices = importedDevices.map((deviceData, index) => {
        if (isHumanDevice) {
          // Human device mapping
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
            deviceType: 'human',
            assignedUserId: deviceData.assignedUserId,
            priority: deviceData.priority || 'medium',
            notes: deviceData.notes || ''
          };
        } else {
          // Other device mapping
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
            deviceType: 'other',
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
      const deviceTypeLabel = isHumanDevice ? 'human device' : 'other device';
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
   * Open bulk import modal for human devices
   */
  const handleBulkImportHumanDevices = useCallback(() => {
    if (!hasDevicePermission) {
      notifications.noPermission("import devices");
      return;
    }

    if (!canBulkAddHumanDevices) {
      notifications.showError(`Bulk import of human devices is not available for ${segmentFilter} segment.`);
      return;
    }

    setBulkImportType('humanDevices');
    setShowBulkImportModal(true);
  }, [hasDevicePermission, canBulkAddHumanDevices, segmentFilter]);

  /**
   * Open bulk import modal for other devices
   */
  const handleBulkImportOtherDevices = useCallback(() => {
    if (!hasDevicePermission) {
      notifications.noPermission("import devices");
      return;
    }

    if (!canBulkAddOtherDevices) {
      notifications.showError(`Bulk import of other devices is not available for ${segmentFilter} segment.`);
      return;
    }

    setBulkImportType('otherDevices');
    setShowBulkImportModal(true);
  }, [hasDevicePermission, canBulkAddOtherDevices, segmentFilter]);

  if (initialLoad) {
    return (
      <main className="device-mgmt-main">
        <h1 className="device-mgmt-title">Device Management</h1>
        
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
        message="Processing devices..."
        fullPage={false}
      />

      <h1 className="device-mgmt-title" style={{ marginBottom: '1.5rem' }}>Device Management</h1>

      <div className="device-summary-cards">
        {segmentDeviceStats.map(stat => (
          <SummaryCard key={stat.label} stat={stat} />
        ))}
      </div>

      <DeviceToolbar
        searchValue={searchTerm}
        onSearchChange={e => setSearchTerm(e.target.value)}
        typeFilter={typeFilter}
        onTypeChange={e => setFilter('typeFilter', e.target.value)}
        statusFilter={statusFilter}
        onStatusChange={e => setFilter('statusFilter', e.target.value)}
        onRegisterDevice={handleRegisterDeviceClick}
        disableRegisterDevice={!canRegisterDevice || isLoading('devices') || submitting}
        onBulkImportHuman={canBulkAddHumanDevices ? handleBulkImportHumanDevices : undefined}
        disableBulkImportHuman={!hasDevicePermission || isLoading('devices') || submitting}
        onBulkImportOther={canBulkAddOtherDevices ? handleBulkImportOtherDevices : undefined}
        disableBulkImportOther={!hasDevicePermission || isLoading('devices') || submitting}
        deviceTypes={deviceTypes}
        statusOptions={statusOptions}
        segment={segmentFilter}
      />

      <div className="device-card-list">
        {pagedDevices.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px", 
            color: "#666",
            gridColumn: "1 / -1",
            fontSize: "1.1rem"
          }}>
            No devices found for this segment.
          </div>
        ) : (
          pagedDevices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              onEdit={handleEditDevice}
              onDisconnect={handleDisconnectDevice}
              canEdit={canEditDevice}
              disconnectingDeviceId={disconnectingDeviceId}
            />
          ))
        )}
      </div>

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
    </main>
  );
};

export default DeviceList;