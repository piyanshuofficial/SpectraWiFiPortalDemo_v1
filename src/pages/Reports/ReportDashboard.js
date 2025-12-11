// src/pages/Reports/ReportDashboard.js

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { Permissions } from "../../utils/accessLevels";
import { useLoading } from "../../context/LoadingContext";
import { useAccessLevelView } from "../../context/AccessLevelViewContext";
import { useTranslation } from "react-i18next";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import SkeletonLoader from "../../components/Loading/SkeletonLoader";
import Button from "../../components/Button";
import { FaEye, FaFileCsv, FaFilePdf, FaStar, FaRegStar, FaTimes, FaClock, FaSearch, FaBuilding, FaInfoCircle } from "react-icons/fa";
import notifications from "../../utils/notifications";
import { companySites } from "../../constants/companySampleData";
import "./ReportDashboard.css";

import { 
  PINNED_REPORT_BRAND_COLORS
} from "../../constants/colorConstants";

import enhancedSampleReports, {
  getCategories,
  getSubcategories,
  getReportsByCategory,
  searchReports,
  getCommonReports,
  getCompanyReports,
  getSiteReports
} from "../../constants/enhancedSampleReports";
import userSampleData from "../../constants/userSampleData";
import { getSiteReportData, isSiteReport } from "../../config/siteConfig";
import { exportChartDataToCSV } from "../../utils/exportUtils";
import { exportReportPDF } from "../../utils/exportReportPDF";

import ReportCriteriaModal from "../../components/Reports/ReportCriteriaModal";
import CriteriaDisplay from "../../components/Reports/CriteriaDisplay";
import GenericReportRenderer from "../../components/Reports/GenericReportRenderer";

