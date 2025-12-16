// src/pages/Dashboard.js

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { FaUsers, FaUserFriends, FaChartPie, FaCheckCircle, FaFileCsv, FaFilePdf, FaLifeRing, FaExclamationCircle, FaChevronLeft, FaChevronRight, FaBuilding, FaLaptop, FaExclamationTriangle, FaNetworkWired, FaUserClock } from "react-icons/fa";
import { usePermissions } from "../hooks/usePermissions";
import { useLoading } from "../context/LoadingContext";
import { useSegment } from "../context/SegmentContext";
import { useSegmentActivities } from "../hooks/useSegmentActivities";
import { getSiteReportData } from "../config/siteConfig";
import { getStandardChartOptions } from "../utils/commonChartOptions";
import { EXPORT_CANVAS_SIZES } from "../utils/exportConstants";
import { exportChartDataToCSV } from "../utils/exportUtils";
import { exportReportPDF } from "../utils/exportReportPDF";
import { useNavigate } from "react-router-dom";
import { ANIMATION } from '../constants/appConstants';
import { useTranslation } from "react-i18next";
import LoadingOverlay from "../components/Loading/LoadingOverlay";
import SkeletonLoader from "../components/Loading/SkeletonLoader";
import notifications from "../utils/notifications";
import { useAccessLevelView } from "../context/AccessLevelViewContext";
import { sampleCompany, companySites, getCompanyStats, getSiteChartData, companyActivityLogs } from "../constants/companySampleData";
import { guestStatistics, getGuestsBySegment, getActiveGuests } from "../constants/guestSampleData";
import { useSegmentCompanyData } from "../hooks/useSegmentCompanyData";
import SitesOverview from "../components/SitesOverview";
import "./Dashboard.css";



