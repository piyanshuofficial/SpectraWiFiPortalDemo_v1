/**
 * ============================================================================
 * Internal Portal Dashboard
 * ============================================================================
 *
 * @file src/pages/Internal/InternalDashboard.js
 * @description Main dashboard for Spectra internal staff (Operations, Support,
 *              Sales teams). Provides a bird's-eye view of all customers, sites,
 *              system health, alerts, and platform metrics.
 *
 * @portalType Internal (Spectra Staff Only)
 *
 * @dashboardSections
 * ```
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ INTERNAL DASHBOARD LAYOUT                                                │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Customer Filter Banner (if customer selected from URL)                   │
 * │ "Viewing data for: [Customer Name]"                                      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Platform Metrics:                                                        │
 * │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
 * │ │ Total   │ │ Total   │ │ Active  │ │ System  │ │ Support │             │
 * │ │Customers│ │ Sites   │ │ Users   │ │ Alerts  │ │ Tickets │             │
 * │ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ ┌───────────────────────────┐ ┌────────────────────────────────────────┐ │
 * │ │ SITE STATUS BREAKDOWN     │ │ SYSTEM ALERTS                          │ │
 * │ │ ● Online: 45              │ │ [!] Critical: NAS down at Site X       │ │
 * │ │ ● Degraded: 3             │ │ [!] Warning: License expiry Site Y     │ │
 * │ │ ● Offline: 1              │ │ [i] Info: Maintenance scheduled        │ │
 * │ │ ○ Maintenance: 2          │ │                                        │ │
 * │ └───────────────────────────┘ └────────────────────────────────────────┘ │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ ┌───────────────────────────┐ ┌────────────────────────────────────────┐ │
 * │ │ RECENT ACTIVITY           │ │ QUICK ACTIONS                          │ │
 * │ │ • Site provisioned        │ │ [View as Customer]                     │ │
 * │ │ • User created            │ │ [Add New Site]                         │ │
 * │ │ • Alert resolved          │ │ [View Provisioning Queue]              │ │
 * │ └───────────────────────────┘ └────────────────────────────────────────┘ │
 * └──────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @metricCards
 * | Metric          | Description                              | Click Action           |
 * |-----------------|------------------------------------------|------------------------|
 * | Total Customers | Count of all customer accounts           | → Customer Management  |
 * | Total Sites     | Count of all provisioned sites           | → Site Management      |
 * | Active Users    | Sum of users across all sites            | → Reports              |
 * | System Alerts   | Active alerts requiring attention        | → Alerts page          |
 * | Support Tickets | Open support tickets                     | → Support page         |
 *
 * @siteStatuses
 * | Status      | Color  | Icon            | Description                    |
 * |-------------|--------|-----------------|--------------------------------|
 * | Online      | Green  | FaCheckCircle   | Site fully operational         |
 * | Degraded    | Yellow | FaExclamationCircle | Partial issues             |
 * | Offline     | Red    | FaTimesCircle   | Site down                      |
 * | Maintenance | Blue   | FaCog           | Planned maintenance            |
 *
 * @alertSeverities
 * | Severity | Color  | Icon               | Auto-Priority   |
 * |----------|--------|--------------------|-----------------|
 * | Critical | Red    | FaExclamationCircle| P1 - Immediate  |
 * | Warning  | Yellow | FaExclamationTriangle | P2 - High    |
 * | Info     | Blue   | FaInfoCircle       | P3 - Low        |
 *
 * @customerFilter
 * Dashboard supports filtering by customer via URL parameter:
 * - URL: /internal/dashboard?customer=CUST001
 * - Shows only that customer's sites and alerts
 * - Useful when navigating from customer management
 *
 * @customerViewFeature
 * "View as Customer" button opens modal to:
 * - Select customer to impersonate
 * - Choose site (or company view)
 * - Select role to view as
 * - Then navigates to customer portal in read-only mode
 *
 * @permissions
 * - canAccessInternalPortal: View dashboard (all internal users)
 * - canProvisionSites: Add new site action visible
 * - canAccessProvisioningQueue: View queue link visible
 *
 * @dataRefresh
 * TODO: Backend integration should:
 * - Load metrics on mount
 * - Auto-refresh alerts every 60 seconds
 * - WebSocket for real-time alert notifications
 *
 * @dependencies
 * - useAuth: Permission checking
 * - internalPortalData.js: Sample internal data
 * - CustomerViewModal: Impersonation selection
 *
 * @relatedFiles
 * - SiteManagement.js: Sites listing page
 * - CustomerManagement.js: Customers listing page
 * - InternalAlerts.js: Full alerts management
 * - SiteProvisioningQueue.js: Provisioning queue
 * - internalPortalData.js: Sample data constants
 *
 * ============================================================================
 */

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaUsers,
  FaWifi,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaCog,
  FaChartLine,
  FaTicketAlt,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaServer,
  FaNetworkWired,
  FaPlus,
  FaBell,
  FaPercentage,
  FaBook,
  FaEye,
} from "react-icons/fa";
import CustomerViewModal from "@components/CustomerViewModal";
import {
  customers,
  sites,
  systemAlerts,
  supportTickets,
  platformMetrics,
  activityLogs,
  getSiteStatusCounts,
  getAlertCounts,
} from "@constants/internalPortalData";
import PageLoadingSkeleton from "@components/Loading/PageLoadingSkeleton";
import "./InternalDashboard.css";

