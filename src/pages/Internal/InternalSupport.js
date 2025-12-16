// src/pages/Internal/InternalSupport.js

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaReply,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPaperPlane,
  FaHistory,
  FaSyncAlt,
} from "react-icons/fa";
import { supportTickets, customers, sites } from "@constants/internalPortalData";
import notifications from "@utils/notifications";
import Pagination from "@components/Pagination";
import "./InternalSupport.css";

const priorityOptions = ["all", "critical", "high", "medium", "low"];
const statusOptions = ["all", "open", "in_progress", "pending_approval", "scheduled", "completed"];
const categoryOptions = ["all", "connectivity", "outage", "upgrade", "maintenance", "compliance", "other"];

const getPriorityIcon = (priority) => {
  switch (priority) {
    case "critical":
      return <FaExclamationCircle className="priority-icon critical" />;
    case "high":
      return <FaExclamationTriangle className="priority-icon high" />;
    case "medium":
      return <FaClock className="priority-icon medium" />;
    default:
      return <FaClock className="priority-icon low" />;
  }
};

const getStatusBadge = (status) => {
  const statusLabels = {
    open: "Open",
    in_progress: "In Progress",
    pending_approval: "Pending Approval",
    scheduled: "Scheduled",
    completed: "Completed",
  };
  return statusLabels[status] || status;
};

