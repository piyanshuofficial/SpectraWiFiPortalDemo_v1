// src/config/reportDefinitions.js



/**
 * Export canvas sizes for PDF generation
 */
const EXPORT_CANVAS_SIZES = {
  bar: { width: 900, height: 450 },
  line: { width: 900, height: 450 },
  pie: { width: 450, height: 450 },
};

/**
 * Standard chart options generator for consistent styling
 */
const getStandardChartOptions = ({ type, title, xLabel, yLabel, darkMode = false, forExport = false }) => {
  const gridColor = darkMode ? "#444" : "#e5e5e5";
  const textColor = darkMode ? "#fff" : "#222";
  const baseFontSize = forExport ? 20 : 14;
  const titleFontSize = forExport ? 28 : 18;
  const tickFontSize = forExport ? 18 : 12;

  return {
    type,
    responsive: !forExport,
    maintainAspectRatio: !forExport,
    animation: !forExport,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: textColor,
          font: { size: baseFontSize, family: "Helvetica", weight: "bold" },
        },
      },
      title: {
        display: Boolean(title),
        text: title,
        font: { size: titleFontSize, family: "Helvetica", weight: "bold" },
        color: textColor,
      },
    },
    scales: type === "pie" ? undefined : {
      x: {
        display: true,
        title: { display: Boolean(xLabel), text: xLabel, font: { size: baseFontSize } },
        ticks: { color: textColor, font: { size: tickFontSize } },
        grid: { color: gridColor },
      },
      y: {
        display: true,
        title: { display: Boolean(yLabel), text: yLabel, font: { size: baseFontSize } },
        ticks: { color: textColor, font: { size: tickFontSize } },
        grid: { color: gridColor },
        beginAtZero: true,
      },
    },
  };
};

/**
 * Centralized Report Definitions
 * 
 * Each report can have:
 * - chart: Chart configuration { type, canvasSize, getData, getOptions }
 * - csv: CSV export configuration { headers, getRows }
 * - table: Table configuration { columns, getRows }
 */

