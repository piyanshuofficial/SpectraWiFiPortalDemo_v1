// src/components/Sidebar.js

import React, { useState, useEffect, useRef } from "react";
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
  FaEllipsisH,
  FaChevronDown,
} from "react-icons/fa";
import { usePermissions } from "@hooks/usePermissions";
import { useSiteConfig } from "@hooks/useSiteConfig";
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
    permission: "canEditUsers",
    requiresGuestAccess: true // Only show if site has guest access enabled
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
  const { guestAccessEnabled } = useSiteConfig();
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const navRef = useRef(null);
  const overflowMenuRef = useRef(null);

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
    // Check permission first
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    // Check guest access requirement (only for customer portal items)
    if (item.requiresGuestAccess && !guestAccessEnabled) {
      return false;
    }
    return true;
  });

  // Check for overflow and calculate visible items (only for internal portal on desktop)
  useEffect(() => {
    if (!isInternalPortal || isMobile) {
      setHasOverflow(false);
      setVisibleCount(accessibleItems.length);
      return;
    }

    const checkOverflow = () => {
      if (!navRef.current) return;

      const navElement = navRef.current;
      const sidebarHeight = navElement.parentElement?.clientHeight || window.innerHeight;
      const logoHeight = 60; // Logo area height
      const moreButtonHeight = 56; // Height for the "more" button
      const availableHeight = sidebarHeight - logoHeight - moreButtonHeight - 20; // 20px buffer

      // Each nav item is approximately 56px (icon + label + padding)
      const itemHeight = 56;
      const maxVisibleItems = Math.floor(availableHeight / itemHeight);

      if (accessibleItems.length > maxVisibleItems && maxVisibleItems > 0) {
        setHasOverflow(true);
        setVisibleCount(Math.max(maxVisibleItems - 1, 1)); // Reserve space for "more" button
      } else {
        setHasOverflow(false);
        setVisibleCount(accessibleItems.length);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => window.removeEventListener('resize', checkOverflow);
  }, [isInternalPortal, isMobile, accessibleItems.length]);

  // Close overflow menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overflowMenuRef.current && !overflowMenuRef.current.contains(event.target)) {
        setShowOverflowMenu(false);
      }
    };

    if (showOverflowMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOverflowMenu]);

  // Close overflow menu on route change
  useEffect(() => {
    setShowOverflowMenu(false);
  }, [location.pathname]);

  const handleMouseEnter = (path) => {
    preloadRoute(path);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const toggleOverflowMenu = () => {
    setShowOverflowMenu(!showOverflowMenu);
  };

  // Split items into visible and overflow
  const visibleItems = hasOverflow ? accessibleItems.slice(0, visibleCount) : accessibleItems;
  const overflowItems = hasOverflow ? accessibleItems.slice(visibleCount) : [];

  // Check if any overflow item is active
  const isOverflowItemActive = overflowItems.some(item => location.pathname.startsWith(item.to));

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
        <nav aria-label="Main navigation" ref={navRef}>
          <ul className="sidebar-nav">
            {visibleItems.map(({ to, icon: Icon, labelKey, label }) => (
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

            {/* Overflow "More" button for internal portal */}
            {hasOverflow && overflowItems.length > 0 && !isMobile && (
              <li className="sidebar-nav-li sidebar-overflow-container" ref={overflowMenuRef}>
                <button
                  className={`sidebar-nav-item sidebar-more-button ${showOverflowMenu ? 'active' : ''} ${isOverflowItemActive ? 'has-active-child' : ''}`}
                  onClick={toggleOverflowMenu}
                  aria-expanded={showOverflowMenu}
                  aria-haspopup="true"
                  aria-label={`More options (${overflowItems.length} more)`}
                >
                  <span className="sidebar-nav-icon" aria-hidden="true">
                    <FaEllipsisH />
                  </span>
                  <span className="sidebar-nav-label">
                    More
                    <FaChevronDown className={`sidebar-more-chevron ${showOverflowMenu ? 'rotated' : ''}`} />
                  </span>
                </button>

                {/* Overflow dropdown menu */}
                {showOverflowMenu && (
                  <div className="sidebar-overflow-menu" role="menu">
                    {overflowItems.map(({ to, icon: Icon, labelKey, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                          "sidebar-overflow-item" + (isActive ? " active-link" : "")
                        }
                        role="menuitem"
                        aria-label={labelKey ? t(labelKey) : label}
                        onMouseEnter={() => handleMouseEnter(to)}
                        onFocus={() => handleMouseEnter(to)}
                        onClick={() => setShowOverflowMenu(false)}
                      >
                        <span className="sidebar-overflow-icon" aria-hidden="true">
                          <Icon />
                        </span>
                        <span className="sidebar-overflow-label">{labelKey ? t(labelKey) : label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;