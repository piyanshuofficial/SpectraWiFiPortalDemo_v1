// src/pages/Internal/SiteProvisioningQueue.js

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@context/AuthContext";
import {
  FaSearch,
  FaFilter,
  FaClock,
  FaPlay,
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronRight,
  FaChevronDown,
  FaSpinner,
  FaRocket,
  FaClipboardCheck,
  FaFlagCheckered,
  FaBan,
  FaPause,
  FaHistory,
  FaEnvelope,
  FaWifi,
  FaKey,
  FaShieldAlt
} from "react-icons/fa";
import {
  SITE_STATUS,
  SITE_STATUS_LABELS,
  SITE_STATUS_COLORS,
  SITE_TESTING_CHECKLIST,
  QUEUE_PRIORITY,
  QUEUE_PRIORITY_LABELS,
  QUEUE_PRIORITY_COLORS,
  canTransitionStatus,
  getNextStatuses,
  getWelcomeEmailTemplate,
  getSSIDCredentialsEmailTemplate,
  formatAuthConfigForDisplay,
  getAuthConfigSummary
} from "@constants/siteProvisioningConfig";
import notifications from "@utils/notifications";
import PageLoadingSkeleton from "@components/Loading/PageLoadingSkeleton";
import "./SiteProvisioningQueue.css";

