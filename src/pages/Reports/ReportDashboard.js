// src/pages/Reports/ReportDashboard.js

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { Permissions } from "../../utils/accessLevels";
import { useLoading } from "../../context/LoadingContext";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import Button from "../../components/Button";
import { FaEye, FaFileCsv, FaFilePdf, FaStar, FaRegStar, FaTimes, FaClock, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "./ReportDashboard.css";

// Import enhanced report data and utilities
import enhancedSampleReports, { 
  getCategories, 
  getSubcategories, 
  getReportsByCategory, 
  searchReports,
  getCommonReports 
} from "../../constants/enhancedSampleReports";
import sampleReportsData from "../../constants/sampleReportsData";
import { exportChartDataToCSV } from "../../utils/exportUtils";
import { exportReportPDF } from "../../utils/exportReportPDF";
import { getStandardChartOptions } from "../../utils/commonChartOptions";
import { EXPORT_CANVAS_SIZES } from "../../utils/exportConstants";

// Import report components
import SiteMonthlyActiveUsers from "../../reports/SiteMonthlyActiveUsers";
import MonthlyDataUsageSummary from "../../reports/MonthlyDataUsageSummary";
import DailyAverageActiveUsers from "../../reports/DailyAverageActiveUsers";
import PolicyWiseMonthlyAverageActiveUsers from "../../reports/PolicyWiseMonthlyAverageActiveUsers";
import NetworkUsageReport from "../../reports/NetworkUsageReport";
import LicenseUsageReport from "../../reports/LicenseUsageReport";
import AlertsSummaryReport from "../../reports/AlertsSummaryReport";

const MAX_PINNED_REPORTS = 6;
const MAX_RECENT_REPORTS = 5;
const LOCAL_STORAGE_KEYS = {
  PINNED: 'reportDashboard_pinnedReports',
  RECENT: 'reportDashboard_recentReports',
  COLORS: 'reportDashboard_pinnedColors'
};

// ============================================
// BRAND COLORS FOR PINNED REPORTS
// ============================================
const PINNED_REPORT_BRAND_COLORS = [
  "#9465AA",  // PURPLE
  "#5B879F",  // INDIGO  
  "#4AA7A9",  // AQUA
  "#42C1B5",  // MINT
];

/**
 * Get a random brand color different from the previous one
 */
const getRandomBrandColor = (previousColor = null) => {
  let availableColors = [...PINNED_REPORT_BRAND_COLORS];
  
  if (previousColor) {
    availableColors = availableColors.filter(color => color !== previousColor);
  }
  
  if (availableColors.length === 0) {
    availableColors = [...PINNED_REPORT_BRAND_COLORS];
  }
  
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
};

/**
 * Helper: Convert hex to rgba
 */
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Helper: Adjust color brightness
 */
const adjustBrightness = (hex, percent) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + (
    0x1000000 +
    R * 0x10000 +
    G * 0x100 +
    B
  ).toString(16).slice(1);
};

/**
 * Main ReportDashboard Component
 */
