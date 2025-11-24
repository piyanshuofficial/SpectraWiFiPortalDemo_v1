// src/pages/Dashboard.js

import React, { useState, useEffect, useMemo } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Line, Bar, Pie } from "react-chartjs-2";
import { FaUsers, FaUserFriends, FaChartPie, FaExclamationCircle, FaFileCsv, FaFilePdf, FaLifeRing } from "react-icons/fa";
import { usePermissions } from "../hooks/usePermissions";
import { useLoading } from "../context/LoadingContext";
import { useSegment } from "../context/SegmentContext";
import { useSegmentActivities } from "../hooks/useSegmentActivities";
import siteSampleData from "../constants/siteSampleData";
import userSampleData from "../constants/userSampleData";
import { getStandardChartOptions } from "../utils/commonChartOptions";
import { EXPORT_CANVAS_SIZES } from "../utils/exportConstants";
import { exportChartDataToCSV } from "../utils/exportUtils";
import { exportReportPDF } from "../utils/exportReportPDF";
import { useNavigate } from "react-router-dom";
import { ANIMATION, ACTIVITY } from '../constants/appConstants';
import LoadingOverlay from "../components/Loading/LoadingOverlay";
import SkeletonLoader from "../components/Loading/SkeletonLoader";
import notifications from "../utils/notifications";
import "./Dashboard.css";