export const REPORT_DEFINITIONS = {
  "site-monthly-active-users": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => ({
        labels: data.map((d) => d.month),
        datasets: [
          {
            type: "bar",
            label: "New Users",
            backgroundColor: "rgba(33,80,162,0.6)",
            data: data.map((d) => d.newUsers),
            yAxisID: "y",
          },
          {
            type: "bar",
            label: "Churned Users",
            backgroundColor: "rgba(217,83,79,0.6)",
            data: data.map((d) => d.churnedUsers),
            yAxisID: "y",
          },
          {
            type: "line",
            label: "Avg Active Users",
            borderColor: "#004aad",
            borderWidth: 3,
            fill: false,
            data: data.map((d) => d.avgActiveUsers),
            yAxisID: "y1",
            tension: 0.3,
            pointRadius: 4,
          },
        ],
      }),
      getOptions: (reportName) => ({
        ...getStandardChartOptions({
          type: "bar",
          title: reportName,
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
      }),
    },
    csv: {
      headers: ["Month", "Avg Active Users", "New Users", "Churned Users", "Activations", "Deactivations", "Change vs Prev"],
      getRows: (data) => data.map(r => [
        r.month,
        r.avgActiveUsers,
        r.newUsers,
        r.churnedUsers,
        r.activations,
        r.deactivations,
        r.changeFromPrevMonth >= 0 ? `+${r.changeFromPrevMonth}` : `${r.changeFromPrevMonth}`
      ])
    },
    table: {
      columns: ["Month", "Avg Active Users", "New Users", "Churned Users", "Activations", "Deactivations", "Change vs Prev"],
      getRows: (data) => data.map(r => [
        r.month,
        r.avgActiveUsers,
        r.newUsers,
        r.churnedUsers,
        r.activations,
        r.deactivations,
        r.changeFromPrevMonth >= 0 ? `+${r.changeFromPrevMonth}` : `${r.changeFromPrevMonth}`
      ])
    }
  },

  "daily-average-active-users": {
    chart: {
      type: "line",
      canvasSize: EXPORT_CANVAS_SIZES.line,
      getData: (data) => ({
        labels: data.map((d) => d.date),
        datasets: [{
          label: "Avg. Active Users",
          data: data.map((d) => d.avgActiveUsers),
          borderColor: "#2150a2",
          backgroundColor: "rgba(33, 80, 162, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          borderWidth: 2,
        }],
      }),
      getOptions: (reportName) => getStandardChartOptions({
        type: "line",
        title: reportName,
        xLabel: "Date",
        yLabel: "Users",
        darkMode: false,
        forExport: true,
      }),
    },
    csv: {
      headers: ["Date", "Avg Active Users"],
      getRows: (data) => data.map(r => [r.date, r.avgActiveUsers])
    },
    table: {
      columns: ["Date", "Avg Active Users"],
      getRows: (data) => data.map(r => [r.date, r.avgActiveUsers])
    }
  },

  "policy-wise-monthly-average-active-users": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        const uniquePolicies = [...new Set(data.map(d => d.policy))];
        const months = [...new Set(data.map(d => d.month))];
        const datasets = uniquePolicies.map((policy, idx) => ({
          label: policy,
          data: months.map(month => {
            const record = data.find(d => d.month === month && d.policy === policy);
            return record ? record.avgActiveUsers : 0;
          }),
          backgroundColor: idx % 2 === 0 ? "rgba(33, 80, 162, 0.7)" : "rgba(49, 120, 115, 0.7)"
        }));
        return {
          labels: months,
          datasets: datasets,
        };
      },
      getOptions: (reportName) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: reportName },
          legend: { position: "top" },
        },
        scales: {
          x: { stacked: true, title: { display: true, text: "Month" } },
          y: { stacked: true, beginAtZero: true, title: { display: true, text: "Avg Active Users" } }
        }
      }),
    },
    csv: {
      headers: ["Month", "Policy", "Avg Active Users"],
      getRows: (data) => data.map(r => [r.month, r.policy, r.avgActiveUsers])
    },
    table: {
      columns: ["Month", "Policy", "Avg Active Users"],
      getRows: (data) => data.map(r => [r.month, r.policy, r.avgActiveUsers])
    }
  },

  "monthly-data-usage-summary": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => ({
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "Total Usage (GB)",
            backgroundColor: "rgba(33,80,162,0.6)",
            data: data.map((d) => d.totalUsageGB),
          },
          {
            label: "Peak Usage (GB)",
            backgroundColor: "rgba(217,83,79,0.6)",
            data: data.map((d) => d.peakUsageGB),
          },
        ],
      }),
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Month",
        yLabel: "Usage (GB)",
        darkMode: false,
        forExport: true,
      }),
    },
    csv: {
      headers: ["Month", "Total Usage (GB)", "Peak Usage (GB)", "Avg Usage (GB)"],
      getRows: (data) => data.map(r => [r.month, r.totalUsageGB, r.peakUsageGB, r.avgUsageGB])
    },
    table: {
      columns: ["Month", "Total Usage (GB)", "Peak Usage (GB)", "Avg Usage (GB)"],
      getRows: (data) => data.map(r => [r.month, r.totalUsageGB, r.peakUsageGB, r.avgUsageGB])
    }
  },

  "network-usage-report": {
    chart: {
      type: "line",
      canvasSize: EXPORT_CANVAS_SIZES.line,
      getData: (data) => ({
        labels: data.map((d) => d.day),
        datasets: [
          {
            label: "Network Usage (GB)",
            data: data.map((d) => d.usageGB),
            borderColor: "#004aad",
            backgroundColor: "rgba(0,74,173,0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      }),
      getOptions: (reportName) => getStandardChartOptions({
        type: "line",
        title: reportName,
        xLabel: "Day",
        yLabel: "Usage (GB)",
        darkMode: false,
        forExport: true,
      }),
    },
    csv: {
      headers: ["Day", "Network Usage (GB)"],
      getRows: (data) => data.map(r => [r.day, r.usageGB])
    },
    table: {
      columns: ["Day", "Network Usage (GB)"],
      getRows: (data) => data.map(r => [r.day, r.usageGB])
    }
  },

  "license-usage-report": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => ({
        labels: data.map((d) => d.licenseType),
        datasets: [{
          label: "License Usage",
          data: data.map((d) => d.usageCount),
          backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
          borderWidth: 1,
        }],
      }),
      getOptions: (reportName) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: reportName },
          legend: { position: "top" },
        },
        scales: {
          x: { title: { display: true, text: "License" } },
          y: { title: { display: true, text: "Usage" }, beginAtZero: true },
        },
      }),
    },
    csv: {
      headers: ["License", "Usage"],
      getRows: (data) => data.map(r => [r.licenseType, r.usageCount])
    },
    table: {
      columns: ["License", "Usage"],
      getRows: (data) => data.map(r => [r.licenseType, r.usageCount])
    }
  },

  "alerts-summary-report": {
    chart: {
      type: "pie",
      canvasSize: EXPORT_CANVAS_SIZES.pie,
      getData: (data) => ({
        labels: data.map((a) => a.alertType),
        datasets: [{
          label: "Alerts",
          data: data.map((a) => a.count),
          backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
        }],
      }),
      getOptions: (reportName) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: reportName },
          legend: { position: "top" },
        },
      }),
    },
    csv: {
      headers: ["Alert Type", "Count"],
      getRows: (data) => data.map(r => [r.alertType, r.count])
    },
    table: {
      columns: ["Alert Type", "Count"],
      getRows: (data) => data.map(r => [r.alertType, r.count])
    }
  },
};

/**
 * Get report definition by ID
 */
export const getReportDefinition = (reportId) => {
  return REPORT_DEFINITIONS[reportId] || null;
};

/**
 * Check if report has custom component
 */
export const hasCustomComponent = (reportId) => {
  return REPORT_DEFINITIONS[reportId]?.component !== undefined;
};

/**
 * Get CSV configuration for report
 */
export const getCSVConfig = (reportId) => {
  const definition = REPORT_DEFINITIONS[reportId];
  return definition?.csv || null;
};

/**
 * Get chart configuration for report
 */
export const getChartConfig = (reportId) => {
  const definition = REPORT_DEFINITIONS[reportId];
  return definition?.chart || null;
};

/**
 * Get table configuration for report
 */
export const getTableConfig = (reportId) => {
  const definition = REPORT_DEFINITIONS[reportId];
  return definition?.table || null;
};