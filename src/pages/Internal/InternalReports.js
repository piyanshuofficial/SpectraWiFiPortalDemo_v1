// src/pages/Internal/InternalReports.js

import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaSearch,
  FaFilter,
  FaEye,
  FaFileCsv,
  FaFilePdf,
  FaStar,
  FaRegStar,
  FaTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaUsers,
  FaWifi,
  FaNetworkWired,
  FaShieldAlt,
  FaDownload,
  FaChartBar,
  FaChartPie,
  FaCalendarAlt,
  FaServer,
  FaExclamationTriangle,
  FaTicketAlt,
  FaSpinner,
} from "react-icons/fa";
import {
  customers,
  sites,
  platformMetrics,
} from "@constants/internalPortalData";
import notifications from "@utils/notifications";
import { exportReportPDF } from "@utils/exportReportPDF";
import { exportChartDataToCSV } from "@utils/exportUtils";
import "./InternalReports.css";

// Internal-specific report categories
const internalReportCategories = [
  { id: "all", name: "All Reports", icon: FaChartLine },
  { id: "platform", name: "Platform Analytics", icon: FaServer },
  { id: "customer", name: "Customer Reports", icon: FaBuilding },
  { id: "site", name: "Site Performance", icon: FaMapMarkerAlt },
  { id: "network", name: "Network & Bandwidth", icon: FaNetworkWired },
  { id: "security", name: "Security & Compliance", icon: FaShieldAlt },
  { id: "support", name: "Support & Tickets", icon: FaTicketAlt },
];

// Internal reports data
const internalReports = [
  // Platform Analytics
  {
    id: "platform_overview",
    name: "Platform Overview Dashboard",
    description: "High-level metrics across all customers and sites",
    category: "platform",
    icon: FaChartPie,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "customer_growth",
    name: "Customer Growth Analysis",
    description: "Month-over-month customer acquisition and retention metrics",
    category: "platform",
    icon: FaChartLine,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "site_deployment",
    name: "Site Deployment Tracker",
    description: "Track site provisioning, activation, and deployment timelines",
    category: "platform",
    icon: FaMapMarkerAlt,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "license_utilization",
    name: "License Utilization Report",
    description: "License usage across all customers with capacity planning insights",
    category: "platform",
    icon: FaServer,
    exportFormats: ["csv", "pdf"],
  },
  // Customer Reports
  {
    id: "customer_summary",
    name: "Customer Summary Report",
    description: "Comprehensive overview of all customers with key metrics",
    category: "customer",
    icon: FaBuilding,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "customer_revenue",
    name: "Customer Revenue Analysis",
    description: "Revenue breakdown by customer, segment, and region",
    category: "customer",
    icon: FaChartBar,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "customer_health",
    name: "Customer Health Score",
    description: "Customer health metrics including uptime, usage, and satisfaction",
    category: "customer",
    icon: FaChartLine,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "contract_expiry",
    name: "Contract Expiry Report",
    description: "Upcoming contract renewals and expirations",
    category: "customer",
    icon: FaCalendarAlt,
    exportFormats: ["csv", "pdf"],
  },
  // Site Performance
  {
    id: "site_status",
    name: "Site Status Report",
    description: "Real-time status of all sites with health indicators",
    category: "site",
    icon: FaMapMarkerAlt,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "site_uptime",
    name: "Site Uptime Analysis",
    description: "Historical uptime data and SLA compliance metrics",
    category: "site",
    icon: FaChartLine,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "site_capacity",
    name: "Site Capacity Report",
    description: "User and device capacity utilization per site",
    category: "site",
    icon: FaUsers,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "regional_performance",
    name: "Regional Performance",
    description: "Performance breakdown by geographical region",
    category: "site",
    icon: FaChartPie,
    exportFormats: ["csv", "pdf"],
  },
  // Network & Bandwidth
  {
    id: "bandwidth_utilization",
    name: "Bandwidth Utilization Report",
    description: "Network bandwidth usage across all sites",
    category: "network",
    icon: FaNetworkWired,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "device_inventory",
    name: "Device Inventory Report",
    description: "Complete inventory of network devices across all sites",
    category: "network",
    icon: FaWifi,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "traffic_analysis",
    name: "Traffic Analysis Report",
    description: "Network traffic patterns and peak usage analysis",
    category: "network",
    icon: FaChartBar,
    exportFormats: ["csv", "pdf"],
  },
  // Security & Compliance
  {
    id: "security_audit",
    name: "Security Audit Report",
    description: "Security events, vulnerabilities, and compliance status",
    category: "security",
    icon: FaShieldAlt,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "access_logs",
    name: "Access Logs Report",
    description: "User access patterns and authentication logs",
    category: "security",
    icon: FaUsers,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "incident_report",
    name: "Security Incident Report",
    description: "Security incidents and response metrics",
    category: "security",
    icon: FaExclamationTriangle,
    exportFormats: ["csv", "pdf"],
  },
  // Support & Tickets
  {
    id: "ticket_summary",
    name: "Support Ticket Summary",
    description: "Overview of support tickets by status, priority, and category",
    category: "support",
    icon: FaTicketAlt,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "sla_performance",
    name: "SLA Performance Report",
    description: "SLA compliance and response time metrics",
    category: "support",
    icon: FaChartLine,
    exportFormats: ["csv", "pdf"],
  },
  {
    id: "customer_satisfaction",
    name: "Customer Satisfaction Report",
    description: "CSAT scores and feedback analysis",
    category: "support",
    icon: FaStar,
    exportFormats: ["csv", "pdf"],
  },
];