/**
 * Internal Dashboard for Spectra Staff
 * Provides multi-site overview, alerts, analytics and management
 */
const InternalDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, hasPermission } = useAuth();

  // Get customer filter from URL
  const customerIdFilter = searchParams.get("customer");
  const selectedCustomer = customerIdFilter ? customers.find(c => c.id === customerIdFilter) : null;

  // Filter sites based on customer
  const filteredSites = useMemo(() => {
    if (customerIdFilter) {
      return sites.filter(s => s.customerId === customerIdFilter);
    }
    return sites;
  }, [customerIdFilter]);

  // Filter alerts based on customer
  const filteredAlerts = useMemo(() => {
    if (customerIdFilter) {
      return systemAlerts.filter(a => a.customerId === customerIdFilter);
    }
    return systemAlerts;
  }, [customerIdFilter]);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Customer View Modal state
  const [showCustomerViewModal, setShowCustomerViewModal] = useState(false);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate metrics - use filtered data when customer is selected
  const siteStatusCounts = useMemo(() => {
    if (customerIdFilter) {
      return {
        online: filteredSites.filter(s => s.status === "online").length,
        degraded: filteredSites.filter(s => s.status === "degraded").length,
        offline: filteredSites.filter(s => s.status === "offline").length,
        maintenance: filteredSites.filter(s => s.status === "maintenance").length,
        total: filteredSites.length,
      };
    }
    return getSiteStatusCounts();
  }, [customerIdFilter, filteredSites]);

  const alertCounts = useMemo(() => {
    if (customerIdFilter) {
      return {
        critical: filteredAlerts.filter(a => a.type === "critical").length,
        warning: filteredAlerts.filter(a => a.type === "warning").length,
        info: filteredAlerts.filter(a => a.type === "info").length,
        total: filteredAlerts.length,
      };
    }
    return getAlertCounts();
  }, [customerIdFilter, filteredAlerts]);

  // Calculate infrastructure stats - use filtered data when customer is selected
  const infrastructureStats = useMemo(() => {
    const sitesToUse = customerIdFilter ? filteredSites : sites;
    const deployedAps = sitesToUse.reduce((sum, s) => sum + (s.infrastructure?.deployedApCount || s.deployedApCount || 0), 0);
    const liveAps = sitesToUse.reduce((sum, s) => sum + (s.infrastructure?.liveApCount || s.liveApCount || 0), 0);
    const totalSwitches = sitesToUse.reduce((sum, s) => sum + (s.infrastructure?.poeSwitchCount || 0), 0);
    const liveSwitches = sitesToUse.reduce((sum, s) => sum + (s.infrastructure?.livePoeSwitchCount || 0), 0);
    const totalPorts = sitesToUse.reduce((sum, s) => sum + (s.infrastructure?.totalPoePorts || 0), 0);
    return { deployedAps, liveAps, totalSwitches, liveSwitches, totalPorts };
  }, [customerIdFilter, filteredSites]);

  // Calculate filtered metrics for customer view
  const filteredMetrics = useMemo(() => {
    if (!customerIdFilter || !selectedCustomer) return null;
    return {
      totalSites: filteredSites.length,
      totalUsers: filteredSites.reduce((sum, s) => sum + s.totalUsers, 0),
      activeUsers: filteredSites.reduce((sum, s) => sum + s.activeUsers, 0),
      totalDevices: filteredSites.reduce((sum, s) => sum + s.totalDevices, 0),
      onlineDevices: filteredSites.reduce((sum, s) => sum + s.onlineDevices, 0),
      totalBandwidth: filteredSites.reduce((sum, s) => sum + s.bandwidthLimit, 0),
      usedBandwidth: filteredSites.reduce((sum, s) => sum + s.bandwidthUsage, 0),
    };
  }, [customerIdFilter, selectedCustomer, filteredSites]);

  // Clear customer filter
  const clearCustomerFilter = () => {
    navigate("/internal/dashboard");
  };

  // Filter active alerts (unacknowledged) - use filtered data when customer is selected
  const activeAlerts = useMemo(
    () => {
      const alertsToUse = customerIdFilter ? filteredAlerts : systemAlerts;
      return alertsToUse.filter((a) => !a.acknowledged).slice(0, 5);
    },
    [customerIdFilter, filteredAlerts]
  );

  // Filter open tickets - use filtered data when customer is selected
  const openTickets = useMemo(
    () => {
      let tickets = supportTickets.filter((t) => t.status !== "completed");
      if (customerIdFilter) {
        tickets = tickets.filter((t) => t.customerId === customerIdFilter);
      }
      return tickets.slice(0, 5);
    },
    [customerIdFilter]
  );

  // Recent activity - filter by customer if selected
  const recentActivity = useMemo(() => {
    let logs = activityLogs;
    if (customerIdFilter) {
      logs = logs.filter((log) => log.customerId === customerIdFilter);
    }
    return logs.slice(0, 8);
  }, [customerIdFilter]);

  // Sites needing attention - use filtered data when customer is selected
  const sitesNeedingAttention = useMemo(
    () => {
      const sitesToUse = customerIdFilter ? filteredSites : sites;
      return sitesToUse.filter((s) => s.status === "offline" || s.status === "degraded" || s.criticalAlerts > 0);
    },
    [customerIdFilter, filteredSites]
  );

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
        return <FaCheckCircle className="status-icon online" />;
      case "degraded":
        return <FaExclamationCircle className="status-icon degraded" />;
      case "offline":
        return <FaTimesCircle className="status-icon offline" />;
      case "maintenance":
        return <FaCog className="status-icon maintenance" />;
      default:
        return null;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "critical":
        return <FaExclamationCircle className="alert-type-icon critical" />;
      case "warning":
        return <FaExclamationTriangle className="alert-type-icon warning" />;
      case "info":
        return <FaInfoCircle className="alert-type-icon info" />;
      default:
        return null;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "critical":
        return "priority-critical";
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Show loading skeleton during initial load
  if (isLoading) {
    return <PageLoadingSkeleton pageType="internal-dashboard" />;
  }

  return (
    <div className="internal-dashboard">
      {/* Customer Filter Banner */}
      {selectedCustomer && (
        <div className="customer-filter-banner">
          <div className="filter-info">
            <FaBuilding className="filter-icon" />
            <span>Viewing analytics for: <strong>{selectedCustomer.name}</strong></span>
            <span className="customer-type-badge">{selectedCustomer.type}</span>
          </div>
          <button className="clear-filter-btn" onClick={clearCustomerFilter}>
            <FaTimesCircle /> Clear Filter
          </button>
        </div>
      )}

      {/* Welcome Header */}
      <div className="dashboard-welcome">
        <div className="welcome-text">
          <h1>{selectedCustomer ? `${selectedCustomer.name} Analytics` : `Welcome, ${currentUser?.displayName || "Admin"}`}</h1>
          <p>{selectedCustomer ? `Customer Dashboard - ${filteredSites.length} site(s)` : "Spectra Network Operations Center"}</p>
        </div>
      </div>

      {/* Quick Actions - Prominent Position */}
      <div className="quick-actions-bar">
        {hasPermission && hasPermission("canProvisionSites") && (
          <button className="quick-action-card provision" onClick={() => navigate("/internal/sites?action=provision")}>
            <FaPlus />
            <span>Provision New Site</span>
          </button>
        )}
        <button className="quick-action-card" onClick={() => navigate("/internal/sites")}>
          <FaMapMarkerAlt />
          <span>All Sites</span>
        </button>
        <button className="quick-action-card" onClick={() => navigate("/internal/customers")}>
          <FaBuilding />
          <span>Customers</span>
        </button>
        <button className="quick-action-card" onClick={() => navigate("/internal/reports")}>
          <FaChartLine />
          <span>Analytics</span>
        </button>
        <button className="quick-action-card" onClick={() => navigate("/internal/support")}>
          <FaTicketAlt />
          <span>Support</span>
        </button>
        <button className="quick-action-card" onClick={() => navigate("/internal/config")}>
          <FaCog />
          <span>Config</span>
        </button>
        <button className="quick-action-card" onClick={() => navigate("/internal/knowledge")}>
          <FaBook />
          <span>Docs</span>
        </button>
        <button className="quick-action-card view-as-customer" onClick={() => setShowCustomerViewModal(true)}>
          <FaEye />
          <span>View as Customer</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        {/* Show customer card only when not filtering by customer */}
        {!customerIdFilter && (
          <div className="metric-card customers">
            <div className="metric-icon">
              <FaBuilding />
            </div>
            <div className="metric-content">
              <span className="metric-value">{platformMetrics.overview.totalCustomers}</span>
              <span className="metric-label">Total Customers</span>
              <span className="metric-sub">{platformMetrics.overview.activeCustomers} active</span>
            </div>
          </div>
        )}

        <div className="metric-card sites">
          <div className="metric-icon">
            <FaMapMarkerAlt />
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {filteredMetrics ? filteredMetrics.totalSites : platformMetrics.overview.totalSites}
            </span>
            <span className="metric-label">{customerIdFilter ? "Customer Sites" : "Total Sites"}</span>
            <span className="metric-sub">
              {filteredMetrics
                ? `${filteredSites.filter(s => s.status === "online").length} online`
                : `${platformMetrics.overview.activeSites} active`}
            </span>
          </div>
          {!customerIdFilter && (
            <div className="metric-trend positive">
              <FaArrowUp /> {platformMetrics.trends.siteGrowth}%
            </div>
          )}
        </div>

        <div className="metric-card users">
          <div className="metric-icon">
            <FaUsers />
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {formatNumber(filteredMetrics ? filteredMetrics.totalUsers : platformMetrics.overview.totalUsers)}
            </span>
            <span className="metric-label">{customerIdFilter ? "Customer Users" : "Total Users"}</span>
            <span className="metric-sub">
              {formatNumber(filteredMetrics ? filteredMetrics.activeUsers : platformMetrics.overview.activeUsers)} active
            </span>
          </div>
          {!customerIdFilter && (
            <div className="metric-trend positive">
              <FaArrowUp /> {platformMetrics.trends.userGrowth}%
            </div>
          )}
        </div>

        <div className="metric-card devices">
          <div className="metric-icon">
            <FaWifi />
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {formatNumber(filteredMetrics ? filteredMetrics.totalDevices : platformMetrics.overview.totalDevices)}
            </span>
            <span className="metric-label">{customerIdFilter ? "Customer Devices" : "Total Devices"}</span>
            <span className="metric-sub">
              {formatNumber(filteredMetrics ? filteredMetrics.onlineDevices : platformMetrics.overview.onlineDevices)} online
            </span>
          </div>
        </div>

        {/* Show license utilization only when not filtering */}
        {!customerIdFilter && (
          <div className="metric-card licenses">
            <div className="metric-icon">
              <FaPercentage />
            </div>
            <div className="metric-content">
              <span className="metric-value">{platformMetrics.health.licenseUtilization}%</span>
              <span className="metric-label">License Utilization</span>
              <span className="metric-sub">{formatNumber(platformMetrics.overview.totalLicenses)} total licenses</span>
            </div>
          </div>
        )}

        <div className="metric-card bandwidth">
          <div className="metric-icon">
            <FaNetworkWired />
          </div>
          <div className="metric-content">
            <span className="metric-value">
              {formatNumber(filteredMetrics ? filteredMetrics.usedBandwidth : platformMetrics.overview.usedBandwidth)}
            </span>
            <span className="metric-label">Bandwidth (Mbps)</span>
            <span className="metric-sub">
              of {formatNumber(filteredMetrics ? filteredMetrics.totalBandwidth : platformMetrics.overview.totalBandwidth)} provisioned
            </span>
          </div>
        </div>

        <div className="metric-card infrastructure-aps">
          <div className="metric-icon">
            <FaWifi />
          </div>
          <div className="metric-content">
            <span className="metric-value infra-value">
              <span className="live">{formatNumber(infrastructureStats.liveAps)}</span>
              <span className="sep">/</span>
              <span className="total">{formatNumber(infrastructureStats.deployedAps)}</span>
            </span>
            <span className="metric-label">Access Points</span>
            <span className="metric-sub">Live / Deployed APs</span>
          </div>
        </div>

        <div className="metric-card infrastructure-switches">
          <div className="metric-icon">
            <FaServer />
          </div>
          <div className="metric-content">
            <span className="metric-value infra-value">
              <span className="live">{formatNumber(infrastructureStats.liveSwitches)}</span>
              <span className="sep">/</span>
              <span className="total">{formatNumber(infrastructureStats.totalSwitches)}</span>
            </span>
            <span className="metric-label">PoE Switches</span>
            <span className="metric-sub">{formatNumber(infrastructureStats.totalPorts)} total ports</span>
          </div>
        </div>
      </div>

      {/* Site Health & Alerts Row */}
      <div className="dashboard-row">
        {/* Site Health Overview */}
        <div className="dashboard-card site-health">
          <div className="card-header">
            <h2><FaServer /> Site Health Overview</h2>
            <button className="view-all-btn" onClick={() => navigate("/internal/sites")}>
              View All Sites
            </button>
          </div>
          <div className="health-grid">
            <div className="health-item online" onClick={() => navigate("/internal/sites?status=online")}>
              <FaCheckCircle />
              <span className="health-count">{siteStatusCounts.online}</span>
              <span className="health-label">Online</span>
            </div>
            <div className="health-item degraded" onClick={() => navigate("/internal/sites?status=degraded")}>
              <FaExclamationCircle />
              <span className="health-count">{siteStatusCounts.degraded}</span>
              <span className="health-label">Degraded</span>
            </div>
            <div className="health-item offline" onClick={() => navigate("/internal/sites?status=offline")}>
              <FaTimesCircle />
              <span className="health-count">{siteStatusCounts.offline}</span>
              <span className="health-label">Offline</span>
            </div>
            <div className="health-item maintenance" onClick={() => navigate("/internal/sites?status=maintenance")}>
              <FaCog />
              <span className="health-count">{siteStatusCounts.maintenance}</span>
              <span className="health-label">Maintenance</span>
            </div>
          </div>
          <div className="uptime-bar">
            <div className="uptime-label">
              <span>Platform Uptime</span>
              <span className="uptime-value">{platformMetrics.health.averageUptime}%</span>
            </div>
            <div className="uptime-track">
              <div
                className="uptime-fill"
                style={{ width: `${platformMetrics.health.averageUptime}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="dashboard-card alerts-card">
          <div className="card-header">
            <h2><FaBell /> Active Alerts</h2>
            <div className="alert-badges">
              <span className="badge critical">{alertCounts.critical}</span>
              <span className="badge warning">{alertCounts.warning}</span>
              <span className="badge info">{alertCounts.info}</span>
            </div>
          </div>
          <div className="alerts-list">
            {activeAlerts.length === 0 ? (
              <div className="no-alerts">
                <FaCheckCircle />
                <p>No active alerts</p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.type}`}>
                  {getAlertIcon(alert.type)}
                  <div className="alert-content">
                    <span className="alert-title">{alert.title}</span>
                    <span className="alert-site">{alert.siteName || alert.customerName || "System"}</span>
                  </div>
                  <span className="alert-time">{getTimeAgo(alert.timestamp)}</span>
                </div>
              ))
            )}
          </div>
          <button className="view-all-btn full-width" onClick={() => navigate("/internal/alerts")}>
            View All Alerts
          </button>
        </div>
      </div>

      {/* Sites Needing Attention & Support Tickets */}
      <div className="dashboard-row">
        {/* Sites Needing Attention */}
        <div className="dashboard-card attention-sites">
          <div className="card-header">
            <h2><FaExclamationCircle /> Sites Needing Attention</h2>
            <span className="count-badge">{sitesNeedingAttention.length}</span>
          </div>
          <div className="sites-table">
            <table>
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Issue</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sitesNeedingAttention.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data">All sites operational</td>
                  </tr>
                ) : (
                  sitesNeedingAttention.slice(0, 5).map((site) => (
                    <tr key={site.id}>
                      <td className="site-name">
                        {getStatusIcon(site.status)}
                        {site.name}
                      </td>
                      <td>{site.customerName}</td>
                      <td>
                        <span className={`status-badge ${site.status}`}>
                          {site.status}
                        </span>
                      </td>
                      <td>
                        {site.status === "offline"
                          ? "No connectivity"
                          : site.criticalAlerts > 0
                          ? `${site.criticalAlerts} critical alerts`
                          : "Performance degraded"}
                      </td>
                      <td>
                        <button
                          className="action-link"
                          onClick={() => navigate(`/internal/sites/${site.id}`)}
                        >
                          Investigate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="dashboard-card tickets-card">
          <div className="card-header">
            <h2><FaTicketAlt /> Support Tickets</h2>
            <span className="count-badge">{openTickets.length} open</span>
          </div>
          <div className="tickets-list">
            {openTickets.map((ticket) => (
              <div key={ticket.id} className="ticket-item">
                <div className={`ticket-priority ${getPriorityClass(ticket.priority)}`} />
                <div className="ticket-content">
                  <span className="ticket-subject">{ticket.subject}</span>
                  <span className="ticket-meta">
                    {ticket.customerName} | {ticket.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="ticket-info">
                  <span className="ticket-sla">
                    <FaClock /> SLA
                  </span>
                  <button
                    className="action-link"
                    onClick={() => navigate(`/internal/support/${ticket.id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn full-width" onClick={() => navigate("/internal/support")}>
            View All Tickets
          </button>
        </div>
      </div>

      {/* Regional & Segment Breakdown */}
      <div className="dashboard-row">
        {/* Regional Performance */}
        <div className="dashboard-card regional-card">
          <div className="card-header">
            <h2><FaChartLine /> Regional Performance</h2>
          </div>
          <div className="regional-grid">
            {platformMetrics.regional.map((region) => (
              <div key={region.region} className="regional-item">
                <div className="regional-header">
                  <span className="regional-name">{region.region}</span>
                  <span className="regional-sites">{region.sites} sites</span>
                </div>
                <div className="regional-stats">
                  <div className="regional-stat">
                    <FaUsers />
                    <span>{formatNumber(region.users)}</span>
                  </div>
                  <div className="regional-stat">
                    <FaWifi />
                    <span>{formatNumber(region.devices)} devices</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Segment Breakdown */}
        <div className="dashboard-card segment-card">
          <div className="card-header">
            <h2><FaBuilding /> Segment Breakdown</h2>
          </div>
          <div className="segment-list">
            {platformMetrics.bySegment.map((segment) => (
              <div key={segment.segment} className="segment-item">
                <div className="segment-header">
                  <span className="segment-name">{segment.segment}</span>
                  <span className="segment-customers">{segment.customers} customers</span>
                </div>
                <div className="segment-bar">
                  <div
                    className="segment-fill"
                    style={{
                      width: `${(segment.sites / platformMetrics.overview.totalSites) * 100}%`,
                    }}
                  />
                </div>
                <div className="segment-stats">
                  <span>{segment.sites} sites</span>
                  <span>{formatNumber(segment.users)} users</span>
                  <span>{formatNumber(segment.devices)} devices</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-card activity-card full-width">
        <div className="card-header">
          <h2><FaClock /> Recent Activity</h2>
          <button className="view-all-btn" onClick={() => navigate("/internal/logs")}>
            View All Logs
          </button>
        </div>
        <div className="activity-timeline">
          {recentActivity.map((log) => (
            <div key={log.id} className="activity-item">
              <div className="activity-time">
                <span className="time">{new Date(log.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                <span className="date">{new Date(log.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </div>
              <div className="activity-dot" />
              <div className="activity-content">
                <span className="activity-action">{log.description}</span>
                <span className="activity-user">
                  by {log.user} {log.userRole !== "Automated" && `(${log.userRole})`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer View Modal */}
      <CustomerViewModal
        isOpen={showCustomerViewModal}
        onClose={() => setShowCustomerViewModal(false)}
      />
    </div>
  );
};

export default InternalDashboard;
