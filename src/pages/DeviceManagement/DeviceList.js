// src/pages/DeviceManagement/DeviceList.js

import React, { useState } from "react";
import { FaDesktop, FaGlobeAmericas, FaBan, FaWifi, FaMobileAlt, FaLaptop } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Permissions } from "../../utils/accessLevels";
import Button from "../../components/Button";
import DeviceFormModal from "../../components/DeviceFormModal"; // ✅ UPDATED IMPORT
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
  }
];

const DeviceList = () => {
  const { currentUser } = useAuth();
  const rolePermissions = Permissions[currentUser.accessLevel]?.[currentUser.role] || {};

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  if (!rolePermissions.canManageDevices) {
    return (
      <div style={{ padding: 20, color: "red" }} role="alert">
        You do not have permission to manage devices.
      </div>
    );
  }

  const filteredDevices = devices.filter(dev => {
    if (typeFilter !== "all" && dev.type !== typeFilter) return false;
    if (statusFilter === "online" && !dev.online) return false;
    if (statusFilter === "blocked" && dev.blocked !== true) return false;
    if (
      searchText &&
      !(
        dev.name.toLowerCase().includes(searchText.toLowerCase()) ||
        dev.mac.toLowerCase().includes(searchText.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const handleDeviceSubmit = (deviceInfo) => {
    toast.success(`Device "${deviceInfo.deviceName}" registered successfully`);
    setShowDeviceModal(false);
    // TODO: Backend integration - add device to list
  };

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
          placeholder="Search by MAC or device name..."
        />
        <Button 
          type="button" 
          className="device-mgmt-search-btn"
          onClick={() => toast.info("Search functionality ready for backend integration")}
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

      {/* Device Cards */}
      <div className="device-card-list">
        {filteredDevices.map(device => (
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
              <Button className="details-btn" variant="primary">
                Details
              </Button>
              <Button className="block-btn" variant="danger">
                Block
              </Button>
            </div>
            <span
              className={`device-status-dot ${device.online ? "online" : "offline"}`}
              title={device.online ? "Online" : "Offline"}
            ></span>
          </div>
        ))}
      </div>

      {/* ✅ UPDATED: Using unified DeviceFormModal */}
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