// ============================================
// SAMPLE QUEUE DATA
// In production, this would come from API
// Data flows from: Order Login → Billing Middleware → This Portal
// ============================================
const sampleQueueData = [
  {
    id: "QUEUE-001",
    siteId: "SITE-MUM-ENT-101",
    siteName: "Tech Park Tower A",
    companyId: "COMP-001",
    companyName: "Horizon Technologies Pvt Ltd",
    segment: "enterprise",
    solutionType: "managed_wifi",
    productName: "ProFi Business",
    status: SITE_STATUS.CONFIGURATION_PENDING,
    priority: QUEUE_PRIORITY.HIGH,
    // Pre-filled from billing middleware (non-editable)
    billingData: {
      orderId: "ORD-2024-00145",
      contractId: "CNT-HRZ-2024-001",
      billingStartDate: "2025-01-01",
      licensedUsers: 500,
      bandwidthMbps: 200,
      contractTerm: "24 months"
    },
    // Site location from order
    location: {
      address: "Tower A, Bandra Kurla Complex",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400051"
    },
    // Contact from customer data
    contact: {
      name: "Rajesh Sharma",
      email: "rajesh.sharma@horizon.com",
      phone: "+91-9876543210"
    },
    createdAt: "2024-12-10T10:30:00Z",
    assignedTo: null,
    testingChecklist: {},
    activationDate: null,
    notes: [],
    // Authentication configuration for the site
    authenticationConfig: {
      users: ["adfs_sso", "username_password"],
      guests: ["otp_rmn", "social_login"],
      devices: ["mac_auth", "wpa2_psk"]
    }
  },
  {
    id: "QUEUE-002",
    siteId: "SITE-DEL-COL-201",
    siteName: "Urban Living Apartments",
    companyId: "COMP-002",
    companyName: "Urban Living Properties",
    segment: "coLiving",
    solutionType: "managed_wifi",
    productName: "ProFi for Shared Living",
    status: SITE_STATUS.UNDER_CONFIGURATION,
    priority: QUEUE_PRIORITY.MEDIUM,
    billingData: {
      orderId: "ORD-2024-00142",
      contractId: "CNT-ULP-2024-003",
      billingStartDate: "2025-01-15",
      licensedUsers: 200,
      bandwidthMbps: 100,
      contractTerm: "12 months"
    },
    location: {
      address: "Block B, Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301"
    },
    contact: {
      name: "Priya Mehta",
      email: "priya@urbanliving.in",
      phone: "+91-9988776655"
    },
    createdAt: "2024-12-08T14:20:00Z",
    assignedTo: "engineer@spectra.co",
    testingChecklist: {},
    activationDate: null,
    notes: [],
    authenticationConfig: {
      residents: ["otp_rmn", "username_password"],
      guests: ["otp_rmn"],
      devices: ["mac_auth"]
    }
  },
  {
    id: "QUEUE-003",
    siteId: "SITE-BLR-HTL-301",
    siteName: "Grand Hyatt Bangalore",
    companyId: "COMP-003",
    companyName: "Grand Hyatt Hotels",
    segment: "hotel",
    solutionType: "managed_wifi_infra",
    productName: "ProFi for Hotels",
    status: SITE_STATUS.UNDER_TESTING,
    priority: QUEUE_PRIORITY.HIGH,
    billingData: {
      orderId: "ORD-2024-00138",
      contractId: "CNT-GHH-2024-001",
      billingStartDate: "2025-01-01",
      licensedUsers: 1000,
      bandwidthMbps: 500,
      contractTerm: "36 months"
    },
    location: {
      address: "MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001"
    },
    contact: {
      name: "Amit Verma",
      email: "amit.verma@grandhyatt.com",
      phone: "+91-9123456789"
    },
    createdAt: "2024-12-05T09:00:00Z",
    assignedTo: "engineer@spectra.co",
    testingChecklist: {
      wifi_connectivity: { completed: true, completedAt: "2024-12-12T10:00:00Z", completedBy: "engineer@spectra.co" },
      internet_access: { completed: true, completedAt: "2024-12-12T10:30:00Z", completedBy: "engineer@spectra.co" },
      authentication_test: { completed: true, completedAt: "2024-12-12T11:00:00Z", completedBy: "engineer@spectra.co" },
      bandwidth_test: { completed: false },
      portal_access_test: { completed: false },
      ap_coverage_test: { completed: false },
      billing_integration_test: { completed: false },
      security_test: { completed: false }
    },
    activationDate: null,
    notes: ["Large property - 500+ rooms", "Priority customer"],
    authenticationConfig: {
      roomGuests: ["otp_rmn", "room_number_auth"],
      conferenceRooms: ["event_code", "otp_rmn"],
      staff: ["adfs_sso", "username_password"],
      devices: ["mac_auth", "wpa2_psk"]
    }
  },
  {
    id: "QUEUE-004",
    siteId: "SITE-HYD-COW-401",
    siteName: "WeWork Hitech City",
    companyId: "COMP-004",
    companyName: "WeWork India",
    segment: "coWorking",
    solutionType: "managed_wifi",
    productName: "ProFi Business",
    status: SITE_STATUS.RFS_PENDING,
    priority: QUEUE_PRIORITY.MEDIUM,
    billingData: {
      orderId: "ORD-2024-00130",
      contractId: "CNT-WWI-2024-002",
      billingStartDate: "2024-12-20",
      licensedUsers: 300,
      bandwidthMbps: 150,
      contractTerm: "24 months"
    },
    location: {
      address: "Hitech City Main Road",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500081"
    },
    contact: {
      name: "Sneha Reddy",
      email: "sneha.reddy@wework.co.in",
      phone: "+91-9876501234"
    },
    createdAt: "2024-12-01T11:00:00Z",
    assignedTo: "engineer@spectra.co",
    testingChecklist: {
      wifi_connectivity: { completed: true, completedAt: "2024-12-10T10:00:00Z", completedBy: "engineer@spectra.co" },
      internet_access: { completed: true, completedAt: "2024-12-10T10:30:00Z", completedBy: "engineer@spectra.co" },
      authentication_test: { completed: true, completedAt: "2024-12-10T11:00:00Z", completedBy: "engineer@spectra.co" },
      bandwidth_test: { completed: true, completedAt: "2024-12-10T11:30:00Z", completedBy: "engineer@spectra.co" },
      portal_access_test: { completed: true, completedAt: "2024-12-10T12:00:00Z", completedBy: "engineer@spectra.co" },
      ap_coverage_test: { completed: true, completedAt: "2024-12-10T14:00:00Z", completedBy: "engineer@spectra.co" },
      billing_integration_test: { completed: true, completedAt: "2024-12-10T15:00:00Z", completedBy: "engineer@spectra.co" },
      security_test: { completed: true, completedAt: "2024-12-10T16:00:00Z", completedBy: "engineer@spectra.co" }
    },
    activationDate: null,
    notes: [],
    authenticationConfig: {
      members: ["otp_rmn", "username_password", "social_login"],
      guests: ["otp_rmn", "sponsor_approval"],
      devices: ["mac_auth"]
    }
  },
  {
    id: "QUEUE-005",
    siteId: "SITE-CHN-PG-501",
    siteName: "Student Haven PG",
    companyId: "COMP-005",
    companyName: "Student Haven Properties",
    segment: "pg",
    solutionType: "managed_wifi",
    productName: "ProFi for PG",
    status: SITE_STATUS.CONFIGURATION_PENDING,
    priority: QUEUE_PRIORITY.LOW,
    billingData: {
      orderId: "ORD-2024-00150",
      contractId: "CNT-SHP-2024-001",
      billingStartDate: "2025-02-01",
      licensedUsers: 100,
      bandwidthMbps: 50,
      contractTerm: "12 months"
    },
    location: {
      address: "Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040"
    },
    contact: {
      name: "Kumar S",
      email: "kumar@studenthaven.in",
      phone: "+91-9444556677"
    },
    createdAt: "2024-12-12T16:00:00Z",
    assignedTo: null,
    testingChecklist: {},
    activationDate: null,
    notes: [],
    authenticationConfig: {
      residents: ["otp_rmn", "username_password"],
      guests: ["otp_rmn"],
      devices: ["mac_auth"]
    }
  }
];

