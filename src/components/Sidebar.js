// src/components/Sidebar.js

import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaWifi,
  FaFileAlt,
  FaBook,
  FaClipboardList,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { usePermissions } from "@hooks/usePermissions";
import { preloadRoute } from "@config/routes";
import { useTranslation } from "react-i18next";
import logoMark from "@assets/images/spectra-logo-white.png";
import "@components/Sidebar.css";

// Sidebar items with translation keys
const sidebarItems = [
  {
    to: "/dashboard",
    icon: FaTachometerAlt,
    labelKey: "nav.dashboard",
    permission: "canViewReports"
  },
  {
    to: "/users",
    icon: FaUsers,
    labelKey: "nav.userManagement",
    permission: "canEditUsers"
  },
  {
    to: "/devices",
    icon: FaWifi,
    labelKey: "nav.deviceManagement",
    permission: "canManageDevices"
  },
  {
    to: "/reports",
    icon: FaFileAlt,
    labelKey: "nav.reporting",
    permission: "canViewReports"
  },
  {
    to: "/knowledge",
    icon: FaBook,
    labelKey: "nav.knowledgeCenter",
    permission: "canViewReports"
  },
  {
    to: "/logs",
    icon: FaClipboardList,
    labelKey: "nav.activityLogs",
    permission: "canViewLogs"
  },
];

const Sidebar = () => {
  const { hasPermission } = usePermissions();
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
            {accessibleItems.map(({ to, icon: Icon, labelKey }) => (
              <li key={to} className="sidebar-nav-li">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    "sidebar-nav-item" + (isActive ? " active-link" : "")
                  }
                  aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                  aria-label={t(labelKey)}
                  onMouseEnter={() => handleMouseEnter(to)}
                  onFocus={() => handleMouseEnter(to)}
                  onClick={closeMobileMenu}
                >
                  <span className="sidebar-nav-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="sidebar-nav-label">{t(labelKey)}</span>
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