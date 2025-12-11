// src/pages/Internal/InternalDashboard.js

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
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
import "./InternalDashboard.css";

/**
 * Internal Dashboard for Spectra Staff
 * Provides multi-site overview, alerts, analytics and management
 */
const InternalDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, hasPermission } = useAuth();

  // Calculate metrics
  const siteStatusCounts = useMemo(() => getSiteStatusCounts(), []);
  const alertCounts = useMemo(() => getAlertCounts(), []);

  // Filter active alerts (unacknowledged)
  const activeAlerts = useMemo(
    () => systemAlerts.filter((a) => !a.acknowledged).slice(0, 5),
    []
  );

  // Filter open tickets
  const openTickets = useMemo(
    () => supportTickets.filter((t) => t.status !== "completed").slice(0, 5),
    []
  );

  // Recent activity
  const recentActivity = useMemo(() => activityLogs.slice(0, 8), []);

  // Sites needing attention
  const sitesNeedingAttention = useMemo(
    () => sites.filter((s) => s.status === "offline" || s.status === "degraded" || s.criticalAlerts > 0),
    []
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

  return (
    <div className="internal-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-welcome">
        <div className="welcome-text">
          <h1>Welcome, {currentUser?.displayName || "Admin"}</h1>
          <p>Spectra Network Operations Center</p>
        </div>
        <div className="welcome-actions">
          {hasPermission && hasPermission("canProvisionSites") && (
            <button className="action-btn primary" onClick={() => navigate("/internal/sites/new")}>
              <FaPlus /> Provision New Site
            </button>
          )}
          <button className="action-btn" onClick={() => navigate("/internal/support")}>
            <FaTicketAlt /> Support Queue
          </button>
        </div>
      </div>

      {/* Quick Actions - Prominent Position */}
      <div className="quick-actions-bar">
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
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
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

        <div className="metric-card sites">
          <div className="metric-icon">
            <FaMapMarkerAlt />
          </div>
          <div className="metric-content">
            <span className="metric-value">{platformMetrics.overview.totalSites}</span>
            <span className="metric-label">Total Sites</span>
            <span className="metric-sub">{platformMetrics.overview.activeSites} active</span>
          </div>
          <div className="metric-trend positive">
            <FaArrowUp /> {platformMetrics.trends.siteGrowth}%
          </div>
        </div>

        <div className="metric-card users">
          <div className="metric-icon">
            <FaUsers />
          </div>
          <div className="metric-content">
            <span className="metric-value">{formatNumber(platformMetrics.overview.totalUsers)}</span>
            <span className="metric-label">Total Users</span>
            <span className="metric-sub">{formatNumber(platformMetrics.overview.activeUsers)} active</span>
          </div>
          <div className="metric-trend positive">
            <FaArrowUp /> {platformMetrics.trends.userGrowth}%
          </div>
        </div>

        <div className="metric-card devices">
          <div className="metric-icon">
            <FaWifi />
          </div>
          <div className="metric-content">
            <span className="metric-value">{formatNumber(platformMetrics.overview.totalDevices)}</span>
            <span className="metric-label">Total Devices</span>
            <span className="metric-sub">{formatNumber(platformMetrics.overview.onlineDevices)} online</span>
          </div>
        </div>

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

        <div className="metric-card bandwidth">
          <div className="metric-icon">
            <FaNetworkWired />
          </div>
          <div className="metric-content">
            <span className="metric-value">{formatNumber(platformMetrics.overview.usedBandwidth)}</span>
            <span className="metric-label">Bandwidth (Mbps)</span>
            <span className="metric-sub">of {formatNumber(platformMetrics.overview.totalBandwidth)} provisioned</span>
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

    </div>
  );
};

export default InternalDashboard;
