// src/pages/Internal/InternalAlerts.js

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaBell,
  FaSearch,
  FaFilter,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaClock,
  FaUserCheck,
  FaSyncAlt,
  FaEye,
  FaCheck,
} from "react-icons/fa";
import { systemAlerts, customers, sites } from "@constants/internalPortalData";
import notifications from "@utils/notifications";
import Pagination from "@components/Pagination";
import SearchableSelect from "@components/SearchableSelect";
import "./InternalAlerts.css";

const typeOptions = ["all", "critical", "warning", "info"];
const categoryOptions = ["all", "connectivity", "performance", "capacity", "license", "security", "deployment", "maintenance"];
const statusOptions = ["all", "unacknowledged", "acknowledged"];

const getTypeIcon = (type) => {
  switch (type) {
    case "critical":
      return <FaExclamationCircle className="type-icon critical" />;
    case "warning":
      return <FaExclamationTriangle className="type-icon warning" />;
    case "info":
      return <FaInfoCircle className="type-icon info" />;
    default:
      return <FaBell className="type-icon" />;
  }
};

const InternalAlerts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get site filter from URL if present
  const siteIdFromUrl = searchParams.get("site");

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState(siteIdFromUrl || "all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeStatCard, setActiveStatCard] = useState(null); // Track active stat card filter

  // Update site filter when URL changes
  useEffect(() => {
    if (siteIdFromUrl) {
      setSiteFilter(siteIdFromUrl);
      setShowFilters(true);
    }
  }, [siteIdFromUrl]);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return systemAlerts.filter((alert) => {
      const matchesSearch =
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alert.customerName && alert.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (alert.siteName && alert.siteName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === "all" || alert.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || alert.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "acknowledged" && alert.acknowledged) ||
        (statusFilter === "unacknowledged" && !alert.acknowledged);
      const matchesCustomer = customerFilter === "all" || alert.customerId === customerFilter;
      const matchesSite = siteFilter === "all" || alert.siteId === siteFilter;

      return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesCustomer && matchesSite;
    });
  }, [searchQuery, typeFilter, categoryFilter, statusFilter, customerFilter, siteFilter]);

  // Pagination
  const paginatedAlerts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAlerts.slice(start, start + rowsPerPage);
  }, [filteredAlerts, currentPage, rowsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, categoryFilter, statusFilter, customerFilter, siteFilter]);

  // Stats
  const stats = useMemo(() => {
    const all = systemAlerts;
    return {
      total: all.length,
      critical: all.filter((a) => a.type === "critical").length,
      warning: all.filter((a) => a.type === "warning").length,
      info: all.filter((a) => a.type === "info").length,
      unacknowledged: all.filter((a) => !a.acknowledged).length,
    };
  }, []);

  // Customer and Site filter options for SearchableSelect
  const customerFilterOptions = useMemo(() =>
    customers.map(c => ({
      value: c.id,
      label: c.name,
      type: c.type,
    })),
    []
  );

  const siteFilterOptions = useMemo(() =>
    sites.map(s => ({
      value: s.id,
      label: s.name,
      region: s.region,
    })),
    []
  );

  const clearFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCustomerFilter("all");
    setSiteFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
    setSearchParams({});
    setActiveStatCard(null);
  };

  // Handle stat card click for filtering
  const handleStatCardClick = (cardType) => {
    // If clicking the same card, toggle off (clear filters)
    if (activeStatCard === cardType) {
      clearFilters();
      return;
    }

    // Reset filters first
    setTypeFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
    setActiveStatCard(cardType);

    // Apply specific filter based on card type
    switch (cardType) {
      case "total":
        // Show all alerts - no specific filter needed
        break;
      case "critical":
        setTypeFilter("critical");
        break;
      case "warning":
        setTypeFilter("warning");
        break;
      case "info":
        setTypeFilter("info");
        break;
      case "pending":
        setStatusFilter("unacknowledged");
        break;
      default:
        break;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notifications.showSuccess("Alerts refreshed successfully");
    } catch (error) {
      notifications.showError("Failed to refresh alerts");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAcknowledge = (alertId) => {
    notifications.showSuccess("Alert acknowledged successfully");
  };

  const handleViewAlert = (alert) => {
    setSelectedAlert(alert);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diff = now - alertTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <div className="internal-alerts">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1>
              <FaBell className="page-title-icon" /> Alerts & Notifications
            </h1>
            <p className="page-subtitle">Monitor and manage system alerts across all customers and sites</p>
          </div>
          <div className="page-header-actions">
            <button
              className={`btn btn-outline ${isRefreshing ? "refreshing" : ""}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <FaSyncAlt className={isRefreshing ? "spin" : ""} /> {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="alerts-stats">
        <div
          className={`stat-card clickable ${activeStatCard === "total" ? "active" : ""}`}
          onClick={() => handleStatCardClick("total")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("total")}
        >
          <div className="stat-icon total">
            <FaBell />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Alerts</span>
          </div>
        </div>
        <div
          className={`stat-card clickable ${activeStatCard === "critical" ? "active" : ""}`}
          onClick={() => handleStatCardClick("critical")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("critical")}
        >
          <div className="stat-icon critical">
            <FaExclamationCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.critical}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>
        <div
          className={`stat-card clickable ${activeStatCard === "warning" ? "active" : ""}`}
          onClick={() => handleStatCardClick("warning")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("warning")}
        >
          <div className="stat-icon warning">
            <FaExclamationTriangle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.warning}</span>
            <span className="stat-label">Warning</span>
          </div>
        </div>
        <div
          className={`stat-card clickable ${activeStatCard === "info" ? "active" : ""}`}
          onClick={() => handleStatCardClick("info")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("info")}
        >
          <div className="stat-icon info">
            <FaInfoCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.info}</span>
            <span className="stat-label">Info</span>
          </div>
        </div>
        <div
          className={`stat-card clickable ${activeStatCard === "pending" ? "active" : ""}`}
          onClick={() => handleStatCardClick("pending")}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === "Enter" && handleStatCardClick("pending")}
        >
          <div className="stat-icon unack">
            <FaClock />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.unacknowledged}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-card">
        <div className="search-row">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search alerts by title, message, customer, or site..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery("")}>
                <FaTimes />
              </button>
            )}
          </div>
          <button
            className={`btn btn-outline filter-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-row">
            <div className="filter-group">
              <label>Type</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "all" ? "All Types" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "all" ? "All Statuses" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group searchable-filter">
              <label>Customer</label>
              <SearchableSelect
                options={customerFilterOptions}
                value={customerFilter === "all" ? "" : customerFilter}
                onChange={(val) => setCustomerFilter(val || "all")}
                placeholder="All Customers"
                searchPlaceholder="Search customers..."
                getOptionLabel={(opt) => opt.label}
                getOptionValue={(opt) => opt.value}
                emptyOption={{ label: "All Customers", value: "" }}
                size="small"
              />
            </div>
            <div className="filter-group searchable-filter">
              <label>Site</label>
              <SearchableSelect
                options={siteFilterOptions}
                value={siteFilter === "all" ? "" : siteFilter}
                onChange={(val) => setSiteFilter(val || "all")}
                placeholder="All Sites"
                searchPlaceholder="Search sites..."
                getOptionLabel={(opt) => opt.label}
                getOptionValue={(opt) => opt.value}
                emptyOption={{ label: "All Sites", value: "" }}
                size="small"
              />
            </div>
            <button className="btn btn-text" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Alerts Table */}
      <div className="alerts-table-container">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Alert</th>
              <th>Customer</th>
              <th>Site</th>
              <th>Category</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAlerts.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  <FaBell className="no-data-icon" />
                  <p>No alerts found</p>
                </td>
              </tr>
            ) : (
              paginatedAlerts.map((alert) => (
                <tr key={alert.id} className={`alert-row ${alert.type}`}>
                  <td>
                    <span className={`type-badge ${alert.type}`}>
                      {getTypeIcon(alert.type)}
                      {alert.type}
                    </span>
                  </td>
                  <td className="alert-info-cell">
                    <span className="alert-title">{alert.title}</span>
                    <span className="alert-message">{alert.message}</span>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <FaBuilding className="cell-icon" />
                      {alert.customerName}
                    </div>
                  </td>
                  <td>
                    {alert.siteName ? (
                      <div className="site-cell">
                        <FaMapMarkerAlt className="cell-icon" />
                        {alert.siteName}
                      </div>
                    ) : (
                      <span className="all-sites">All Sites</span>
                    )}
                  </td>
                  <td>
                    <span className="category-tag">{alert.category}</span>
                  </td>
                  <td>
                    <div className="time-cell">
                      <span className="time-ago">{getTimeAgo(alert.timestamp)}</span>
                      <span className="time-full">{formatTimestamp(alert.timestamp)}</span>
                    </div>
                  </td>
                  <td>
                    {alert.acknowledged ? (
                      <span className="status-badge acknowledged">
                        <FaCheckCircle /> Acknowledged
                      </span>
                    ) : (
                      <span className="status-badge pending">
                        <FaClock /> Pending
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-primary" onClick={() => handleViewAlert(alert)} title="View Details">
                        <FaEye />
                      </button>
                      {!alert.acknowledged && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleAcknowledge(alert.id)}
                          title="Acknowledge"
                        >
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAlerts.length > 0 && (
        <div className="pagination-wrapper">
          <Pagination
            totalItems={filteredAlerts.length}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(newRows) => {
              setRowsPerPage(newRows);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="alert-modal-overlay" onClick={handleCloseModal}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`alert-modal-header ${selectedAlert.type}`}>
              <div className="alert-modal-title">
                {getTypeIcon(selectedAlert.type)}
                <h2>{selectedAlert.title}</h2>
              </div>
              <button className="close-btn" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="alert-modal-body">
              <div className="alert-message-section">
                <p>{selectedAlert.message}</p>
              </div>

              <div className="alert-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Customer</span>
                  <span className="meta-value">
                    <FaBuilding /> {selectedAlert.customerName}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Site</span>
                  <span className="meta-value">
                    <FaMapMarkerAlt /> {selectedAlert.siteName || "All Sites"}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Category</span>
                  <span className="meta-value">{selectedAlert.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Time</span>
                  <span className="meta-value">{formatTimestamp(selectedAlert.timestamp)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span className="meta-value">
                    {selectedAlert.acknowledged ? "Acknowledged" : "Pending"}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Assigned To</span>
                  <span className="meta-value">
                    <FaUserCheck /> {selectedAlert.assignedTo || "Unassigned"}
                  </span>
                </div>
              </div>
            </div>

            <div className="alert-modal-footer">
              <button className="btn btn-outline" onClick={handleCloseModal}>
                Close
              </button>
              {!selectedAlert.acknowledged && (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    handleAcknowledge(selectedAlert.id);
                    handleCloseModal();
                  }}
                >
                  <FaCheck /> Acknowledge
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalAlerts;