const Dashboard = () => {
  const { t } = useTranslation();
  const { currentSegment } = useSegment();
  const { isCompanyView, isSiteView, isCompanyUser } = useAccessLevelView();

  // Calculate segment-specific metrics with realistic variation
  const metrics = useMemo(() => {
    // Different segments have different sizes and usage patterns
    const segmentMetrics = {
      enterprise: {
        baseUsers: 850,
        licensePercent: 68,
        dataUsageTB: 2.8,
        uptimePercent: 99.92,
        totalAlerts: 3,
        criticalAlerts: 1,
        activeGuests: 8,
        checkedInToday: 6
      },
      coLiving: {
        baseUsers: 320,
        licensePercent: 45,
        dataUsageTB: 1.5,
        uptimePercent: 99.85,
        totalAlerts: 5,
        criticalAlerts: 2,
        activeGuests: 5,
        checkedInToday: 4
      },
      hotel: {
        baseUsers: 450,
        licensePercent: 52,
        dataUsageTB: 1.8,
        uptimePercent: 99.88,
        totalAlerts: 2,
        criticalAlerts: 0,
        activeGuests: 245,
        checkedInToday: 42
      },
      coWorking: {
        baseUsers: 280,
        licensePercent: 38,
        dataUsageTB: 1.2,
        uptimePercent: 99.78,
        totalAlerts: 4,
        criticalAlerts: 1,
        activeGuests: 14,
        checkedInToday: 12
      },
      pg: {
        baseUsers: 180,
        licensePercent: 25,
        dataUsageTB: 0.6,
        uptimePercent: 99.65,
        totalAlerts: 7,
        criticalAlerts: 3,
        activeGuests: 4,
        checkedInToday: 3
      },
      miscellaneous: {
        baseUsers: 95,
        licensePercent: 15,
        dataUsageTB: 0.3,
        uptimePercent: 99.58,
        totalAlerts: 2,
        criticalAlerts: 0,
        activeGuests: 2,
        checkedInToday: 1
      }
    };

    const segmentConfig = segmentMetrics[currentSegment] || segmentMetrics.enterprise;

    return {
      activeUsers: segmentConfig.baseUsers,
      activeUsersDelta: Math.round(segmentConfig.baseUsers * 0.03), // 3% delta
      licenseUsagePercent: segmentConfig.licensePercent,
      licenseUsageDelta: 2,
      dataUsageTB: segmentConfig.dataUsageTB,
      dataUsageDelta: Math.round(segmentConfig.dataUsageTB * 0.04 * 100) / 100, // 4% delta
      networkUptime: segmentConfig.uptimePercent,
      uptimeDelta: 0.05, // Small positive delta
      totalAlerts: segmentConfig.totalAlerts,
      criticalAlerts: segmentConfig.criticalAlerts,
      activeGuests: segmentConfig.activeGuests,
      checkedInToday: segmentConfig.checkedInToday,
      guestsDelta: Math.round(segmentConfig.checkedInToday * 0.15) // 15% delta for guests
    };
  }, [currentSegment]);

  // Get segment-specific recent activities from shared hook
  const recentActivities = useSegmentActivities();

  const { hasPermission } = usePermissions();
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  
  const [initialLoad, setInitialLoad] = useState(true);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingChart, setExportingChart] = useState(null);
  const [activityPage, setActivityPage] = useState(0);

  // Activities carousel configuration
  const ACTIVITIES_PER_PAGE = 5;
  const HOURS_24_IN_MS = 24 * 60 * 60 * 1000;

  const darkMode = document.documentElement.getAttribute("data-theme") === "dark";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14 },
          usePointStyle: true,
          padding: 15,
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        boxPadding: 6,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: function(tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.chart.canvas.id === 'chart-network-usage') {
                label += context.parsed.y + ' GB';
              } else if (context.chart.canvas.id === 'chart-speed-tier') {
                label += context.parsed.y + ' users';
              } else if (context.chart.canvas.id === 'chart-peak-usage') {
                label += context.parsed.y;
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: false },
        grid: { color: darkMode ? "#444" : "#e5e5e5" },
        ticks: { color: darkMode ? "#fff" : "#222", font: { size: 12 } }
      },
      y: {
        title: { display: false },
        grid: { color: darkMode ? "#444" : "#e5e5e5" },
        ticks: { color: darkMode ? "#fff" : "#222", font: { size: 12 } },
        beginAtZero: true
      }
    }
  };

  // Separate options for pie/doughnut charts - no scales (gridlines/axes)
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14 },
          usePointStyle: true,
          padding: 15,
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        boxPadding: 6,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
    // No scales property - pie charts don't have axes
  };

  // Get segment-specific data for dashboard charts
  const networkData = useMemo(() => {
    // Generate segment-specific network usage data with variation per segment
    const baseData = getSiteReportData("network-usage-report") || [];

    // Different segments have different usage patterns
    const segmentMultipliers = {
      enterprise: 2.5,      // Enterprise uses most bandwidth
      coLiving: 1.8,        // Co-living has high usage
      hotel: 1.5,           // Hotels have moderate usage
      coWorking: 1.3,       // Co-working moderate-low
      pg: 0.8,              // PG uses less
      miscellaneous: 0.5    // Miscellaneous lowest
    };

    const multiplier = segmentMultipliers[currentSegment] || 1.0;

    // Scale and add some variation per segment
    return baseData.map((item, index) => {
      // Add segment-specific pattern (some segments peak differently)
      const dayVariation = currentSegment === 'enterprise' ? 1.0 + (Math.sin(index / 5) * 0.2) :
                          currentSegment === 'hotel' ? 1.0 + (Math.cos(index / 4) * 0.25) :
                          1.0;

      return {
        ...item,
        usageGB: Math.round(item.usageGB * multiplier * dayVariation * 10) / 10
      };
    });
  }, [currentSegment]);

  const speedTierData = useMemo(() => {
    // Generate segment-specific user distribution by speed tiers
    const segmentSpeedDistributions = {
      enterprise: [
        { speedTier: "Up to 25 Mbps", userCount: 180 },
        { speedTier: "26-50 Mbps", userCount: 320 },
        { speedTier: "51-100 Mbps", userCount: 250 },
        { speedTier: "Above 100 Mbps", userCount: 100 }
      ],
      coLiving: [
        { speedTier: "Up to 25 Mbps", userCount: 120 },
        { speedTier: "26-50 Mbps", userCount: 140 },
        { speedTier: "51-100 Mbps", userCount: 60 }
      ],
      hotel: [
        { speedTier: "Up to 25 Mbps", userCount: 280 },
        { speedTier: "26-50 Mbps", userCount: 120 },
        { speedTier: "51-100 Mbps", userCount: 50 }
      ],
      coWorking: [
        { speedTier: "Up to 25 Mbps", userCount: 85 },
        { speedTier: "26-50 Mbps", userCount: 130 },
        { speedTier: "51-100 Mbps", userCount: 65 }
      ],
      pg: [
        { speedTier: "Up to 25 Mbps", userCount: 95 },
        { speedTier: "26-50 Mbps", userCount: 75 },
        { speedTier: "51-100 Mbps", userCount: 10 }
      ],
      miscellaneous: [
        { speedTier: "Up to 25 Mbps", userCount: 45 },
        { speedTier: "26-50 Mbps", userCount: 35 },
        { speedTier: "51-100 Mbps", userCount: 15 }
      ]
    };

    return segmentSpeedDistributions[currentSegment] || segmentSpeedDistributions.enterprise;
  }, [currentSegment]);

  const peakUsageData = useMemo(() => {
    // Generate segment-specific peak usage hours data
    // Shows percentage of daily traffic during different time periods
    const segmentPeakUsage = {
      enterprise: [
        { period: "6AM-9AM", usage: 15, label: "Morning" },
        { period: "9AM-12PM", usage: 28, label: "Late Morning" },
        { period: "12PM-3PM", usage: 22, label: "Afternoon" },
        { period: "3PM-6PM", usage: 25, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 8, label: "Evening" },
        { period: "9PM-12AM", usage: 2, label: "Night" }
      ],
      coLiving: [
        { period: "6AM-9AM", usage: 12, label: "Morning" },
        { period: "9AM-12PM", usage: 8, label: "Late Morning" },
        { period: "12PM-3PM", usage: 10, label: "Afternoon" },
        { period: "3PM-6PM", usage: 15, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 32, label: "Evening" },
        { period: "9PM-12AM", usage: 23, label: "Night" }
      ],
      hotel: [
        { period: "6AM-9AM", usage: 18, label: "Morning" },
        { period: "9AM-12PM", usage: 12, label: "Late Morning" },
        { period: "12PM-3PM", usage: 8, label: "Afternoon" },
        { period: "3PM-6PM", usage: 10, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 28, label: "Evening" },
        { period: "9PM-12AM", usage: 24, label: "Night" }
      ],
      coWorking: [
        { period: "6AM-9AM", usage: 10, label: "Morning" },
        { period: "9AM-12PM", usage: 30, label: "Late Morning" },
        { period: "12PM-3PM", usage: 25, label: "Afternoon" },
        { period: "3PM-6PM", usage: 28, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 5, label: "Evening" },
        { period: "9PM-12AM", usage: 2, label: "Night" }
      ],
      pg: [
        { period: "6AM-9AM", usage: 8, label: "Morning" },
        { period: "9AM-12PM", usage: 5, label: "Late Morning" },
        { period: "12PM-3PM", usage: 10, label: "Afternoon" },
        { period: "3PM-6PM", usage: 12, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 35, label: "Evening" },
        { period: "9PM-12AM", usage: 30, label: "Night" }
      ],
      miscellaneous: [
        { period: "6AM-9AM", usage: 14, label: "Morning" },
        { period: "9AM-12PM", usage: 18, label: "Late Morning" },
        { period: "12PM-3PM", usage: 16, label: "Afternoon" },
        { period: "3PM-6PM", usage: 20, label: "Late Afternoon" },
        { period: "6PM-9PM", usage: 18, label: "Evening" },
        { period: "9PM-12AM", usage: 14, label: "Night" }
      ]
    };

    return segmentPeakUsage[currentSegment] || segmentPeakUsage.enterprise;
  }, [currentSegment]);

  const safeNumber = (value, fallback = 0) => typeof value === "number" && !isNaN(value) ? value : fallback;

  // Filter activities to last 24 hours and sort by most recent first
  const filteredActivities = useMemo(() => {
    const now = new Date();
    const filtered = recentActivities.filter(activity => {
      if (!activity.createdAt) return true; // Keep activities without timestamp
      const activityTime = new Date(activity.createdAt);
      return (now - activityTime) <= HOURS_24_IN_MS;
    });

    // Sort by createdAt descending (most recent first)
    return filtered.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA; // Descending order
    });
  }, [recentActivities, HOURS_24_IN_MS]);

  // Calculate total pages for the carousel
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE));

  // Get current page activities (page-level cyclic navigation, not item-level)
  const currentActivities = useMemo(() => {
    if (filteredActivities.length === 0) return [];
    const startIndex = activityPage * ACTIVITIES_PER_PAGE;
    const endIndex = startIndex + ACTIVITIES_PER_PAGE;
    // Slice returns the actual items for this page (may be less than 5 on last page)
    return filteredActivities.slice(startIndex, endIndex);
  }, [filteredActivities, activityPage, ACTIVITIES_PER_PAGE]);

  // Carousel navigation handlers (cyclic at page level)
  const handlePrevActivities = useCallback(() => {
    setActivityPage(prev => {
      if (totalPages <= 1) return 0;
      return prev === 0 ? totalPages - 1 : prev - 1;
    });
  }, [totalPages]);

  const handleNextActivities = useCallback(() => {
    setActivityPage(prev => {
      if (totalPages <= 1) return 0;
      return (prev + 1) % totalPages;
    });
  }, [totalPages]);

