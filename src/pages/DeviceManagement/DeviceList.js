// src/pages/DeviceManagement/DeviceList.js

import React, { useState, useMemo, useEffect } from "react";
import { FaDesktop, FaGlobeAmericas, FaBan, FaWifi, FaMobileAlt, FaLaptop, FaTablet } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Permissions } from "../../utils/accessLevels";
import { useLoading } from "../../context/LoadingContext";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import DeviceFormModal from "../../components/DeviceFormModal";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import SkeletonLoader from "../../components/Loading/SkeletonLoader";
import { toast } from "react-toastify";
import "./DeviceList.css";
import { PAGINATION } from "../../constants/appConstants";
import SEGMENT_DEVICE_AVAILABILITY from "../../config/segmentDeviceConfig";
import sampleDevices from "../../constants/sampleDevices";
import sampleUsers from "../../constants/sampleUsers";
import siteConfig from "../../config/siteConfig";

const getDeviceIcon = (category) => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('tablet')) return FaTablet;
  if (categoryLower.includes('phone') || categoryLower.includes('mobile')) return FaMobileAlt;
  return FaLaptop;
};

const DeviceList = () => {
  const { currentUser } = useAuth();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const rolePermissions = Permissions[currentUser.accessLevel]?.[currentUser.role] || {};

  const [devices, setDevices] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PAGINATION.DEVICE_LIST_DEFAULT);
  const [initialLoad, setInitialLoad] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [blockingDeviceId, setBlockingDeviceId] = useState(null);
  const [viewingDeviceId, setViewingDeviceId] = useState(null);
  
  const [segmentFilter, setSegmentFilter] = useState("enterprise");
  
  const segmentDeviceConfig = SEGMENT_DEVICE_AVAILABILITY[segmentFilter] || {};
  const allowHuman = segmentDeviceConfig.allowHuman ?? false;
  const allowNonHuman = segmentDeviceConfig.allowNonHuman ?? false;
  const showRegisterDevice = allowHuman || allowNonHuman;
  
  const hasDevicePermission = rolePermissions.canManageDevices === true;
  
  const canRegisterDevice = hasDevicePermission && showRegisterDevice;

  // Enrich devices with owner information from users
  const enrichedDevices = useMemo(() => {
    return sampleDevices.map(device => {
      const owner = sampleUsers.find(user => user.id === device.userId);
      return {
        ...device,
        Icon: getDeviceIcon(device.category),
        owner: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'
      };
    });
  }, []);

  // Device statistics from siteConfig
  const deviceStats = [
    {
      label: "Total Devices",
      value: siteConfig.devices.totalDevices,
      Icon: FaDesktop,
      colorClass: "stat-blue"
    },
    {
      label: "Online Now",
      value: siteConfig.devices.onlineDevices,
      Icon: FaGlobeAmericas,
      colorClass: "stat-green"
    },
    {
      label: "Blocked",
      value: siteConfig.devices.blockedDevices,
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

  const loadDevices = async () => {
    startLoading('devices');
    try {
      timeoutId = setTimeout(() => {
        if (mounted) {
          setDevices(enrichedDevices);
          stopLoading('devices');
          setInitialLoad(false);
        }
      }, 700);
    } catch (error) {
      if (mounted) {
        toast.error("Failed to load devices");
        stopLoading('devices');
        setInitialLoad(false);
      }
    }
  };

  loadDevices();

  return () => {
    mounted = false;
    if (timeoutId) clearTimeout(timeoutId);
  };
}, [enrichedDevices, startLoading, stopLoading]);

  const filteredDevices = useMemo(() => {
    return devices.filter(dev => {
      if (typeFilter !== "all" && dev.type !== typeFilter) return false;
      if (statusFilter === "online" && !dev.online) return false;
      if (statusFilter === "blocked" && dev.blocked !== true) return false;
      if (
        searchText &&
        !(
          dev.name.toLowerCase().includes(searchText.toLowerCase()) ||
          dev.mac.toLowerCase().includes(searchText.toLowerCase()) ||
          dev.owner.toLowerCase().includes(searchText.toLowerCase())
        )
      )
        return false;
      return true;
    });
  }, [devices, typeFilter, statusFilter, searchText]);

  const pagedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredDevices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDevices, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, statusFilter, searchText, rowsPerPage]);

  const handleDeviceSubmit = async (deviceInfo) => {
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newDevice = {
        id: `dev${devices.length + 1}`.padStart(6, '0'),
        userId: deviceInfo.mode === 'bindUser' ? deviceInfo.userId : 'system',
        name: deviceInfo.deviceName,
        type: deviceInfo.deviceCategory.toLowerCase().includes('mobile') ? 'mobile' : 'laptop',
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
      toast.success(`Device "${deviceInfo.deviceName}" registered successfully`);
      setShowDeviceModal(false);
    } catch (error) {
      toast.error("Failed to register device");
    } finally {
      setSubmitting(false);
    }
  };

