// src/pages/Dashboard.js

import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Line, Bar, Pie } from "react-chartjs-2";
import { FaUsers, FaUserFriends, FaChartPie, FaExclamationCircle, FaFileCsv, FaFilePdf, FaLifeRing } from "react-icons/fa";
import { usePermissions } from "../hooks/usePermissions";
import { useLoading } from "../context/LoadingContext";
import siteSampleData from "../constants/siteSampleData";
import { getStandardChartOptions } from "../utils/commonChartOptions";
import { EXPORT_CANVAS_SIZES } from "../utils/exportConstants";
import { exportChartDataToCSV } from "../utils/exportUtils";
import { exportReportPDF } from "../utils/exportReportPDF";
import { useNavigate } from "react-router-dom";
import siteConfig from "../config/siteConfig";
import { ANIMATION, ACTIVITY } from '../constants/appConstants';
import LoadingOverlay from "../components/Loading/LoadingOverlay";
import SkeletonLoader from "../components/Loading/SkeletonLoader";
import notifications from "../utils/notifications";
import "./Dashboard.css";

const Dashboard = () => {
  const metrics = {
    activeUsers: siteConfig?.dashboard?.activeUsers || 850,
    activeUsersDelta: 25,
    licenseUsagePercent: Math.round((siteConfig?.licenses?.usedLicenses / siteConfig?.licenses?.maxLicenses) * 100) || 57,
    licenseUsageDelta: 2,
    dataUsageTB: 1.2,
    dataUsageDelta: 0.05,
    currentAlerts: 0,
    alertsDelta: -2
  };
  
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
              } else if (context.chart.canvas.id === 'chart-license-usage') {
                label += context.parsed.y;
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

  const networkData = siteSampleData.getSiteReportData("network-usage-report");
  const licenseData = siteSampleData.getSiteReportData("license-usage-report");
  const alertsData = siteSampleData.getSiteReportData("alerts-summary-report");

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
          labels: dataRows.map((d) => d.licenseType),
          datasets: [{
            label: "License Usage",
            data: dataRows.map((d) => d.usageCount),
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
        xLabel: chartType === "line" ? "Day" : chartType === "bar" ? "License" : "",
        yLabel: chartType === "line" ? "Network Usage (GB)" : chartType === "bar" ? "Usage" : "",
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

        <Card title="License Usage by Type">
          <div id="chart-license-usage" className="chart-container">
            <Bar
              data={{
                labels: licenseData.map((d) => d.licenseType),
                datasets: [
                  {
                    label: "License Usage",
                    data: licenseData.map((d) => d.usageCount),
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
                  ["License", "Usage"],
                  licenseData.map((d) => [d.licenseType, d.usageCount]),
                  "license_usage.csv",
                  "license-usage"
                )
              }
              aria-label="Export License Usage CSV"
              loading={exportingCSV && exportingChart === "license-usage"}
              disabled={exportingPDF || (exportingCSV && exportingChart !== "license-usage")}
            >
              <FaFileCsv style={{ marginRight: 6 }} />
              Export CSV
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                handleDashboardExportPDF(
                  "License Usage by Type",
                  ["License", "Usage"],
                  licenseData.map((d) => [d.licenseType, d.usageCount]),
                  "bar",
                  licenseData,
                  "license_usage.pdf",
                  "license_usage",
                  "license-usage"
                )
              }
              aria-label="Export License Usage PDF"
              loading={exportingPDF && exportingChart === "license-usage"}
              disabled={exportingCSV || (exportingPDF && exportingChart !== "license-usage")}
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
          {[
            { text: "User Amit logged in", time: "10:30 AM" },
            { text: "License allocation updated for Enterprise segment", time: "Yesterday" },
            { text: "Network health check passed", time: "2 days ago" },
            { text: "Password reset request for user Neeta", time: "3 days ago" },
          ].slice(0, ACTIVITY.MAX_RECENT_ITEMS).map((activity, i) => (
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