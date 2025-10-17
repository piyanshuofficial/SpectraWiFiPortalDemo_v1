// src/pages/DeviceManagement/DeviceList.js

import React, { useState, useMemo, useEffect } from "react";
import { FaDesktop, FaGlobeAmericas, FaBan, FaWifi, FaMobileAlt, FaLaptop } from "react-icons/fa";
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

const deviceStats = [
  {
    label: "Total Devices",
    value: 3892,
    Icon: FaDesktop,
    colorClass: "stat-blue"
  },
  {
    label: "Online Now",
    value: 2145,
    Icon: FaGlobeAmericas,
    colorClass: "stat-green"
  },
  {
    label: "Blocked",
    value: 23,
    Icon: FaBan,
    colorClass: "stat-red"
  },
  {
    label: "Access Points",
    value: 48,
    Icon: FaWifi,
    colorClass: "stat-yellow"
  }
];

const deviceTypes = [
  { value: "all", label: "All Device Types" },
  { value: "mobile", label: "Mobile" },
  { value: "laptop", label: "Laptop" }
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "online", label: "Online" },
  { value: "blocked", label: "Blocked" }
];

const initialDevices = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    type: "mobile",
    Icon: FaMobileAlt,
    mac: "00:1B:44:11:3A:B7",
    owner: "Amit Sharma",
    ip: "192.168.1.142",
    ago: "2 hours ago",
    usage: "245 MB",
    online: true
  },
  {
    id: 2,
    name: "MacBook Air",
    type: "laptop",
    Icon: FaLaptop,
    mac: "00:1B:44:11:3A:C8",
    owner: "Neeta Singh",
    ip: "192.168.1.156",
    ago: "1 hour ago",
    usage: "1.2 GB",
    online: true
  },
  {
    id: 3,
    name: "iPhone 13",
    type: "mobile",
    Icon: FaMobileAlt,
    mac: "00:1B:44:11:3A:B8",
    owner: "Rajesh Kumar",
    ip: "192.168.1.143",
    ago: "3 hours ago",
    usage: "189 MB",
    online: false
  },
  {
    id: 4,
    name: "Dell XPS 15",
    type: "laptop",
    Icon: FaLaptop,
    mac: "00:1B:44:11:3A:C9",
    owner: "Vikram Chatterjee",
    ip: "192.168.1.157",
    ago: "30 minutes ago",
    usage: "890 MB",
    online: true
  },
  {
    id: 5,
    name: "Samsung Galaxy S22",
    type: "mobile",
    Icon: FaMobileAlt,
    mac: "00:1B:44:11:3A:B9",
    owner: "Divya Nair",
    ip: "192.168.1.144",
    ago: "5 hours ago",
    usage: "567 MB",
    online: false
  },
  {
    id: 6,
    name: "HP Pavilion",
    type: "laptop",
    Icon: FaLaptop,
    mac: "00:1B:44:11:3A:D0",
    owner: "Sanjay Rao",
    ip: "192.168.1.158",
    ago: "15 minutes ago",
    usage: "2.1 GB",
    online: true,
    blocked: true
  },
  {
    id: 7,
    name: "iPad Pro",
    type: "mobile",
    Icon: FaMobileAlt,
    mac: "00:1B:44:11:3A:C0",
    owner: "Rahul Desai",
    ip: "192.168.1.145",
    ago: "45 minutes ago",
    usage: "432 MB",
    online: true
  },
  {
    id: 8,
    name: "Lenovo ThinkPad",
    type: "laptop",
    Icon: FaLaptop,
    mac: "00:1B:44:11:3A:D1",
    owner: "Amit Sharma",
    ip: "192.168.1.159",
    ago: "10 minutes ago",
    usage: "1.5 GB",
    online: true
  },
  {
    id: 9,
    name: "iPhone 12 Mini",
    type: "mobile",
    Icon: FaMobileAlt,
    mac: "00:1B:44:11:3A:C1",
    owner: "Neeta Singh",
    ip: "192.168.1.146",
    ago: "6 hours ago",
    usage: "234 MB",
    online: false
  },
  {
    id: 10,
    name: "MacBook Pro 16",
    type: "laptop",
    Icon: FaLaptop,
    mac: "00:1B:44:11:3A:D2",
    owner: "Rajesh Kumar",
    ip: "192.168.1.160",
    ago: "20 minutes ago",
    usage: "3.2 GB",
    online: true
  },
  {
    id: 11,
    name: "Google Pixel 7",
    type: "mobile",
    Icon: FaMobileAlt,
    mac: "00:1B:44:11:3A:C2",
    owner: "Vikram Chatterjee",
    ip: "192.168.1.147",
    ago: "4 hours ago",
    usage: "345 MB",
    online: false
  },
  {
    id: 12,
    name: "Asus ROG",
    type: "laptop",
    Icon: FaLaptop,
    mac: "00:1B:44:11:3A:D3",
    owner: "Divya Nair",
    ip: "192.168.1.161",
    ago: "25 minutes ago",
    usage: "2.8 GB",
    online: true
  }
];

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
  
  //NEW: Segment selector for testing (matches UserList pattern)
  const [segmentFilter, setSegmentFilter] = useState("enterprise");
  
  //NEW: Check segment-specific device availability
  const segmentDeviceConfig = SEGMENT_DEVICE_AVAILABILITY[segmentFilter] || {};
  const allowHuman = segmentDeviceConfig.allowHuman ?? false;
  const allowNonHuman = segmentDeviceConfig.allowNonHuman ?? false;
  const showRegisterDevice = allowHuman || allowNonHuman;
  
  //NEW: Check user permissions
  const hasDevicePermission = rolePermissions.canManageDevices === true;
  
  //NEW: Final button state - both permission AND segment availability required
  const canRegisterDevice = hasDevicePermission && showRegisterDevice;

  // Load devices only once on mount
