// src/pages/Dashboard.js

import React, { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  FaUsers,
  FaUserFriends,
  FaChartPie,
  FaExclamationCircle,
  FaFileCsv,
  FaFilePdf,
  FaLifeRing,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportChartDataToCSV } from "../utils/exportUtils";
import { exportReportPDF } from "../utils/exportReportPDF";
import { useAuth } from "../context/AuthContext";
import { Permissions } from "../utils/accessLevels";
import sampleReportsData from "../constants/sampleReportsData";
import { getStandardChartOptions } from "../utils/commonChartOptions";
import { EXPORT_CANVAS_SIZES } from "../utils/exportConstants";
import { useNavigate } from "react-router-dom";
import siteConfig from "../config/siteConfig";
import "./Dashboard.css";

const Dashboard = () => {
  const metrics = siteConfig.metrics;
  const { currentUser } = useAuth();
  const rolePermissions = Permissions[currentUser.accessLevel]?.[currentUser.role] || {};
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [segment, setSegment] = useState("enterprise");

  const segments = [
    { value: "enterprise", label: "Enterprise Offices" },
    { value: "co-living", label: "Co-Living" },
    { value: "co-working", label: "Co-Working" },
    { value: "hotel", label: "Hotel" },
    { value: "pg", label: "PG" },
    { value: "miscellaneous", label: "Miscellaneous" },
  ];

  const darkMode = document.documentElement.getAttribute("data-theme") === "dark";

  const chartOptions = getStandardChartOptions({
    type: "line",
    title: "",
    xLabel: "",
    yLabel: "",
    darkMode,
  });

  const networkData = sampleReportsData["network-usage-report"];
  const licenseData = sampleReportsData["license-usage-report"];
  const alertsData = sampleReportsData["alerts-summary-report"];

  const safeNumber = (value, fallback = 0) => typeof value === "number" && !isNaN(value) ? value : fallback;

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

  const handleDashboardExportCSV = (headers, rows, filename) => {
    exportChartDataToCSV({ headers, rows }, filename);
  };

  const handleDashboardExportPDF = async (title, headers, rows, chartType, dataRows, filename) => {
    let chartData;

    if (chartType === "line") {
      chartData = {
        labels: dataRows.map((n) => n.day),
        datasets: [
          {
            label: "Network Usage (GB)",
            data: dataRows.map((n) => n.usageGB),
            borderColor: "#004aad",
            backgroundColor: "rgba(0,74,173,0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      };
    } else if (chartType === "bar") {
      chartData = {
        labels: dataRows.map((d) => d.licenseType),
        datasets: [
          {
            label: "License Usage",
            data: dataRows.map((d) => d.usageCount),
            backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
            borderWidth: 1,
          },
        ],
      };
    } else if (chartType === "pie") {
      chartData = {
        labels: dataRows.map((a) => a.alertType),
        datasets: [
          {
            label: "Alerts",
            data: dataRows.map((a) => a.count),
            backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
          },
        ],
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
      rolePermissions,
      exportCanvasWidth: width,
      exportCanvasHeight: height,
    });
  };

  // Support quick action: navigate to Knowledge Center and signal highlight
  const handleSupportQuickAction = () => {
    navigate('/knowledge');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('triggerSupportHighlight', { detail: 'highlight-support' }));
    }, 350);
  };

  return (
    <main className="main-content" role="main" aria-label="Dashboard">
      {/* OVERVIEW */}
      <h2 className="dashboard-section-title">Overview</h2>
      <section className="dashboard-cards" aria-label="Dashboard summary cards">
        {renderDashboardForSegment()}
      </section>

      {/* QUICK ACTIONS */}
      <h2 className="dashboard-section-title">Quick Actions</h2>
      <section className="dashboard-quick-actions" aria-label="Quick actions">
        <div className="quick-actions-row">
          <div
            className="quick-action-card"
            tabIndex={0}
            role="button"
            aria-label="Add User"
            onClick={() => navigate('/users?add=1')}
          >
            <div className="quick-action-content">
              <FaUsers className="quick-action-icon" />
              <span className="quick-action-label">Add User</span>
            </div>
          </div>
          <div
            className="quick-action-card"
            tabIndex={0}
            role="button"
            aria-label="View Users"
            onClick={() => navigate('/users')}
          >
            <div className="quick-action-content">
              <FaUserFriends className="quick-action-icon" />
              <span className="quick-action-label">View Users</span>
            </div>
          </div>
          <div
            className="quick-action-card"
            tabIndex={0}
            role="button"
            aria-label="Reports"
            onClick={() => navigate('/reports')}
          >
            <div className="quick-action-content">
              <FaChartPie className="quick-action-icon" />
              <span className="quick-action-label">Reports</span>
            </div>
          </div>
          <div
            className="quick-action-card"
            tabIndex={0}
            role="button"
            aria-label="Support"
            onClick={handleSupportQuickAction}
          >
            <div className="quick-action-content">
              <FaLifeRing className="quick-action-icon" />
              <span className="quick-action-label">Support</span>
            </div>
          </div>
          <div
            className="quick-action-card"
            tabIndex={0}
            role="button"
            aria-label="Alerts and Event Logs"
            onClick={() => navigate('/alerts')}
          >
            <div className="quick-action-content">
              <FaExclamationCircle className="quick-action-icon" />
              <span className="quick-action-label">Alerts & Logs</span>
            </div>
          </div>
        </div>
      </section>

      {/* NETWORK ANALYTICS */}
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
                  "network_usage.csv"
                )
              }
              aria-label="Export Network Usage CSV"
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
                  "network_usage.pdf"
                )
              }
              aria-label="Export Network Usage PDF"
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
                  "license_usage.csv"
                )
              }
              aria-label="Export License Usage CSV"
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
                  "license_usage.pdf"
                )
              }
              aria-label="Export License Usage PDF"
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
                  "alert_summary.csv"
                )
              }
              aria-label="Export Alerts Summary CSV"
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
                  "alert_summary.pdf"
                )
              }
              aria-label="Export Alerts Summary PDF"
            >
              <FaFilePdf style={{ marginRight: 6 }} />
              Export PDF
            </Button>
          </div>
        </Card>
      </section>

      {/* RECENT ACTIVITIES */}
      <h2 className="dashboard-section-title">Recent Activities</h2>
      <Card title="" style={{ maxHeight: "200px", overflowY: "auto" }} aria-label="Recent user activities">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[
            { text: "User Amit logged in", time: "10:30 AM" },
            { text: "License allocation updated for Enterprise segment", time: "Yesterday" },
            { text: "Network health check passed", time: "2 days ago" },
            { text: "Password reset request for user Neeta", time: "3 days ago" },
          ].map((activity, i) => (
            <li
              key={i}
              style={{
                padding: "8px 12px",
                borderBottom: i === 3 ? "none" : "1px solid var(--text-color)",
                display: "flex",
                justifyContent: "space-between",
                color: "var(--text-color)",
              }}
              tabIndex={0}
            >
              <span>{activity.text}</span>
              <span style={{ fontStyle: "italic", color: "var(--text-color)" }}>{activity.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
};

export default Dashboard;
