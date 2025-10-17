// src/components/Sidebar.js

import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaWifi,
  FaFileAlt,
  FaBook,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Permissions } from "../utils/accessLevels";
import { preloadRoute } from "../config/routes"; // ✅ Import preload function
import logoMark from "../assets/images/spectra-logo-white.png";
import "./Sidebar.css";

const sidebarItems = [
  { 
    to: "/dashboard", 
    icon: FaTachometerAlt, 
    label: "Dashboard", 
    aria: "Dashboard",
    permission: "canViewReports"
  },
  { 
    to: "/users", 
    icon: FaUsers, 
    label: "User Management", 
    aria: "User Management",
    permission: "canEditUsers"
  },
  { 
    to: "/devices", 
    icon: FaWifi, 
    label: "Device Management", 
    aria: "Device Management",
    permission: "canManageDevices"
  },
  { 
    to: "/reports", 
    icon: FaFileAlt, 
    label: "Reporting", 
    aria: "Reporting",
    permission: "canViewReports"
  },
  { 
    to: "/knowledge", 
    icon: FaBook, 
    label: "Knowledge Center", 
    aria: "Knowledge Center",
    permission: "canViewReports"
  },
];

const Sidebar = () => {
  const { currentUser } = useAuth();
  const rolePermissions = Permissions[currentUser.accessLevel]?.[currentUser.role] || {};

  // Filter sidebar items based on permissions
  const accessibleItems = sidebarItems.filter(item => {
    if (!item.permission) return true;
    return rolePermissions[item.permission] === true;
  });

  // ✅ Preload route on hover for instant navigation
  const handleMouseEnter = (path) => {
    preloadRoute(path);
  };

  // If no accessible items, show minimal sidebar
  if (accessibleItems.length === 0) {
    return (
      <aside className="sidebar" role="complementary" aria-label="Sidebar navigation">
        <div className="sidebar-logo-area">
          <img
            src={logoMark}
            alt="Spectra mark"
            className="sidebar-logo-img"
            draggable={false}
          />
        </div>
        <nav aria-label="Main Navigation">
          <ul className="sidebar-nav">
            <li className="sidebar-nav-li sidebar-no-access">
              <div className="sidebar-nav-item">
                <span className="sidebar-nav-label">No Access</span>
              </div>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="sidebar" role="complementary" aria-label="Sidebar navigation">
      <div className="sidebar-logo-area">
        <img
          src={logoMark}
          alt="Spectra mark"
          className="sidebar-logo-img"
          draggable={false}
        />
      </div>
      <nav aria-label="Main Navigation">
        <ul className="sidebar-nav">
          {accessibleItems.map(({ to, icon: Icon, label, aria }) => (
            <li key={to} className="sidebar-nav-li">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  "sidebar-nav-item" + (isActive ? " active-link" : "")
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                aria-label={aria}
                onMouseEnter={() => handleMouseEnter(to)} // ✅ Preload on hover
                onFocus={() => handleMouseEnter(to)} // ✅ Preload on focus
              >
                <span className="sidebar-nav-icon">
                  <Icon />
                </span>
                <span className="sidebar-nav-label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;