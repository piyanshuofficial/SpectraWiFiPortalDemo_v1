// src/components/Sidebar.js

import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserFriends,
  FaWifi,
  FaFileAlt,
  FaBook,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaHistory,
  FaCog,
  FaChartLine,
  FaTicketAlt,
  FaTasks,
  FaBell,
} from "react-icons/fa";
import { usePermissions } from "@hooks/usePermissions";
import { preloadRoute } from "@config/routes";
import { useTranslation } from "react-i18next";
import logoMark from "@assets/images/spectra-logo-white.png";
import "@components/Sidebar.css";

// Customer portal sidebar items with translation keys
const customerSidebarItems = [
  {
    to: "/dashboard",
    icon: FaTachometerAlt,
    labelKey: "nav.dashboard",
    label: "Dashboard",
    permission: "canViewReports"
  },
  {
    to: "/users",
    icon: FaUsers,
    labelKey: "nav.userManagement",
    label: "User Management",
    permission: "canEditUsers"
  },
  {
    to: "/devices",
    icon: FaWifi,
    labelKey: "nav.deviceManagement",
    label: "Device Management",
    permission: "canManageDevices"
  },
  {
    to: "/guests",
    icon: FaUserFriends,
    labelKey: "nav.guestManagement",
    label: "Guest Management",
    permission: "canEditUsers"
  },
  {
    to: "/reports",
    icon: FaFileAlt,
    labelKey: "nav.reporting",
    label: "Reports",
    permission: "canViewReports"
  },
  {
    to: "/knowledge",
    icon: FaBook,
    labelKey: "nav.knowledgeCenter",
    label: "Knowledge Center",
    permission: "canViewReports"
  },
  {
    to: "/logs",
    icon: FaClipboardList,
    labelKey: "nav.activityLogs",
    label: "Activity Logs",
    permission: "canViewLogs"
  },
];

// Internal portal sidebar items (no translation for internal portal)
const internalSidebarItems = [
  {
    to: "/internal/dashboard",
    icon: FaTachometerAlt,
    label: "Dashboard",
    permission: "canAccessInternalPortal"
  },
  {
    to: "/internal/sites",
    icon: FaMapMarkerAlt,
    label: "Sites",
    permission: "canAccessInternalPortal"
  },
  {
    to: "/internal/customers",
    icon: FaBuilding,
    label: "Customers",
    permission: "canAccessInternalPortal"
  },
  {
    to: "/internal/guests",
    icon: FaUserFriends,
    label: "Guest Access",
    permission: "canAccessInternalPortal"
  },
  {
    to: "/internal/reports",
    icon: FaChartLine,
    label: "Reports",
    permission: "canAccessInternalPortal"
  },
  {
    to: "/internal/support",
    icon: FaTicketAlt,
    label: "Support",
    permission: "canAccessInternalPortal"
  },
  {
    to: "/internal/alerts",
    icon: FaBell,
    label: "Alerts",
    permission: "canAccessInternalPortal"
  },
  {
    to: "/internal/bulk-operations",
    icon: FaTasks,
    label: "Bulk Operations",
    permission: "canAccessBulkOperations"
  },
  {
    to: "/internal/logs",
    icon: FaHistory,
    label: "Audit Logs",
    permission: "canAccessInternalPortal"
  },
  {
    to: "/internal/config",
    icon: FaCog,
    label: "Configuration",
    permission: "canAccessInternalPortal"
  },
  {
    to: "/internal/knowledge",
    icon: FaBook,
    label: "Knowledge Base",
    permission: "canAccessInternalPortal"
  },
];

const Sidebar = () => {
  const { hasPermission } = usePermissions();
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Determine if we're on internal portal routes
  const isInternalPortal = location.pathname.startsWith('/internal');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, isMobile]);

  // Select sidebar items based on portal type
  const sidebarItems = isInternalPortal ? internalSidebarItems : customerSidebarItems;

  const accessibleItems = sidebarItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const handleMouseEnter = (path) => {
    preloadRoute(path);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  if (accessibleItems.length === 0) {
    return (
      <>
        {isMobile && (
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        )}
        
        {mobileOpen && isMobile && (
          <div 
            className="sidebar-overlay" 
            onClick={closeMobileMenu}
            role="presentation"
            aria-hidden="true"
          />
        )}
        
        <aside 
          className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="sidebar-logo-area">
            <img
              src={logoMark}
              alt="Spectra logo"
              className="sidebar-logo-img"
              draggable={false}
            />
          </div>
          <nav aria-label="Main navigation">
            <ul className="sidebar-nav">
              <li className="sidebar-nav-li sidebar-no-access">
                <div className="sidebar-nav-item" role="status">
                  <span className="sidebar-nav-label">No Access</span>
                </div>
              </li>
            </ul>
          </nav>
        </aside>
      </>
    );
  }

  return (
    <>
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
      )}
      
      {mobileOpen && isMobile && (
        <div 
          className="sidebar-overlay" 
          onClick={closeMobileMenu}
          role="presentation"
          aria-hidden="true"
        />
      )}
      
      <aside
        className={`sidebar ${mobileOpen ? 'mobile-open' : ''} ${isInternalPortal ? 'internal-portal' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-logo-area">
          <img
            src={logoMark}
            alt="Spectra logo"
            className="sidebar-logo-img"
            draggable={false}
          />
        </div>
        <nav aria-label="Main navigation">
          <ul className="sidebar-nav">
            {accessibleItems.map(({ to, icon: Icon, labelKey, label }) => (
              <li key={to} className="sidebar-nav-li">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    "sidebar-nav-item" + (isActive ? " active-link" : "")
                  }
                  aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                  aria-label={labelKey ? t(labelKey) : label}
                  onMouseEnter={() => handleMouseEnter(to)}
                  onFocus={() => handleMouseEnter(to)}
                  onClick={closeMobileMenu}
                >
                  <span className="sidebar-nav-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="sidebar-nav-label">{labelKey ? t(labelKey) : label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;