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
import logoMark from "../assets/images/spectra-logo-white.png"; // update path as needed
import "./Sidebar.css";

const sidebarItems = [
  { to: "/dashboard", icon: FaTachometerAlt, label: "Dashboard", aria: "Dashboard" },
  { to: "/users", icon: FaUsers, label: "User Management", aria: "User Management" },
  { to: "/devices", icon: FaWifi, label: "Device Management", aria: "Device Management" },
  { to: "/reports", icon: FaFileAlt, label: "Reporting", aria: "Reporting" },
  { to: "/knowledge", icon: FaBook, label: "Knowledge Center", aria: "Knowledge Center" },
];

const Sidebar = () => (
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
        {sidebarItems.map(({ to, icon: Icon, label, aria }) => (
          <li key={to} className="sidebar-nav-li">
            <NavLink
              to={to}
              className={({ isActive }) =>
                "sidebar-nav-item" + (isActive ? " active-link" : "")
              }
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              aria-label={aria}
            >
              <span className={`sidebar-nav-icon${window.location.pathname === to ? " icon-active" : ""}`}>
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

export default Sidebar;
