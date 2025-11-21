// src/pages/DeviceManagement/DeviceList.js

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FaDesktop, FaGlobeAmericas, FaBan, FaWifi, FaMobileAlt, FaLaptop, FaTablet } from "react-icons/fa";
import { usePermissions } from "../../hooks/usePermissions";
import { useFilter } from "../../hooks/useFilter";
import { useTableState } from "../../hooks/useTableState";
import { useLoading } from "../../context/LoadingContext";
import { useSegment } from "../../context/SegmentContext";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import DeviceFormModal from "../../components/DeviceFormModal";
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
  onViewDetails, 
  onBlock,
  viewingDeviceId,
  blockingDeviceId
}) => (
  <div className="device-card">
    <div className="device-icon-bg">
      <device.Icon className="device-main-icon" />
    </div>
    <div className="device-meta-col">
      <div className="device-card-title">{device.name}</div>
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
      <Button 
        variant="info"
        onClick={() => onViewDetails(device)}
        aria-label={`View details for ${device.name}`}
        loading={viewingDeviceId === device.id}
        disabled={blockingDeviceId === device.id}
      >
        Details
      </Button>
      <Button 
        variant="danger"
        onClick={() => onBlock(device)}
        aria-label={`Block ${device.name}`}
        disabled={device.blocked || viewingDeviceId === device.id}
        loading={blockingDeviceId === device.id}
      >
        {device.blocked ? "Blocked" : "Block"}
      </Button>
    </div>
    <span
      className={`device-status-dot ${device.online ? "online" : "offline"}`}
      title={device.online ? "Online" : "Offline"}
      aria-label={device.online ? "Device is online" : "Device is offline"}
    ></span>
  </div>
), (prevProps, nextProps) => {
  return (
    prevProps.device.id === nextProps.device.id &&
    prevProps.device.blocked === nextProps.device.blocked &&
    prevProps.device.online === nextProps.device.online &&
    prevProps.device.name === nextProps.device.name &&
    prevProps.viewingDeviceId === nextProps.viewingDeviceId &&
    prevProps.blockingDeviceId === nextProps.blockingDeviceId
  );
});

DeviceCard.displayName = 'DeviceCard';

const DeviceList = () => {
  const { hasPermission } = usePermissions();
  const { isLoading } = useLoading();
  const { currentSegment, updateSegment } = useSegment();

  const [devices, setDevices] = useState([]);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [blockingDeviceId, setBlockingDeviceId] = useState(null);
  const [viewingDeviceId, setViewingDeviceId] = useState(null);

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
  const showRegisterDevice = allowHuman || allowNonHuman;
  
  const hasDevicePermission = hasPermission('canManageDevices');
  const canRegisterDevice = hasDevicePermission && showRegisterDevice;

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
    const blockedDevices = segmentDevices.filter(d => d.blocked).length;
    
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
        label: "Blocked",
        value: blockedDevices,
        Icon: FaBan,
        colorClass: "stat-red"
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
      setShowDeviceModal(false);
    } catch (error) {
      notifications.operationFailed("register device");
    } finally {
      setSubmitting(false);
    }
  }, [devices.length]);

  const handleBlockDevice = useCallback(async (device) => {
    if (device.blocked) {
      notifications.deviceAlreadyBlocked(device.name);
      return;
    }

    if (!window.confirm(`Are you sure you want to block ${device.name}?`)) {
      return;
    }

    setBlockingDeviceId(device.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setDevices(prev => 
        prev.map(dev => 
          dev.id === device.id 
            ? { ...dev, blocked: true, online: false } 
            : dev
        )
      );
      notifications.deviceBlocked(device.name);
    } catch (error) {
      notifications.operationFailed(`block ${device.name}`);
    } finally {
      setBlockingDeviceId(null);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      notifications.showInfo(`Searching for: ${searchTerm}`);
    } else {
      notifications.showInfo("Enter search criteria");
    }
  }, [searchTerm]);
  
  const handleViewDetails = useCallback(async (device) => {
    setViewingDeviceId(device.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      notifications.showInfo(`Viewing details for ${device.name}`);
    } catch (error) {
      notifications.operationFailed("load device details");
    } finally {
      setViewingDeviceId(null);
    }
  }, []);

  const handleRegisterDeviceClick = useCallback(() => {
    if (!hasDevicePermission) {
      notifications.noPermission("register devices");
      return;
    }
    
    if (!showRegisterDevice) {
      notifications.showError(`Device registration is not available for ${segmentFilter} segment.`);
      return;
    }
    
    setShowDeviceModal(true);
  }, [hasDevicePermission, showRegisterDevice, segmentFilter]);

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
      
      <div className="segment-selector-test">
        <label htmlFor="segment-test-select">Segment:</label>
        <select
          id="segment-test-select"
          value={segmentFilter}
          onChange={(e) => updateSegment(e.target.value)}
          className="segment-test-dropdown"
          disabled={isLoading('devices')}
        >
          <option value="enterprise">Enterprise</option>
          <option value="coLiving">Co-Living</option>
          <option value="coWorking">Co-Working</option>
          <option value="hotel">Hotel</option>
          <option value="pg">PG</option>
          <option value="miscellaneous">Miscellaneous</option>
        </select>
      </div>

      <h1 className="device-mgmt-title" style={{ marginBottom: '1.5rem' }}>Device Management</h1>

      <div className="device-summary-cards">
        {segmentDeviceStats.map(stat => (
          <SummaryCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="device-mgmt-toolbar">
        <select
          value={typeFilter}
          onChange={e => setFilter('typeFilter', e.target.value)}
          className="device-mgmt-select"
          aria-label="Filter by device type"
          disabled={isLoading('devices')}
        >
          {deviceTypes.map(t => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setFilter('statusFilter', e.target.value)}
          className="device-mgmt-select"
          aria-label="Filter by device status"
          disabled={isLoading('devices')}
        >
          {statusOptions.map(s => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          className="device-mgmt-search"
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by name, MAC, or owner..."
          aria-label="Search devices"
          disabled={isLoading('devices')}
        />
        <Button 
          type="button" 
          variant="secondary"
          onClick={handleSearch}
          aria-label="Execute search"
          disabled={isLoading('devices')}
        >
          Search
        </Button>
        
        <Button
          variant="primary"
          onClick={handleRegisterDeviceClick}
          aria-label={
            !hasDevicePermission 
              ? "Register Device - Permission Required" 
              : !showRegisterDevice 
              ? "Register Device - Not Available for This Segment"
              : "Register New Device"
          }
          title={
            !hasDevicePermission 
              ? "You need device management permissions to register devices" 
              : !showRegisterDevice 
              ? `Device registration is not available for ${segmentFilter} segment`
              : "Register a new device"
          }
          style={{ marginLeft: "auto" }}
          disabled={!canRegisterDevice || isLoading('devices') || submitting}
        >
          Register Device
        </Button>
      </div>

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
              onViewDetails={handleViewDetails}
              onBlock={handleBlockDevice}
              viewingDeviceId={viewingDeviceId}
              blockingDeviceId={blockingDeviceId}
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
          onClose={() => setShowDeviceModal(false)}
          onSubmit={handleDeviceSubmit}
          users={segmentUsers}
          devices={devices}
          segment={segmentFilter}
          siteUserList={segmentUsers}
          submitting={submitting}
        />
      )}
    </main>
  );
};

export default DeviceList;