const InternalSupport = () => {
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeStatCard, setActiveStatCard] = useState(null); // Track active stat card filter
  const [newTicket, setNewTicket] = useState({
    customerId: "",
    siteId: "",
    subject: "",
    description: "",
    priority: "medium",
    category: "other",
  });

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return supportTickets.filter((ticket) => {
      const matchesSearch =
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || ticket.category === categoryFilter;

      return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
    });
  }, [searchQuery, priorityFilter, statusFilter, categoryFilter]);

  // Pagination
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTickets.slice(start, start + rowsPerPage);
  }, [filteredTickets, currentPage, rowsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priorityFilter, statusFilter, categoryFilter]);

  // Stats
  const stats = useMemo(() => {
    const all = supportTickets;
    return {
      total: all.length,
      open: all.filter((t) => t.status === "open").length,
      inProgress: all.filter((t) => t.status === "in_progress").length,
      critical: all.filter((t) => t.priority === "critical").length,
      resolved: all.filter((t) => t.status === "completed").length,
    };
  }, []);

  const clearFilters = () => {
    setPriorityFilter("all");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
    setActiveStatCard(null);
  };

  // Handle stat card click to filter tickets
  const handleStatCardClick = (cardType) => {
    // If clicking the same card, toggle it off (show all)
    if (activeStatCard === cardType) {
      clearFilters();
      return;
    }

    // Reset filters first
    setPriorityFilter("all");
    setStatusFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
    setActiveStatCard(cardType);

    // Apply the appropriate filter based on card type
    switch (cardType) {
      case "total":
        // Show all tickets - no filter needed
        break;
      case "open":
        setStatusFilter("open");
        break;
      case "inProgress":
        setStatusFilter("in_progress");
        break;
      case "critical":
        setPriorityFilter("critical");
        break;
      case "resolved":
        setStatusFilter("completed");
        break;
      default:
        break;
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseTicketModal = () => {
    setSelectedTicket(null);
    setReplyText("");
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      notifications.showWarning("Please enter a reply message");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notifications.showSuccess("Reply sent successfully");
      setReplyText("");
    } catch (error) {
      notifications.showError("Failed to send reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      notifications.showSuccess(`Ticket status updated to ${getStatusBadge(newStatus)}`);
    } catch (error) {
      notifications.showError("Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  // Refresh tickets
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notifications.showSuccess("Tickets refreshed successfully");
    } catch (error) {
      notifications.showError("Failed to refresh tickets");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Create ticket handlers
  const handleCreateTicket = async () => {
    if (!newTicket.customerId || !newTicket.subject.trim() || !newTicket.description.trim()) {
      notifications.showWarning("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notifications.showSuccess("Ticket created successfully");
      setShowCreateModal(false);
      setNewTicket({
        customerId: "",
        siteId: "",
        subject: "",
        description: "",
        priority: "medium",
        category: "other",
      });
    } catch (error) {
      notifications.showError("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewTicketChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({ ...prev, [name]: value }));
  };

  // Get sites for selected customer
  const customerSites = useMemo(() => {
    if (!newTicket.customerId) return [];
    return sites.filter((s) => s.customerId === newTicket.customerId);
  }, [newTicket.customerId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilSLA = (slaDeadline) => {
    const now = new Date();
    const deadline = new Date(slaDeadline);
    const diff = deadline - now;

    if (diff < 0) return { text: "Overdue", isOverdue: true };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { text: `${days}d ${hours % 24}h`, isOverdue: false };
    }

    return { text: `${hours}h ${minutes}m`, isOverdue: hours < 2 };
  };

  return (
    <div className="internal-support">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1>
              <FaTicketAlt className="page-title-icon" />
              Support Queue
            </h1>
            <p className="page-subtitle">
              Manage customer support tickets and requests
            </p>
          </div>
          <div className="page-header-actions">
            <button
              className={`btn btn-outline ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <FaSyncAlt className={isRefreshing ? 'spin' : ''} /> {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <FaPlus /> Create Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="support-stats">
        <div
          className={`stat-card clickable ${activeStatCard === 'total' ? 'active' : ''}`}
          onClick={() => handleStatCardClick('total')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleStatCardClick('total')}
        >
          <div className="stat-icon total">
            <FaTicketAlt />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Tickets</span>
          </div>
        </div>
        <div
          className={`stat-card clickable ${activeStatCard === 'open' ? 'active' : ''}`}
          onClick={() => handleStatCardClick('open')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleStatCardClick('open')}
        >
          <div className="stat-icon open">
            <FaExclamationCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.open}</span>
            <span className="stat-label">Open</span>
          </div>
        </div>
        <div
          className={`stat-card clickable ${activeStatCard === 'inProgress' ? 'active' : ''}`}
          onClick={() => handleStatCardClick('inProgress')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleStatCardClick('inProgress')}
        >
          <div className="stat-icon progress">
            <FaSpinner />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div
          className={`stat-card clickable ${activeStatCard === 'critical' ? 'active' : ''}`}
          onClick={() => handleStatCardClick('critical')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleStatCardClick('critical')}
        >
          <div className="stat-icon critical">
            <FaExclamationTriangle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.critical}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>
        <div
          className={`stat-card clickable ${activeStatCard === 'resolved' ? 'active' : ''}`}
          onClick={() => handleStatCardClick('resolved')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && handleStatCardClick('resolved')}
        >
          <div className="stat-icon resolved">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.resolved}</span>
            <span className="stat-label">Resolved</span>
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
              placeholder="Search tickets by ID, subject, or customer..."
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
              <label>Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {priorityOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "all" ? "All Priorities" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "all" ? "All Statuses" : getStatusBadge(opt)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-text" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Tickets Table */}
      <div className="tickets-table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
              <th>Customer</th>
              <th>Site</th>
              <th>Priority</th>
              <th>Status</th>
              <th>SLA</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTickets.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  <FaTicketAlt className="no-data-icon" />
                  <p>No tickets found</p>
                </td>
              </tr>
            ) : (
              paginatedTickets.map((ticket) => {
                const slaInfo = getTimeUntilSLA(ticket.slaDeadline);
                return (
                  <tr key={ticket.id}>
                    <td className="ticket-id">{ticket.id.toUpperCase()}</td>
                    <td className="ticket-subject">
                      <span className="subject-text">{ticket.subject}</span>
                      <span className="category-tag">{ticket.category}</span>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <FaBuilding className="cell-icon" />
                        {ticket.customerName}
                      </div>
                    </td>
                    <td>
                      <div className="site-cell">
                        <FaMapMarkerAlt className="cell-icon" />
                        {ticket.siteName || "All Sites"}
                      </div>
                    </td>
                    <td>
                      <span className={`priority-badge ${ticket.priority}`}>
                        {getPriorityIcon(ticket.priority)}
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${ticket.status}`}>
                        {getStatusBadge(ticket.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`sla-badge ${slaInfo.isOverdue ? "overdue" : ""}`}>
                        <FaClock />
                        {slaInfo.text}
                      </span>
                    </td>
                    <td>
                      <div className="assigned-cell">
                        <FaUser className="cell-icon" />
                        {ticket.assignedTo || "Unassigned"}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleViewTicket(ticket)}
                          title="View Ticket"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleViewTicket(ticket)}
                          title="Reply"
                        >
                          <FaReply />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredTickets.length > 0 && (
        <div className="pagination-wrapper">
          <Pagination
            totalItems={filteredTickets.length}
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

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="ticket-modal-overlay" onClick={handleCloseTicketModal}>
          <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ticket-modal-header">
              <div className="ticket-modal-title">
                <h2>{selectedTicket.id.toUpperCase()}</h2>
                <span className={`priority-badge ${selectedTicket.priority}`}>
                  {selectedTicket.priority}
                </span>
                <span className={`status-badge ${selectedTicket.status}`}>
                  {getStatusBadge(selectedTicket.status)}
                </span>
              </div>
              <button className="close-btn" onClick={handleCloseTicketModal}>
                <FaTimes />
              </button>
            </div>

            <div className="ticket-modal-body">
              <div className="ticket-info-section">
                <h3>{selectedTicket.subject}</h3>
                <p className="ticket-description">{selectedTicket.description}</p>

                <div className="ticket-meta-grid">
                  <div className="meta-item">
                    <span className="meta-label">Customer</span>
                    <span className="meta-value">
                      <FaBuilding /> {selectedTicket.customerName}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Site</span>
                    <span className="meta-value">
                      <FaMapMarkerAlt /> {selectedTicket.siteName || "All Sites"}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Category</span>
                    <span className="meta-value">{selectedTicket.category}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Created</span>
                    <span className="meta-value">{formatDate(selectedTicket.createdAt)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Last Updated</span>
                    <span className="meta-value">{formatDate(selectedTicket.updatedAt)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Assigned To</span>
                    <span className="meta-value">
                      <FaUser /> {selectedTicket.assignedTo || "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ticket-timeline">
                <h4>
                  <FaHistory /> Activity ({selectedTicket.responses} responses)
                </h4>
                <div className="timeline-placeholder">
                  <p>Ticket conversation history will appear here</p>
                </div>
              </div>

              <div className="ticket-reply-section">
                <h4>
                  <FaReply /> Reply
                </h4>
                <textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="4"
                />
              </div>
            </div>

            <div className="ticket-modal-footer">
              <div className="status-actions">
                <label>Update Status:</label>
                <select
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  defaultValue={selectedTicket.status}
                  disabled={submitting}
                >
                  {statusOptions.filter((s) => s !== "all").map((status) => (
                    <option key={status} value={status}>
                      {getStatusBadge(status)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="reply-actions">
                <button className="btn btn-outline" onClick={handleCloseTicketModal}>
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitReply}
                  disabled={submitting || !replyText.trim()}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="ticket-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="ticket-modal create-ticket-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ticket-modal-header">
              <h2>
                <FaPlus /> Create New Ticket
              </h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="ticket-modal-body">
              <div className="create-ticket-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Customer <span className="required">*</span></label>
                    <select
                      name="customerId"
                      value={newTicket.customerId}
                      onChange={handleNewTicketChange}
                    >
                      <option value="">Select Customer</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Site</label>
                    <select
                      name="siteId"
                      value={newTicket.siteId}
                      onChange={handleNewTicketChange}
                      disabled={!newTicket.customerId}
                    >
                      <option value="">All Sites</option>
                      {customerSites.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={newTicket.priority}
                      onChange={handleNewTicketChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={newTicket.category}
                      onChange={handleNewTicketChange}
                    >
                      <option value="connectivity">Connectivity</option>
                      <option value="outage">Outage</option>
                      <option value="upgrade">Upgrade</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="compliance">Compliance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Subject <span className="required">*</span></label>
                  <input
                    type="text"
                    name="subject"
                    value={newTicket.subject}
                    onChange={handleNewTicketChange}
                    placeholder="Brief summary of the issue"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description <span className="required">*</span></label>
                  <textarea
                    name="description"
                    value={newTicket.description}
                    onChange={handleNewTicketChange}
                    placeholder="Detailed description of the issue..."
                    rows="5"
                  />
                </div>
              </div>
            </div>

            <div className="ticket-modal-footer">
              <button className="btn btn-outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateTicket}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="spin" /> Creating...
                  </>
                ) : (
                  <>
                    <FaPlus /> Create Ticket
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalSupport;
