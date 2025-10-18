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

import { 
  PINNED_REPORT_BRAND_COLORS, 
  getRandomBrandColor 
} from "../../constants/colorConstants";

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

import ReportCriteriaModal from "../../components/Reports/ReportCriteriaModal";
import CriteriaDisplay from "../../components/Reports/CriteriaDisplay";

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
  RECENT: 'reportDashboard_recentReports'
};

const getColorForPinnedReport = (reportId, pinnedReports) => {
  const index = pinnedReports.indexOf(reportId);
  if (index === -1) return PINNED_REPORT_BRAND_COLORS[0];
  return PINNED_REPORT_BRAND_COLORS[index % PINNED_REPORT_BRAND_COLORS.length];
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ReportDashboard = () => {
  const { currentUser } = useAuth();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const rolePermissions = Permissions[currentUser.accessLevel]?.[currentUser.role] || {};
  
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pinnedReports, setPinnedReports] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportCriteria, setSelectedReportCriteria] = useState(null);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingReportId, setExportingReportId] = useState(null);
  const [criteriaModalOpen, setCriteriaModalOpen] = useState(false);
  const [reportForCriteria, setReportForCriteria] = useState(null);

  const searchInputRef = useRef(null);
  const categories = useMemo(() => getCategories(), []);

  useEffect(() => {
    try {
      const savedPinned = localStorage.getItem(LOCAL_STORAGE_KEYS.PINNED);
      const savedRecent = localStorage.getItem(LOCAL_STORAGE_KEYS.RECENT);
      
      let pinnedIds = [];
      
      if (savedPinned) {
        pinnedIds = JSON.parse(savedPinned);
      } else {
        const commonReports = getCommonReports().slice(0, MAX_PINNED_REPORTS);
        pinnedIds = commonReports.map(r => r.id);
      }
      
      setPinnedReports(pinnedIds);
      
      if (savedRecent) {
        setRecentReports(JSON.parse(savedRecent));
      }
    } catch (error) {
      console.error('Error loading saved report preferences:', error);
    }

    if (categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories]);

  useEffect(() => {
    if (pinnedReports.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PINNED, JSON.stringify(pinnedReports));
    }
  }, [pinnedReports]);

  useEffect(() => {
    if (recentReports.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.RECENT, JSON.stringify(recentReports));
    }
  }, [recentReports]);

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

  const togglePin = useCallback((reportId) => {
    setPinnedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      } else {
        if (prev.length >= MAX_PINNED_REPORTS) {
          toast.warning(`Maximum ${MAX_PINNED_REPORTS} pinned reports allowed`);
          return prev;
        }
        return [...prev, reportId];
      }
    });
  }, []);

  const isPinned = useCallback((reportId) => {
    return pinnedReports.includes(reportId);
  }, [pinnedReports]);

  const addToRecent = useCallback((reportId) => {
    setRecentReports(prev => {
      const filtered = prev.filter(id => id !== reportId);
      const updated = [reportId, ...filtered].slice(0, MAX_RECENT_REPORTS);
      return updated;
    });
  }, []);

  const handleViewReport = useCallback((report) => {
    // Check if report supports criteria
    if (report.supportsCriteria) {
      setReportForCriteria(report);
      setCriteriaModalOpen(true);
    } else {
      // Show report immediately with no criteria
      setSelectedReport(report);
      setSelectedReportCriteria(null);
      addToRecent(report.id);
      
      setTimeout(() => {
        const displaySection = document.getElementById('report-display-section');
        if (displaySection) {
          displaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [addToRecent]);

  const handleGenerateReport = useCallback((criteria) => {
    if (!reportForCriteria) return;

    // Filter/transform data based on criteria
    const filteredData = filterReportData(reportForCriteria.id, criteria);
    
    setSelectedReport(reportForCriteria);
    setSelectedReportCriteria(criteria);
    addToRecent(reportForCriteria.id);
    
    setTimeout(() => {
      const displaySection = document.getElementById('report-display-section');
      if (displaySection) {
        displaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [reportForCriteria, addToRecent]);

  const filterReportData = (reportId, criteria) => {
    // TODO: Replace with actual API call
    // const response = await fetchReport(reportId, criteria);
    // For now, using filtered sample data
    
    const rawData = sampleReportsData[reportId];
    if (!rawData) return null;

    // Apply date range filter
    if (criteria.dateRange) {
      const { start, end } = criteria.dateRange;
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      return rawData.filter(item => {
        if (item.date) {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        }
        return true;
      });
    }

    // Apply month range filter
    if (criteria.monthRange) {
      const { start, end } = criteria.monthRange;
      
      return rawData.filter(item => {
        if (item.month) {
          return item.month >= start && item.month <= end;
        }
        return true;
      });
    }

    // Apply policy filter
    if (criteria.policies && criteria.policies.length > 0) {
      return rawData.filter(item => {
        if (item.policy) {
          return criteria.policies.includes(item.policy);
        }
        return true;
      });
    }

    return rawData;
  };

  const getCSVData = (report) => {
    const reportData = selectedReportCriteria 
      ? filterReportData(report.id, selectedReportCriteria)
      : sampleReportsData[report.id];
      
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

  const generateFilename = (report, extension) => {
    let filename = report.name.replace(/\s+/g, '_');
    
    if (selectedReportCriteria) {
      if (selectedReportCriteria.dateRange) {
        const { start, end } = selectedReportCriteria.dateRange;
        filename += `_${start}_to_${end}`;
      }
      if (selectedReportCriteria.monthRange) {
        const { start, end } = selectedReportCriteria.monthRange;
        filename += `_${start}_to_${end}`;
      }
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    filename += `_${timestamp}`;
    
    return `${filename}.${extension}`;
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
      await exportChartDataToCSV({ headers, rows }, generateFilename(report, 'csv'));
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
      
      const reportData = selectedReportCriteria 
        ? filterReportData(report.id, selectedReportCriteria)
        : sampleReportsData[report.id];
        
      if (!reportData) {
        throw new Error('Report data not found');
      }

      const { headers, rows } = getCSVData(report);
      
      let chartData = null;
      let chartOptions = null;
      let chartType = "line";
      let canvasSize = EXPORT_CANVAS_SIZES.line;

      switch (report.id) {
        case "network-usage-report":
          chartType = "line";
          canvasSize = EXPORT_CANVAS_SIZES.line;
          chartData = {
            labels: reportData.map((n) => n.day),
            datasets: [{
              label: "Network Usage (GB)",
              data: reportData.map((n) => n.usageGB),
              borderColor: "#004aad",
              backgroundColor: "rgba(0,74,173,0.2)",
              fill: true,
              tension: 0.4,
            }],
          };
          chartOptions = getStandardChartOptions({
            type: chartType,
            title: report.name,
            xLabel: "Day",
            yLabel: "Usage (GB)",
            darkMode: false,
            forExport: true,
          });
          break;

        case "license-usage-report":
          chartType = "bar";
          canvasSize = EXPORT_CANVAS_SIZES.bar;
          chartData = {
            labels: reportData.map((d) => d.licenseType),
            datasets: [{
              label: "License Usage",
              data: reportData.map((d) => d.usageCount),
              backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
              borderWidth: 1,
            }],
          };
          chartOptions = getStandardChartOptions({
            type: chartType,
            title: report.name,
            xLabel: "License",
            yLabel: "Usage",
            darkMode: false,
            forExport: true,
          });
          break;

        case "alerts-summary-report":
          chartType = "pie";
          canvasSize = EXPORT_CANVAS_SIZES.pie;
          chartData = {
            labels: reportData.map((a) => a.alertType),
            datasets: [{
              label: "Alerts",
              data: reportData.map((a) => a.count),
              backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
            }],
          };
          chartOptions = getStandardChartOptions({
            type: chartType,
            title: report.name,
            xLabel: "",
            yLabel: "",
            darkMode: false,
            forExport: true,
          });
          break;

        case "site-monthly-active-users":
          chartType = "bar";
          canvasSize = EXPORT_CANVAS_SIZES.bar;
          chartData = {
            labels: reportData.map((d) => d.month),
            datasets: [
              {
                type: "bar",
                label: "New Users",
                backgroundColor: "rgba(33,80,162,0.6)",
                data: reportData.map((d) => d.newUsers),
                yAxisID: "y",
              },
              {
                type: "bar",
                label: "Churned Users",
                backgroundColor: "rgba(217,83,79,0.6)",
                data: reportData.map((d) => d.churnedUsers),
                yAxisID: "y",
              },
              {
                type: "line",
                label: "Avg Active Users",
                borderColor: "#004aad",
                borderWidth: 3,
                fill: false,
                data: reportData.map((d) => d.avgActiveUsers),
                yAxisID: "y1",
                tension: 0.3,
                pointRadius: 4,
              },
            ],
          };
          chartOptions = {
            ...getStandardChartOptions({
              type: chartType,
              title: report.name,
              xLabel: "Month",
              yLabel: "Users",
              darkMode: false,
              forExport: true,
            }),
            scales: {
              y: {
                type: "linear",
                display: true,
                position: "left",
                title: { display: true, text: "Users" },
                beginAtZero: true,
              },
              y1: {
                type: "linear",
                display: true,
                position: "right",
                title: { display: true, text: "Avg Active Users" },
                grid: { drawOnChartArea: false },
                beginAtZero: true,
              },
            },
          };
          break;

        case "monthly-data-usage-summary":
          chartType = "bar";
          canvasSize = EXPORT_CANVAS_SIZES.bar;
          chartData = {
            labels: reportData.map((d) => d.month),
            datasets: [
              {
                label: "Total Usage (GB)",
                backgroundColor: "rgba(33,80,162,0.6)",
                data: reportData.map((d) => d.totalUsageGB),
              },
              {
                label: "Peak Usage (GB)",
                backgroundColor: "rgba(217,83,79,0.6)",
                data: reportData.map((d) => d.peakUsageGB),
              },
            ],
          };
          chartOptions = getStandardChartOptions({
            type: chartType,
            title: report.name,
            xLabel: "Month",
            yLabel: "Usage (GB)",
            darkMode: false,
            forExport: true,
          });
          break;

        case "daily-average-active-users":
          chartType = "line";
          canvasSize = EXPORT_CANVAS_SIZES.line;
          chartData = {
            labels: reportData.map((d) => d.date),
            datasets: [{
              label: "Avg. Active Users",
              data: reportData.map((d) => d.avgActiveUsers),
              borderColor: "#2150a2",
              backgroundColor: "rgba(33, 80, 162, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              borderWidth: 2,
            }],
          };
          chartOptions = getStandardChartOptions({
            type: chartType,
            title: report.name,
            xLabel: "Date",
            yLabel: "Users",
            darkMode: false,
            forExport: true,
          });
          break;

        case "policy-wise-monthly-average-active-users":
          chartType = "bar";
          canvasSize = EXPORT_CANVAS_SIZES.bar;
          const uniquePolicies = [...new Set(reportData.map(d => d.policy))];
          const months = [...new Set(reportData.map(d => d.month))];
          const datasets = uniquePolicies.map((policy, idx) => ({
            label: policy,
            data: months.map(month => {
              const record = reportData.find(d => d.month === month && d.policy === policy);
              return record ? record.avgActiveUsers : 0;
            }),
            backgroundColor: idx % 2 === 0 ? "rgba(33, 80, 162, 0.7)" : "rgba(49, 120, 115, 0.7)"
          }));
          chartData = {
            labels: months,
            datasets: datasets,
          };
          chartOptions = {
            ...getStandardChartOptions({
              type: chartType,
              title: report.name,
              xLabel: "Month",
              yLabel: "Avg. Active Users",
              darkMode: false,
              forExport: true,
            }),
            scales: {
              x: { stacked: true, title: { display: true, text: "Month" } },
              y: { stacked: true, beginAtZero: true, title: { display: true, text: "Avg. Active Users" } }
            }
          };
          break;

        default:
          break;
      }

      await exportReportPDF({
        title: report.name,
        headers,
        rows,
        chartData,
        chartOptions,
        filename: generateFilename(report, 'pdf'),
        rolePermissions,
        exportCanvasWidth: canvasSize.width,
        exportCanvasHeight: canvasSize.height,
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


  

  const renderReportDetail = () => {
    if (!selectedReport) {
      return (
        <div className="no-report-selected">
          <p>Select a report to view details</p>
        </div>
      );
    }

    const reportData = selectedReportCriteria 
      ? filterReportData(selectedReport.id, selectedReportCriteria)
      : sampleReportsData[selectedReport.id];
      
    const hasData = !!reportData;

    const handleChangeCriteria = () => {
      setReportForCriteria(selectedReport);
      setCriteriaModalOpen(true);
    };

    return (
      <div className="report-detail-container">
        <div className="report-detail-header">
          <h2>{selectedReport.name}</h2>
          {hasData && (
            <div className="report-detail-actions">
              <Button
                variant="secondary"
                onClick={() => handleDownloadCSV(selectedReport)}
                title="Download CSV"
                aria-label={`Download ${selectedReport.name} CSV`}
                loading={exportingCSV && exportingReportId === selectedReport.id}
                disabled={exportingPDF && exportingReportId === selectedReport.id}
              >
                <FaFileCsv style={{ marginRight: 6 }} />
                Export CSV
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleExportPDF(selectedReport)}
                title="Download PDF"
                aria-label={`Download ${selectedReport.name} PDF`}
                loading={exportingPDF && exportingReportId === selectedReport.id}
                disabled={exportingCSV && exportingReportId === selectedReport.id}
              >
                <FaFilePdf style={{ marginRight: 6 }} />
                Export PDF
              </Button>
            </div>
          )}
        </div>

        {selectedReportCriteria && selectedReport.criteriaFields && (
          <CriteriaDisplay 
            criteria={selectedReportCriteria} 
            criteriaFields={selectedReport.criteriaFields}
            onChangeCriteria={selectedReport.supportsCriteria ? handleChangeCriteria : null}
          />
        )}

        <div className="report-content-wrapper">
          {hasData ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}></div>
              {(() => {
                switch (selectedReport.id) {
                  case "site-monthly-active-users":
                    return <SiteMonthlyActiveUsers data={reportData} />;
                  case "monthly-data-usage-summary":
                    return <MonthlyDataUsageSummary data={reportData} />;
                  case "daily-average-active-users":
                    return <DailyAverageActiveUsers data={reportData} />;
                  case "policy-wise-monthly-average-active-users":
                    return <PolicyWiseMonthlyAverageActiveUsers data={reportData} />;
                  case "network-usage-report":
                    return <NetworkUsageReport data={reportData} />;
                  case "license-usage-report":
                    return <LicenseUsageReport data={reportData} />;
                  case "alerts-summary-report":
                    return <AlertsSummaryReport data={reportData} />;
                  default:
                    return (
                      <div className="report-placeholder">
                        <p>{selectedReport.description}</p>
                        <p className="report-placeholder-note">Full report visualization coming soon...</p>
                      </div>
                    );
                }
              })()}
            </>
          ) : (
            <div className="report-placeholder">
              <p>{selectedReport.description}</p>
              <p className="report-placeholder-note">Full report visualization coming soon...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="report-dashboard-container" role="region" aria-label="Reports Dashboard">
      <LoadingOverlay 
        active={isLoading('export') || exportingCSV || exportingPDF} 
        message={exportingCSV ? "Preparing CSV..." : "Generating PDF..."}
      />

      <ReportCriteriaModal
        open={criteriaModalOpen}
        onClose={() => {
          setCriteriaModalOpen(false);
          setReportForCriteria(null);
        }}
        report={reportForCriteria}
        onGenerate={handleGenerateReport}
      />

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
            pinnedReportObjects.map((report) => {
              const color = getColorForPinnedReport(report.id, pinnedReports);
              
              return (
                <button
                  key={report.id}
                  className="shortcut-card"
                  onClick={() => handleViewReport(report)}
                  title={report.description}
                  style={{
                    background: color,
                    boxShadow: `0 0.125rem 0.375rem ${hexToRgba(color, 0.25)}`,
                    border: 'none',
                    color: '#fff'
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
                    loading={exportingPDF && exportingReportId === selectedReport.id}
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

      <div id="report-display-section" className="report-display-section">
        {renderReportDetail()}
      </div>
    </div>
  );
};

export default ReportDashboard;