const Dashboard = () => {
  const { currentSegment } = useSegment();

  // Calculate segment-specific metrics with realistic variation
  const metrics = useMemo(() => {
    // Different segments have different sizes and usage patterns
    const segmentMetrics = {
      enterprise: {
        baseUsers: 850,
        licensePercent: 68,
        dataUsageTB: 2.8,
        alerts: 3
      },
      coLiving: {
        baseUsers: 320,
        licensePercent: 45,
        dataUsageTB: 1.5,
        alerts: 1
      },
      hotel: {
        baseUsers: 450,
        licensePercent: 52,
        dataUsageTB: 1.8,
        alerts: 2
      },
      coWorking: {
        baseUsers: 280,
        licensePercent: 38,
        dataUsageTB: 1.2,
        alerts: 1
      },
      pg: {
        baseUsers: 180,
        licensePercent: 25,
        dataUsageTB: 0.6,
        alerts: 0
      },
      miscellaneous: {
        baseUsers: 95,
        licensePercent: 15,
        dataUsageTB: 0.3,
        alerts: 0
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
      currentAlerts: segmentConfig.alerts,
      alertsDelta: -1
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
              } else if (context.chart.canvas.id === 'chart-alerts-summary') {
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

  // Get segment-specific data for dashboard charts
  const networkData = useMemo(() => {
    // Generate segment-specific network usage data with variation per segment
    const baseData = siteSampleData.getSiteReportData("network-usage-report") || [];

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

  const alertsData = useMemo(() => {
    // Generate segment-specific alerts data with different patterns
    const segmentAlertDistributions = {
      enterprise: [
        { alertType: "Critical", count: 8 },
        { alertType: "Warning", count: 42 },
        { alertType: "Info", count: 125 }
      ],
      coLiving: [
        { alertType: "Critical", count: 2 },
        { alertType: "Warning", count: 18 },
        { alertType: "Info", count: 65 }
      ],
      hotel: [
        { alertType: "Critical", count: 5 },
        { alertType: "Warning", count: 28 },
        { alertType: "Info", count: 95 }
      ],
      coWorking: [
        { alertType: "Critical", count: 3 },
        { alertType: "Warning", count: 15 },
        { alertType: "Info", count: 48 }
      ],
      pg: [
        { alertType: "Critical", count: 0 },
        { alertType: "Warning", count: 8 },
        { alertType: "Info", count: 32 }
      ],
      miscellaneous: [
        { alertType: "Critical", count: 0 },
        { alertType: "Warning", count: 4 },
        { alertType: "Info", count: 18 }
      ]
    };

    return segmentAlertDistributions[currentSegment] || segmentAlertDistributions.enterprise;
  }, [currentSegment]);

  const safeNumber = (value, fallback = 0) => typeof value === "number" && !isNaN(value) ? value : fallback;

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
        title="Active Users"
        icon={<FaUsers />}
        trendData={[
          1100, 1120, 1150, 1170, 1200,
          safeNumber(metrics.activeUsers - 2),
          safeNumber(metrics.activeUsers)
        ]}
        trendIncrease={safeNumber(metrics.activeUsersDelta, 0) >= 0}
      >
        {safeNumber(metrics.activeUsers)} Active Users
      </Card>
      <Card
        title="License Usage"
        icon={<FaChartPie />}
        trendData={[
          72, 73, 75, 76,
          safeNumber(metrics.licenseUsagePercent - 1),
          safeNumber(metrics.licenseUsagePercent)
        ]}
        trendIncrease={safeNumber(metrics.licenseUsageDelta, 0) >= 0}
      >
        {safeNumber(metrics.licenseUsagePercent)}% Licenses Used
      </Card>
      <Card
        title="Data Usage"
        icon={<FaUserFriends />}
        trendData={[
          1.0, 1.05, 1.1, 1.15,
          safeNumber(Math.round((metrics.dataUsageTB - 0.01) * 100) / 100),
          safeNumber(metrics.dataUsageTB)
        ]}
        trendIncrease={safeNumber(metrics.dataUsageDelta, 0) >= 0}
      >
        {safeNumber(metrics.dataUsageTB)} TB Used This Week
      </Card>
      <Card
        title="Alerts"
        icon={<FaExclamationCircle />}
        trendData={[
          3, 2, 2, 1, 0,
          safeNumber(metrics.currentAlerts + 1),
          safeNumber(metrics.currentAlerts)
        ]}
        trendIncrease={safeNumber(metrics.alertsDelta, 0) <= 0}
      >
        {safeNumber(metrics.currentAlerts) === 0 ? "No Current Alerts" : `${safeNumber(metrics.currentAlerts)} Alerts`}
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
    let timeoutId = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('triggerSupportHighlight', { detail: 'highlight-support' }));
    }, ANIMATION.HIGHLIGHT_DURATION);
    
    return () => clearTimeout(timeoutId);
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
      label: "Add User",
      onClick: () => handleQuickAction('/users?add=1', 'canEditUsers'),
      permission: 'canEditUsers',
    },
    {
      icon: FaUserFriends,
      label: "View Users",
      onClick: () => handleQuickAction('/users', 'canEditUsers'),
      permission: 'canEditUsers',
    },
    {
      icon: FaChartPie,
      label: "Reports",
      onClick: () => handleQuickAction('/reports', 'canViewReports'),
      permission: 'canViewReports',
    },
    {
      icon: FaLifeRing,
      label: "Support",
      onClick: handleSupportQuickAction,
      permission: 'canViewReports',
    },
    {
      icon: FaExclamationCircle,
      label: "Alerts & Logs",
      onClick: () => handleQuickAction('/alerts', 'canViewReports'),
      permission: 'canViewReports',
    },
  ];

  const accessibleQuickActions = quickActions.filter(action => {
    if (!action.permission) return true;
    return hasPermission(action.permission);
  });

  if (initialLoad) {
    return (
      <main className="main-content" role="main" aria-label="Dashboard">
        <h1 className="dashboard-title">WiFi Dashboard</h1>
        <h2 className="dashboard-section-title">Overview</h2>
        <section className="dashboard-cards">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </section>
        
        <h2 className="dashboard-section-title">Quick Actions</h2>
        <div className="quick-actions-row">
          {[...Array(5)].map((_, i) => (
            <SkeletonLoader key={i} variant="rect" height={80} />
          ))}
        </div>

        <h2 className="dashboard-section-title">Network Analytics</h2>
        <section className="dashboard-charts">
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '8px', padding: '16px' }}>
              <SkeletonLoader variant="rect" height={200} />
            </div>
          ))}
        </section>

        <h2 className="dashboard-section-title">Recent Activities</h2>
        <SkeletonLoader variant="card" />
      </main>
    );
  }

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

      <h1 className="dashboard-title">WiFi Dashboard</h1>
      <h2 className="dashboard-section-title">Overview</h2>
      <section className="dashboard-cards" aria-label="Dashboard summary cards">
        {renderDashboardForSegment()}
      </section>

      <h2 className="dashboard-section-title">Quick Actions</h2>
      <section className="dashboard-quick-actions" aria-label="Quick actions">
        {accessibleQuickActions.length === 0 ? (
          <div className="no-quick-actions">
            <p>No quick actions available with your current permissions.</p>
          </div>
        ) : (
          <div className="quick-actions-row">
            {accessibleQuickActions.map((action, index) => (
              <div
                key={index}
                className="quick-action-card"
                tabIndex={0}
                role="button"
                aria-label={action.label}
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
                  <span className="quick-action-label">{action.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <h2 className="dashboard-section-title">Network Analytics</h2>
      <section className="dashboard-charts" aria-label="Dashboard charts section">
        <Card title="Network Usage (GB)">
          <div id="chart-network-usage" className="chart-container">
            <Line
              data={{
                labels: networkData.map((n) => n.day),
                datasets: [
                  {
                    label: "Network Usage (GB)",
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
                  ["Day", "Network Usage (GB)"],
                  networkData.map((n) => [n.day, n.usageGB]),
                  "network_usage.csv",
                  "network-usage"
                )
              }
              aria-label="Export Network Usage CSV"
              loading={exportingCSV && exportingChart === "network-usage"}
              disabled={exportingPDF || (exportingCSV && exportingChart !== "network-usage")}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              Export CSV
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportPDF(
                  "Network Usage (GB)",
                  ["Day", "Network Usage (GB)"],
                  networkData.map((n) => [n.day, n.usageGB]),
                  "line",
                  networkData,
                  "network_usage.pdf",
                  "network_usage",
                  "network-usage"
                )
              }
              aria-label="Export Network Usage PDF"
              loading={exportingPDF && exportingChart === "network-usage"}
              disabled={exportingCSV || (exportingPDF && exportingChart !== "network-usage")}
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              Export PDF
            </Button>
          </div>
        </Card>

        <Card title="Users by Speed Tier">
          <div id="chart-speed-tier" className="chart-container">
            <Bar
              data={{
                labels: speedTierData.map((d) => d.speedTier),
                datasets: [
                  {
                    label: "User Count",
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
                  ["Speed Tier", "User Count"],
                  speedTierData.map((d) => [d.speedTier, d.userCount]),
                  "users_by_speed_tier.csv",
                  "speed-tier"
                )
              }
              aria-label="Export Users by Speed Tier CSV"
              loading={exportingCSV && exportingChart === "speed-tier"}
              disabled={exportingPDF || (exportingCSV && exportingChart !== "speed-tier")}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              Export CSV
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportPDF(
                  "Users by Speed Tier",
                  ["Speed Tier", "User Count"],
                  speedTierData.map((d) => [d.speedTier, d.userCount]),
                  "bar",
                  speedTierData,
                  "users_by_speed_tier.pdf",
                  "users_by_speed_tier",
                  "speed-tier"
                )
              }
              aria-label="Export Users by Speed Tier PDF"
              loading={exportingPDF && exportingChart === "speed-tier"}
              disabled={exportingCSV || (exportingPDF && exportingChart !== "speed-tier")}
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              Export PDF
            </Button>
          </div>
        </Card>

        <Card title="Alerts Summary">
          <div id="chart-alerts-summary" className="chart-container">
            <Pie
              data={{
                labels: alertsData.map((a) => a.alertType),
                datasets: [
                  {
                    label: "Alerts",
                    data: alertsData.map((a) => a.count),
                    backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
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
                  ["Alert Type", "Count"],
                  alertsData.map((a) => [a.alertType, a.count]),
                  "alert_summary.csv",
                  "alerts-summary"
                )
              }
              aria-label="Export Alerts Summary CSV"
              loading={exportingCSV && exportingChart === "alerts-summary"}
              disabled={exportingPDF || (exportingCSV && exportingChart !== "alerts-summary")}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              Export CSV
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportPDF(
                  "Alerts Summary",
                  ["Alert Type", "Count"],
                  alertsData.map((a) => [a.alertType, a.count]),
                  "pie",
                  alertsData,
                  "alert_summary.pdf",
                  "alerts_summary",
                  "alerts-summary"
                )
              }
              aria-label="Export Alerts Summary PDF"
              loading={exportingPDF && exportingChart === "alerts-summary"}
              disabled={exportingCSV || (exportingPDF && exportingChart !== "alerts-summary")}
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              Export PDF
            </Button>
          </div>
        </Card>
      </section>

      <h2 className="dashboard-section-title">Recent Activities</h2>
      <Card title="" className="recent-activities-card" aria-label="Recent user activities">
        <ul className="activity-list">
          {recentActivities.slice(0, ACTIVITY.MAX_RECENT_ITEMS).map((activity, i) => (
            <li key={i} className="activity-item" tabIndex={0}>
              <span className="activity-text">{activity.text}</span>
              <span className="activity-time">{activity.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
};

export default Dashboard;