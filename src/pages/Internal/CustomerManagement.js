// src/pages/Internal/CustomerManagement.js

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import {
  FaBuilding,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEllipsisV,
  FaEdit,
  FaCog,
  FaTrash,
  FaEye,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaPauseCircle,
  FaUsers,
  FaMapMarkerAlt,
  FaWifi,
  FaCalendarAlt,
  FaTh,
  FaList,
  FaSyncAlt,
  FaPhone,
  FaEnvelope,
  FaChartLine,
  FaTimes,
  FaFileContract,
  FaIdCard,
  FaGlobe,
} from "react-icons/fa";
import { customers, getSitesByCustomer, licenses } from "@constants/internalPortalData";
import notifications from "@utils/notifications";
import Pagination from "@components/Pagination";
import PageLoadingSkeleton from "@components/Loading/PageLoadingSkeleton";
import "./CustomerManagement.css";

/**
 * Customer Management Component
 * Manage all customer accounts for internal Spectra staff
 */
const CustomerManagement = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Customer detail modal state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Get filter options
  const statusOptions = ["All", "active", "inactive", "suspended"];
  const industryOptions = ["All", ...new Set(customers.map(c => c.industry))];

  // Enhance customers with site data
  const enhancedCustomers = useMemo(() => {
    return customers.map(customer => {
      const customerSites = getSitesByCustomer(customer.id);
      const onlineSites = customerSites.filter(s => s.status === "online").length;
      // Use customer's own data if available, otherwise calculate from sites
      const totalUsers = customer.totalUsers || customerSites.reduce((sum, s) => sum + (s.totalUsers || 0), 0);
      const totalDevices = customer.totalDevices || customerSites.reduce((sum, s) => sum + (s.totalDevices || 0), 0);
      const license = licenses.find(l => l.customerId === customer.id);

      return {
        ...customer,
        sites: customerSites,
        siteCount: customerSites.length || customer.totalSites || 0,
        onlineSites: onlineSites || customer.activeSites || 0,
        totalUsers,
        totalDevices,
        license,
      };
    });
  }, []);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return enhancedCustomers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || customer.status === selectedStatus;

      const matchesIndustry =
        selectedIndustry === "All" || customer.industry === selectedIndustry;

      return matchesSearch && matchesStatus && matchesIndustry;
    });
  }, [searchQuery, selectedStatus, selectedIndustry, enhancedCustomers]);

  // Paginated customers for display
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage, rowsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedIndustry]);

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FaCheckCircle className="status-icon active" />;
      case "inactive":
        return <FaPauseCircle className="status-icon inactive" />;
      case "suspended":
        return <FaTimesCircle className="status-icon suspended" />;
      default:
        return null;
    }
  };

  // Handle customer actions
  const handleCustomerAction = (action, customerId) => {
    setActiveDropdown(null);
    const customer = enhancedCustomers.find(c => c.id === customerId);
    switch (action) {
      case "view":
        // Show customer details in modal (internal admin view)
        setSelectedCustomer(customer);
        setShowCustomerModal(true);
        break;
      case "edit":
        // TODO: Implement edit functionality with modal
        notifications.showInfo("Edit functionality coming soon");
        break;
      case "configure":
        // TODO: Implement configure functionality
        notifications.showInfo("Configure functionality coming soon");
        break;
      case "sites":
        // Navigate to sites filtered by customer
        navigate(`/internal/sites?customer=${customerId}`);
        break;
      case "analytics":
        // Navigate to internal dashboard with customer filter
        navigate(`/internal/dashboard?customer=${customerId}`);
        break;
      case "delete":
        // Delete functionality removed - customers should be suspended instead
        notifications.showWarning("Delete is not available. Use suspend/block from site management.");
        break;
      default:
        break;
    }
  };

  // Close customer modal
  const closeCustomerModal = () => {
    setShowCustomerModal(false);
    setSelectedCustomer(null);
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = filteredCustomers.length;
    const active = filteredCustomers.filter(c => c.status === "active").length;
    const inactive = filteredCustomers.filter(c => c.status === "inactive").length;
    const suspended = filteredCustomers.filter(c => c.status === "suspended").length;
    const totalSites = filteredCustomers.reduce((sum, c) => sum + c.siteCount, 0);
    const totalUsers = filteredCustomers.reduce((sum, c) => sum + c.totalUsers, 0);

    return { total, active, inactive, suspended, totalSites, totalUsers };
  }, [filteredCustomers]);

  // Clear filters
  const clearFilters = () => {
    setSelectedStatus("All");
    setSelectedIndustry("All");
    setSearchQuery("");
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show loading skeleton during initial load
  if (isLoading) {
    return <PageLoadingSkeleton pageType="grid" rows={6} />;
  }

  return (
    <div className="customer-management">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>
            <FaBuilding /> Customer Management
          </h1>
          <p>Manage and monitor all customer accounts</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => console.log("Refresh")}>
            <FaSyncAlt /> Refresh
          </button>
          <button className="btn btn-outline" onClick={() => console.log("Export")}>
            <FaDownload /> Export
          </button>
          {hasPermission && hasPermission("canManageCustomers") && (
            <button className="btn btn-primary" onClick={() => navigate("/internal/customers/new")}>
              <FaPlus /> Add Customer
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="summary-stat">
          <span className="stat-number">{summaryStats.total}</span>
          <span className="stat-label">Total Customers</span>
        </div>
        <div className="summary-stat active">
          <span className="stat-number">{summaryStats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="summary-stat inactive">
          <span className="stat-number">{summaryStats.inactive}</span>
          <span className="stat-label">Inactive</span>
        </div>
        <div className="summary-stat suspended">
          <span className="stat-number">{summaryStats.suspended}</span>
          <span className="stat-label">Suspended</span>
        </div>
        <div className="summary-stat">
          <span className="stat-number">{summaryStats.totalSites}</span>
          <span className="stat-label">Total Sites</span>
        </div>
        <div className="summary-stat">
          <span className="stat-number">{summaryStats.totalUsers.toLocaleString()}</span>
          <span className="stat-label">Total Users</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-card">
        <div className="search-row">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search customers by name, email, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-actions">
            <button
              className={`btn btn-outline filter-toggle ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters
            </button>
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <FaTh />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="filters-row">
            <div className="filter-group">
              <label>Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                {industryOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-text" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="pagination-wrapper">
          <Pagination
            totalItems={filteredCustomers.length}
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

      {/* Customers Grid View */}
      {viewMode === "grid" && (
        <div className="customers-grid">
          {paginatedCustomers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-card-header">
                <div className="customer-info">
                  <div className="customer-status-name">
                    {getStatusIcon(customer.status)}
                    <h3 onClick={() => navigate(`/internal/customers/${customer.id}`)}>
                      {customer.name}
                    </h3>
                  </div>
                  <span className="customer-industry">{customer.industry}</span>
                </div>
                <div className="customer-actions">
                  <div className="dropdown-container">
                    <button
                      className="btn-icon"
                      onClick={() => setActiveDropdown(activeDropdown === customer.id ? null : customer.id)}
                    >
                      <FaEllipsisV />
                    </button>
                    {activeDropdown === customer.id && (
                      <div className="dropdown-menu">
                        <button onClick={() => handleCustomerAction("view", customer.id)}>
                          <FaEye /> View Details
                        </button>
                        <button onClick={() => handleCustomerAction("sites", customer.id)}>
                          <FaMapMarkerAlt /> View Sites
                        </button>
                        <button onClick={() => handleCustomerAction("analytics", customer.id)}>
                          <FaChartLine /> Analytics
                        </button>
                        {hasPermission && hasPermission("canManageCustomers") && (
                          <>
                            <button onClick={() => handleCustomerAction("edit", customer.id)}>
                              <FaEdit /> Edit Customer
                            </button>
                            <button onClick={() => handleCustomerAction("configure", customer.id)}>
                              <FaCog /> Configure
                            </button>
                          </>
                        )}
                        {hasPermission && hasPermission("canManageAllCustomers") && (
                          <button onClick={() => handleCustomerAction("delete", customer.id)} className="danger">
                            <FaTrash /> Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="customer-contact">
                <div className="contact-item">
                  <FaEnvelope />
                  <span>{customer.contactEmail}</span>
                </div>
                <div className="contact-item">
                  <FaPhone />
                  <span>{customer.contactPhone}</span>
                </div>
              </div>

              <div className="customer-tags">
                <span className={`status-tag ${customer.status}`}>
                  {customer.status}
                </span>
              </div>

              <div className="customer-metrics">
                <div className="metric">
                  <FaMapMarkerAlt />
                  <span className="metric-value">{customer.onlineSites}</span>
                  <span className="metric-label">/ {customer.siteCount} sites</span>
                </div>
                <div className="metric">
                  <FaUsers />
                  <span className="metric-value">{customer.totalUsers.toLocaleString()}</span>
                  <span className="metric-label">users</span>
                </div>
                <div className="metric">
                  <FaWifi />
                  <span className="metric-value">{customer.totalDevices.toLocaleString()}</span>
                  <span className="metric-label">devices</span>
                </div>
              </div>

              {customer.license && (
                <div className="customer-license">
                  <div className="license-header">
                    <span>License Usage</span>
                    <span>{Math.round((customer.license.usedUsers / customer.license.maxUsers) * 100)}%</span>
                  </div>
                  <div className="license-bar-container">
                    <div
                      className="license-bar"
                      style={{ width: `${(customer.license.usedUsers / customer.license.maxUsers) * 100}%` }}
                    />
                  </div>
                  <div className="license-details">
                    <span>{customer.license.usedUsers.toLocaleString()} / {customer.license.maxUsers.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="customer-footer">
                <span className="since-date">
                  <FaCalendarAlt /> Since {formatDate(customer.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customers List View */}
      {viewMode === "list" && (
        <div className="customers-list-table">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Customer Name</th>
                <th>Industry</th>
                <th>Contact</th>
                <th>Sites</th>
                <th>Users</th>
                <th>Devices</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className={customer.status}>
                  <td>{getStatusIcon(customer.status)}</td>
                  <td>
                    <span
                      className="customer-name-link"
                      onClick={() => navigate(`/internal/customers/${customer.id}`)}
                    >
                      {customer.name}
                    </span>
                  </td>
                  <td>{customer.industry}</td>
                  <td>
                    <div className="contact-cell">
                      <span>{customer.contactName}</span>
                      <small>{customer.contactEmail}</small>
                    </div>
                  </td>
                  <td>{customer.onlineSites} / {customer.siteCount}</td>
                  <td>{customer.totalUsers.toLocaleString()}</td>
                  <td>{customer.totalDevices.toLocaleString()}</td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => handleCustomerAction("view", customer.id)} title="View">
                        <FaEye />
                      </button>
                      <button onClick={() => handleCustomerAction("sites", customer.id)} title="Sites">
                        <FaMapMarkerAlt />
                      </button>
                      <button onClick={() => handleCustomerAction("edit", customer.id)} title="Edit">
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="empty-state">
          <FaBuilding className="empty-icon" />
          <h3>No customers found</h3>
          <p>Try adjusting your search or filters</p>
          <button className="btn btn-outline" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Customer Detail Modal */}
      {showCustomerModal && selectedCustomer && createPortal(
        <div className="customer-modal-overlay" onClick={closeCustomerModal}>
          <div className="customer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaBuilding /> Customer Details</h2>
              <button className="modal-close" onClick={closeCustomerModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              {/* Customer Overview */}
              <div className="detail-section">
                <div className="customer-overview">
                  <div className="overview-header">
                    <h3>{selectedCustomer.name}</h3>
                    <span className={`status-badge ${selectedCustomer.status}`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <p className="customer-industry-text">{selectedCustomer.industry}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="detail-section">
                <h4><FaIdCard /> Contact Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Contact Name</label>
                    <span>{selectedCustomer.contactName || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <span>{selectedCustomer.contactEmail}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <span>{selectedCustomer.contactPhone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Address</label>
                    <span>{selectedCustomer.address || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="detail-section">
                <h4><FaFileContract /> Account Details</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Customer ID</label>
                    <span className="monospace">{selectedCustomer.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Created Date</label>
                    <span>{formatDate(selectedCustomer.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Account Type</label>
                    <span>{selectedCustomer.accountType || 'Standard'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Billing Cycle</label>
                    <span>{selectedCustomer.billingCycle || 'Monthly'}</span>
                  </div>
                </div>
              </div>

              {/* Site & Usage Metrics */}
              <div className="detail-section">
                <h4><FaGlobe /> Site & Usage Metrics</h4>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon"><FaMapMarkerAlt /></div>
                    <div className="metric-info">
                      <span className="metric-value">{selectedCustomer.siteCount}</span>
                      <span className="metric-label">Total Sites</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon online"><FaCheckCircle /></div>
                    <div className="metric-info">
                      <span className="metric-value">{selectedCustomer.onlineSites}</span>
                      <span className="metric-label">Online Sites</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon"><FaUsers /></div>
                    <div className="metric-info">
                      <span className="metric-value">{selectedCustomer.totalUsers.toLocaleString()}</span>
                      <span className="metric-label">Total Users</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon"><FaWifi /></div>
                    <div className="metric-info">
                      <span className="metric-value">{selectedCustomer.totalDevices.toLocaleString()}</span>
                      <span className="metric-label">Total Devices</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* License Information */}
              {selectedCustomer.license && (
                <div className="detail-section">
                  <h4><FaChartLine /> License Information</h4>
                  <div className="license-detail">
                    <div className="license-progress">
                      <div className="progress-header">
                        <span>License Usage</span>
                        <span>{Math.round((selectedCustomer.license.usedUsers / selectedCustomer.license.maxUsers) * 100)}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${(selectedCustomer.license.usedUsers / selectedCustomer.license.maxUsers) * 100}%` }}
                        />
                      </div>
                      <div className="progress-details">
                        <span>{selectedCustomer.license.usedUsers.toLocaleString()} used</span>
                        <span>{selectedCustomer.license.maxUsers.toLocaleString()} total</span>
                      </div>
                    </div>
                    <div className="detail-grid" style={{ marginTop: '16px' }}>
                      <div className="detail-item">
                        <label>License Type</label>
                        <span>{selectedCustomer.license.type || 'Enterprise'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Valid Until</label>
                        <span>{selectedCustomer.license.validUntil ? formatDate(selectedCustomer.license.validUntil) : '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sites List */}
              {selectedCustomer.sites && selectedCustomer.sites.length > 0 && (
                <div className="detail-section">
                  <h4><FaMapMarkerAlt /> Sites ({selectedCustomer.sites.length})</h4>
                  <div className="sites-mini-list">
                    {selectedCustomer.sites.slice(0, 5).map(site => (
                      <div key={site.id} className="site-mini-item">
                        <div className="site-mini-info">
                          <span className="site-mini-name">{site.name}</span>
                          <span className="site-mini-location">{site.city}, {site.state}</span>
                        </div>
                        <span className={`site-mini-status ${site.status}`}>{site.status}</span>
                      </div>
                    ))}
                    {selectedCustomer.sites.length > 5 && (
                      <button
                        className="view-all-sites-btn"
                        onClick={() => {
                          closeCustomerModal();
                          navigate(`/internal/sites?customer=${selectedCustomer.id}`);
                        }}
                      >
                        View all {selectedCustomer.sites.length} sites
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeCustomerModal}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  closeCustomerModal();
                  navigate(`/internal/sites?customer=${selectedCustomer.id}`);
                }}
              >
                <FaMapMarkerAlt /> View Sites
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  closeCustomerModal();
                  navigate(`/internal/dashboard?customer=${selectedCustomer.id}`);
                }}
              >
                <FaChartLine /> View Analytics
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomerManagement;