// Generate sample report data
const generateReportData = (reportId) => {
  switch (reportId) {
    case "customer_summary":
      return customers.map(c => ({
        Customer: c.name,
        Type: c.type,
        Status: c.status,
        Sites: c.totalSites,
        "Active Sites": c.activeSites,
        Users: c.totalUsers,
        Devices: c.totalDevices,
        "Account Manager": c.accountManager,
      }));
    case "site_status":
      return sites.map(s => ({
        Site: s.name,
        Customer: s.customerName,
        City: s.city,
        Region: s.region,
        Status: s.status,
        "Active Users": s.activeUsers,
        "Online Devices": s.onlineDevices,
        "Uptime %": s.uptime,
        Alerts: s.alerts,
      }));
    case "regional_performance":
      return platformMetrics.regional.map(r => ({
        Region: r.region,
        Sites: r.sites,
        Users: r.users,
        Devices: r.devices,
      }));
    default:
      return [];
  }
};

const InternalReports = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pinnedReports, setPinnedReports] = useState([
    "platform_overview",
    "customer_summary",
    "site_status",
  ]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportingReportId, setExportingReportId] = useState(null);

  // Filter reports based on category and search
  const filteredReports = useMemo(() => {
    let reports = internalReports;

    if (activeCategory !== "all") {
      reports = reports.filter((r) => r.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      reports = reports.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term)
      );
    }

    return reports;
  }, [activeCategory, searchTerm]);

  const pinnedReportObjects = useMemo(() => {
    return pinnedReports
      .map((id) => internalReports.find((r) => r.id === id))
      .filter(Boolean);
  }, [pinnedReports]);

  const togglePin = useCallback((reportId) => {
    setPinnedReports((prev) => {
      if (prev.includes(reportId)) {
        return prev.filter((id) => id !== reportId);
      }
      if (prev.length >= 6) {
        notifications.showWarning("Maximum 6 reports can be pinned");
        return prev;
      }
      return [...prev, reportId];
    });
  }, []);

  const isPinned = useCallback(
    (reportId) => pinnedReports.includes(reportId),
    [pinnedReports]
  );

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  // Helper to get report data as headers and rows for export
  const getReportDataForExport = useCallback((report) => {
    const data = generateReportData(report.id);
    if (data.length === 0) {
      return { headers: [], rows: [] };
    }
    const headers = Object.keys(data[0]);
    const rows = data.map((row) => headers.map((h) => row[h]));
    return { headers, rows };
  }, []);

  // Generate filename for export
  const generateFilename = useCallback((report, extension) => {
    const date = new Date().toISOString().split("T")[0];
    const cleanName = report.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    return `Internal_${cleanName}_${date}.${extension}`;
  }, []);

  const handleExportCSV = async (report) => {
    setExporting(true);
    setExportingReportId(report.id);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { headers, rows } = getReportDataForExport(report);

      if (rows.length > 0) {
        await exportChartDataToCSV({ headers, rows }, generateFilename(report, 'csv'));
        notifications.showSuccess("CSV report exported successfully");
      } else {
        notifications.showInfo("No data available for export");
      }
    } catch (error) {
      console.error("CSV export error:", error);
      notifications.showError("Failed to export CSV report");
    } finally {
      setExporting(false);
      setExportingReportId(null);
    }
  };

  const handleExportPDF = async (report) => {
    setExporting(true);
    setExportingReportId(report.id);

    try {
      const { headers, rows } = getReportDataForExport(report);

      if (rows.length === 0) {
        notifications.showInfo("No data available for export");
        setExporting(false);
        setExportingReportId(null);
        return;
      }

      // Internal portal permissions - always allow for internal users
      const internalPermissions = {
        canViewReports: true,
        canExportReports: true,
      };

      await exportReportPDF({
        title: report.name,
        headers,
        rows,
        chartData: null, // No chart for internal reports currently
        chartOptions: null,
        filename: generateFilename(report, 'pdf'),
        rolePermissions: internalPermissions,
        exportCanvasWidth: 900,
        exportCanvasHeight: 450,
        reportId: report.id,
        criteria: null,
        addWatermark: true,
        watermarkText: "INTERNAL USE ONLY",
        disclaimerText: "This report is for internal Spectra use only. Contains confidential platform data. Do not distribute without authorization.",
        includeExecutiveSummary: true
      });

      notifications.showSuccess("PDF report generated successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      notifications.showError("Failed to generate PDF report");
    } finally {
      setExporting(false);
      setExportingReportId(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: internalReports.length };
    internalReportCategories.forEach((cat) => {
      if (cat.id !== "all") {
        counts[cat.id] = internalReports.filter((r) => r.category === cat.id).length;
      }
    });
    return counts;
  }, []);

  return (
    <div className="internal-reports">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1>
              <FaChartLine className="page-title-icon" />
              Reports & Analytics
            </h1>
            <p className="page-subtitle">
              Comprehensive reporting and analytics for platform management
            </p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-outline" onClick={() => navigate("/internal/dashboard")}>
              <FaChartBar /> Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="reports-summary-stats">
        <div className="summary-stat-card">
          <div className="stat-icon customers-icon">
            <FaBuilding />
          </div>
          <div className="stat-content">
            <span className="stat-value">{platformMetrics.overview.totalCustomers}</span>
            <span className="stat-label">Total Customers</span>
          </div>
        </div>
        <div className="summary-stat-card">
          <div className="stat-icon sites-icon">
            <FaMapMarkerAlt />
          </div>
          <div className="stat-content">
            <span className="stat-value">{platformMetrics.overview.totalSites}</span>
            <span className="stat-label">Total Sites</span>
          </div>
        </div>
        <div className="summary-stat-card">
          <div className="stat-icon users-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <span className="stat-value">{(platformMetrics.overview.totalUsers / 1000).toFixed(1)}K</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="summary-stat-card">
          <div className="stat-icon devices-icon">
            <FaWifi />
          </div>
          <div className="stat-content">
            <span className="stat-value">{(platformMetrics.overview.totalDevices / 1000).toFixed(1)}K</span>
            <span className="stat-label">Total Devices</span>
          </div>
        </div>
      </div>

      {/* Pinned Reports */}
      {pinnedReportObjects.length > 0 && (
        <div className="pinned-reports-section">
          <div className="section-header">
            <h2>
              <FaStar className="section-icon" /> Pinned Reports
            </h2>
            <span className="pinned-count">({pinnedReportObjects.length}/6)</span>
          </div>
          <div className="pinned-reports-grid">
            {pinnedReportObjects.map((report) => (
              <button
                key={report.id}
                className="pinned-report-card"
                onClick={() => handleViewReport(report)}
              >
                <div className="pinned-report-icon">
                  <report.icon />
                </div>
                <span className="pinned-report-name">{report.name}</span>
                <button
                  className="unpin-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(report.id);
                  }}
                  title="Unpin report"
                >
                  <FaTimes />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="reports-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={clearSearch}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {internalReportCategories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <cat.icon className="tab-icon" />
            <span className="tab-name">{cat.name}</span>
            <span className="tab-count">{categoryCounts[cat.id]}</span>
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <FaChartLine className="no-reports-icon" />
            <p>No reports found</p>
            {searchTerm && (
              <button className="btn btn-secondary" onClick={clearSearch}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-card-header">
                <div className="report-icon-wrapper">
                  <report.icon />
                </div>
                <button
                  className={`pin-btn ${isPinned(report.id) ? "pinned" : ""}`}
                  onClick={() => togglePin(report.id)}
                  title={isPinned(report.id) ? "Unpin report" : "Pin report"}
                >
                  {isPinned(report.id) ? <FaStar /> : <FaRegStar />}
                </button>
              </div>
              <h3 className="report-card-title">{report.name}</h3>
              <p className="report-card-description">{report.description}</p>
              <div className="report-card-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewReport(report)}
                >
                  <FaEye /> View
                </button>
                {report.exportFormats.includes("csv") && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleExportCSV(report)}
                    disabled={exporting && exportingReportId === report.id}
                  >
                    {exporting && exportingReportId === report.id ? (
                      <FaSpinner className="spin" />
                    ) : (
                      <FaFileCsv />
                    )}{" "}
                    CSV
                  </button>
                )}
                {report.exportFormats.includes("pdf") && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleExportPDF(report)}
                    disabled={exporting && exportingReportId === report.id}
                  >
                    {exporting && exportingReportId === report.id ? (
                      <FaSpinner className="spin" />
                    ) : (
                      <FaFilePdf />
                    )}{" "}
                    PDF
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="report-preview-overlay" onClick={() => setSelectedReport(null)}>
          <div className="report-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="report-preview-header">
              <h2>{selectedReport.name}</h2>
              <button className="close-btn" onClick={() => setSelectedReport(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="report-preview-body">
              <p className="report-description">{selectedReport.description}</p>

              {/* Sample data table */}
              {generateReportData(selectedReport.id).length > 0 ? (
                <div className="report-data-table-wrapper">
                  <table className="report-data-table">
                    <thead>
                      <tr>
                        {Object.keys(generateReportData(selectedReport.id)[0]).map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {generateReportData(selectedReport.id).slice(0, 10).map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((cell, cellIdx) => (
                            <td key={cellIdx}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {generateReportData(selectedReport.id).length > 10 && (
                    <p className="table-note">
                      Showing 10 of {generateReportData(selectedReport.id).length} records
                    </p>
                  )}
                </div>
              ) : (
                <div className="no-preview-data">
                  <FaChartBar className="no-data-icon" />
                  <p>Report preview data coming soon</p>
                </div>
              )}
            </div>
            <div className="report-preview-footer">
              <button className="btn btn-outline" onClick={() => setSelectedReport(null)}>
                Close
              </button>
              <div className="export-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleExportCSV(selectedReport)}
                  disabled={exporting}
                >
                  {exporting && exportingReportId === selectedReport.id ? (
                    <FaSpinner className="spin" />
                  ) : (
                    <FaFileCsv />
                  )}{" "}
                  Export CSV
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleExportPDF(selectedReport)}
                  disabled={exporting}
                >
                  {exporting && exportingReportId === selectedReport.id ? (
                    <FaSpinner className="spin" />
                  ) : (
                    <FaFilePdf />
                  )}{" "}
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalReports;