const handleBlockDevice = async (device) => {
  if (device.blocked) {
    toast.info(`${device.name} is already blocked`);
    return;
  }

  if (!window.confirm(`Are you sure you want to block ${device.name}?`)) {
    return;
  }

  setBlockingDeviceId(device.id);
  let timeoutId = null;
  try {
    await new Promise(resolve => {
      timeoutId = setTimeout(resolve, 600);
    });
    
    setDevices(prev => 
      prev.map(dev => 
        dev.id === device.id 
          ? { ...dev, blocked: true, online: false } 
          : dev
      )
    );
    toast.warn(`${device.name} has been blocked`);
  } catch (error) {
    toast.error(`Failed to block ${device.name}`);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    setBlockingDeviceId(null);
  }
};

  const handleSearch = () => {
    if (searchText.trim()) {
      toast.info(`Searching for: ${searchText}`);
    } else {
      toast.info("Enter search criteria");
    }
  };
  
   const handleViewDetails = async (device) => {
    setViewingDeviceId(device.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      toast.info(`Viewing details for ${device.name}`);
    } catch (error) {
      toast.error("Failed to load device details");
    } finally {
      setViewingDeviceId(null);
    }
  };

  const handleRegisterDeviceClick = () => {
    if (!hasDevicePermission) {
      toast.error("You don't have permission to register devices. Please contact your administrator.");
      return;
    }
    
    if (!showRegisterDevice) {
      toast.error(`Device registration is not available for ${segmentFilter} segment.`);
      return;
    }
    
    setShowDeviceModal(true);
  };

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
          onChange={(e) => setSegmentFilter(e.target.value)}
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

      <h1 className="device-mgmt-title">Device Management</h1>

      <div className="device-summary-cards">
        {deviceStats.map(stat => (
          <div className={`device-summary-card ${stat.colorClass}`} key={stat.label}>
            <div className="devsc-toprow">
              <div className="devsc-title">{stat.label}</div>
              <stat.Icon className="devsc-icon" />
            </div>
            <div className="devsc-valuecard">
              <span className="devsc-value">{stat.value.toLocaleString()}</span>
              {stat.label === "Online Now" &&
                <span className="devsc-dot green"></span>}
              {stat.label === "Blocked" &&
                <span className="devsc-dot red"></span>}
            </div>
          </div>
        ))}
      </div>

      <div className="device-mgmt-toolbar">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
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
          onChange={e => setStatusFilter(e.target.value)}
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
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
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
            No devices found matching your filters.
          </div>
        ) : (
          pagedDevices.map(device => (
            <div className="device-card" key={device.id}>
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
                  onClick={() => handleViewDetails(device)}
                  aria-label={`View details for ${device.name}`}
                  loading={viewingDeviceId === device.id}
                  disabled={blockingDeviceId === device.id}
                >
                  Details
                </Button>
                <Button 
                  variant="danger"
                  onClick={() => handleBlockDevice(device)}
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
          users={sampleUsers}
          devices={devices}
          segment={segmentFilter}
          siteUserList={sampleUsers}
          submitting={submitting}
        />
      )}
    </main>
  );
};

export default DeviceList;