const ReportDashboard = () => {
  const { currentUser } = useAuth();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const rolePermissions = Permissions[currentUser.accessLevel]?.[currentUser.role] || {};
  
  // State management
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pinnedReports, setPinnedReports] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingReportId, setExportingReportId] = useState(null);
  const [pinnedColors, setPinnedColors] = useState({});

  const searchInputRef = useRef(null);
  const categories = useMemo(() => getCategories(), []);

  // ============================================
  // INITIALIZATION & PERSISTENCE
  // ============================================

  useEffect(() => {
    try {
      const savedPinned = localStorage.getItem(LOCAL_STORAGE_KEYS.PINNED);
      const savedRecent = localStorage.getItem(LOCAL_STORAGE_KEYS.RECENT);
      const savedColors = localStorage.getItem(LOCAL_STORAGE_KEYS.COLORS);
      
      let pinnedIds = [];
      
      if (savedPinned) {
        pinnedIds = JSON.parse(savedPinned);
      } else {
        const commonReports = getCommonReports().slice(0, MAX_PINNED_REPORTS);
        pinnedIds = commonReports.map(r => r.id);
      }
      
      setPinnedReports(pinnedIds);
      
      // Initialize colors
      if (savedColors) {
        const loadedColors = JSON.parse(savedColors);
        // Verify all pinned reports have colors
        const missingColors = pinnedIds.filter(id => !loadedColors[id]);
        
        if (missingColors.length > 0) {
          const updatedColors = { ...loadedColors };
          let prevColor = null;
          
          // Get the last color from existing assignments
          const existingColors = Object.values(loadedColors);
          if (existingColors.length > 0) {
            prevColor = existingColors[existingColors.length - 1];
          }
          
          missingColors.forEach(id => {
            const newColor = getRandomBrandColor(prevColor);
            updatedColors[id] = newColor;
            prevColor = newColor;
          });
          
          setPinnedColors(updatedColors);
        } else {
          setPinnedColors(loadedColors);
        }
      } else {
        // Generate initial colors
        const initialColors = {};
        let previousColor = null;
        
        pinnedIds.forEach(reportId => {
          const color = getRandomBrandColor(previousColor);
          initialColors[reportId] = color;
          previousColor = color;
        });
        
        setPinnedColors(initialColors);
      }
      
      if (savedRecent) {
        setRecentReports(JSON.parse(savedRecent));
      }
    } catch (error) {
      console.error('Error loading saved report preferences:', error);
    }

    // Set default active category
    if (categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  // Save pinned reports to localStorage
  useEffect(() => {
    if (pinnedReports.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PINNED, JSON.stringify(pinnedReports));
    }
  }, [pinnedReports]);

  // Save color assignments to localStorage
  useEffect(() => {
    if (Object.keys(pinnedColors).length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.COLORS, JSON.stringify(pinnedColors));
    }
  }, [pinnedColors]);

  // Save recent reports to localStorage
  useEffect(() => {
    if (recentReports.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.RECENT, JSON.stringify(recentReports));
    }
  }, [recentReports]);

  // ============================================
  // FILTERING & SEARCH
  // ============================================

  const filteredReports = useMemo(() => {
    let reports = enhancedSampleReports;

    if (searchTerm.trim()) {
      reports = searchReports(searchTerm);
    } else {
      if (activeCategory) {
        reports = getReportsByCategory(activeCategory, activeSubcategory || null);
      }
    }

    return reports;
  }, [activeCategory, activeSubcategory, searchTerm]);

  const subcategories = useMemo(() => {
    if (!activeCategory) return [];
    return getSubcategories(activeCategory);
  }, [activeCategory]);

  const pinnedReportObjects = useMemo(() => {
    return pinnedReports
      .map(id => enhancedSampleReports.find(r => r.id === id))
      .filter(Boolean);
  }, [pinnedReports]);

  const recentReportObjects = useMemo(() => {
    return recentReports
      .map(id => enhancedSampleReports.find(r => r.id === id))
      .filter(Boolean);
  }, [recentReports]);

  // ============================================
  // PINNING LOGIC WITH COLOR MANAGEMENT
  // ============================================

  const togglePin = useCallback((reportId) => {
    setPinnedReports(prev => {
      if (prev.includes(reportId)) {
        // Unpinning - remove color assignment
        setPinnedColors(prevColors => {
          const newColors = { ...prevColors };
          delete newColors[reportId];
          return newColors;
        });
        return prev.filter(id => id !== reportId);
      } else {
        if (prev.length >= MAX_PINNED_REPORTS) {
          toast.warning(`Maximum ${MAX_PINNED_REPORTS} pinned reports allowed`);
          return prev;
        }
        
        // Pinning - assign new color different from the last pinned report
        setPinnedColors(prevColors => {
          const lastPinnedId = prev[prev.length - 1];
          const lastColor = prevColors[lastPinnedId] || null;
          const newColor = getRandomBrandColor(lastColor);
          
          return {
            ...prevColors,
            [reportId]: newColor
          };
        });
        
        return [...prev, reportId];
      }
    });
  }, []);

  const isPinned = useCallback((reportId) => {
    return pinnedReports.includes(reportId);
  }, [pinnedReports]);

  // ============================================
  // RECENT REPORTS TRACKING
  // ============================================

  const addToRecent = useCallback((reportId) => {
    setRecentReports(prev => {
      const filtered = prev.filter(id => id !== reportId);
      const updated = [reportId, ...filtered].slice(0, MAX_RECENT_REPORTS);
      return updated;
    });
  }, []);

  // ============================================
  // REPORT VIEWING
  // ============================================

  const handleViewReport = useCallback((report) => {
    setSelectedReport(report);
    addToRecent(report.id);
    
    setTimeout(() => {
      const displaySection = document.getElementById('report-display-section');
      if (displaySection) {
        displaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [addToRecent]);

  // ============================================
  // EXPORT HANDLERS
  // ============================================

  const getCSVData = (report) => {
    const reportData = sampleReportsData[report.id];
    if (!reportData) return { headers: [], rows: [] };

    let headers = [];
    let rows = [];

    switch (report.id) {
      case "site-monthly-active-users":
        headers = ["Month", "Avg. Active Users", "New Users", "Churned Users", "Activations", "Deactivations", "Change vs Prev."];
        rows = reportData.map(r => [r.month, r.avgActiveUsers, r.newUsers, r.churnedUsers, r.activations, r.deactivations, r.changeFromPrevMonth >= 0 ? `+${r.changeFromPrevMonth}` : `${r.changeFromPrevMonth}`]);
        break;
      case "monthly-data-usage-summary":
        headers = ["Month", "Total Usage (GB)", "Peak Usage (GB)", "Avg Usage (GB)"];
        rows = reportData.map(r => [r.month, r.totalUsageGB, r.peakUsageGB, r.avgUsageGB]);
        break;
      case "daily-average-active-users":
        headers = ["Date", "Avg. Active Users"];
        rows = reportData.map(r => [r.date, r.avgActiveUsers]);
        break;
      case "policy-wise-monthly-average-active-users":
        headers = ["Month", "Policy", "Avg. Active Users"];
        rows = reportData.map(r => [r.month, r.policy, r.avgActiveUsers]);
        break;
      case "network-usage-report":
        headers = ["Day", "Network Usage (GB)"];
        rows = reportData.map(r => [r.day, r.usageGB]);
        break;
      case "license-usage-report":
        headers = ["License", "Usage"];
        rows = reportData.map(r => [r.licenseType, r.usageCount]);
        break;
      case "alerts-summary-report":
        headers = ["Alert Type", "Count"];
        rows = reportData.map(r => [r.alertType, r.count]);
        break;
      default:
        break;
    }

    return { headers, rows };
  };

  const handleDownloadCSV = async (report) => {
    if (!rolePermissions.canViewReports) {
      toast.error("You don't have permission to export reports");
      return;
    }

    setExportingCSV(true);
    setExportingReportId(report.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const { headers, rows } = getCSVData(report);
      await exportChartDataToCSV({ headers, rows }, `${report.name.replace(/\s/g, "_")}.csv`);
      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error("Failed to export CSV");
    } finally {
      setExportingCSV(false);
      setExportingReportId(null);
    }
  };

  const handleExportPDF = async (report) => {
    if (!rolePermissions.canViewReports) {
      toast.error("You don't have permission to export reports");
      return;
    }

    setExportingPDF(true);
    setExportingReportId(report.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const reportData = sampleReportsData[report.id];
      if (!reportData) {
        throw new Error('Report data not found');
      }

      const { headers, rows } = getCSVData(report);
      const { width, height } = EXPORT_CANVAS_SIZES.line;

      await exportReportPDF({
        title: report.name,
        headers,
        rows,
        chartData: null,
        chartOptions: null,
        filename: `${report.name.replace(/\s/g, "_")}_Report.pdf`,
        rolePermissions,
        exportCanvasWidth: width,
        exportCanvasHeight: height,
        reportId: report.id
      });
      
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Failed to export PDF");
    } finally {
      setExportingPDF(false);
      setExportingReportId(null);
    }
  };

  // ============================================
  // SEARCH HANDLERS
  // ============================================

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim()) {
      setActiveSubcategory('');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // ============================================
  // REPORT DISPLAY COMPONENT
  // ============================================

  const renderReportDetail = () => {
    if (!selectedReport) {
      return (
        <div className="no-report-selected">
          <p>Select a report to view details</p>
        </div>
      );
    }

    switch (selectedReport.id) {
      case "site-monthly-active-users":
        return <SiteMonthlyActiveUsers data={sampleReportsData["site-monthly-active-users"]} />;
      case "monthly-data-usage-summary":
        return <MonthlyDataUsageSummary data={sampleReportsData["monthly-data-usage-summary"]} />;
      case "daily-average-active-users":
        return <DailyAverageActiveUsers data={sampleReportsData["daily-average-active-users"]} />;
      case "policy-wise-monthly-average-active-users":
        return <PolicyWiseMonthlyAverageActiveUsers data={sampleReportsData["policy-wise-monthly-average-active-users"]} />;
      case "network-usage-report":
        return <NetworkUsageReport data={sampleReportsData["network-usage-report"]} />;
      case "license-usage-report":
        return <LicenseUsageReport data={sampleReportsData["license-usage-report"]} />;
      case "alerts-summary-report":
        return <AlertsSummaryReport data={sampleReportsData["alerts-summary-report"]} />;
      default:
        return (
          <div className="report-placeholder">
            <h3>{selectedReport.name}</h3>
            <p>{selectedReport.description}</p>
            <p className="report-placeholder-note">Full report visualization coming soon...</p>
          </div>
        );
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="report-dashboard-container" role="region" aria-label="Reports Dashboard">
      <LoadingOverlay 
        active={isLoading('export') || exportingCSV || exportingPDF} 
        message={exportingCSV ? "Preparing CSV..." : "Generating PDF..."}
      />

      {/* Pinned Shortcuts Strip */}
      <div className="pinned-shortcuts-section">
        <div className="shortcuts-header">
          <h3 className="shortcuts-title">
            <FaStar className="shortcuts-icon" /> Pinned Reports
          </h3>
          <span className="shortcuts-count">({pinnedReportObjects.length}/{MAX_PINNED_REPORTS})</span>
        </div>
        
        <div className="shortcuts-grid">
          {pinnedReportObjects.length === 0 ? (
            <div className="no-shortcuts">
              <p>No pinned reports. Click the star icon on any report to pin it here.</p>
            </div>
          ) : (
            pinnedReportObjects.map(report => {
              const color = pinnedColors[report.id] || PINNED_REPORT_BRAND_COLORS[0];
              const darkerColor = adjustBrightness(color, -15);
              
              return (
                <button
                  key={report.id}
                  className="shortcut-card"
                  onClick={() => handleViewReport(report)}
                  title={report.description}
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%)`,
                    boxShadow: `0 0.125rem 0.375rem ${hexToRgba(color, 0.25)}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0.375rem 1rem ${hexToRgba(color, 0.35)}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0.125rem 0.375rem ${hexToRgba(color, 0.25)}`;
                  }}
                >
                  <div className="shortcut-icon">
                    <FaEye />
                  </div>
                  <span className="shortcut-name">{report.name}</span>
                  <button
                    className="unpin-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(report.id);
                    }}
                    title="Unpin report"
                    aria-label="Unpin report"
                  >
                    <FaTimes />
                  </button>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Recently Viewed */}
      {recentReportObjects.length > 0 && (
        <div className="recent-reports-section">
          <h3 className="recent-title">
            <FaClock className="recent-icon" /> Recently Viewed
          </h3>
          <div className="recent-list">
            {recentReportObjects.map(report => (
              <button
                key={report.id}
                className="recent-item"
                onClick={() => handleViewReport(report)}
                title={report.description}
              >
                {report.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            ref={searchInputRef}
            type="search"
            className="search-input"
            placeholder="Search reports by name, category, keywords..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search reports"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            Found {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      {!searchTerm && (
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`tab ${activeCategory === category ? 'tab-active' : ''}`}
              onClick={() => {
                setActiveCategory(category);
                setActiveSubcategory('');
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Subcategory Dropdown */}
      {!searchTerm && activeCategory && subcategories.length > 0 && (
        <div className="subcategory-section">
          <label htmlFor="subcategory-select" className="subcategory-label">
            Filter by Subcategory:
          </label>
          <select
            id="subcategory-select"
            className="subcategory-select"
            value={activeSubcategory}
            onChange={(e) => setActiveSubcategory(e.target.value)}
          >
            <option value="">All Subcategories</option>
            {subcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      )}

      {/* Report Cards Grid */}
      <div className="reports-grid">
        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <p>No reports found matching your criteria.</p>
            {searchTerm && (
              <button className="btn btn-secondary" onClick={clearSearch}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-card-header">
                <h4 className="report-card-title">{report.name}</h4>
                <button
                  className={`pin-btn ${isPinned(report.id) ? 'pinned' : ''}`}
                  onClick={() => togglePin(report.id)}
                  title={isPinned(report.id) ? "Unpin report" : "Pin report"}
                  aria-label={isPinned(report.id) ? "Unpin report" : "Pin report"}
                >
                  {isPinned(report.id) ? <FaStar /> : <FaRegStar />}
                </button>
              </div>
              
              <div className="report-card-meta">
                <span className="report-category">{report.category}</span>
                {report.subcategory && (
                  <>
                    <span className="meta-separator">›</span>
                    <span className="report-subcategory">{report.subcategory}</span>
                  </>
                )}
              </div>

              <p className="report-card-description">{report.description}</p>

              <div className="report-card-actions">
                <Button
                  variant="primary"
                  onClick={() => handleViewReport(report)}
                  title="View report"
                  aria-label={`View ${report.name}`}
                >
                  <FaEye style={{ marginRight: 6 }} />
                  View
                </Button>
                
                {report.exportFormats.includes('csv') && (
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadCSV(report)}
                    title="Download CSV"
                    aria-label={`Download ${report.name} CSV`}
                    loading={exportingCSV && exportingReportId === report.id}
                    disabled={exportingPDF && exportingReportId === report.id}
                  >
                    <FaFileCsv style={{ marginRight: 6 }} />
                    CSV
                  </Button>
                )}
                
                {report.exportFormats.includes('pdf') && (
                  <Button
                    variant="secondary"
                    onClick={() => handleExportPDF(report)}
                    title="Download PDF"
                    aria-label={`Download ${report.name} PDF`}
                    loading={exportingPDF && exportingReportId === report.id}
                    disabled={exportingCSV && exportingReportId === report.id}
                  >
                    <FaFilePdf style={{ marginRight: 6 }} />
                    PDF
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Display Section */}
      <div id="report-display-section" className="report-display-section">
        {renderReportDetail()}
      </div>
    </div>
  );
};

export default ReportDashboard;