/**
 * SiteProvisioningQueue Component
 * Queue management for deployment engineers to configure new sites
 */
const SiteProvisioningQueue = () => {
  const { currentUser, hasPermission } = useAuth();
  const userRole = currentUser?.role || 'viewer';
  const userEmail = currentUser?.email || 'anonymous';

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Queue data state
  const [queueItems, setQueueItems] = useState([]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTestingModal, setShowTestingModal] = useState(false);
  const [showRFSModal, setShowRFSModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'suspend' or 'block'

  // RFS form state
  const [rfsData, setRfsData] = useState({
    activationDate: new Date().toISOString().split('T')[0],
    activationTime: new Date().toTimeString().slice(0, 5),
    usePastDate: false,
    notes: ""
  });

  // Action form state
  const [actionReason, setActionReason] = useState("");

  // Load data
  useEffect(() => {
    const timer = setTimeout(() => {
      setQueueItems(sampleQueueData);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Status tabs configuration
  const statusTabs = [
    { key: "all", label: "All Sites", icon: FaBuilding },
    { key: SITE_STATUS.CONFIGURATION_PENDING, label: "Config Pending", icon: FaClock },
    { key: SITE_STATUS.UNDER_CONFIGURATION, label: "In Progress", icon: FaPlay },
    { key: SITE_STATUS.UNDER_TESTING, label: "Testing", icon: FaClipboardCheck },
    { key: SITE_STATUS.RFS_PENDING, label: "RFS Pending", icon: FaFlagCheckered },
    { key: SITE_STATUS.ACTIVE, label: "Active", icon: FaCheckCircle }
  ];

  // Filter queue items
  const filteredItems = useMemo(() => {
    return queueItems.filter(item => {
      // Status filter
      if (selectedStatus !== "all" && item.status !== selectedStatus) return false;

      // Priority filter
      if (selectedPriority !== "all" && item.priority !== selectedPriority) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.siteName.toLowerCase().includes(query) ||
          item.siteId.toLowerCase().includes(query) ||
          item.companyName.toLowerCase().includes(query) ||
          item.billingData.orderId.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [queueItems, selectedStatus, selectedPriority, searchQuery]);

  // Get counts per status
  const statusCounts = useMemo(() => {
    const counts = { all: queueItems.length };
    Object.values(SITE_STATUS).forEach(status => {
      counts[status] = queueItems.filter(item => item.status === status).length;
    });
    return counts;
  }, [queueItems]);

  // Calculate testing progress
  const getTestingProgress = useCallback((checklist) => {
    const requiredItems = SITE_TESTING_CHECKLIST.filter(item => item.required);
    const completedRequired = requiredItems.filter(item => checklist[item.id]?.completed).length;
    return {
      completed: completedRequired,
      total: requiredItems.length,
      percentage: Math.round((completedRequired / requiredItems.length) * 100)
    };
  }, []);

  // Handle start configuration
  const handleStartConfiguration = useCallback((item) => {
    if (!canTransitionStatus(item.status, SITE_STATUS.UNDER_CONFIGURATION, userRole)) {
      notifications.error("You don't have permission to start configuration");
      return;
    }

    setQueueItems(prev => prev.map(qi =>
      qi.id === item.id
        ? { ...qi, status: SITE_STATUS.UNDER_CONFIGURATION, assignedTo: userEmail }
        : qi
    ));
    notifications.success(`Started configuration for ${item.siteName}`);
  }, [userRole, userEmail]);

  // Handle move to testing
  const handleMoveToTesting = useCallback((item) => {
    if (!canTransitionStatus(item.status, SITE_STATUS.UNDER_TESTING, userRole)) {
      notifications.error("You don't have permission to move to testing");
      return;
    }

    setQueueItems(prev => prev.map(qi =>
      qi.id === item.id
        ? { ...qi, status: SITE_STATUS.UNDER_TESTING }
        : qi
    ));
    notifications.success(`${item.siteName} moved to testing phase`);
  }, [userRole]);

  // Handle testing checklist update
  const handleTestingChecklistUpdate = useCallback((itemId, checklistId, completed) => {
    setQueueItems(prev => prev.map(qi => {
      if (qi.id !== itemId) return qi;

      const updatedChecklist = {
        ...qi.testingChecklist,
        [checklistId]: completed
          ? { completed: true, completedAt: new Date().toISOString(), completedBy: userEmail }
          : { completed: false }
      };

      return { ...qi, testingChecklist: updatedChecklist };
    }));
  }, [userEmail]);

  // Handle move to RFS pending
  const handleMoveToRFSPending = useCallback((item) => {
    const progress = getTestingProgress(item.testingChecklist);
    if (progress.percentage < 100) {
      notifications.error("All required tests must be completed before moving to RFS");
      return;
    }

    if (!canTransitionStatus(item.status, SITE_STATUS.RFS_PENDING, userRole)) {
      notifications.error("You don't have permission to move to RFS pending");
      return;
    }

    setQueueItems(prev => prev.map(qi =>
      qi.id === item.id
        ? { ...qi, status: SITE_STATUS.RFS_PENDING }
        : qi
    ));
    setShowTestingModal(false);
    notifications.success(`${item.siteName} moved to RFS pending`);
  }, [userRole, getTestingProgress]);

  // Handle RFS confirmation (activate site)
  const handleRFSConfirmation = useCallback(() => {
    if (!selectedItem) return;

    if (!canTransitionStatus(selectedItem.status, SITE_STATUS.ACTIVE, userRole)) {
      notifications.error("You don't have permission to activate this site");
      return;
    }

    const activationDateTime = `${rfsData.activationDate}T${rfsData.activationTime}:00`;

    setQueueItems(prev => prev.map(qi =>
      qi.id === selectedItem.id
        ? {
            ...qi,
            status: SITE_STATUS.ACTIVE,
            activationDate: activationDateTime,
            rfsNotes: rfsData.notes
          }
        : qi
    ));

    // IT TEAM INTEGRATION POINT: Send welcome email
    const emailTemplate = getWelcomeEmailTemplate(
      { ...selectedItem, activationDate: rfsData.activationDate, activationTime: rfsData.activationTime },
      { companyName: selectedItem.companyName, primaryEmail: selectedItem.contact.email }
    );
    console.log("📧 Welcome Email Template (IT Team to implement):", emailTemplate);

    // IT TEAM INTEGRATION POINT: Send SSID credentials
    const credentialsTemplate = getSSIDCredentialsEmailTemplate(
      selectedItem,
      { companyName: selectedItem.companyName, primaryEmail: selectedItem.contact.email }
    );
    console.log("🔐 SSID Credentials Template (IT Team to implement):", credentialsTemplate);

    setShowRFSModal(false);
    setSelectedItem(null);
    setRfsData({ activationDate: "", activationTime: "", usePastDate: false, notes: "" });

    notifications.success(`${selectedItem.siteName} is now ACTIVE! Welcome email queued for sending.`);
  }, [selectedItem, rfsData, userRole]);

  // Handle site action (suspend/block)
  const handleSiteAction = useCallback(() => {
    if (!selectedItem || !actionType) return;

    const newStatus = actionType === 'suspend' ? SITE_STATUS.SUSPENDED : SITE_STATUS.BLOCKED;

    if (!canTransitionStatus(selectedItem.status, newStatus, userRole)) {
      notifications.error(`You don't have permission to ${actionType} this site`);
      return;
    }

    setQueueItems(prev => prev.map(qi =>
      qi.id === selectedItem.id
        ? { ...qi, status: newStatus, actionReason, actionBy: userEmail, actionAt: new Date().toISOString() }
        : qi
    ));

    setShowActionModal(false);
    setSelectedItem(null);
    setActionType(null);
    setActionReason("");

    notifications.success(`${selectedItem.siteName} has been ${actionType === 'suspend' ? 'suspended' : 'blocked'}`);
  }, [selectedItem, actionType, actionReason, userRole, userEmail]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format datetime for display
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <PageLoadingSkeleton title="Site Provisioning Queue" />;
  }

  return (
    <div className="provisioning-queue-page">
      {/* Page Header */}
      <div className="pq-header">
        <div className="pq-header-left">
          <h1>Site Provisioning Queue</h1>
          <p className="pq-subtitle">Configure and activate new sites from the order pipeline</p>
        </div>
        <div className="pq-header-right">
          <div className="pq-stats">
            <div className="pq-stat">
              <span className="stat-value">{statusCounts[SITE_STATUS.CONFIGURATION_PENDING] || 0}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="pq-stat">
              <span className="stat-value">{statusCounts[SITE_STATUS.UNDER_TESTING] || 0}</span>
              <span className="stat-label">Testing</span>
            </div>
            <div className="pq-stat">
              <span className="stat-value">{statusCounts[SITE_STATUS.RFS_PENDING] || 0}</span>
              <span className="stat-label">RFS Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="pq-filters-bar">
        <div className="pq-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by site name, ID, company, or order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              <FaTimes />
            </button>
          )}
        </div>

        <button
          className={`pq-filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filters
        </button>

        {showFilters && (
          <div className="pq-filters-dropdown">
            <div className="filter-group">
              <label>Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                {Object.entries(QUEUE_PRIORITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <div className="pq-status-tabs">
        {statusTabs.map(tab => (
          <button
            key={tab.key}
            className={`pq-tab ${selectedStatus === tab.key ? 'active' : ''}`}
            onClick={() => setSelectedStatus(tab.key)}
          >
            <tab.icon />
            <span>{tab.label}</span>
            <span className="tab-count">{statusCounts[tab.key] || 0}</span>
          </button>
        ))}
      </div>

      {/* Queue List */}
      <div className="pq-queue-list">
        {filteredItems.length === 0 ? (
          <div className="pq-empty-state">
            <FaInfoCircle />
            <h3>No sites found</h3>
            <p>No sites match your current filters</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const progress = getTestingProgress(item.testingChecklist);

            return (
              <div key={item.id} className={`pq-queue-card status-${item.status}`}>
                {/* Card Header */}
                <div className="pq-card-header">
                  <div className="pq-card-title">
                    <h3>{item.siteName}</h3>
                    <span className="pq-site-id">{item.siteId}</span>
                  </div>
                  <div className="pq-card-badges">
                    <span
                      className="priority-badge"
                      style={{ background: QUEUE_PRIORITY_COLORS[item.priority] }}
                    >
                      {QUEUE_PRIORITY_LABELS[item.priority]}
                    </span>
                    <span
                      className="status-badge"
                      style={{ background: SITE_STATUS_COLORS[item.status] }}
                    >
                      {SITE_STATUS_LABELS[item.status]}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="pq-card-body">
                  <div className="pq-card-info">
                    <div className="info-row">
                      <FaBuilding />
                      <span>{item.companyName}</span>
                    </div>
                    <div className="info-row">
                      <FaMapMarkerAlt />
                      <span>{item.location.city}, {item.location.state}</span>
                    </div>
                    <div className="info-row">
                      <FaUser />
                      <span>{item.contact.name}</span>
                    </div>
                    <div className="info-row">
                      <FaCalendarAlt />
                      <span>Order: {item.billingData.orderId}</span>
                    </div>
                  </div>

                  <div className="pq-card-details">
                    <div className="detail-item">
                      <span className="detail-label">Segment</span>
                      <span className="detail-value">{item.segment}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Product</span>
                      <span className="detail-value">{item.productName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Users</span>
                      <span className="detail-value">{item.billingData.licensedUsers}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bandwidth</span>
                      <span className="detail-value">{item.billingData.bandwidthMbps} Mbps</span>
                    </div>
                  </div>

                  {/* Testing Progress (if in testing) */}
                  {item.status === SITE_STATUS.UNDER_TESTING && (
                    <div className="pq-testing-progress">
                      <div className="progress-header">
                        <span>Testing Progress</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <span className="progress-text">
                        {progress.completed}/{progress.total} required tests completed
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer - Actions */}
                <div className="pq-card-footer">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDetailModal(true);
                    }}
                  >
                    View Details
                  </button>

                  {/* Configuration Pending Actions */}
                  {item.status === SITE_STATUS.CONFIGURATION_PENDING && (
                    <button
                      className="btn-primary"
                      onClick={() => handleStartConfiguration(item)}
                    >
                      <FaPlay /> Start Configuration
                    </button>
                  )}

                  {/* Under Configuration Actions */}
                  {item.status === SITE_STATUS.UNDER_CONFIGURATION && (
                    <button
                      className="btn-primary"
                      onClick={() => handleMoveToTesting(item)}
                    >
                      <FaClipboardCheck /> Move to Testing
                    </button>
                  )}

                  {/* Under Testing Actions */}
                  {item.status === SITE_STATUS.UNDER_TESTING && (
                    <button
                      className="btn-primary"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowTestingModal(true);
                      }}
                    >
                      <FaClipboardCheck /> Testing Checklist
                    </button>
                  )}

                  {/* RFS Pending Actions */}
                  {item.status === SITE_STATUS.RFS_PENDING && (
                    <button
                      className="btn-success"
                      onClick={() => {
                        setSelectedItem(item);
                        setRfsData({
                          activationDate: new Date().toISOString().split('T')[0],
                          activationTime: new Date().toTimeString().slice(0, 5),
                          usePastDate: false,
                          notes: ""
                        });
                        setShowRFSModal(true);
                      }}
                    >
                      <FaRocket /> Confirm RFS
                    </button>
                  )}

                  {/* Active Site Actions */}
                  {item.status === SITE_STATUS.ACTIVE && (
                    <>
                      <button
                        className="btn-warning"
                        onClick={() => {
                          setSelectedItem(item);
                          setActionType('suspend');
                          setShowActionModal(true);
                        }}
                      >
                        <FaPause /> Suspend
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => {
                          setSelectedItem(item);
                          setActionType('block');
                          setShowActionModal(true);
                        }}
                      >
                        <FaBan /> Block
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && createPortal(
        <div className="pq-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="pq-modal pq-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="pq-modal-header">
              <h2>Site Details</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="pq-modal-body">
              <div className="detail-section">
                <h3><FaBuilding /> Site Information</h3>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Site Name</label>
                    <span>{selectedItem.siteName}</span>
                  </div>
                  <div className="detail-field">
                    <label>Site ID</label>
                    <span>{selectedItem.siteId}</span>
                  </div>
                  <div className="detail-field">
                    <label>Company</label>
                    <span>{selectedItem.companyName}</span>
                  </div>
                  <div className="detail-field">
                    <label>Segment</label>
                    <span>{selectedItem.segment}</span>
                  </div>
                  <div className="detail-field">
                    <label>Solution Type</label>
                    <span>{selectedItem.solutionType}</span>
                  </div>
                  <div className="detail-field">
                    <label>Product</label>
                    <span>{selectedItem.productName}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3><FaMapMarkerAlt /> Location</h3>
                <div className="detail-grid">
                  <div className="detail-field full-width">
                    <label>Address</label>
                    <span>{selectedItem.location.address}</span>
                  </div>
                  <div className="detail-field">
                    <label>City</label>
                    <span>{selectedItem.location.city}</span>
                  </div>
                  <div className="detail-field">
                    <label>State</label>
                    <span>{selectedItem.location.state}</span>
                  </div>
                  <div className="detail-field">
                    <label>Pincode</label>
                    <span>{selectedItem.location.pincode}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section billing-section">
                <h3><FaHistory /> Billing Information (Pre-filled from Order)</h3>
                <p className="section-note">
                  <FaInfoCircle /> This data flows from Billing Middleware and cannot be edited here
                </p>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Order ID</label>
                    <span className="readonly-value">{selectedItem.billingData.orderId}</span>
                  </div>
                  <div className="detail-field">
                    <label>Contract ID</label>
                    <span className="readonly-value">{selectedItem.billingData.contractId}</span>
                  </div>
                  <div className="detail-field">
                    <label>Licensed Users</label>
                    <span className="readonly-value">{selectedItem.billingData.licensedUsers}</span>
                  </div>
                  <div className="detail-field">
                    <label>Bandwidth</label>
                    <span className="readonly-value">{selectedItem.billingData.bandwidthMbps} Mbps</span>
                  </div>
                  <div className="detail-field">
                    <label>Billing Start Date</label>
                    <span className="readonly-value">{formatDate(selectedItem.billingData.billingStartDate)}</span>
                  </div>
                  <div className="detail-field">
                    <label>Contract Term</label>
                    <span className="readonly-value">{selectedItem.billingData.contractTerm}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3><FaUser /> Contact Information</h3>
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Contact Name</label>
                    <span>{selectedItem.contact.name}</span>
                  </div>
                  <div className="detail-field">
                    <label>Email</label>
                    <span>{selectedItem.contact.email}</span>
                  </div>
                  <div className="detail-field">
                    <label>Phone</label>
                    <span>{selectedItem.contact.phone}</span>
                  </div>
                </div>
              </div>

              {/* Authentication Configuration Section */}
              <div className="detail-section auth-config-section">
                <h3>
                  <FaKey /> Authentication Configuration
                  {selectedItem.authenticationConfig && (
                    <span className="auth-summary-badge">
                      <FaShieldAlt />
                      {getAuthConfigSummary(selectedItem.authenticationConfig, selectedItem.segment).summary}
                    </span>
                  )}
                </h3>
                {selectedItem.authenticationConfig ? (
                  <div className="auth-categories-grid">
                    {formatAuthConfigForDisplay(selectedItem.authenticationConfig, selectedItem.segment).map(category => (
                      <div key={category.categoryId} className="auth-category-card">
                        <div className="category-header">
                          <div className="category-icon"><FaShieldAlt /></div>
                          <span className="category-name">{category.categoryLabel}</span>
                        </div>
                        {category.categoryDescription && (
                          <p className="category-description">{category.categoryDescription}</p>
                        )}
                        {category.methods.length > 0 ? (
                          <div className="auth-methods-list">
                            {category.methods.map(method => (
                              <div key={method.id} className="auth-method-item">
                                <FaCheck />
                                <span className="method-label">{method.label}</span>
                                <span className="method-id">{method.id}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="auth-methods-empty">No methods configured</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="auth-config-not-set">
                    Authentication configuration not set for this site
                  </div>
                )}
              </div>

              {selectedItem.activationDate && (
                <div className="detail-section">
                  <h3><FaCheckCircle /> Activation Details</h3>
                  <div className="detail-grid">
                    <div className="detail-field">
                      <label>Activation Date & Time</label>
                      <span>{formatDateTime(selectedItem.activationDate)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="pq-modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Testing Checklist Modal */}
      {showTestingModal && selectedItem && createPortal(
        <div className="pq-modal-overlay" onClick={() => setShowTestingModal(false)}>
          <div className="pq-modal pq-testing-modal" onClick={e => e.stopPropagation()}>
            <div className="pq-modal-header">
              <h2><FaClipboardCheck /> Testing Checklist - {selectedItem.siteName}</h2>
              <button className="modal-close" onClick={() => setShowTestingModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="pq-modal-body">
              <div className="testing-progress-summary">
                <div className="progress-circle">
                  <span className="progress-value">
                    {getTestingProgress(selectedItem.testingChecklist).percentage}%
                  </span>
                </div>
                <div className="progress-info">
                  <h3>Testing Progress</h3>
                  <p>
                    {getTestingProgress(selectedItem.testingChecklist).completed} of{" "}
                    {getTestingProgress(selectedItem.testingChecklist).total} required tests completed
                  </p>
                </div>
              </div>

              <div className="testing-checklist">
                {SITE_TESTING_CHECKLIST.map(item => {
                  const isCompleted = selectedItem.testingChecklist[item.id]?.completed;
                  const completedAt = selectedItem.testingChecklist[item.id]?.completedAt;

                  return (
                    <div key={item.id} className={`checklist-item ${isCompleted ? 'completed' : ''}`}>
                      <label className="checklist-checkbox">
                        <input
                          type="checkbox"
                          checked={isCompleted || false}
                          onChange={(e) => handleTestingChecklistUpdate(
                            selectedItem.id,
                            item.id,
                            e.target.checked
                          )}
                        />
                        <span className="checkbox-custom">
                          {isCompleted && <FaCheck />}
                        </span>
                      </label>
                      <div className="checklist-content">
                        <div className="checklist-label">
                          {item.label}
                          {item.required && <span className="required-badge">Required</span>}
                        </div>
                        <div className="checklist-description">{item.description}</div>
                        {isCompleted && completedAt && (
                          <div className="checklist-completed-at">
                            Completed on {formatDateTime(completedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pq-modal-footer">
              <button className="btn-secondary" onClick={() => setShowTestingModal(false)}>
                Close
              </button>
              {getTestingProgress(selectedItem.testingChecklist).percentage === 100 && (
                <button
                  className="btn-success"
                  onClick={() => handleMoveToRFSPending(selectedItem)}
                >
                  <FaFlagCheckered /> Move to RFS Pending
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* RFS Confirmation Modal */}
      {showRFSModal && selectedItem && createPortal(
        <div className="pq-modal-overlay" onClick={() => setShowRFSModal(false)}>
          <div className="pq-modal pq-rfs-modal" onClick={e => e.stopPropagation()}>
            <div className="pq-modal-header">
              <h2><FaRocket /> Confirm Ready for Service (RFS)</h2>
              <button className="modal-close" onClick={() => setShowRFSModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="pq-modal-body">
              <div className="rfs-info-banner">
                <FaInfoCircle />
                <div>
                  <strong>Site: {selectedItem.siteName}</strong>
                  <p>This action will mark the site as ACTIVE and trigger the following:</p>
                  <ul>
                    <li><FaEnvelope /> Welcome email to customer with site details</li>
                    <li><FaWifi /> SSID credentials email to customer</li>
                    <li><FaCheckCircle /> Site visible on customer portal</li>
                  </ul>
                </div>
              </div>

              <div className="rfs-form">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rfsData.usePastDate}
                      onChange={(e) => setRfsData(prev => ({
                        ...prev,
                        usePastDate: e.target.checked
                      }))}
                    />
                    <span>Use past date/time for activation (backdate RFS)</span>
                  </label>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Activation Date <span className="required">*</span></label>
                    <input
                      type="date"
                      value={rfsData.activationDate}
                      max={rfsData.usePastDate ? new Date().toISOString().split('T')[0] : undefined}
                      onChange={(e) => setRfsData(prev => ({
                        ...prev,
                        activationDate: e.target.value
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Activation Time <span className="required">*</span></label>
                    <input
                      type="time"
                      value={rfsData.activationTime}
                      onChange={(e) => setRfsData(prev => ({
                        ...prev,
                        activationTime: e.target.value
                      }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea
                    value={rfsData.notes}
                    onChange={(e) => setRfsData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes for this activation..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="rfs-warning">
                <FaExclamationTriangle />
                <span>This action cannot be undone. Please verify all details before confirming.</span>
              </div>
            </div>
            <div className="pq-modal-footer">
              <button className="btn-secondary" onClick={() => setShowRFSModal(false)}>
                Cancel
              </button>
              <button
                className="btn-success"
                onClick={handleRFSConfirmation}
                disabled={!rfsData.activationDate || !rfsData.activationTime}
              >
                <FaCheckCircle /> Confirm Activation
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Suspend/Block Action Modal */}
      {showActionModal && selectedItem && createPortal(
        <div className="pq-modal-overlay" onClick={() => setShowActionModal(false)}>
          <div className="pq-modal pq-action-modal" onClick={e => e.stopPropagation()}>
            <div className="pq-modal-header">
              <h2>
                {actionType === 'suspend' ? (
                  <><FaPause /> Suspend Site</>
                ) : (
                  <><FaBan /> Block Site</>
                )}
              </h2>
              <button className="modal-close" onClick={() => setShowActionModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="pq-modal-body">
              <div className={`action-warning ${actionType}`}>
                <FaExclamationTriangle />
                <div>
                  {actionType === 'suspend' ? (
                    <>
                      <strong>Suspending: {selectedItem.siteName}</strong>
                      <p>
                        This will temporarily stop WiFi access for all users at this site.
                        The site configuration will be preserved and can be reactivated later.
                      </p>
                    </>
                  ) : (
                    <>
                      <strong>Blocking: {selectedItem.siteName}</strong>
                      <p>
                        This will permanently terminate the site. All user accounts will be
                        disabled and the site cannot be reactivated. This action is irreversible.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Reason <span className="required">*</span></label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={`Enter reason for ${actionType === 'suspend' ? 'suspension' : 'blocking'}...`}
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="pq-modal-footer">
              <button className="btn-secondary" onClick={() => setShowActionModal(false)}>
                Cancel
              </button>
              <button
                className={actionType === 'suspend' ? 'btn-warning' : 'btn-danger'}
                onClick={handleSiteAction}
                disabled={!actionReason.trim()}
              >
                {actionType === 'suspend' ? (
                  <><FaPause /> Confirm Suspension</>
                ) : (
                  <><FaBan /> Confirm Block</>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SiteProvisioningQueue;
