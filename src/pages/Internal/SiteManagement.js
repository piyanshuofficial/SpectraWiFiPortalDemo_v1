// src/pages/Internal/SiteManagement.js

import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import {
  FaMapMarkerAlt,
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
  FaExclamationCircle,
  FaBuilding,
  FaUsers,
  FaWifi,
  FaNetworkWired,
  FaTh,
  FaList,
  FaSyncAlt,
  FaTimes,
  FaSpinner,
  FaCheck,
} from "react-icons/fa";
import { sites, customers, configTemplates } from "@constants/internalPortalData";
import notifications from "@utils/notifications";
import Pagination from "@components/Pagination";
import "./SiteManagement.css";

// Get unique values for filters
const getUniqueValues = (array, key) => {
  return ["All", ...new Set(array.map(item => item[key]))].filter(Boolean);
};

/**
 * Site Management Component
 * Comprehensive multi-site management for internal Spectra staff
 */
const SiteManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hasPermission } = useAuth();

  // Get initial filter from URL params
  const initialStatus = searchParams.get("status") || "All";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Provision Modal State
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [provisionStep, setProvisionStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Site Detail/Edit/Configure Modal State
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteModalMode, setSiteModalMode] = useState(null); // 'view', 'edit', 'configure'
  const [editFormData, setEditFormData] = useState(null);
  const [configFormData, setConfigFormData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);

  // Initial form state
  const initialFormState = {
    customerId: "",
    siteName: "",
    siteType: "",
    city: "",
    state: "",
    region: "",
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    licenseTier: "Standard",
    bandwidthLimit: 500,
    storageLimit: 50,
    expectedUsers: 100,
    expectedDevices: 50,
    configTemplate: "",
    deploymentDate: "",
    notes: "",
    captivePortal: true,
    guestNetwork: false,
    vlanSegmentation: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  // Get filter options
  const customerOptions = useMemo(() =>
    ["All", ...customers.map(c => c.name)],
    []
  );
  const regionOptions = useMemo(() => getUniqueValues(sites, "region"), []);
  const typeOptions = useMemo(() => getUniqueValues(sites, "type"), []);
  const statusOptions = ["All", "online", "degraded", "offline", "maintenance"];

  // Filter sites
  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const matchesSearch =
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCustomer =
        selectedCustomer === "All" || site.customerName === selectedCustomer;

      const matchesStatus =
        selectedStatus === "All" || site.status === selectedStatus;

      const matchesRegion =
        selectedRegion === "All" || site.region === selectedRegion;

      const matchesType =
        selectedType === "All" || site.type === selectedType;

      return matchesSearch && matchesCustomer && matchesStatus && matchesRegion && matchesType;
    });
  }, [searchQuery, selectedCustomer, selectedStatus, selectedRegion, selectedType]);

  // Paginated sites for display
  const paginatedSites = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredSites.slice(startIndex, endIndex);
  }, [filteredSites, currentPage, rowsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCustomer, selectedStatus, selectedRegion, selectedType]);

  // Get status icon
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

  // Get uptime color class
  const getUptimeClass = (uptime) => {
    if (uptime >= 99) return "uptime-excellent";
    if (uptime >= 95) return "uptime-good";
    if (uptime >= 90) return "uptime-fair";
    return "uptime-poor";
  };

  // Open site modal
  const openSiteModal = (site, mode) => {
    setSelectedSite(site);
    setSiteModalMode(mode);

    if (mode === 'edit') {
      setEditFormData({
        name: site.name,
        city: site.city,
        state: site.state,
        region: site.region,
        type: site.type,
        primaryContact: site.primaryContact || '',
        primaryEmail: site.primaryEmail || '',
        primaryPhone: site.primaryPhone || '',
      });
    }

    if (mode === 'configure') {
      setConfigFormData({
        bandwidthLimit: site.bandwidthLimit || 500,
        storageLimit: site.storageLimit || 50,
        captivePortal: true,
        guestNetwork: false,
        vlanSegmentation: false,
        qosEnabled: true,
        firewallRules: 'moderate',
      });
    }
  };

  // Close site modal
  const closeSiteModal = () => {
    setSelectedSite(null);
    setSiteModalMode(null);
    setEditFormData(null);
    setConfigFormData(null);
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle config form change
  const handleConfigFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfigFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Save edit form
  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    notifications.showSuccess(`Site "${selectedSite.name}" updated successfully`);
    setIsSubmitting(false);
    closeSiteModal();
  };

  // Save config form
  const handleSaveConfig = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    notifications.showSuccess(`Configuration for "${selectedSite.name}" saved successfully`);
    setIsSubmitting(false);
    closeSiteModal();
  };

  // Handle site actions
  const handleSiteAction = (action, siteId) => {
    setActiveDropdown(null);
    const site = sites.find(s => s.id === siteId);
    if (!site) return;

    switch (action) {
      case "view":
        openSiteModal(site, 'view');
        break;
      case "edit":
        openSiteModal(site, 'edit');
        break;
      case "configure":
        openSiteModal(site, 'configure');
        break;
      case "delete":
        setSiteToDelete(site);
        setShowDeleteConfirm(true);
        break;
      default:
        break;
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!siteToDelete) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    notifications.showSuccess(`Site "${siteToDelete.name}" deleted successfully`);
    setIsSubmitting(false);
    setShowDeleteConfirm(false);
    setSiteToDelete(null);
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = filteredSites.length;
    const online = filteredSites.filter(s => s.status === "online").length;
    const degraded = filteredSites.filter(s => s.status === "degraded").length;
    const offline = filteredSites.filter(s => s.status === "offline").length;
    const totalUsers = filteredSites.reduce((sum, s) => sum + s.totalUsers, 0);
    const totalDevices = filteredSites.reduce((sum, s) => sum + s.totalDevices, 0);

    return { total, online, degraded, offline, totalUsers, totalDevices };
  }, [filteredSites]);

  // Clear filters
  const clearFilters = () => {
    setSelectedCustomer("All");
    setSelectedStatus("All");
    setSelectedRegion("All");
    setSelectedType("All");
    setSearchQuery("");
  };

  // Get selected customer data
  const getSelectedCustomer = () => {
    return customers.find(c => c.id === formData.customerId);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Auto-fill site type from customer
    if (name === "customerId" && value) {
      const customer = customers.find(c => c.id === value);
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerId: value,
          siteType: customer.type,
        }));
      }
    }
  };

  // Validate step 1
  const validateStep1 = () => {
    const errors = {};
    if (!formData.customerId) errors.customerId = "Please select a customer";
    if (!formData.siteName.trim()) errors.siteName = "Site name is required";
    if (!formData.siteType) errors.siteType = "Site type is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.region) errors.region = "Region is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate step 2
  const validateStep2 = () => {
    const errors = {};
    if (!formData.primaryContactName.trim()) errors.primaryContactName = "Contact name is required";
    if (!formData.primaryContactEmail.trim()) {
      errors.primaryContactEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryContactEmail)) {
      errors.primaryContactEmail = "Invalid email format";
    }
    if (!formData.primaryContactPhone.trim()) errors.primaryContactPhone = "Phone is required";
    if (!formData.licenseTier) errors.licenseTier = "License tier is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (provisionStep === 1 && validateStep1()) {
      setProvisionStep(2);
    } else if (provisionStep === 2 && validateStep2()) {
      setProvisionStep(3);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (provisionStep > 1) {
      setProvisionStep(provisionStep - 1);
    }
  };

  // Handle form submit
  const handleProvisionSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate new site ID
    const newSiteId = `site_${Date.now()}`;
    const selectedCustomerData = getSelectedCustomer();

    const newSite = {
      id: newSiteId,
      customerId: formData.customerId,
      customerName: selectedCustomerData?.name || "",
      name: formData.siteName,
      city: formData.city,
      state: formData.state,
      region: formData.region,
      type: formData.siteType,
      status: "provisioning",
      deploymentDate: formData.deploymentDate || new Date().toISOString().split('T')[0],
      lastSeen: new Date().toISOString(),
      totalUsers: parseInt(formData.expectedUsers) || 0,
      activeUsers: 0,
      totalDevices: parseInt(formData.expectedDevices) || 0,
      onlineDevices: 0,
      bandwidthUsage: 0,
      bandwidthLimit: parseInt(formData.bandwidthLimit) || 500,
      storageUsed: 0,
      storageLimit: parseInt(formData.storageLimit) || 50,
      activeConnections: 0,
      dailyDataTransfer: 0,
      uptime: 0,
      alerts: 0,
      criticalAlerts: 0,
      licenseTier: formData.licenseTier,
      primaryContact: formData.primaryContactName,
      primaryEmail: formData.primaryContactEmail,
      primaryPhone: formData.primaryContactPhone,
    };

    console.log("New site provisioned:", newSite);

    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  // Open provision modal
  const openProvisionModal = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setProvisionStep(1);
    setSubmitSuccess(false);
    setShowProvisionModal(true);
  };

  // Close provision modal
  const closeProvisionModal = () => {
    setShowProvisionModal(false);
    setProvisionStep(1);
    setFormData(initialFormState);
    setFormErrors({});
    setSubmitSuccess(false);
  };

  // State options
  const stateOptions = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh", "Puducherry"
  ];

  const regionOptions_list = ["North", "South", "East", "West"];
  const siteTypeOptions = ["Hotel", "Co-Working", "Co-Living", "PG", "Enterprise"];
  const licenseTierOptions = ["Basic", "Standard", "Premium", "Enterprise"];

  return (
    <div className="site-management">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>
            <FaMapMarkerAlt /> Site Management
          </h1>
          <p>Manage and monitor all customer sites</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => console.log("Refresh")}>
            <FaSyncAlt /> Refresh
          </button>
          <button className="btn btn-outline" onClick={() => console.log("Export")}>
            <FaDownload /> Export
          </button>
          <button className="btn btn-primary" onClick={openProvisionModal}>
            <FaPlus /> Provision New Site
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="summary-stat">
          <span className="stat-number">{summaryStats.total}</span>
          <span className="stat-label">Total Sites</span>
        </div>
        <div className="summary-stat online">
          <span className="stat-number">{summaryStats.online}</span>
          <span className="stat-label">Online</span>
        </div>
        <div className="summary-stat degraded">
          <span className="stat-number">{summaryStats.degraded}</span>
          <span className="stat-label">Degraded</span>
        </div>
        <div className="summary-stat offline">
          <span className="stat-number">{summaryStats.offline}</span>
          <span className="stat-label">Offline</span>
        </div>
        <div className="summary-stat">
          <span className="stat-number">{summaryStats.totalUsers.toLocaleString()}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="summary-stat">
          <span className="stat-number">{summaryStats.totalDevices.toLocaleString()}</span>
          <span className="stat-label">Total Devices</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-card">
        <div className="search-row">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search sites by name, customer, or city..."
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
              <label>Customer</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                {customerOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt === "All" ? "All" : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regionOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {typeOptions.map((opt) => (
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
      {filteredSites.length > 0 && (
        <div className="pagination-wrapper">
          <Pagination
            totalItems={filteredSites.length}
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

      {/* Sites Grid View */}
      {viewMode === "grid" && (
        <div className="sites-grid">
          {paginatedSites.map((site) => (
            <div key={site.id} className="site-card">
              <div className="site-card-header">
                <div className="site-info">
                  <div className="site-status-name">
                    {getStatusIcon(site.status)}
                    <h3 onClick={() => navigate(`/internal/sites/${site.id}`)}>
                      {site.name}
                    </h3>
                  </div>
                  <span className="site-customer">{site.customerName}</span>
                </div>
                <div className="site-actions">
                  <div className="dropdown-container">
                    <button
                      className="btn-icon"
                      onClick={() => setActiveDropdown(activeDropdown === site.id ? null : site.id)}
                    >
                      <FaEllipsisV />
                    </button>
                    {activeDropdown === site.id && (
                      <div className="dropdown-menu">
                        <button onClick={() => handleSiteAction("view", site.id)}>
                          <FaEye /> View Details
                        </button>
                        {hasPermission && hasPermission("canConfigureSites") && (
                          <>
                            <button onClick={() => handleSiteAction("edit", site.id)}>
                              <FaEdit /> Edit Site
                            </button>
                            <button onClick={() => handleSiteAction("configure", site.id)}>
                              <FaCog /> Configure
                            </button>
                          </>
                        )}
                        {hasPermission && hasPermission("canManageAllSites") && (
                          <button onClick={() => handleSiteAction("delete", site.id)} className="danger">
                            <FaTrash /> Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="site-location">
                <FaMapMarkerAlt /> {site.city}, {site.state} ({site.region})
              </div>

              <div className="site-tags">
                <span className="type-tag">{site.type}</span>
                <span className={`status-tag ${site.status}`}>{site.status}</span>
              </div>

              <div className="site-metrics">
                <div className="metric">
                  <FaUsers />
                  <span className="metric-value">{site.activeUsers}</span>
                  <span className="metric-label">/ {site.totalUsers}</span>
                </div>
                <div className="metric">
                  <FaWifi />
                  <span className="metric-value">{site.onlineDevices}</span>
                  <span className="metric-label">/ {site.totalDevices}</span>
                </div>
                <div className="metric">
                  <FaNetworkWired />
                  <span className="metric-value">{site.bandwidthUsage}</span>
                  <span className="metric-label">Mbps</span>
                </div>
              </div>

              <div className="site-uptime">
                <div className="uptime-header">
                  <span>Uptime</span>
                  <span className={getUptimeClass(site.uptime)}>{site.uptime}%</span>
                </div>
                <div className="uptime-bar-container">
                  <div
                    className={`uptime-bar ${getUptimeClass(site.uptime)}`}
                    style={{ width: `${site.uptime}%` }}
                  />
                </div>
              </div>

              {site.alerts > 0 && (
                <div className="site-alerts">
                  <span className={site.criticalAlerts > 0 ? "critical" : "warning"}>
                    {site.alerts} alert{site.alerts > 1 ? "s" : ""}
                    {site.criticalAlerts > 0 && ` (${site.criticalAlerts} critical)`}
                  </span>
                </div>
              )}

              <div className="site-footer">
                <span className="last-seen">
                  Last seen: {new Date(site.lastSeen).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sites List View */}
      {viewMode === "list" && (
        <div className="sites-list-table">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Site Name</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Type</th>
                <th>Users</th>
                <th>Devices</th>
                <th>Bandwidth</th>
                <th>Uptime</th>
                <th>Alerts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSites.map((site) => (
                <tr key={site.id} className={site.status}>
                  <td>{getStatusIcon(site.status)}</td>
                  <td>
                    <span
                      className="site-name-link"
                      onClick={() => navigate(`/internal/sites/${site.id}`)}
                    >
                      {site.name}
                    </span>
                  </td>
                  <td>{site.customerName}</td>
                  <td>{site.city}, {site.region}</td>
                  <td><span className="type-badge">{site.type}</span></td>
                  <td>{site.activeUsers} / {site.totalUsers}</td>
                  <td>{site.onlineDevices} / {site.totalDevices}</td>
                  <td>{site.bandwidthUsage} Mbps</td>
                  <td>
                    <span className={`uptime-badge ${getUptimeClass(site.uptime)}`}>
                      {site.uptime}%
                    </span>
                  </td>
                  <td>
                    {site.alerts > 0 ? (
                      <span className={`alerts-badge ${site.criticalAlerts > 0 ? "critical" : "warning"}`}>
                        {site.alerts}
                      </span>
                    ) : (
                      <span className="alerts-badge ok">0</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => handleSiteAction("view", site.id)} title="View">
                        <FaEye />
                      </button>
                      <button onClick={() => handleSiteAction("edit", site.id)} title="Edit">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleSiteAction("configure", site.id)} title="Configure">
                        <FaCog />
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
      {filteredSites.length === 0 && (
        <div className="empty-state">
          <FaBuilding className="empty-icon" />
          <h3>No sites found</h3>
          <p>Try adjusting your search or filters</p>
          <button className="btn btn-outline" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Provision New Site Modal */}
      {showProvisionModal && (
        <div className="provision-modal-overlay" onClick={closeProvisionModal}>
          <div className="provision-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeProvisionModal}>
              <FaTimes />
            </button>

            <div className="modal-header">
              <h2>Provision New Site</h2>
              {!submitSuccess && (
                <div className="step-indicator">
                  <div className={`step ${provisionStep >= 1 ? "active" : ""} ${provisionStep > 1 ? "completed" : ""}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Site Details</span>
                  </div>
                  <div className="step-line" />
                  <div className={`step ${provisionStep >= 2 ? "active" : ""} ${provisionStep > 2 ? "completed" : ""}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Contact & License</span>
                  </div>
                  <div className="step-line" />
                  <div className={`step ${provisionStep >= 3 ? "active" : ""}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Configuration</span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-body">
              {/* Success State */}
              {submitSuccess ? (
                <div className="success-state">
                  <div className="success-icon">
                    <FaCheckCircle />
                  </div>
                  <h3>Site Provisioned Successfully!</h3>
                  <p>
                    <strong>{formData.siteName}</strong> has been created for{" "}
                    <strong>{getSelectedCustomer()?.name}</strong>
                  </p>
                  <div className="success-details">
                    <div className="detail-item">
                      <span className="label">Site ID:</span>
                      <span className="value">SITE-{Date.now().toString().slice(-6)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Location:</span>
                      <span className="value">{formData.city}, {formData.state}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">License Tier:</span>
                      <span className="value">{formData.licenseTier}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Status:</span>
                      <span className="value status-provisioning">Provisioning</span>
                    </div>
                  </div>
                  <p className="success-note">
                    The site is now being set up. You will receive a notification once it's ready.
                  </p>
                  <div className="success-actions">
                    <button className="btn btn-outline" onClick={closeProvisionModal}>
                      Close
                    </button>
                    <button className="btn btn-primary" onClick={() => {
                      closeProvisionModal();
                      openProvisionModal();
                    }}>
                      Provision Another Site
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step 1: Site Details */}
                  {provisionStep === 1 && (
                    <div className="form-step">
                      <h3>Site Details</h3>
                      <p className="step-description">Enter the basic information about the new site</p>

                      <div className="form-grid">
                        <div className={`form-group full-width ${formErrors.customerId ? "has-error" : ""}`}>
                          <label>Customer <span className="required">*</span></label>
                          <select
                            name="customerId"
                            value={formData.customerId}
                            onChange={handleInputChange}
                          >
                            <option value="">Select a customer</option>
                            {customers.filter(c => c.status === "active").map(customer => (
                              <option key={customer.id} value={customer.id}>
                                {customer.name} ({customer.type})
                              </option>
                            ))}
                          </select>
                          {formErrors.customerId && <span className="error-text">{formErrors.customerId}</span>}
                        </div>

                        <div className={`form-group ${formErrors.siteName ? "has-error" : ""}`}>
                          <label>Site Name <span className="required">*</span></label>
                          <input
                            type="text"
                            name="siteName"
                            value={formData.siteName}
                            onChange={handleInputChange}
                            placeholder="e.g., The Grand Hotel, Mumbai"
                          />
                          {formErrors.siteName && <span className="error-text">{formErrors.siteName}</span>}
                        </div>

                        <div className={`form-group ${formErrors.siteType ? "has-error" : ""}`}>
                          <label>Site Type <span className="required">*</span></label>
                          <select
                            name="siteType"
                            value={formData.siteType}
                            onChange={handleInputChange}
                          >
                            <option value="">Select type</option>
                            {siteTypeOptions.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          {formErrors.siteType && <span className="error-text">{formErrors.siteType}</span>}
                        </div>

                        <div className={`form-group ${formErrors.city ? "has-error" : ""}`}>
                          <label>City <span className="required">*</span></label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="e.g., Mumbai"
                          />
                          {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                        </div>

                        <div className={`form-group ${formErrors.state ? "has-error" : ""}`}>
                          <label>State <span className="required">*</span></label>
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                          >
                            <option value="">Select state</option>
                            {stateOptions.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                          {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                        </div>

                        <div className={`form-group ${formErrors.region ? "has-error" : ""}`}>
                          <label>Region <span className="required">*</span></label>
                          <select
                            name="region"
                            value={formData.region}
                            onChange={handleInputChange}
                          >
                            <option value="">Select region</option>
                            {regionOptions_list.map(region => (
                              <option key={region} value={region}>{region}</option>
                            ))}
                          </select>
                          {formErrors.region && <span className="error-text">{formErrors.region}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Contact & License */}
                  {provisionStep === 2 && (
                    <div className="form-step">
                      <h3>Contact & License Information</h3>
                      <p className="step-description">Primary contact details and license configuration</p>

                      <div className="form-grid">
                        <div className={`form-group ${formErrors.primaryContactName ? "has-error" : ""}`}>
                          <label>Primary Contact Name <span className="required">*</span></label>
                          <input
                            type="text"
                            name="primaryContactName"
                            value={formData.primaryContactName}
                            onChange={handleInputChange}
                            placeholder="e.g., Rahul Sharma"
                          />
                          {formErrors.primaryContactName && <span className="error-text">{formErrors.primaryContactName}</span>}
                        </div>

                        <div className={`form-group ${formErrors.primaryContactPhone ? "has-error" : ""}`}>
                          <label>Contact Phone <span className="required">*</span></label>
                          <input
                            type="tel"
                            name="primaryContactPhone"
                            value={formData.primaryContactPhone}
                            onChange={handleInputChange}
                            placeholder="e.g., +91 98765 43210"
                          />
                          {formErrors.primaryContactPhone && <span className="error-text">{formErrors.primaryContactPhone}</span>}
                        </div>

                        <div className={`form-group full-width ${formErrors.primaryContactEmail ? "has-error" : ""}`}>
                          <label>Contact Email <span className="required">*</span></label>
                          <input
                            type="email"
                            name="primaryContactEmail"
                            value={formData.primaryContactEmail}
                            onChange={handleInputChange}
                            placeholder="e.g., rahul.sharma@company.com"
                          />
                          {formErrors.primaryContactEmail && <span className="error-text">{formErrors.primaryContactEmail}</span>}
                        </div>

                        <div className={`form-group ${formErrors.licenseTier ? "has-error" : ""}`}>
                          <label>License Tier <span className="required">*</span></label>
                          <select
                            name="licenseTier"
                            value={formData.licenseTier}
                            onChange={handleInputChange}
                          >
                            {licenseTierOptions.map(tier => (
                              <option key={tier} value={tier}>{tier}</option>
                            ))}
                          </select>
                          {formErrors.licenseTier && <span className="error-text">{formErrors.licenseTier}</span>}
                        </div>

                        <div className="form-group">
                          <label>Deployment Date</label>
                          <input
                            type="date"
                            name="deploymentDate"
                            value={formData.deploymentDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Configuration */}
                  {provisionStep === 3 && (
                    <div className="form-step">
                      <h3>Site Configuration</h3>
                      <p className="step-description">Configure capacity and network settings</p>

                      <div className="form-grid">
                        <div className="form-group">
                          <label>Configuration Template</label>
                          <select
                            name="configTemplate"
                            value={formData.configTemplate}
                            onChange={handleInputChange}
                          >
                            <option value="">Use default settings</option>
                            {configTemplates.map(template => (
                              <option key={template.id} value={template.id}>
                                {template.name} ({template.tier})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Expected Users</label>
                          <input
                            type="number"
                            name="expectedUsers"
                            value={formData.expectedUsers}
                            onChange={handleInputChange}
                            min="1"
                          />
                        </div>

                        <div className="form-group">
                          <label>Expected Devices</label>
                          <input
                            type="number"
                            name="expectedDevices"
                            value={formData.expectedDevices}
                            onChange={handleInputChange}
                            min="1"
                          />
                        </div>

                        <div className="form-group">
                          <label>Bandwidth Limit (Mbps)</label>
                          <input
                            type="number"
                            name="bandwidthLimit"
                            value={formData.bandwidthLimit}
                            onChange={handleInputChange}
                            min="100"
                            step="100"
                          />
                        </div>

                        <div className="form-group">
                          <label>Storage Limit (GB)</label>
                          <input
                            type="number"
                            name="storageLimit"
                            value={formData.storageLimit}
                            onChange={handleInputChange}
                            min="10"
                            step="10"
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Notes</label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Any additional notes or special requirements..."
                            rows="3"
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Network Features</label>
                          <div className="checkbox-group">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                name="captivePortal"
                                checked={formData.captivePortal}
                                onChange={handleInputChange}
                              />
                              <span>Captive Portal</span>
                            </label>
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                name="guestNetwork"
                                checked={formData.guestNetwork}
                                onChange={handleInputChange}
                              />
                              <span>Guest Network</span>
                            </label>
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                name="vlanSegmentation"
                                checked={formData.vlanSegmentation}
                                onChange={handleInputChange}
                              />
                              <span>VLAN Segmentation</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Summary Preview */}
                      <div className="provision-summary">
                        <h4>Provision Summary</h4>
                        <div className="summary-grid">
                          <div className="summary-item">
                            <span className="label">Customer:</span>
                            <span className="value">{getSelectedCustomer()?.name}</span>
                          </div>
                          <div className="summary-item">
                            <span className="label">Site:</span>
                            <span className="value">{formData.siteName}</span>
                          </div>
                          <div className="summary-item">
                            <span className="label">Location:</span>
                            <span className="value">{formData.city}, {formData.state} ({formData.region})</span>
                          </div>
                          <div className="summary-item">
                            <span className="label">Type:</span>
                            <span className="value">{formData.siteType}</span>
                          </div>
                          <div className="summary-item">
                            <span className="label">License:</span>
                            <span className="value">{formData.licenseTier}</span>
                          </div>
                          <div className="summary-item">
                            <span className="label">Contact:</span>
                            <span className="value">{formData.primaryContactName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!submitSuccess && (
              <div className="modal-footer">
                {provisionStep > 1 && (
                  <button className="btn btn-outline" onClick={handlePrevStep}>
                    Back
                  </button>
                )}
                <div className="footer-right">
                  <button className="btn btn-outline" onClick={closeProvisionModal}>
                    Cancel
                  </button>
                  {provisionStep < 3 ? (
                    <button className="btn btn-primary" onClick={handleNextStep}>
                      Next
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={handleProvisionSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="spin" /> Provisioning...
                        </>
                      ) : (
                        <>
                          <FaCheck /> Provision Site
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Site Detail/Edit/Configure Modal */}
      {selectedSite && siteModalMode && (
        <div className="site-modal-overlay" onClick={closeSiteModal}>
          <div className="site-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeSiteModal}>
              <FaTimes />
            </button>

            <div className="modal-header">
              <h2>
                {siteModalMode === 'view' && 'Site Details'}
                {siteModalMode === 'edit' && 'Edit Site'}
                {siteModalMode === 'configure' && 'Configure Site'}
              </h2>
              <div className="site-status-header">
                {getStatusIcon(selectedSite.status)}
                <span className={`status-text ${selectedSite.status}`}>
                  {selectedSite.status.charAt(0).toUpperCase() + selectedSite.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="modal-body">
              {/* View Mode */}
              {siteModalMode === 'view' && (
                <div className="site-detail-view">
                  <div className="detail-section">
                    <h3>General Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Site Name</span>
                        <span className="detail-value">{selectedSite.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Customer</span>
                        <span className="detail-value">{selectedSite.customerName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Location</span>
                        <span className="detail-value">{selectedSite.city}, {selectedSite.state}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Region</span>
                        <span className="detail-value">{selectedSite.region}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Type</span>
                        <span className="detail-value">{selectedSite.type}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Deployment Date</span>
                        <span className="detail-value">{selectedSite.deploymentDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Usage Metrics</h3>
                    <div className="metrics-row">
                      <div className="metric-box">
                        <FaUsers className="metric-icon" />
                        <div className="metric-data">
                          <span className="metric-value">{selectedSite.activeUsers} / {selectedSite.totalUsers}</span>
                          <span className="metric-label">Active Users</span>
                        </div>
                      </div>
                      <div className="metric-box">
                        <FaWifi className="metric-icon" />
                        <div className="metric-data">
                          <span className="metric-value">{selectedSite.onlineDevices} / {selectedSite.totalDevices}</span>
                          <span className="metric-label">Online Devices</span>
                        </div>
                      </div>
                      <div className="metric-box">
                        <FaNetworkWired className="metric-icon" />
                        <div className="metric-data">
                          <span className="metric-value">{selectedSite.bandwidthUsage} / {selectedSite.bandwidthLimit} Mbps</span>
                          <span className="metric-label">Bandwidth</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Performance</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Uptime</span>
                        <span className={`detail-value ${getUptimeClass(selectedSite.uptime)}`}>
                          {selectedSite.uptime}%
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Active Alerts</span>
                        <span className={`detail-value ${selectedSite.criticalAlerts > 0 ? 'critical' : ''}`}>
                          {selectedSite.alerts} {selectedSite.criticalAlerts > 0 && `(${selectedSite.criticalAlerts} critical)`}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Daily Data Transfer</span>
                        <span className="detail-value">{selectedSite.dailyDataTransfer} TB</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Active Connections</span>
                        <span className="detail-value">{selectedSite.activeConnections?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Contact Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Primary Contact</span>
                        <span className="detail-value">{selectedSite.primaryContact || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{selectedSite.primaryEmail || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">{selectedSite.primaryPhone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Mode */}
              {siteModalMode === 'edit' && editFormData && (
                <div className="site-edit-form">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Site Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData.city}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <select
                        name="state"
                        value={editFormData.state}
                        onChange={handleEditFormChange}
                      >
                        {stateOptions.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Region</label>
                      <select
                        name="region"
                        value={editFormData.region}
                        onChange={handleEditFormChange}
                      >
                        {regionOptions_list.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        name="type"
                        value={editFormData.type}
                        onChange={handleEditFormChange}
                      >
                        {siteTypeOptions.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Primary Contact</label>
                      <input
                        type="text"
                        name="primaryContact"
                        value={editFormData.primaryContact}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Email</label>
                      <input
                        type="email"
                        name="primaryEmail"
                        value={editFormData.primaryEmail}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Phone</label>
                      <input
                        type="tel"
                        name="primaryPhone"
                        value={editFormData.primaryPhone}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Configure Mode */}
              {siteModalMode === 'configure' && configFormData && (
                <div className="site-config-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Bandwidth Limit (Mbps)</label>
                      <input
                        type="number"
                        name="bandwidthLimit"
                        value={configFormData.bandwidthLimit}
                        onChange={handleConfigFormChange}
                        min="100"
                        step="100"
                      />
                    </div>
                    <div className="form-group">
                      <label>Storage Limit (GB)</label>
                      <input
                        type="number"
                        name="storageLimit"
                        value={configFormData.storageLimit}
                        onChange={handleConfigFormChange}
                        min="10"
                        step="10"
                      />
                    </div>
                    <div className="form-group">
                      <label>Firewall Rules</label>
                      <select
                        name="firewallRules"
                        value={configFormData.firewallRules}
                        onChange={handleConfigFormChange}
                      >
                        <option value="basic">Basic</option>
                        <option value="moderate">Moderate</option>
                        <option value="strict">Strict</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Network Features</label>
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="captivePortal"
                            checked={configFormData.captivePortal}
                            onChange={handleConfigFormChange}
                          />
                          <span>Captive Portal</span>
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="guestNetwork"
                            checked={configFormData.guestNetwork}
                            onChange={handleConfigFormChange}
                          />
                          <span>Guest Network</span>
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="vlanSegmentation"
                            checked={configFormData.vlanSegmentation}
                            onChange={handleConfigFormChange}
                          />
                          <span>VLAN Segmentation</span>
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="qosEnabled"
                            checked={configFormData.qosEnabled}
                            onChange={handleConfigFormChange}
                          />
                          <span>QoS Enabled</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeSiteModal}>
                {siteModalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {siteModalMode === 'view' && (
                <div className="footer-right">
                  <button className="btn btn-secondary" onClick={() => openSiteModal(selectedSite, 'edit')}>
                    <FaEdit /> Edit
                  </button>
                  <button className="btn btn-primary" onClick={() => openSiteModal(selectedSite, 'configure')}>
                    <FaCog /> Configure
                  </button>
                </div>
              )}
              {siteModalMode === 'edit' && (
                <button className="btn btn-primary" onClick={handleSaveEdit} disabled={isSubmitting}>
                  {isSubmitting ? <><FaSpinner className="spin" /> Saving...</> : <><FaCheck /> Save Changes</>}
                </button>
              )}
              {siteModalMode === 'configure' && (
                <button className="btn btn-primary" onClick={handleSaveConfig} disabled={isSubmitting}>
                  {isSubmitting ? <><FaSpinner className="spin" /> Saving...</> : <><FaCheck /> Apply Configuration</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && siteToDelete && (
        <div className="delete-confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-icon">
              <FaTrash />
            </div>
            <h3>Delete Site</h3>
            <p>Are you sure you want to delete <strong>{siteToDelete.name}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isSubmitting}>
                {isSubmitting ? <><FaSpinner className="spin" /> Deleting...</> : 'Delete Site'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteManagement;