useEffect(() => {
  let mounted = true;
  let timeoutId = null;

  const loadDevices = async () => {
    startLoading('devices');
    try {
      timeoutId = setTimeout(() => {
        if (mounted) {
          setDevices(initialDevices);
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
}, []);

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
        id: devices.length + 1,
        name: deviceInfo.deviceName,
        type: deviceInfo.deviceCategory.toLowerCase().includes('mobile') ? 'mobile' : 'laptop',
        Icon: deviceInfo.deviceCategory.toLowerCase().includes('mobile') ? FaMobileAlt : FaLaptop,
        mac: deviceInfo.macAddress,
        owner: deviceInfo.mode === 'bindUser' ? deviceInfo.userId : 'System',
        ip: `192.168.1.${Math.floor(Math.random() * 200) + 1}`,
        ago: 'Just now',
        usage: '0 MB',
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
  
  //NEW: Handle button click with proper messaging
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

  // Show skeleton loader on initial load
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
        <SkeletonLoader variant="rect" height={40} style={{ marginBottom: '16px' }} />

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
      
      {/*NEW: Segment Selector (Testing Only) - Matches UserList pattern */}
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
              <span className="devsc-value">{stat.value}</span>
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
          className="device-mgmt-search-btn"
          onClick={handleSearch}
          aria-label="Execute search"
          disabled={isLoading('devices')}
        >
          Search
        </Button>
        
        {/*UPDATED: Register Device button with permission & segment checks */}
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

      <Pagination
        totalItems={filteredDevices.length}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
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
                    <span className="device-link">{device.ago}</span>
                  </span>
                  <span>
                    Data Usage:{" "}
                    <span className="device-link">{device.usage}</span>
                  </span>
                </div>
              </div>
              <div className="device-card-actions">
                <Button 
                  className="details-btn" 
                  variant="primary"
                  onClick={() => handleViewDetails(device)}
                  aria-label={`View details for ${device.name}`}
                  loading={viewingDeviceId === device.id}
                  disabled={blockingDeviceId === device.id}
                >
                  Details
                </Button>
                <Button 
                  className="block-btn" 
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

      {/*UPDATED: Pass segment to DeviceFormModal */}
      {showDeviceModal && (
        <DeviceFormModal
          open={showDeviceModal}
          onClose={() => setShowDeviceModal(false)}
          onSubmit={handleDeviceSubmit}
          users={[]}
          devices={devices}
          segment={segmentFilter}
          siteUserList={[]}
          submitting={submitting}
        />
      )}
    </main>
  );
};

export default DeviceList;