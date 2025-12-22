/**
 * ============================================================================
 * Site Management Page (Internal Portal)
 * ============================================================================
 *
 * @file src/pages/Internal/SiteManagement.js
 * @description Comprehensive site management for Spectra internal staff.
 *              Lists all customer sites across all segments with filtering,
 *              status monitoring, and provisioning capabilities.
 *
 * @portalType Internal (Spectra Staff Only)
 *
 * @features
 * - Grid and List view modes
 * - Search by site name, location, or customer
 * - Filter by status, region, customer, segment
 * - Provision new sites via wizard modal
 * - View site configuration details
 * - "View as Customer" to see customer portal as that site
 * - Credentials management (view/rotate)
 * - Export site list to CSV
 * - Site status monitoring (online, degraded, offline)
 *
 * @pageStructure
 * ```
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ Page Title: "Site Management"                                            │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Summary Cards:                                                           │
 * │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
 * │ │ Total   │ │ Online  │ │ Degraded│ │ Offline │ │ Maint.  │             │
 * │ │ Sites   │ │    45   │ │    3    │ │    1    │ │    2    │             │
 * │ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Toolbar: [Search] [Filters] [Add Site] [Export] [Grid|List Toggle]      │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Filter Panel (collapsible):                                              │
 * │ [Status ▼] [Region ▼] [Customer ▼] [Segment ▼]                          │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Site Cards/Table:                                                        │
 * │ ┌────────────────────────────────────────────────────────────────────┐  │
 * │ │ [●] Site Name          Customer: Acme Corp        Segment: Hotel   │  │
 * │ │     Mumbai, India      Users: 245    Devices: 312  Status: Online  │  │
 * │ │     [View] [Config] [Credentials] [View as Customer] [...]         │  │
 * │ └────────────────────────────────────────────────────────────────────┘  │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │ Pagination: [< 1 2 3 4 5 >]  Rows per page: [10 ▼]                      │
 * └──────────────────────────────────────────────────────────────────────────┘
 * ```
 *
 * @siteStatuses
 * | Status      | Color  | Description                              |
 * |-------------|--------|------------------------------------------|
 * | Online      | Green  | All systems operational                  |
 * | Degraded    | Yellow | Some connectivity issues                 |
 * | Offline     | Red    | No connectivity to NAS                   |
 * | Maintenance | Blue   | Scheduled maintenance window             |
 * | Pending     | Gray   | Not yet provisioned (in queue)           |
 *
 * @provisioningModal
 * "Add Site" opens SiteProvisioningModal wizard with steps:
 * 1. Basic Info: Name, location, customer selection
 * 2. Segment Config: Select segment type (Enterprise, Hotel, etc.)
 * 3. Network Config: NAS IP, RADIUS settings
 * 4. Auth Config: Authentication methods (MAB, Captive Portal, etc.)
 * 5. Policy Config: License count, default policies
 * 6. Review & Submit
 *
 * @viewAsCustomerFeature
 * Opens CustomerViewModal allowing staff to:
 * - Impersonate as a specific site user
 * - View customer portal in read-only mode
 * - Test what customers see
 * - Troubleshoot customer-reported issues
 *
 * @credentialsManagement
 * Site credentials panel shows:
 * - RADIUS shared secret (masked, click to reveal)
 * - NAS credentials
 * - API keys if applicable
 * - Option to rotate/regenerate credentials
 *
 * @customerFilter
 * Supports filtering by customer via URL:
 * - URL: /internal/sites?customer=CUST001
 * - Shows only that customer's sites
 *
 * @permissions
 * - canAccessInternalPortal: View sites list
 * - canProvisionSites: Add new site button visible
 * - canViewSiteCredentials: View credentials action
 * - canRotateCredentials: Rotate credentials action
 *
 * @dependencies
 * - internalPortalData.js: Sample sites data
 * - CustomerViewModal: For impersonation
 * - SiteProvisioningModal: Site creation wizard
 * - siteProvisioningConfig.js: Auth method configurations
 *
 * @relatedFiles
 * - SiteProvisioningModal.js: Site provisioning wizard
 * - SiteProvisioningQueue.js: Pending sites queue
 * - CustomerManagement.js: Customer listing
 * - internalPortalData.js: Sample data
 * - SiteManagement.css: Page styles
 *
 * ============================================================================
 */

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
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
  FaKey,
  FaShieldAlt,
  FaUserSecret,
} from "react-icons/fa";
import { sites, customers, configTemplates } from "@constants/internalPortalData";
import CustomerViewModal from "@components/CustomerViewModal";
import SearchableSelect from "@components/SearchableSelect";
import { getAllCustomers, getSitesForSegment } from "@context/CustomerViewContext";
import {
  formatAuthConfigForDisplay,
  getAuthConfigSummary,
  AUTH_METHODS,
  getAuthCategoriesForSegment,
  getDefaultAuthConfig,
  validateAuthConfig
} from "@constants/siteProvisioningConfig";
import notifications from "@utils/notifications";
import Pagination from "@components/Pagination";
import SiteProvisioningModal from "@components/SiteProvisioningModal/SiteProvisioningModal";
import PageLoadingSkeleton from "@components/Loading/PageLoadingSkeleton";
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
  const { siteId } = useParams();
  const { hasPermission } = useAuth();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    /* ========================================================================
     * BACKEND INTEGRATION: Load Sites List for Internal Portal
     * ========================================================================
     * API Endpoint: GET /api/v1/internal/sites
     *
     * Query Parameters:
     * - customerId (optional): Filter by customer
     * - status (optional): Filter by status (online|degraded|offline|maintenance)
     * - region (optional): Filter by region
     * - type (optional): Filter by site type
     * - page: Page number for pagination
     * - limit: Items per page
     * - search: Search term for name/city
     *
     * Expected Response (Success - 200):
     * {
     *   "success": true,
     *   "data": {
     *     "sites": [{
     *       "id": "string",
     *       "name": "string",
     *       "customerId": "string",
     *       "customerName": "string",
     *       "type": "string",              // Enterprise, Hotel, CoLiving, etc.
     *       "status": "online|degraded|offline|maintenance",
     *       "city": "string",
     *       "state": "string",
     *       "region": "string",            // North, South, East, West
     *       "totalUsers": number,
     *       "activeUsers": number,
     *       "totalDevices": number,
     *       "accessPoints": number,
     *       "uptime": number,              // Percentage
     *       "lastSeen": "ISO8601",
     *       "deployedAt": "ISO8601",
     *       "configTemplate": "string",
     *       "primaryContact": {
     *         "name": "string",
     *         "email": "string",
     *         "phone": "string"
     *       },
     *       "networkConfig": {
     *         "bandwidthLimit": number,
     *         "vlans": number,
     *         "captivePortal": boolean,
     *         "guestNetwork": boolean
     *       }
     *     }],
     *     "totalCount": number,
     *     "page": number,
     *     "limit": number
     *   }
     * }
     *
     * Backend Processing:
     * 1. Authenticate internal user and verify permissions
     * 2. Query sites database with filters
     * 3. For each site, fetch real-time status from:
     *    - Network monitoring system (connectivity status)
     *    - AAA system (active users/sessions)
     *    - Controller API (access point status)
     * 4. Calculate uptime from monitoring data
     * 5. Return paginated results
     *
     * Sample Integration Code:
     * ------------------------
     * const fetchSites = async () => {
     *   setIsLoading(true);
     *   try {
     *     const params = new URLSearchParams({
     *       page: currentPage,
     *       limit: rowsPerPage,
     *       ...(selectedCustomer !== 'All' && { customerId: selectedCustomer }),
     *       ...(selectedStatus !== 'All' && { status: selectedStatus }),
     *       ...(searchQuery && { search: searchQuery })
     *     });
     *     const response = await fetch(`/api/v1/internal/sites?${params}`, {
     *       headers: { 'Authorization': `Bearer ${authToken}` }
     *     });
     *     const result = await response.json();
     *     if (result.success) {
     *       setSites(result.data.sites);
     *       setTotalCount(result.data.totalCount);
     *     }
     *   } catch (error) {
     *     notifications.operationFailed('load sites');
     *   } finally {
     *     setIsLoading(false);
     *   }
     * };
     * ======================================================================== */

    // TODO: Remove mock and implement actual API call above
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Handle siteId from URL - open site detail modal when navigating from "Investigate" button
  useEffect(() => {
    if (!isLoading && siteId) {
      const site = sites.find(s => s.id === siteId || s.id === parseInt(siteId));
      if (site) {
        setSelectedSite(site);
        setSiteModalMode('view');
      } else {
        notifications.showError(`Site with ID "${siteId}" not found`);
        navigate('/internal/sites', { replace: true });
      }
    }
  }, [isLoading, siteId, navigate]);

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
  const [showEnhancedProvisionModal, setShowEnhancedProvisionModal] = useState(false); // New enhanced modal
  const [provisionStep, setProvisionStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Site Detail/Edit/Configure Modal State
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteModalMode, setSiteModalMode] = useState(null); // 'view', 'edit', 'configure'
  const [editFormData, setEditFormData] = useState(null);
  const [configFormData, setConfigFormData] = useState(null);
  // Delete functionality removed - sites should be blocked/suspended via provisioning queue

  // Customer View (impersonation) modal state
  const [showCustomerViewModal, setShowCustomerViewModal] = useState(false);
  const [customerForView, setCustomerForView] = useState(null);
  const [siteForView, setSiteForView] = useState(null);

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
  const customerFilterOptions = useMemo(() =>
    customers.map(c => ({
      value: c.name,
      label: c.name,
      type: c.type,
    })),
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

  // Handle action query param to auto-open provision modal
  React.useEffect(() => {
    const action = searchParams.get("action");
    if (action === "provision") {
      setShowEnhancedProvisionModal(true);
      // Clear the query param to prevent re-opening on refresh
      navigate("/internal/sites", { replace: true });
    }
  }, [searchParams, navigate]);

  // Handle customer query param to filter sites by customer
  React.useEffect(() => {
    const customerId = searchParams.get("customer");
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setSelectedCustomer(customer.name);
      }
    }
  }, [searchParams]);

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
      // Get segment type for auth config initialization
      const segmentType = site.type?.toLowerCase()?.replace('-', '') || 'miscellaneous';

      setConfigFormData({
        // Bandwidth Configuration
        bandwidthType: site.bandwidthType || 'fixed',
        fixedBandwidth: site.fixedBandwidth || site.bandwidthLimit || 100,
        overallLicenseCount: site.overallLicenseCount || site.totalUsers || 100,
        registeredDeviceLimit: site.registeredDeviceLimit || 10,
        displayDeviceCount: site.displayDeviceCount !== false,
        // Network Infrastructure
        wirelessControllerId: site.wirelessControllerId || '',
        wirelessControllerVersion: site.wirelessControllerVersion || '',
        aaaController: site.aaaController || '',
        accessControllerId: site.accessControllerId || '',
        serviceId: site.serviceId || '',
        nasIpPrimary: site.nasIpPrimary || '',
        nasIpSecondary: site.nasIpSecondary || '',
        trafficFlowType: site.trafficFlowType || '',
        trafficFlowIp: site.trafficFlowIp || '',
        // Infrastructure Equipment
        apVendor: site.infrastructure?.apVendor || '',
        apModel: site.infrastructure?.apModel || '',
        deployedApCount: site.infrastructure?.deployedApCount || site.deployedApCount || 0,
        liveApCount: site.infrastructure?.liveApCount || site.liveApCount || 0,
        indoorApCount: site.infrastructure?.indoorApCount || 0,
        outdoorApCount: site.infrastructure?.outdoorApCount || 0,
        poeSwitchVendor: site.infrastructure?.poeSwitchVendor || '',
        poeSwitchCount: site.infrastructure?.poeSwitchCount || 0,
        livePoeSwitchCount: site.infrastructure?.livePoeSwitchCount || 0,
        totalPoePorts: site.infrastructure?.totalPoePorts || 0,
        nasCount: site.infrastructure?.nasCount || 0,
        firewallCount: site.infrastructure?.firewallCount || 0,
        upsCount: site.infrastructure?.upsCount || 0,
        // Feature Toggles
        interSiteRoaming: site.interSiteRoaming || false,
        bulkUserRegistration: site.bulkUserRegistration !== false,
        bulkDeviceRegistration: site.bulkDeviceRegistration !== false,
        reportingEnabled: site.reportingEnabled !== false,
        // Email Notifications
        emailAlertEnabled: site.emailAlertEnabled !== false,
        // Authentication Configuration - use existing or initialize with defaults
        authenticationConfig: site.authenticationConfig || getDefaultAuthConfig(segmentType),
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
      case "viewAsCustomer":
        // Open customer view modal for impersonation with site preselected
        // Find the customer and site in the CustomerViewContext data
        const customer = customers.find(c => c.id === site.customerId);
        if (customer) {
          const contextCustomers = getAllCustomers();
          // Match by customer name since IDs might differ
          const matchingContextCustomer = contextCustomers.find(c =>
            c.name === customer.name
          );
          if (matchingContextCustomer) {
            // Get sites for this customer's segment
            const segmentSites = getSitesForSegment(matchingContextCustomer.segment);
            // Find matching site by name or similar attributes
            const matchingSite = segmentSites.find(s =>
              s.siteName === site.name || s.city === site.city
            );
            setCustomerForView(matchingContextCustomer);
            setSiteForView(matchingSite || null);
            setShowCustomerViewModal(true);
          } else {
            notifications.showInfo("Customer view not available for this site's customer");
          }
        } else {
          notifications.showInfo("Customer information not found for this site");
        }
        break;
      // Delete case removed - use suspend/block from provisioning queue
      default:
        break;
    }
  };

  // Delete functionality removed - sites should be blocked/suspended via provisioning queue

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = filteredSites.length;
    const online = filteredSites.filter(s => s.status === "online").length;
    const degraded = filteredSites.filter(s => s.status === "degraded").length;
    const offline = filteredSites.filter(s => s.status === "offline").length;
    const totalUsers = filteredSites.reduce((sum, s) => sum + s.totalUsers, 0);
    const totalDevices = filteredSites.reduce((sum, s) => sum + s.totalDevices, 0);
    // Infrastructure stats
    const deployedAps = filteredSites.reduce((sum, s) => sum + (s.infrastructure?.deployedApCount || s.deployedApCount || 0), 0);
    const liveAps = filteredSites.reduce((sum, s) => sum + (s.infrastructure?.liveApCount || s.liveApCount || 0), 0);
    const totalSwitches = filteredSites.reduce((sum, s) => sum + (s.infrastructure?.poeSwitchCount || 0), 0);
    const liveSwitches = filteredSites.reduce((sum, s) => sum + (s.infrastructure?.livePoeSwitchCount || 0), 0);

    return { total, online, degraded, offline, totalUsers, totalDevices, deployedAps, liveAps, totalSwitches, liveSwitches };
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

  // Show loading skeleton during initial load
  if (isLoading) {
    return <PageLoadingSkeleton pageType="grid" rows={6} />;
  }

  return (
    <div className="site-management">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1>
              <FaMapMarkerAlt className="page-title-icon" /> Site Management
            </h1>
            <p className="page-subtitle">Manage and monitor all customer sites</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-outline" onClick={() => console.log("Refresh")}>
              <FaSyncAlt /> Refresh
            </button>
            <button className="btn btn-outline" onClick={() => console.log("Export")}>
              <FaDownload /> Export
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowEnhancedProvisionModal(true)}
            >
              <FaPlus /> Provision New Site
            </button>
          </div>
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
        <div className="summary-stat infra">
          <span className="stat-number infra-stat-value">
            <span className="live">{summaryStats.liveAps}</span>
            <span className="sep">/</span>
            <span className="total">{summaryStats.deployedAps}</span>
          </span>
          <span className="stat-label">Live / Total APs</span>
        </div>
        <div className="summary-stat infra">
          <span className="stat-number infra-stat-value">
            <span className="live">{summaryStats.liveSwitches}</span>
            <span className="sep">/</span>
            <span className="total">{summaryStats.totalSwitches}</span>
          </span>
          <span className="stat-label">Live / Total Switches</span>
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
            <div className="filter-group searchable-filter">
              <label>Customer</label>
              <SearchableSelect
                options={customerFilterOptions}
                value={selectedCustomer === "All" ? "" : selectedCustomer}
                onChange={(val) => setSelectedCustomer(val || "All")}
                placeholder="All Customers"
                searchPlaceholder="Search customers..."
                getOptionLabel={(opt) => opt.label}
                getOptionValue={(opt) => opt.value}
                emptyOption={{ label: "All Customers", value: "" }}
                size="small"
              />
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
                        <button onClick={() => handleSiteAction("viewAsCustomer", site.id)} className="view-as-customer">
                          <FaUserSecret /> View as Customer
                        </button>
                        {/* Delete option removed - sites should be blocked/suspended instead */}
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

              {/* Infrastructure Quick Stats */}
              <div className="site-infra-stats">
                <div className="infra-stat">
                  <span className="infra-label">APs</span>
                  <span className="infra-value">
                    <span className="live">{site.infrastructure?.liveApCount || site.liveApCount || 0}</span>
                    <span className="sep">/</span>
                    <span className="total">{site.infrastructure?.deployedApCount || site.deployedApCount || 0}</span>
                  </span>
                </div>
                <div className="infra-stat">
                  <span className="infra-label">Switches</span>
                  <span className="infra-value">
                    <span className="live">{site.infrastructure?.livePoeSwitchCount || 0}</span>
                    <span className="sep">/</span>
                    <span className="total">{site.infrastructure?.poeSwitchCount || 0}</span>
                  </span>
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
                <div
                  className="site-alerts clickable"
                  onClick={() => navigate(`/internal/alerts?site=${site.id}`)}
                  title="Click to view alerts for this site"
                >
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
                <th>APs (Live/Total)</th>
                <th>Switches</th>
                <th>Bandwidth</th>
                <th>Uptime</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSites.map((site) => (
                <tr key={site.id} className={site.status}>
                  <td>{getStatusIcon(site.status)}</td>
                  <td>
                    <span className="site-name-text">
                      {site.name}
                    </span>
                  </td>
                  <td>{site.customerName}</td>
                  <td>{site.city}, {site.region}</td>
                  <td><span className="type-badge">{site.type}</span></td>
                  <td>{site.activeUsers} / {site.totalUsers}</td>
                  <td>
                    <span className="infra-cell">
                      <span className="live">{site.infrastructure?.liveApCount || site.liveApCount || 0}</span>
                      <span className="sep">/</span>
                      <span className="total">{site.infrastructure?.deployedApCount || site.deployedApCount || 0}</span>
                    </span>
                  </td>
                  <td>
                    <span className="infra-cell">
                      <span className="live">{site.infrastructure?.livePoeSwitchCount || 0}</span>
                      <span className="sep">/</span>
                      <span className="total">{site.infrastructure?.poeSwitchCount || 0}</span>
                    </span>
                  </td>
                  <td>{site.bandwidthUsage} Mbps</td>
                  <td>
                    <span className={`uptime-badge ${getUptimeClass(site.uptime)}`}>
                      {site.uptime}%
                    </span>
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
                    <h3>Infrastructure Status</h3>
                    <div className="metrics-row infrastructure-metrics">
                      <div className="metric-box highlight">
                        <FaWifi className="metric-icon ap-icon" />
                        <div className="metric-data">
                          <span className="metric-value">
                            <span className="live-count">{selectedSite.infrastructure?.liveApCount || selectedSite.liveApCount || 0}</span>
                            <span className="separator">/</span>
                            <span className="total-count">{selectedSite.infrastructure?.deployedApCount || selectedSite.deployedApCount || 0}</span>
                          </span>
                          <span className="metric-label">Live / Deployed APs</span>
                        </div>
                      </div>
                      <div className="metric-box">
                        <FaNetworkWired className="metric-icon switch-icon" />
                        <div className="metric-data">
                          <span className="metric-value">
                            <span className="live-count">{selectedSite.infrastructure?.livePoeSwitchCount || 0}</span>
                            <span className="separator">/</span>
                            <span className="total-count">{selectedSite.infrastructure?.poeSwitchCount || 0}</span>
                          </span>
                          <span className="metric-label">Live / Total PoE Switches</span>
                        </div>
                      </div>
                      <div className="metric-box">
                        <span className="metric-icon text-icon">PoE</span>
                        <div className="metric-data">
                          <span className="metric-value">{selectedSite.infrastructure?.totalPoePorts || 0}</span>
                          <span className="metric-label">Total PoE Ports</span>
                        </div>
                      </div>
                    </div>
                    {selectedSite.infrastructure?.apVendor && (
                      <div className="detail-grid infrastructure-detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">AP Vendor</span>
                          <span className="detail-value">{selectedSite.infrastructure.apVendor}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">AP Model</span>
                          <span className="detail-value">{selectedSite.infrastructure.apModel || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Indoor APs</span>
                          <span className="detail-value">{selectedSite.infrastructure.indoorApCount || 0}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Outdoor APs</span>
                          <span className="detail-value">{selectedSite.infrastructure.outdoorApCount || 0}</span>
                        </div>
                      </div>
                    )}
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
                        {selectedSite.alerts > 0 ? (
                          <span
                            className={`detail-value clickable-alert ${selectedSite.criticalAlerts > 0 ? 'critical' : 'warning'}`}
                            onClick={() => {
                              closeSiteModal();
                              navigate(`/internal/alerts?site=${selectedSite.id}`);
                            }}
                            title="Click to view alerts"
                          >
                            {selectedSite.alerts} {selectedSite.criticalAlerts > 0 && `(${selectedSite.criticalAlerts} critical)`}
                          </span>
                        ) : (
                          <span className="detail-value">0</span>
                        )}
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

                  {/* Authentication Configuration */}
                  <div className="detail-section auth-config-section">
                    <h3><FaKey className="section-icon" /> Authentication Configuration</h3>
                    {selectedSite.authenticationConfig ? (
                      <div className="auth-config-display">
                        {formatAuthConfigForDisplay(selectedSite.authenticationConfig, selectedSite.type?.toLowerCase()?.replace('-', '')).map(category => (
                          <div key={category.categoryId} className="auth-category-display">
                            <div className="auth-category-header-display">
                              <span className="auth-category-name">{category.categoryLabel}</span>
                              <span className="auth-category-count">{category.methods.length} method{category.methods.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="auth-methods-display">
                              {category.methods.length > 0 ? (
                                category.methods.map(method => (
                                  <span
                                    key={method.id}
                                    className={`auth-method-badge ${category.defaultMethods?.includes(method.id) ? 'is-default' : ''}`}
                                    title={method.description}
                                  >
                                    {method.label}
                                  </span>
                                ))
                              ) : (
                                <span className="no-methods">No methods configured</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-auth-config">
                        <FaShieldAlt className="no-config-icon" />
                        <p>Authentication configuration not set for this site.</p>
                        <span className="hint">Configure authentication methods via the site configuration panel.</span>
                      </div>
                    )}
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
                  {/* Bandwidth & License Configuration */}
                  <div className="config-section">
                    <h4>Bandwidth & License Configuration</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Bandwidth Type</label>
                        <select
                          name="bandwidthType"
                          value={configFormData.bandwidthType}
                          onChange={handleConfigFormChange}
                        >
                          <option value="fixed">Fixed Bandwidth</option>
                          <option value="userLevel">User Level Policies</option>
                        </select>
                      </div>
                      {configFormData.bandwidthType === 'fixed' && (
                        <div className="form-group">
                          <label>Fixed Bandwidth (Mbps)</label>
                          <input
                            type="number"
                            name="fixedBandwidth"
                            value={configFormData.fixedBandwidth}
                            onChange={handleConfigFormChange}
                            min="1"
                          />
                        </div>
                      )}
                      <div className="form-group">
                        <label>Overall License Count</label>
                        <input
                          type="number"
                          name="overallLicenseCount"
                          value={configFormData.overallLicenseCount}
                          onChange={handleConfigFormChange}
                          min="1"
                        />
                      </div>
                      <div className="form-group">
                        <label>Registered Device Limit</label>
                        <input
                          type="number"
                          name="registeredDeviceLimit"
                          value={configFormData.registeredDeviceLimit}
                          onChange={handleConfigFormChange}
                          min="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Network Infrastructure */}
                  <div className="config-section">
                    <h4>Network Infrastructure</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Wireless Controller ID</label>
                        <input
                          type="text"
                          name="wirelessControllerId"
                          value={configFormData.wirelessControllerId}
                          onChange={handleConfigFormChange}
                          placeholder="Enter controller ID"
                        />
                      </div>
                      <div className="form-group">
                        <label>Wireless Controller Version</label>
                        <select
                          name="wirelessControllerVersion"
                          value={configFormData.wirelessControllerVersion}
                          onChange={handleConfigFormChange}
                        >
                          <option value="">Select version</option>
                          <option value="v1">Version 1</option>
                          <option value="v2">Version 2</option>
                          <option value="v3">Version 3</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>AAA Controller</label>
                        <select
                          name="aaaController"
                          value={configFormData.aaaController}
                          onChange={handleConfigFormChange}
                        >
                          <option value="">Select AAA controller</option>
                          <option value="freeradius">FreeRADIUS</option>
                          <option value="cisco_ise">Cisco ISE</option>
                          <option value="aruba_clearpass">Aruba ClearPass</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Access Controller ID</label>
                        <input
                          type="text"
                          name="accessControllerId"
                          value={configFormData.accessControllerId}
                          onChange={handleConfigFormChange}
                          placeholder="Enter access controller ID"
                        />
                      </div>
                      <div className="form-group">
                        <label>Service ID</label>
                        <input
                          type="text"
                          name="serviceId"
                          value={configFormData.serviceId}
                          onChange={handleConfigFormChange}
                          placeholder="Enter service ID"
                        />
                      </div>
                    </div>
                  </div>

                  {/* NAS IP Configuration */}
                  <div className="config-section">
                    <h4>NAS IP Configuration</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>NAS IP: Primary</label>
                        <input
                          type="text"
                          name="nasIpPrimary"
                          value={configFormData.nasIpPrimary}
                          onChange={handleConfigFormChange}
                          placeholder="e.g., 192.168.1.1"
                        />
                      </div>
                      <div className="form-group">
                        <label>NAS IP: Secondary</label>
                        <input
                          type="text"
                          name="nasIpSecondary"
                          value={configFormData.nasIpSecondary}
                          onChange={handleConfigFormChange}
                          placeholder="Optional"
                        />
                      </div>
                      <div className="form-group">
                        <label>Traffic Flow Type</label>
                        <select
                          name="trafficFlowType"
                          value={configFormData.trafficFlowType}
                          onChange={handleConfigFormChange}
                        >
                          <option value="">Select type</option>
                          <option value="direct">Direct</option>
                          <option value="tunneled">Tunneled</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Traffic Flow IP</label>
                        <input
                          type="text"
                          name="trafficFlowIp"
                          value={configFormData.trafficFlowIp}
                          onChange={handleConfigFormChange}
                          placeholder="IP address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Infrastructure Equipment */}
                  <div className="config-section">
                    <h4>Infrastructure Equipment</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>AP Vendor</label>
                        <select
                          name="apVendor"
                          value={configFormData.apVendor}
                          onChange={handleConfigFormChange}
                        >
                          <option value="">Select vendor</option>
                          <option value="ruckus">Ruckus (CommScope)</option>
                          <option value="edgecore">Edgecore</option>
                          <option value="tplink">TP-Link</option>
                          <option value="cisco">Cisco</option>
                          <option value="aruba">Aruba (HPE)</option>
                          <option value="ubiquiti">Ubiquiti</option>
                          <option value="meraki">Cisco Meraki</option>
                          <option value="cambium">Cambium Networks</option>
                          <option value="dlink">D-Link</option>
                          <option value="netgear">Netgear</option>
                          <option value="zyxel">Zyxel</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>AP Model</label>
                        <input
                          type="text"
                          name="apModel"
                          value={configFormData.apModel}
                          onChange={handleConfigFormChange}
                          placeholder="Enter AP model"
                        />
                      </div>
                      <div className="form-group">
                        <label>Deployed AP Count</label>
                        <input
                          type="number"
                          name="deployedApCount"
                          value={configFormData.deployedApCount}
                          onChange={handleConfigFormChange}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Live AP Count</label>
                        <input
                          type="number"
                          name="liveApCount"
                          value={configFormData.liveApCount}
                          onChange={handleConfigFormChange}
                          min="0"
                        />
                        <span className="field-hint">Currently online APs</span>
                      </div>
                      <div className="form-group">
                        <label>Indoor APs</label>
                        <input
                          type="number"
                          name="indoorApCount"
                          value={configFormData.indoorApCount}
                          onChange={handleConfigFormChange}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Outdoor APs</label>
                        <input
                          type="number"
                          name="outdoorApCount"
                          value={configFormData.outdoorApCount}
                          onChange={handleConfigFormChange}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="form-grid" style={{ marginTop: '16px' }}>
                      <div className="form-group">
                        <label>PoE Switch Vendor</label>
                        <select
                          name="poeSwitchVendor"
                          value={configFormData.poeSwitchVendor}
                          onChange={handleConfigFormChange}
                        >
                          <option value="">Select vendor</option>
                          <option value="edgecore">Edgecore</option>
                          <option value="tplink">TP-Link</option>
                          <option value="cisco">Cisco</option>
                          <option value="aruba">Aruba (HPE)</option>
                          <option value="netgear">Netgear</option>
                          <option value="ubiquiti">Ubiquiti</option>
                          <option value="dlink">D-Link</option>
                          <option value="zyxel">Zyxel</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>PoE Switch Count</label>
                        <input
                          type="number"
                          name="poeSwitchCount"
                          value={configFormData.poeSwitchCount}
                          onChange={handleConfigFormChange}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Live PoE Switches</label>
                        <input
                          type="number"
                          name="livePoeSwitchCount"
                          value={configFormData.livePoeSwitchCount}
                          onChange={handleConfigFormChange}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Total PoE Ports</label>
                        <input
                          type="number"
                          name="totalPoePorts"
                          value={configFormData.totalPoePorts}
                          onChange={handleConfigFormChange}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>NAS Count</label>
                        <input
                          type="number"
                          name="nasCount"
                          value={configFormData.nasCount}
                          onChange={handleConfigFormChange}
                          min="0"
                        />
                        <span className="field-hint">Network Attached Storage</span>
                      </div>
                      <div className="form-group">
                        <label>UPS Count</label>
                        <input
                          type="number"
                          name="upsCount"
                          value={configFormData.upsCount}
                          onChange={handleConfigFormChange}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className="config-section">
                    <h4>Feature Toggles</h4>
                    <div className="checkbox-group feature-toggles">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="interSiteRoaming"
                          checked={configFormData.interSiteRoaming}
                          onChange={handleConfigFormChange}
                        />
                        <span>Inter-site Roaming</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="bulkUserRegistration"
                          checked={configFormData.bulkUserRegistration}
                          onChange={handleConfigFormChange}
                        />
                        <span>Bulk User Registration</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="bulkDeviceRegistration"
                          checked={configFormData.bulkDeviceRegistration}
                          onChange={handleConfigFormChange}
                        />
                        <span>Bulk Device Registration</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="displayDeviceCount"
                          checked={configFormData.displayDeviceCount}
                          onChange={handleConfigFormChange}
                        />
                        <span>Display Device Count</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="reportingEnabled"
                          checked={configFormData.reportingEnabled}
                          onChange={handleConfigFormChange}
                        />
                        <span>Reporting Enabled</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="emailAlertEnabled"
                          checked={configFormData.emailAlertEnabled}
                          onChange={handleConfigFormChange}
                        />
                        <span>Email Alerts Enabled</span>
                      </label>
                    </div>
                  </div>

                  {/* Authentication Configuration */}
                  <div className="config-section auth-config-edit-section">
                    <h4><FaKey className="section-icon" /> Authentication Configuration</h4>
                    <p className="section-description">
                      Configure authentication methods for each user category. At least one method must be selected per category.
                    </p>
                    {selectedSite?.type && (
                      <div className="auth-config-edit-container">
                        {Object.entries(getAuthCategoriesForSegment(selectedSite.type.toLowerCase().replace('-', ''))).map(([categoryId, category]) => {
                          const selectedMethods = configFormData.authenticationConfig?.[categoryId] || [];
                          const validationResult = validateAuthConfig(configFormData.authenticationConfig || {}, selectedSite.type.toLowerCase().replace('-', ''));
                          const categoryError = validationResult.errors.find(e => e.categoryId === categoryId);

                          return (
                            <div key={categoryId} className={`auth-category-edit ${categoryError ? 'has-error' : ''}`}>
                              <div className="auth-category-edit-header">
                                <div className="auth-category-info">
                                  <span className="auth-category-name">{category.label}</span>
                                  <span className="auth-category-desc">{category.description}</span>
                                </div>
                                <button
                                  type="button"
                                  className="btn-link reset-btn"
                                  onClick={() => {
                                    handleConfigFormChange({
                                      target: {
                                        name: 'authenticationConfig',
                                        value: {
                                          ...configFormData.authenticationConfig,
                                          [categoryId]: [...category.defaultMethods]
                                        }
                                      }
                                    });
                                  }}
                                >
                                  Reset to defaults
                                </button>
                              </div>
                              {categoryError && (
                                <div className="auth-error-msg">
                                  {categoryError.message}
                                </div>
                              )}
                              <div className="auth-methods-edit-grid">
                                {category.availableMethods.map(methodId => {
                                  const method = AUTH_METHODS[methodId];
                                  if (!method) return null;
                                  const isSelected = selectedMethods.includes(methodId);
                                  const isDefault = category.defaultMethods.includes(methodId);

                                  return (
                                    <label
                                      key={methodId}
                                      className={`auth-method-checkbox ${isSelected ? 'selected' : ''} ${isDefault ? 'is-default' : ''}`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                          const currentMethods = configFormData.authenticationConfig?.[categoryId] || [];
                                          let newMethods;
                                          if (e.target.checked) {
                                            newMethods = [...currentMethods, methodId];
                                          } else {
                                            newMethods = currentMethods.filter(m => m !== methodId);
                                          }
                                          handleConfigFormChange({
                                            target: {
                                              name: 'authenticationConfig',
                                              value: {
                                                ...configFormData.authenticationConfig,
                                                [categoryId]: newMethods
                                              }
                                            }
                                          });
                                        }}
                                      />
                                      <span className="checkbox-custom"></span>
                                      <div className="method-info">
                                        <span className="method-label">
                                          {method.label}
                                          {isDefault && <span className="default-tag">Default</span>}
                                        </span>
                                        <span className="method-desc">{method.description}</span>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                              <div className="auth-category-footer">
                                <span className="selected-count">
                                  {selectedMethods.length} method{selectedMethods.length !== 1 ? 's' : ''} selected
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
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

      {/* Delete Confirmation Modal removed - use suspend/block from provisioning queue */}

      {/* Enhanced Site Provisioning Modal */}
      <SiteProvisioningModal
        isOpen={showEnhancedProvisionModal}
        onClose={() => setShowEnhancedProvisionModal(false)}
        onSubmit={(siteData) => {
          console.log('New site provisioned:', siteData);
          notifications.showSuccess(`Site "${siteData.siteName}" provisioned successfully`);
          setShowEnhancedProvisionModal(false);
        }}
        customers={customers}
      />

      {/* Customer View Modal for Impersonation */}
      <CustomerViewModal
        isOpen={showCustomerViewModal}
        onClose={() => {
          setShowCustomerViewModal(false);
          setCustomerForView(null);
          setSiteForView(null);
        }}
        preselectedCustomer={customerForView}
        preselectedSite={siteForView}
      />
    </div>
  );
};

export default SiteManagement;
