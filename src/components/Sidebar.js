/**
 * ============================================================================
 * Sidebar Component
 * ============================================================================
 *
 * @file src/components/Sidebar.js
 * @description Navigation sidebar component that displays menu items based on
 *              user type (Customer vs Internal) and permissions. Handles
 *              collapsible state, mobile responsiveness, and route preloading.
 *
 * @portalTypes
 * The sidebar automatically detects which portal the user is in:
 * - Customer Portal: Shows user/device management, reports, etc.
 * - Internal Portal: Shows sites, customers, provisioning queue, etc.
 *
 * @permissionSystem
 * Menu items are filtered based on user permissions from usePermissions hook.
 * Each item specifies required permission - items without permission are hidden.
 *
 * @features
 * - Collapsible sidebar (toggle between icon-only and full width)
 * - Mobile responsive with hamburger menu
 * - Active route highlighting
 * - Route preloading on hover (performance optimization)
 * - Translation support (i18n) for customer portal
 * - Customer view banner when impersonating
 *
 * @structure
 * ```
 * ┌────────────────────┐
 * │  Logo              │
 * ├────────────────────┤
 * │  [Company Banner]  │  ← Only in customer view mode
 * ├────────────────────┤
 * │  Nav Item 1        │
 * │  Nav Item 2        │
 * │  Nav Item 3        │
 * │  ...               │
 * ├────────────────────┤
 * │  Logout Button     │
 * └────────────────────┘
 * ```
 *
 * @menuConfiguration
 * - customerSidebarItems: Menu for customer portal users
 * - internalSidebarItems: Menu for internal Spectra staff
 *
 * @dependencies
 * - react-router-dom : For NavLink and navigation
 * - react-icons      : For menu item icons
 * - usePermissions   : For permission-based filtering
 * - useSiteConfig    : For site-specific configurations
 * - useCustomerView  : For customer impersonation banner
 * - react-i18next    : For internationalization
 *
 * @relatedFiles
 * - Sidebar.css      : Styles including collapse/expand animations
 * - routes.js        : Route configuration and preloading
 * - usePermissions.js: Permission checking logic
 *
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  FaSignOutAlt,
  FaClipboardCheck,
  FaHeadset,
} from "react-icons/fa";
import { usePermissions } from "@hooks/usePermissions";
import { useSiteConfig } from "@hooks/useSiteConfig";
import { useCustomerView } from "@context/CustomerViewContext";
import { preloadRoute } from "@config/routes";
import { useTranslation } from "react-i18next";
import logoMark from "@assets/images/spectra-logo-white.png";
import "@components/Sidebar.css";

/**
 * Customer Portal Sidebar Menu Items
 *
 * Each item contains:
 * - to: Route path for navigation
 * - icon: Icon component to display
 * - labelKey: i18n translation key
 * - label: Fallback label if translation fails
 * - permission: Required permission to view this item
 * - requiresGuestAccess: (optional) Only show if site has guest access enabled
 */
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
  {
    to: "/support",
    icon: FaHeadset,
    labelKey: "nav.helpSupport",
    label: "Help & Support",
    permission: "canViewReports"
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
    to: "/internal/provisioning",
    icon: FaClipboardCheck,
    label: "Provisioning Queue",
    permission: "canAccessProvisioningQueue"
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
  const { isImpersonating, impersonatedCustomer, exitCustomerView } = useCustomerView();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef(null);

  // Determine if we're on internal portal routes
  const isInternalPortalRoute = location.pathname.startsWith('/internal');

  // When impersonating, show customer sidebar regardless of current route
  const isInternalPortal = isInternalPortalRoute && !isImpersonating;

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
        className={`sidebar ${mobileOpen ? 'mobile-open' : ''} ${isInternalPortal ? 'internal-portal' : ''} ${isImpersonating ? 'impersonating-mode' : ''}`}
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

        {/* Impersonation indicator */}
        {isImpersonating && (
          <div className="impersonation-indicator">
            <div className="impersonation-info">
              <span className="impersonation-label">Viewing as</span>
              <span className="impersonation-customer">{impersonatedCustomer?.name}</span>
            </div>
            <button
              className="exit-impersonation-btn"
              onClick={() => {
                exitCustomerView();
                navigate('/internal/dashboard');
              }}
              title="Exit customer view"
            >
              <FaSignOutAlt />
            </button>
          </div>
        )}

        <nav aria-label="Main navigation" ref={navRef}>
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