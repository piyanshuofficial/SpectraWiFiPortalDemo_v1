// src/pages/DeviceManagement/DeviceList.js

import React, { useState, useMemo, useEffect } from "react";
import { FaDesktop, FaGlobeAmericas, FaBan, FaWifi, FaMobileAlt, FaLaptop } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Permissions } from "../../utils/accessLevels";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import DeviceFormModal from "../../components/DeviceFormModal";
import { toast } from "react-toastify";
import "./DeviceList.css";

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

const devices = [
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
  const rolePermissions = Permissions[currentUser.accessLevel]?.[currentUser.role] || {};

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  // Compute filtered devices - ALWAYS called, not conditional
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
  }, [typeFilter, statusFilter, searchText]);

  // Compute paged devices - ALWAYS called, not conditional
  const pagedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredDevices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDevices, currentPage, rowsPerPage]);

  // Reset to page 1 when filters change - ALWAYS called, not conditional
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, statusFilter, searchText, rowsPerPage]);

  const handleDeviceSubmit = (deviceInfo) => {
    toast.success(`Device "${deviceInfo.deviceName}" registered successfully`);
    setShowDeviceModal(false);
    // TODO: Backend integration - add device to list
  };

  // Early return AFTER all hooks have been called
  if (!rolePermissions.canManageDevices) {
    return (
      <div style={{ padding: 20, color: "red" }} role="alert">
        You do not have permission to manage devices.
      </div>
    );
  }

  return (
    <main className="device-mgmt-main">
      <h1 className="device-mgmt-title">Device Management</h1>

      {/* Stats / Summary Cards */}
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

      {/* Filters/Toolbar */}
      <div className="device-mgmt-toolbar">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="device-mgmt-select"
          aria-label="Filter by device type"
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
        />
        <Button 
          type="button" 
          className="device-mgmt-search-btn"
          onClick={() => toast.info("Search functionality ready for backend integration")}
          aria-label="Execute search"
        >
          Search
        </Button>
        <Button
          variant="primary"
          onClick={() => setShowDeviceModal(true)}
          aria-label="Register New Device"
          style={{ marginLeft: "auto" }}
        >
          Register Device
        </Button>
      </div>

      {/* Pagination Controls - Top */}
      <Pagination
        totalItems={filteredDevices.length}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />

      {/* Device Cards */}
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
                  onClick={() => toast.info(`Viewing details for ${device.name}`)}
                  aria-label={`View details for ${device.name}`}
                >
                  Details
                </Button>
                <Button 
                  className="block-btn" 
                  variant="danger"
                  onClick={() => toast.warn(`Blocking ${device.name}`)}
                  aria-label={`Block ${device.name}`}
                  disabled={device.blocked}
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

      {/* Pagination Controls - Bottom */}
      {filteredDevices.length > 0 && (
        <Pagination
          totalItems={filteredDevices.length}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      )}

      {/* Device Registration Modal */}
      {showDeviceModal && (
        <DeviceFormModal
          open={showDeviceModal}
          onClose={() => setShowDeviceModal(false)}
          onSubmit={handleDeviceSubmit}
        />
      )}
    </main>
  );
};

export default DeviceList;