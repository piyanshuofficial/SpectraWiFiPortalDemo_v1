// src/pages/Reports/ReportDashboard.js

import React, { useState, useMemo, useEffect } from "react";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import { useAuth } from "../../context/AuthContext";
import { Permissions } from "../../utils/accessLevels";
import { FaEye, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import "./ReportDashboard.css";
import shortcutColors from "../../constants/shortcutColors";
import { exportChartDataToCSV } from "../../utils/exportUtils";
import { exportReportPDF } from "../../utils/exportReportPDF";

import SiteMonthlyActiveUsers from "../../reports/SiteMonthlyActiveUsers";
import MonthlyDataUsageSummary from "../../reports/MonthlyDataUsageSummary";
import DailyAverageActiveUsers from "../../reports/DailyAverageActiveUsers";
import PolicyWiseMonthlyAverageActiveUsers from "../../reports/PolicyWiseMonthlyAverageActiveUsers";

import NetworkUsageReport from "../../reports/NetworkUsageReport";
import LicenseUsageReport from "../../reports/LicenseUsageReport";
import AlertsSummaryReport from "../../reports/AlertsSummaryReport";

import sampleReports from "../../constants/sampleReports";
import sampleReportsData from "../../constants/sampleReportsData";
import { EXPORT_CANVAS_SIZES } from "../../utils/exportConstants";
import { useLoading } from "../../context/LoadingContext";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";

import { getStandardChartOptions } from "../../utils/commonChartOptions";

const STATUS_VARIANTS = {
  Completed: "success",
  "In Progress": "warning",
  Failed: "danger",
};

const getCSVData = (report) => {
  const reportData = sampleReportsData[report.id];
  let headers = [];
  let rows = [];
  switch (report.id) {
    case "site-monthly-active-users":
      headers = [
        "Month",
        "Avg. Active Users",
        "New Users",
        "Churned Users",
        "Activations",
        "Deactivations",
        "Change vs Prev.",
      ];
      rows = reportData.map((r) => [
        r.month,
        r.avgActiveUsers,
        r.newUsers,
        r.churnedUsers,
        r.activations,
        r.deactivations,
        r.changeFromPrevMonth >= 0 ? `+${r.changeFromPrevMonth}` : `${r.changeFromPrevMonth}`,
      ]);
      break;
    case "monthly-data-usage-summary":
      headers = ["Month", "Total Usage (GB)", "Peak Usage (GB)", "Avg Usage (GB)"];
      rows = reportData.map((r) => [r.month, r.totalUsageGB, r.peakUsageGB, r.avgUsageGB]);
      break;
    case "daily-average-active-users":
      headers = ["Date", "Avg. Active Users"];
      rows = reportData.map((r) => [r.date, r.avgActiveUsers]);
      break;
    case "policy-wise-monthly-average-active-users":
      headers = ["Month", "Policy", "Avg. Active Users"];
      rows = reportData.map((r) => [r.month, r.policy, r.avgActiveUsers]);
      break;
    case "network-usage-report":
      headers = ["Day", "Network Usage (GB)"];
      rows = reportData.map((r) => [r.day, r.usageGB]);
      break;
    case "license-usage-report":
      headers = ["License", "Usage"];
      rows = reportData.map((r) => [r.licenseType, r.usageCount]);
      break;
    case "alerts-summary-report":
      headers = ["Alert Type", "Count"];
      rows = reportData.map((r) => [r.alertType, r.count]);
      break;
    default:
      headers = [];
      rows = [];
  }
  return { headers, rows };
};

const getChartConfig = (reportId, reportData, darkMode = false) => {
  switch (reportId) {
    case "site-monthly-active-users": {
      const data = {
        labels: reportData.map((r) => r.month),
        datasets: [
          {
            label: "Avg. Active Users",
            data: reportData.map((r) => r.avgActiveUsers),
            backgroundColor: "rgba(33,80,162,0.6)",
          },
          {
            label: "New Users",
            data: reportData.map((r) => r.newUsers),
            backgroundColor: "rgba(49,120,115,0.6)",
          },
        ],
      };
      const options = getStandardChartOptions({
        type: "bar",
        title: "Site Monthly Active Users",
        xLabel: "Month",
        yLabel: "Users",
        darkMode,
      });
      return { data, options };
    }
    case "monthly-data-usage-summary": {
      const data = {
        labels: reportData.map((r) => r.month),
        datasets: [
          {
            label: "Total Usage (GB)",
            data: reportData.map((r) => r.totalUsageGB),
            backgroundColor: "rgba(33,80,162,0.6)",
          },
          {
            label: "Peak Usage (GB)",
            data: reportData.map((r) => r.peakUsageGB),
            backgroundColor: "rgba(217,83,79,0.6)",
          },
        ],
      };
      const options = getStandardChartOptions({
        type: "bar",
        title: "Monthly Data Usage Summary",
        xLabel: "Month",
        yLabel: "GB",
        darkMode,
      });
      return { data, options };
    }
    case "daily-average-active-users": {
      const data = {
        labels: reportData.map((r) => r.date),
        datasets: [
          {
            label: "Avg. Active Users",
            data: reportData.map((r) => r.avgActiveUsers),
            borderColor: "#2150a2",
            backgroundColor: "rgba(33,80,162,0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            borderWidth: 2,
          },
        ],
      };
      const options = getStandardChartOptions({
        type: "line",
        title: "Daily Average Active Users",
        xLabel: "Date",
        yLabel: "Users",
        darkMode,
      });
      return { data, options };
    }
    case "policy-wise-monthly-average-active-users": {
      const uniquePolicies = [...new Set(reportData.map((r) => r.policy))];
      const months = [...new Set(reportData.map((r) => r.month))];
      const datasets = uniquePolicies.map((policy, idx) => ({
        label: policy,
        data: months.map(
          (month) => reportData.find((d) => d.month === month && d.policy === policy)?.avgActiveUsers ?? 0
        ),
        backgroundColor: idx % 2 === 0 ? "rgba(33,80,162,0.7)" : "rgba(49,120,115,0.7)",
      }));
      const data = { labels: months, datasets };
      const options = getStandardChartOptions({
        type: "bar",
        title: "Policy Wise Monthly Average Active Users",
        xLabel: "Month",
        yLabel: "Users",
        darkMode,
      });
      options.scales.x.stacked = true;
      options.scales.y.stacked = true;
      return { data, options };
    }
    case "network-usage-report": {
      const data = {
        labels: reportData.map((d) => d.day),
        datasets: [
          {
            label: "Network Usage (GB)",
            data: reportData.map((d) => d.usageGB),
            borderColor: "#004aad",
            backgroundColor: "rgba(0,74,173,0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      };
      const options = getStandardChartOptions({
        type: "line",
        title: "Network Usage",
        xLabel: "Day",
        yLabel: "GB",
        darkMode,
      });
      return { data, options };
    }
    case "license-usage-report": {
      const data = {
        labels: reportData.map((d) => d.licenseType),
        datasets: [
          {
            label: "License Usage",
            data: reportData.map((d) => d.usageCount),
            backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
            borderWidth: 1,
          },
        ],
      };
      const options = getStandardChartOptions({
        type: "bar",
        title: "License Usage by Type",
        xLabel: "License",
        yLabel: "Usage",
        darkMode,
      });
      return { data, options };
    }
    case "alerts-summary-report": {
      const data = {
        labels: reportData.map((d) => d.alertType),
        datasets: [
          {
            label: "Alerts",
            data: reportData.map((d) => d.count),
            backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
          },
        ],
      };
      const options = getStandardChartOptions({
        type: "pie",
        title: "Alerts Summary",
        darkMode,
      });
      return { data, options };
    }
    default:
      throw new Error("Unsupported report id");
  }
};


const ReportList = ({ reports, onView, onDownloadCSV, onExportPDF, selectedReportId, highlightedReportId, onRemoveHighlight }) => (
  <table
    className="report-table"
    onClick={(e) => {
      if (!e.target.closest(".actions-cell")) {
        onRemoveHighlight();
      }
    }}
  >
    <thead>
      <tr>
        <th>Report Name</th>
        <th>Type</th>
        <th>Created Date</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {reports.length === 0 ? (
        <tr>
          <td colSpan={5} style={{ textAlign: "center" }}>
            No reports found
          </td>
        </tr>
      ) : (
        reports.map((report) => (
          <tr
            key={report.id}
            id={`report-row-${report.id}`}
            className={highlightedReportId === report.id ? "highlight-report" : selectedReportId === report.id ? "selected-report" : ""}
          >
            <td>{report.name}</td>
            <td>{report.type}</td>
            <td>{report.createdDate}</td>
            <td>
              <Badge variant={STATUS_VARIANTS[report.status]?.toLowerCase() || "secondary"}>{report.status}</Badge>
            </td>
            <td className="actions-cell">
              <Button variant="secondary" onClick={() => onView(report)} title={`View report ${report.name}`}>
                <FaEye />
              </Button>
              <Button
                variant="primary"
                onClick={() => onDownloadCSV(report)}
                title={`Download CSV for report ${report.name}`}
                style={{ marginLeft: "8px" }}
              >
                <FaFileCsv />
              </Button>
              <Button
                variant="primary"
                onClick={() => onExportPDF(report)}
                title={`Download PDF for report ${report.name}`}
                style={{ marginLeft: "8px" }}
              >
                <FaFilePdf />
              </Button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);


const ReportDashboard = () => {
  const { currentUser } = useAuth();
  const { startLoading, stopLoading, isLoading } = useLoading();
  const rolePermissions = Permissions[currentUser.accessLevel]?.[currentUser.role] || {};
  const [reports] = React.useState(sampleReports);
  const [selectedReportId, setSelectedReportId] = React.useState(null);
  const [highlightedReportId, setHighlightedReportId] = React.useState(null);
  const darkMode = document.documentElement.getAttribute("data-theme") === "dark";
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const accessibleReports = useMemo(() => reports.filter(() => true), [reports, rolePermissions]);
  const commonReports = accessibleReports.filter((r) => r.isCommon);
  const categorizedReports = accessibleReports.reduce((acc, r) => {
    const category = r.category || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(r);
    return acc;
  }, {});

  const handleExportPDF = async (report) => {
    setExportingPDF(true);
    startLoading('export');
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const reportData = sampleReportsData[report.id];
      const { headers, rows } = getCSVData(report);
      let chartConfig = null;
      try {
        chartConfig = getChartConfig(report.id, reportData, darkMode);
        if (chartConfig && chartConfig.options && !chartConfig.options.type) {
          if (report.id === "alerts-summary-report") {
            chartConfig.options.type = "pie";
          } else if (report.id === "network-usage-report" || report.id === "daily-average-active-users") {
            chartConfig.options.type = "line";
          } else {
            chartConfig.options.type = "bar";
          }
        }
      } catch {
        
      }
      const { width, height } = EXPORT_CANVAS_SIZES[chartConfig.options.type];

      await exportReportPDF({
        title: `${report.name} Report`,
        headers,
        rows,
        chartData: chartConfig ? chartConfig.data : null,
        chartOptions: chartConfig ? chartConfig.options : null,
        filename: `${report.name.replace(/\s/g, "_")}_Report.pdf`,
        rolePermissions,
        exportCanvasWidth: width,
        exportCanvasHeight: height,
      });
      toast.success("PDF exported successfully");
    } catch (error) {
      toast.error("Failed to export PDF");
    } finally {
      setExportingPDF(false);
      stopLoading('export');
    }
  };

  const handleDownloadCSV = async (report) => {
    setExportingCSV(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const { headers, rows } = getCSVData(report);
      exportChartDataToCSV({ headers, rows }, `${report.name.replace(/\s/g, "_")}.csv`);
      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error("Failed to export CSV");
    } finally {
      setExportingCSV(false);
    }
  };

  const handleView = (report) => {
    setSelectedReportId(report.id);
    setHighlightedReportId(report.id);
    setTimeout(() => {
      const el = document.getElementById(`report-row-${report.id}`) || document.getElementById(`section-${report.category}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  const handleRemoveHighlight = () => {
    setHighlightedReportId(null);
    setSelectedReportId(null);
  };

  const renderReportDetail = () => {
    switch (selectedReportId) {
      case "site-monthly-active-users":
        return <SiteMonthlyActiveUsers data={sampleReportsData["site-monthly-active-users"]} />;
      case "monthly-data-usage-summary":
        return <MonthlyDataUsageSummary data={sampleReportsData["monthly-data-usage-summary"]} />;
      case "daily-average-active-users":
        return <DailyAverageActiveUsers data={sampleReportsData["daily-average-active-users"]} />;
      case "policy-wise-monthly-average-active-users":
        return <PolicyWiseMonthlyAverageActiveUsers data={sampleReportsData["policy-wise-monthly-average-active-users"]} />;
      case "network-usage-report":
        return <NetworkUsageReport data={sampleReportsData["network-usage-report"]} chartOptions={getChartConfig("network-usage-report", sampleReportsData["network-usage-report"], darkMode).options} />;
      case "license-usage-report":
        return <LicenseUsageReport data={sampleReportsData["license-usage-report"]} chartOptions={getChartConfig("license-usage-report", sampleReportsData["license-usage-report"], darkMode).options} />;
      case "alerts-summary-report":
        return <AlertsSummaryReport data={sampleReportsData["alerts-summary-report"]} chartOptions={getChartConfig("alerts-summary-report", sampleReportsData["alerts-summary-report"], darkMode).options} />;
      default:
        return <p>Select a report to view</p>;
    }
  };

  const shortcutReports = commonReports.slice(0, 5);

  return (
    <div className="report-dashboard-container" role="region" aria-label="Reports Dashboard">
      <LoadingOverlay 
        active={isLoading('export') || exportingCSV || exportingPDF} 
        message={exportingCSV ? "Preparing CSV..." : "Generating PDF..."}
      />
      <h2>Quick Access</h2>
      <div className="report-shortcuts" role="list">
        {shortcutReports.map((report, idx) => (
          <button
            key={report.id}
            className="report-shortcut-box"
            style={{ backgroundColor: shortcutColors[idx % shortcutColors.length] }}
            onClick={() => handleView(report)}
            aria-label={`Quick access to ${report.name} report`}
          >
            {report.name}
          </button>
        ))}
      </div>


      <h2>All Reports</h2>
      {Object.keys(categorizedReports).length > 0 ? (
        Object.entries(categorizedReports).map(([category, reports]) => (
          <section key={category} className="report-category-section" id={`section-${category}`}>
            <h3>{category} Reports</h3>
            <ReportList
              reports={reports}
              onView={handleView}
              onDownloadCSV={handleDownloadCSV}
              onExportPDF={handleExportPDF}
              selectedReportId={selectedReportId}
              highlightedReportId={highlightedReportId}
              onRemoveHighlight={handleRemoveHighlight}
            />
          </section>
        ))
      ) : (
        <p>No reports found.</p>
      )}

      <div className="report-display-section">{renderReportDetail()}</div>
    </div>
  );
};

export default ReportDashboard;