useEffect(() => {
  let mounted = true;
  let timeoutId = null;

  const loadDashboard = async () => {
    startLoading('dashboard');
    try {
      timeoutId = setTimeout(() => {
        if (mounted) {
          stopLoading('dashboard');
          setInitialLoad(false);
        }
      }, 600);
    } catch (error) {
      if (mounted) {
        notifications.operationFailed("load dashboard");
        stopLoading('dashboard');
        setInitialLoad(false);
      }
    }
  };

  loadDashboard();

  return () => {
    mounted = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const renderDashboardForSegment = () => (
    <>
      <Card
        title={t('dashboard.activeUsersCard')}
        icon={<FaUsers />}
        trendData={[
          1100, 1120, 1150, 1170, 1200,
          safeNumber(metrics.activeUsers - 2),
          safeNumber(metrics.activeUsers)
        ]}
        trendIncrease={safeNumber(metrics.activeUsersDelta, 0) >= 0}
      >
        {t('dashboard.activeUsersValue', { count: safeNumber(metrics.activeUsers) })}
      </Card>
      <Card
        title={t('dashboard.guestAccessCard', { defaultValue: 'Active Guests' })}
        icon={<FaUserClock />}
        trendData={[
          Math.max(0, metrics.activeGuests - 5),
          Math.max(0, metrics.activeGuests - 4),
          Math.max(0, metrics.activeGuests - 3),
          Math.max(0, metrics.activeGuests - 2),
          Math.max(0, metrics.activeGuests - 1),
          safeNumber(metrics.activeGuests)
        ]}
        trendIncrease={safeNumber(metrics.guestsDelta, 0) >= 0}
      >
        {t('dashboard.guestAccessValue', { count: safeNumber(metrics.activeGuests), checkedIn: safeNumber(metrics.checkedInToday), defaultValue: `${safeNumber(metrics.activeGuests)} Active (${safeNumber(metrics.checkedInToday)} today)` })}
      </Card>
      <Card
        title={t('dashboard.dataUsageCard')}
        icon={<FaUserFriends />}
        trendData={[
          1.0, 1.05, 1.1, 1.15,
          safeNumber(Math.round((metrics.dataUsageTB - 0.01) * 100) / 100),
          safeNumber(metrics.dataUsageTB)
        ]}
        trendIncrease={safeNumber(metrics.dataUsageDelta, 0) >= 0}
      >
        {t('dashboard.dataUsedValue', { value: safeNumber(metrics.dataUsageTB) })}
      </Card>
      <Card
        title={t('dashboard.networkUptimeCard')}
        icon={<FaCheckCircle />}
        trendData={[
          99.65, 99.72, 99.78, 99.85,
          safeNumber(metrics.networkUptime - 0.05),
          safeNumber(metrics.networkUptime)
        ]}
        trendIncrease={safeNumber(metrics.uptimeDelta, 0) >= 0}
      >
        {t('dashboard.uptimeValue', { percent: safeNumber(metrics.networkUptime) })}
      </Card>
    </>
  );

  const handleDashboardExportCSV = async (headers, rows, filename, chartId) => {
    setExportingCSV(true);
    setExportingChart(chartId);
    let timeoutId = null;
    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 500);
      });
      exportChartDataToCSV({ headers, rows }, filename);
      notifications.exportSuccess("CSV");
    } catch (error) {
      notifications.exportFailed("CSV");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setExportingCSV(false);
      setExportingChart(null);
    }
  };

  const handleDashboardExportPDF = async (title, headers, rows, chartType, dataRows, filename, reportId, chartId) => {
    setExportingPDF(true);
    setExportingChart(chartId);
    let timeoutId = null;
    try {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 1000);
      });
      
      let chartData;
      if (chartType === "line") {
        chartData = {
          labels: dataRows.map((n) => n.day),
          datasets: [{
            label: "Network Usage (GB)",
            data: dataRows.map((n) => n.usageGB),
            borderColor: "#004aad",
            backgroundColor: "rgba(0,74,173,0.2)",
            fill: true,
            tension: 0.4,
          }],
        };
      } else if (chartType === "bar") {
        chartData = {
          labels: dataRows.map((d) => d.speedTier),
          datasets: [{
            label: "User Count",
            data: dataRows.map((d) => d.userCount),
            backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
            borderWidth: 1,
          }],
        };
      } else if (chartType === "pie") {
        chartData = {
          labels: dataRows.map((a) => a.alertType),
          datasets: [{
            label: "Alerts",
            data: dataRows.map((a) => a.count),
            backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
          }],
        };
      }

      const exportChartOptions = getStandardChartOptions({
        type: chartType,
        title,
        xLabel: chartType === "line" ? "Day" : chartType === "bar" ? "Speed Tier" : "",
        yLabel: chartType === "line" ? "Network Usage (GB)" : chartType === "bar" ? "User Count" : "",
        darkMode: false,
        forExport: true,
      });
      
      const { width, height } = EXPORT_CANVAS_SIZES[chartType];

      await exportReportPDF({
        title,
        headers,
        rows,
        chartData,
        chartOptions: exportChartOptions,
        filename,
        rolePermissions: { canViewReports: hasPermission('canViewReports') },
        exportCanvasWidth: width,
        exportCanvasHeight: height,
        reportId: reportId,
        criteria: null,
        addWatermark: false,
        watermarkText: "CONFIDENTIAL",
        disclaimerText: "This report contains confidential information. Data is subject to change. For internal use only."
      });
      
      notifications.exportSuccess("PDF");
    } catch (error) {
      notifications.exportFailed("PDF");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setExportingPDF(false);
      setExportingChart(null);
    }
  };

  const handleSupportQuickAction = () => {
    navigate('/knowledge');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('triggerSupportHighlight', { detail: 'highlight-support' }));
    }, ANIMATION.HIGHLIGHT_DURATION);
  };

  const handleQuickAction = (path, requiredPermission) => {
    if (requiredPermission && !hasPermission(requiredPermission)) {
      notifications.noPermission(`access ${path.replace('/', '')}`);
      return;
    }
    navigate(path);
  };

  const quickActions = [
    {
      icon: FaUsers,
      labelKey: "dashboard.addUser",
      onClick: () => handleQuickAction('/users?add=1', 'canEditUsers'),
      permission: 'canEditUsers',
    },
    {
      icon: FaUserClock,
      labelKey: "dashboard.manageGuests",
      label: "Manage Guests",
      onClick: () => handleQuickAction('/guests', 'canEditUsers'),
      permission: 'canEditUsers',
    },
    {
      icon: FaChartPie,
      labelKey: "nav.reporting",
      onClick: () => handleQuickAction('/reports', 'canViewReports'),
      permission: 'canViewReports',
    },
    {
      icon: FaLifeRing,
      labelKey: "dashboard.support",
      onClick: handleSupportQuickAction,
      permission: 'canViewReports',
    },
    {
      icon: FaExclamationCircle,
      labelKey: "dashboard.logs",
      onClick: () => handleQuickAction('/logs', 'canViewLogs'),
      permission: 'canViewLogs',
    },
  ];

  const accessibleQuickActions = quickActions.filter(action => {
    if (!action.permission) return true;
    return hasPermission(action.permission);
  });

  // Company-level stats and chart data - Now segment-specific
  const segmentData = useSegmentCompanyData();
  const companyStats = useMemo(() => segmentData.stats, [segmentData.stats]);
  const companyChartData = useMemo(() => segmentData.chartData, [segmentData.chartData]);
  const segmentCompany = useMemo(() => segmentData.company, [segmentData.company]);
  const segmentSites = useMemo(() => segmentData.sites, [segmentData.sites]);
  const segmentActivityLogs = useMemo(() => segmentData.activityLogs, [segmentData.activityLogs]);

  // Render Company Dashboard View
  const renderCompanyDashboard = () => (
    <main className="main-content" role="main" aria-label="Company Dashboard">
      {(exportingCSV || exportingPDF) && (
        <LoadingOverlay
          active={true}
          message={exportingCSV ? "Preparing CSV..." : "Generating PDF..."}
          fullPage={false}
        />
      )}

      <h1 className="dashboard-title">{segmentCompany.name}</h1>

      {/* Company-level info banner */}
      <div className="company-info-banner">
        <FaBuilding className="banner-icon" />
        <div className="banner-content">
          <span className="banner-text">You are viewing company-level data across all sites</span>
          <span className="banner-subtext">Select a site below to view details or make changes</span>
        </div>
      </div>

      <h2 className="dashboard-section-title">Company Overview</h2>
      <section className="dashboard-cards company-overview-cards" aria-label="Company summary cards">
        <Card
          title="Total Sites"
          icon={<FaBuilding />}
          trendData={[4, 5, 5, 6, 6, 6]}
          trendIncrease={true}
        >
          {companyStats.totalSites} Sites
        </Card>
        <Card
          title="Total Users"
          icon={<FaUsers />}
          trendData={[2500, 2600, 2700, 2750, 2800, companyStats.totalUsers]}
          trendIncrease={true}
        >
          {companyStats.totalUsers.toLocaleString()} Users
        </Card>
        <Card
          title="Active Guests"
          icon={<FaUserClock />}
          trendData={[42, 48, 52, 58, 62, 68]}
          trendIncrease={true}
        >
          68 Across All Sites
        </Card>
        <Card
          title="Network Uptime"
          icon={<FaCheckCircle />}
          trendData={[99.65, 99.72, 99.78, 99.85, 99.88, 99.92]}
          trendIncrease={true}
        >
          99.92% This Month
        </Card>
      </section>

      <h2 className="dashboard-section-title">Your Sites</h2>
      <SitesOverview />

      <h2 className="dashboard-section-title">Company Analytics</h2>
      <section className="dashboard-charts company-charts" aria-label="Company analytics charts">
        <Card title="Users by Site">
          <div className="chart-container">
            <Bar
              data={{
                labels: companyChartData.usersBySite.map(s => s.name),
                datasets: [
                  {
                    label: "Total Users",
                    data: companyChartData.usersBySite.map(s => s.value),
                    backgroundColor: "#004aad",
                  },
                  {
                    label: "Active Users",
                    data: companyChartData.usersBySite.map(s => s.active),
                    backgroundColor: "#4caf50",
                  }
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </Card>

        <Card title="Devices by Site">
          <div className="chart-container">
            <Bar
              data={{
                labels: companyChartData.devicesBySite.map(s => s.name),
                datasets: [
                  {
                    label: "Total Devices",
                    data: companyChartData.devicesBySite.map(s => s.value),
                    backgroundColor: "#3f51b5",
                  },
                  {
                    label: "Active Devices",
                    data: companyChartData.devicesBySite.map(s => s.active),
                    backgroundColor: "#8bc34a",
                  }
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </Card>

        <Card title="Bandwidth Utilization by Site">
          <div className="chart-container">
            <Bar
              data={{
                labels: companyChartData.bandwidthBySite.map(s => s.name),
                datasets: [
                  {
                    label: "Bandwidth Usage (%)",
                    data: companyChartData.bandwidthBySite.map(s => s.usage),
                    backgroundColor: companyChartData.bandwidthBySite.map(s =>
                      s.usage >= 80 ? '#f44336' : s.usage >= 60 ? '#ff9800' : '#4caf50'
                    ),
                    borderRadius: 4,
                  }
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
      </section>

      <h2 className="dashboard-section-title">Recent Company Activity</h2>
      <Card title="" className="recent-activities-card company-activities" aria-label="Recent company activities">
        <ul className="activity-list company-activity-list">
          {segmentActivityLogs.slice(0, 5).map((log) => (
            <li key={log.id} className={`activity-item severity-${log.severity}`}>
              <span className="activity-site-badge">{log.site}</span>
              <span className="activity-text">{log.action}: {log.details}</span>
              <span className="activity-time">{new Date(log.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );

  if (initialLoad) {
    return (
      <main className="main-content" role="main" aria-label="Dashboard">
        <h1 className="dashboard-title">{t('dashboard.title')}</h1>
        <h2 className="dashboard-section-title">{t('dashboard.overview')}</h2>
        <section className="dashboard-cards">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </section>
        
        <h2 className="dashboard-section-title">{t('dashboard.quickActions')}</h2>
        <div className="quick-actions-row">
          {[...Array(5)].map((_, i) => (
            <SkeletonLoader key={i} variant="rect" height={80} />
          ))}
        </div>

        <h2 className="dashboard-section-title">{t('dashboard.networkAnalytics')}</h2>
        <section className="dashboard-charts">
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '8px', padding: '16px' }}>
              <SkeletonLoader variant="rect" height={200} />
            </div>
          ))}
        </section>

        <h2 className="dashboard-section-title">{t('dashboard.recentActivities')}</h2>
        <SkeletonLoader variant="card" />
      </main>
    );
  }

  // Render company dashboard if in company view
  if (isCompanyView) {
    return renderCompanyDashboard();
  }

  // Render site-level dashboard (existing view)
  return (
    <main
      className="main-content"
      role="main"
      aria-label="Dashboard"
      style={{ position: 'relative', zIndex: 1 }}
    >
      {(exportingCSV || exportingPDF) && (
        <LoadingOverlay
          active={true}
          message={exportingCSV ? "Preparing CSV..." : "Generating PDF..."}
          fullPage={false}
        />
      )}

      <h1 className="dashboard-title">{t('dashboard.title')}</h1>
      <h2 className="dashboard-section-title">{t('dashboard.overview')}</h2>
      <section className="dashboard-cards" aria-label="Dashboard summary cards">
        {renderDashboardForSegment()}
      </section>

      <h2 className="dashboard-section-title">{t('dashboard.quickActions')}</h2>
      <section className="dashboard-quick-actions" aria-label="Quick actions">
        {accessibleQuickActions.length === 0 ? (
          <div className="no-quick-actions">
            <p>{t('dashboard.noQuickActions')}</p>
          </div>
        ) : (
          <div className="quick-actions-row">
            {accessibleQuickActions.map((action, index) => (
              <div
                key={index}
                className="quick-action-card"
                tabIndex={0}
                role="button"
                aria-label={t(action.labelKey)}
                onClick={action.onClick}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    action.onClick();
                    e.preventDefault();
                  }
                }}
                style={{
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
              >
                <div className="quick-action-content">
                  <action.icon className="quick-action-icon" />
                  <span className="quick-action-label">{t(action.labelKey)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <h2 className="dashboard-section-title">{t('dashboard.networkAnalytics')}</h2>
      <section className="dashboard-charts" aria-label="Dashboard charts section">
        <Card title={t('charts.networkUsage')}>
          <div id="chart-network-usage" className="chart-container">
            <Line
              data={{
                labels: networkData.map((n) => n.day),
                datasets: [
                  {
                    label: t('charts.networkUsage'),
                    data: networkData.map((n) => n.usageGB),
                    borderColor: "#004aad",
                    backgroundColor: "rgba(0,74,173,0.2)",
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
          <div className="export-btn-group">
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportCSV(
                  [t('dashboard.day'), t('charts.networkUsage')],
                  networkData.map((n) => [n.day, n.usageGB]),
                  "network_usage.csv",
                  "network-usage"
                )
              }
              aria-label={t('common.exportCsv')}
              loading={exportingCSV && exportingChart === "network-usage"}
              disabled={exportingPDF || (exportingCSV && exportingChart !== "network-usage")}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              {t('common.exportCsv')}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportPDF(
                  t('charts.networkUsage'),
                  [t('dashboard.day'), t('charts.networkUsage')],
                  networkData.map((n) => [n.day, n.usageGB]),
                  "line",
                  networkData,
                  "network_usage.pdf",
                  "network_usage",
                  "network-usage"
                )
              }
              aria-label={t('common.exportPdf')}
              loading={exportingPDF && exportingChart === "network-usage"}
              disabled={exportingCSV || (exportingPDF && exportingChart !== "network-usage")}
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              {t('common.exportPdf')}
            </Button>
          </div>
        </Card>

        <Card title={t('charts.usersBySpeedTier')}>
          <div id="chart-speed-tier" className="chart-container">
            <Bar
              data={{
                labels: speedTierData.map((d) => d.speedTier),
                datasets: [
                  {
                    label: t('dashboard.userCount'),
                    data: speedTierData.map((d) => d.userCount),
                    backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
                    borderWidth: 1,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
          <div className="export-btn-group">
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportCSV(
                  [t('dashboard.speedTier'), t('dashboard.userCount')],
                  speedTierData.map((d) => [d.speedTier, d.userCount]),
                  "users_by_speed_tier.csv",
                  "speed-tier"
                )
              }
              aria-label={t('common.exportCsv')}
              loading={exportingCSV && exportingChart === "speed-tier"}
              disabled={exportingPDF || (exportingCSV && exportingChart !== "speed-tier")}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              {t('common.exportCsv')}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportPDF(
                  t('charts.usersBySpeedTier'),
                  [t('dashboard.speedTier'), t('dashboard.userCount')],
                  speedTierData.map((d) => [d.speedTier, d.userCount]),
                  "bar",
                  speedTierData,
                  "users_by_speed_tier.pdf",
                  "users_by_speed_tier",
                  "speed-tier"
                )
              }
              aria-label={t('common.exportPdf')}
              loading={exportingPDF && exportingChart === "speed-tier"}
              disabled={exportingCSV || (exportingPDF && exportingChart !== "speed-tier")}
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              {t('common.exportPdf')}
            </Button>
          </div>
        </Card>

        <Card title={t('charts.peakUsageHours')}>
          <div id="chart-peak-usage" className="chart-container">
            <Bar
              data={{
                labels: peakUsageData.map((p) => p.period),
                datasets: [
                  {
                    label: t('charts.usagePercent'),
                    data: peakUsageData.map((p) => p.usage),
                    backgroundColor: peakUsageData.map((_, i) => {
                      const colors = ['#4caf50', '#8bc34a', '#ffeb3b', '#ff9800', '#ff5722', '#9c27b0'];
                      return colors[i % colors.length];
                    }),
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 40,
                    ticks: {
                      callback: (value) => `${value}%`
                    }
                  }
                }
              }}
            />
          </div>
          <div className="export-btn-group">
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportCSV(
                  [t('dashboard.timePeriod'), t('charts.usagePercent')],
                  peakUsageData.map((p) => [p.period, `${p.usage}%`]),
                  "peak_usage_hours.csv",
                  "peak-usage"
                )
              }
              aria-label={t('common.exportCsv')}
              loading={exportingCSV && exportingChart === "peak-usage"}
              disabled={exportingPDF || (exportingCSV && exportingChart !== "peak-usage")}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              {t('common.exportCsv')}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportPDF(
                  t('charts.peakUsageHours'),
                  [t('dashboard.timePeriod'), t('charts.usagePercent')],
                  peakUsageData.map((p) => [p.period, `${p.usage}%`]),
                  "bar",
                  peakUsageData,
                  "peak_usage_hours.pdf",
                  "peak_usage",
                  "peak-usage"
                )
              }
              aria-label={t('common.exportPdf')}
              loading={exportingPDF && exportingChart === "peak-usage"}
              disabled={exportingCSV || (exportingPDF && exportingChart !== "peak-usage")}
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              {t('common.exportPdf')}
            </Button>
          </div>
        </Card>
      </section>

      <h2 className="dashboard-section-title">{t('dashboard.recentActivities')}</h2>
      <Card title="" className="recent-activities-card" aria-label="Recent user activities">
        <div className="activities-carousel">
          <button
            className="carousel-nav carousel-nav-left"
            onClick={handlePrevActivities}
            aria-label={t('common.previous')}
            disabled={totalPages <= 1}
          >
            <FaChevronLeft />
          </button>

          <ul className="activity-list">
            {currentActivities.map((activity, i) => (
              <li key={`${activity.id || i}-${activityPage}`} className="activity-item" tabIndex={0}>
                <span className="activity-text">{activity.text}</span>
                <span className="activity-time">{activity.time}</span>
              </li>
            ))}
            {currentActivities.length === 0 && (
              <li className="activity-item activity-empty">
                <span className="activity-text">{t('activities.noActivities')}</span>
              </li>
            )}
          </ul>

          <button
            className="carousel-nav carousel-nav-right"
            onClick={handleNextActivities}
            aria-label={t('common.next')}
            disabled={totalPages <= 1}
          >
            <FaChevronRight />
          </button>
        </div>

        {totalPages > 1 && (
          <div className="activities-pagination">
            <span className="pagination-info">
              {activityPage + 1} / {totalPages}
            </span>
          </div>
        )}
      </Card>
    </main>
  );
};

export default Dashboard;