import { 
  getCSVConfig,
  getChartConfig
} from "../../config/reportDefinitions";

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
  const { isLoading } = useLoading();
  const { t } = useTranslation();
  const { isCompanyView, drillDownToSite } = useAccessLevelView();
  const rolePermissions = Permissions[currentUser.accessLevel]?.[currentUser.role] || {};

  const [activeCategory, setActiveCategory] = useState(null);
  const [siteFilter, setSiteFilter] = useState('all');
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
  const [initialLoad, setInitialLoad] = useState(true);

  const searchInputRef = useRef(null);
  // Categories filtered by access level (company or site)
  const categories = useMemo(() => {
    const accessLevelReports = isCompanyView ? getCompanyReports() : getSiteReports();
    const cats = new Set(accessLevelReports.map(r => r.category));
    return Array.from(cats).sort();
  }, [isCompanyView]);

  useEffect(() => {
    const loadReports = () => {
      try {
        const savedPinned = localStorage.getItem(LOCAL_STORAGE_KEYS.PINNED);
        const savedRecent = localStorage.getItem(LOCAL_STORAGE_KEYS.RECENT);

        let pinnedIds = [];

        if (savedPinned) {
          // Parse saved pinned reports and validate they still exist
          const parsedPinned = JSON.parse(savedPinned);
          // Filter out any report IDs that no longer exist in enhancedSampleReports
          pinnedIds = parsedPinned.filter(id =>
            enhancedSampleReports.some(report => report.id === id)
          );

          // If we filtered out invalid reports, save the cleaned list back to localStorage
          if (pinnedIds.length !== parsedPinned.length) {
            console.log('Cleaned up invalid pinned report IDs:',
              parsedPinned.filter(id => !pinnedIds.includes(id))
            );
          }
        } else {
          const commonReports = getCommonReports().slice(0, MAX_PINNED_REPORTS);
          pinnedIds = commonReports.map(r => r.id);
        }

        setPinnedReports(pinnedIds);

        if (savedRecent) {
          // Also validate recent reports
          const parsedRecent = JSON.parse(savedRecent);
          const validRecent = parsedRecent.filter(id =>
            enhancedSampleReports.some(report => report.id === id)
          );
          setRecentReports(validRecent);
        }
      } catch (error) {
        console.error('Error loading saved report preferences:', error);
      }

      if (categories.length > 0) {
        setActiveCategory(categories[0]);
      }

      setInitialLoad(false);
    };

    const timer = setTimeout(loadReports, 300);

    return () => clearTimeout(timer);
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
    // First, filter by access level (company view shows only company reports, site view shows only site reports)
    let reports = isCompanyView ? getCompanyReports() : getSiteReports();

    if (searchTerm.trim()) {
      // Filter search results to only include reports of the appropriate access level
      const searchResults = searchReports(searchTerm);
      const accessLevel = isCompanyView ? 'company' : 'site';
      reports = searchResults.filter(r => r.accessLevel === accessLevel);
    } else {
      if (activeCategory) {
        // Filter category results to only include reports of the appropriate access level
        const categoryReports = getReportsByCategory(activeCategory, activeSubcategory || null);
        const accessLevel = isCompanyView ? 'company' : 'site';
        reports = categoryReports.filter(r => r.accessLevel === accessLevel);
      }
    }

    return reports;
  }, [activeCategory, activeSubcategory, searchTerm, isCompanyView]);

  const subcategories = useMemo(() => {
    if (!activeCategory) return [];
    // Filter subcategories by access level
    const accessLevelReports = isCompanyView ? getCompanyReports() : getSiteReports();
    const subcats = new Set(
      accessLevelReports
        .filter(r => r.category === activeCategory)
        .map(r => r.subcategory)
    );
    return Array.from(subcats).sort();
  }, [activeCategory, isCompanyView]);

  const pinnedReportObjects = useMemo(() => {
    const accessLevel = isCompanyView ? 'company' : 'site';
    return pinnedReports
      .map(id => enhancedSampleReports.find(r => r.id === id))
      .filter(r => r && r.accessLevel === accessLevel);
  }, [pinnedReports, isCompanyView]);

  const recentReportObjects = useMemo(() => {
    const accessLevel = isCompanyView ? 'company' : 'site';
    return recentReports
      .map(id => enhancedSampleReports.find(r => r.id === id))
      .filter(r => r && r.accessLevel === accessLevel);
  }, [recentReports, isCompanyView]);

  const togglePin = useCallback((reportId) => {
    setPinnedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      } else {
        if (prev.length >= MAX_PINNED_REPORTS) {
          notifications.showWarning(t('reports.maxPinnedReports', { count: MAX_PINNED_REPORTS }));
          return prev;
        }
        return [...prev, reportId];
      }
    });
  }, [t]);

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

  const getReportData = useCallback((reportId) => {
    if (userSampleData.isUserReport(reportId)) {
      return userSampleData.getUserReportData(reportId);
    }
    
    if (isSiteReport(reportId)) {
      return getSiteReportData(reportId);
    }
    
    return null;
  }, []);

  const handleViewReport = useCallback((report) => {
    if (report.supportsCriteria) {
      setReportForCriteria(report);
      setCriteriaModalOpen(true);
    } else {
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

  const filterReportData = useCallback((reportId, criteria) => {
    const rawData = getReportData(reportId);
    if (!rawData || !criteria) return rawData;

    let filteredData = [...rawData];

    // Filter by date range (for reports with 'date' field)
    if (criteria.dateRange) {
      const { start, end } = criteria.dateRange;
      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date

      filteredData = filteredData.filter(item => {
        if (item.date) {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        }
        if (item.timestamp) {
          const itemDate = new Date(item.timestamp.split(' ')[0]);
          return itemDate >= startDate && itemDate <= endDate;
        }
        if (item.sessionStart) {
          const itemDate = new Date(item.sessionStart.split(' ')[0]);
          return itemDate >= startDate && itemDate <= endDate;
        }
        if (item.purchaseDate) {
          const itemDate = new Date(item.purchaseDate);
          return itemDate >= startDate && itemDate <= endDate;
        }
        return true;
      });
    }

    // Filter by month range (for reports with 'month' field)
    if (criteria.monthRange) {
      const { start, end } = criteria.monthRange;

      filteredData = filteredData.filter(item => {
        if (item.month) {
          return item.month >= start && item.month <= end;
        }
        return true;
      });
    }

    // Filter by policies (for policy-wise reports)
    if (criteria.policies && criteria.policies.length > 0) {
      filteredData = filteredData.filter(item => {
        if (item.policy) {
          return criteria.policies.includes(item.policy);
        }
        return true;
      });
    }

    // Filter by severity (for alarm/alert reports)
    if (criteria.severity && criteria.severity !== 'All') {
      filteredData = filteredData.filter(item => {
        if (item.severity) {
          return item.severity === criteria.severity;
        }
        if (item.alertType) {
          return item.alertType === criteria.severity;
        }
        return true;
      });
    }

    return filteredData;
  }, [getReportData]);

  /**
   * Check if a report has data
   */
  const reportHasData = useCallback((reportId) => {
    const reportData = selectedReportCriteria
      ? filterReportData(reportId, selectedReportCriteria)
      : getReportData(reportId);

    return reportData && Array.isArray(reportData) && reportData.length > 0;
  }, [selectedReportCriteria, filterReportData, getReportData]);

  const getCSVData = useCallback((report) => {
    const reportData = selectedReportCriteria
      ? filterReportData(report.id, selectedReportCriteria)
      : getReportData(report.id);

    if (!reportData) return { headers: [], rows: [] };

    const csvConfig = getCSVConfig(report.id);
    
    if (csvConfig) {
      return {
        headers: csvConfig.headers,
        rows: csvConfig.getRows(reportData)
      };
    }

    return { headers: [], rows: [] };
  }, [selectedReportCriteria, filterReportData, getReportData]);

  const generateFilename = useCallback((report, extension) => {
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
  }, [selectedReportCriteria]);

  const handleDownloadCSV = async (report) => {
    if (!rolePermissions.canViewReports) {
      notifications.noPermission("export reports");
      return;
    }

    // Check if report has data
    if (!reportHasData(report.id)) {
      notifications.showError(t('reports.noDataToExport'));
      return;
    }

    setExportingCSV(true);
    setExportingReportId(report.id);
    let timeoutId = null;
    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 400);
      });
      const { headers, rows } = getCSVData(report);
      await exportChartDataToCSV({ headers, rows }, generateFilename(report, 'csv'));
      notifications.exportSuccess("CSV");
    } catch (error) {
      notifications.exportFailed("CSV");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setExportingCSV(false);
      setExportingReportId(null);
    }
  };

  const handleExportPDF = async (report) => {
    if (!rolePermissions.canViewReports) {
      notifications.noPermission("export reports");
      return;
    }

    // Check if report has data
    if (!reportHasData(report.id)) {
      notifications.showError(t('reports.noDataToExport'));
      return;
    }

    setExportingPDF(true);
    setExportingReportId(report.id);
    let timeoutId = null;
    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 1200);
      });
      
      const reportData = selectedReportCriteria 
        ? filterReportData(report.id, selectedReportCriteria)
        : getReportData(report.id);
        
      if (!reportData) {
        throw new Error('Report data not found');
      }

      const { headers, rows } = getCSVData(report);
      
      const chartConfig = getChartConfig(report.id);
      
      let chartData = null;
      let chartOptions = null;
      let canvasSize = { width: 900, height: 450 };

      if (chartConfig) {
        canvasSize = chartConfig.canvasSize;
        chartData = chartConfig.getData(reportData);
        chartOptions = chartConfig.getOptions(report.name);
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
        reportId: report.id,
        criteria: selectedReportCriteria,
        addWatermark: false,
        watermarkText: "CONFIDENTIAL",
        disclaimerText: "This report contains confidential information. Data is subject to change. For internal use only."
      });
      
      notifications.exportSuccess("PDF");
    } catch (error) {
      console.error('PDF export error:', error);
      notifications.exportFailed("PDF");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
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
          <p>{t('reports.selectReportToView')}</p>
        </div>
      );
    }

    const reportData = selectedReportCriteria 
      ? filterReportData(selectedReport.id, selectedReportCriteria)
      : getReportData(selectedReport.id);
      
    const hasData = !!reportData;

    const handleChangeCriteria = () => {
      setReportForCriteria(selectedReport);
      setCriteriaModalOpen(true);
    };

    return (
      <div className="report-detail-container">
        <div className="report-detail-header">
          <h2>{selectedReport.name}</h2>
          <div className="report-detail-actions">
            <Button
              variant="secondary"
              onClick={() => handleDownloadCSV(selectedReport)}
              title={hasData ? t('reports.downloadCsv') : t('reports.noDataAvailable')}
              aria-label={t('reports.downloadReportAria', { name: selectedReport.name, format: 'CSV' })}
              loading={exportingCSV && exportingReportId === selectedReport.id}
              disabled={!hasData || (exportingPDF && exportingReportId === selectedReport.id)}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              {t('reports.exportCsv')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleExportPDF(selectedReport)}
              title={hasData ? t('reports.downloadPdf') : t('reports.noDataAvailable')}
              aria-label={t('reports.downloadReportAria', { name: selectedReport.name, format: 'PDF' })}
              loading={exportingPDF && exportingReportId === selectedReport.id}
              disabled={!hasData || (exportingCSV && exportingReportId === selectedReport.id)}
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              {t('reports.exportPdf')}
            </Button>
          </div>
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
            <GenericReportRenderer reportId={selectedReport.id} data={reportData} />
          ) : (
            <div className="report-placeholder">
              <p>{selectedReport.description}</p>
              <p className="report-placeholder-note">{t('reports.visualizationComingSoon')}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (initialLoad) {
    return (
      <div className="report-dashboard-container" role="region" aria-label={t('reports.reportDashboard')}>
        <h1 className="reports-title">{t('reports.title')}</h1>
        <div className="pinned-shortcuts-section">
          <SkeletonLoader variant="rect" height={30} width="40%" style={{ marginBottom: '20px' }} />
          <div className="shortcuts-grid">
            {[...Array(6)].map((_, i) => (
              <SkeletonLoader key={i} variant="card" />
            ))}
          </div>
        </div>

        <SkeletonLoader variant="rect" height={50} style={{ marginBottom: '20px' }} />

        <SkeletonLoader variant="rect" height={40} style={{ marginBottom: '20px' }} />

        <div className="reports-grid">
          {[...Array(9)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="report-dashboard-container" role="region" aria-label={t('reports.reportDashboard')}>
      <LoadingOverlay
        active={isLoading('export') || exportingCSV || exportingPDF}
        message={exportingCSV ? t('reports.preparingCsv') : t('reports.generatingPdf')}
      />

      <h1 className="reports-title">{t('reports.title')}</h1>

      {/* Company View Info Banner */}
      {isCompanyView && (
        <div className="reports-company-view-banner">
          <div className="company-banner-content">
            <FaInfoCircle className="company-banner-icon" />
            <div className="company-banner-text">
              <span className="company-banner-title">Company-Wide Reports</span>
              <span className="company-banner-subtitle">
                Viewing reports across all sites. Select a site to view site-specific reports.
              </span>
            </div>
          </div>
          <div className="company-banner-filter">
            <label htmlFor="report-site-filter">Filter by Site:</label>
            <select
              id="report-site-filter"
              value={siteFilter}
              onChange={e => setSiteFilter(e.target.value)}
              className="report-site-filter-select"
            >
              <option value="all">All Sites (Aggregated)</option>
              {companySites.map(site => (
                <option key={site.siteId} value={site.siteId}>
                  {site.siteName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

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
            <FaStar className="shortcuts-icon" /> {t('reports.pinnedReports')}
          </h3>
          <span className="shortcuts-count">({pinnedReportObjects.length}/{MAX_PINNED_REPORTS})</span>
        </div>

        <div className="shortcuts-grid">
          {pinnedReportObjects.length === 0 ? (
            <div className="no-shortcuts">
              <p>{t('reports.noPinnedReports')}</p>
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
                    title={t('reports.unpinReport')}
                    aria-label={t('reports.unpinReport')}
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
            <FaClock className="recent-icon" /> {t('reports.recentlyViewed')}
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
            placeholder={t('reports.searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label={t('reports.searchReports')}
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={clearSearch}
              aria-label={t('common.clearSearch')}
            >
              <FaTimes />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            {t('reports.foundReports', { count: filteredReports.length })}
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
            {t('reports.filterBySubcategory')}:
          </label>
          <select
            id="subcategory-select"
            className="subcategory-select"
            value={activeSubcategory}
            onChange={(e) => setActiveSubcategory(e.target.value)}
          >
            <option value="">{t('reports.allSubcategories')}</option>
            {subcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      )}

      <div className="reports-grid">
        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <p>{t('reports.noReportsFound')}</p>
            {searchTerm && (
              <button className="btn btn-secondary" onClick={clearSearch}>
                {t('common.clearSearch')}
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
                  title={isPinned(report.id) ? t('reports.unpinReport') : t('reports.pinReport')}
                  aria-label={isPinned(report.id) ? t('reports.unpinReport') : t('reports.pinReport')}
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
                  title={t('reports.viewReport')}
                  aria-label={t('reports.viewReportAria', { name: report.name })}
                >
                  <FaEye style={{ marginRight: 6 }} />
                  {t('common.view')}
                </Button>

                {report.exportFormats.includes('csv') && (
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadCSV(report)}
                    title={reportHasData(report.id) ? t('reports.downloadCsv') : t('reports.noDataAvailable')}
                    aria-label={t('reports.downloadReportAria', { name: report.name, format: 'CSV' })}
                    loading={exportingCSV && exportingReportId === report.id}
                    disabled={!reportHasData(report.id) || (exportingPDF && exportingReportId === report.id)}
                  >
                    <FaFileCsv style={{ marginRight: 6 }} />
                    CSV
                  </Button>
                )}

                {report.exportFormats.includes('pdf') && (
                  <Button
                    variant="secondary"
                    onClick={() => handleExportPDF(report)}
                    title={reportHasData(report.id) ? t('reports.downloadPdf') : t('reports.noDataAvailable')}
                    aria-label={t('reports.downloadReportAria', { name: report.name, format: 'PDF' })}
                    loading={exportingPDF && exportingReportId === report.id}
                    disabled={!reportHasData(report.id) || (exportingCSV && exportingReportId === report.id)}
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