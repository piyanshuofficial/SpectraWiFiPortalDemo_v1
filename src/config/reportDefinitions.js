// src/config/reportDefinitions.js

/**
 * Segment Constants
 * These should match SEGMENTS from SegmentContext
 */
const ALL_SEGMENTS = ["enterprise", "coLiving", "coWorking", "hotel", "pg", "miscellaneous"];

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
 * - segments: Array of segment IDs this report applies to (default: ALL_SEGMENTS)
 * - chart: Chart configuration
 * - table: Table configuration
 * - csv: CSV export configuration
 */
export const REPORT_DEFINITIONS = {
  "site-monthly-active-users": {
    segments: ALL_SEGMENTS, // Available for all segments
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
        const policyColors = [
          "rgba(33, 80, 162, 0.7)",
          "rgba(49, 120, 115, 0.7)",
          "rgba(76, 175, 80, 0.7)",
          "rgba(255, 152, 0, 0.7)"
        ];
        const datasets = uniquePolicies.map((policy, idx) => ({
          label: policy,
          data: months.map(month => {
            const record = data.find(d => d.month === month && d.policy === policy);
            return record ? record.avgActiveUsers : 0;
          }),
          backgroundColor: policyColors[idx % policyColors.length]
        }));
        return {
          labels: months,
          datasets: datasets,
        };
      },
      getOptions: (reportName) => {
        const baseOptions = getStandardChartOptions({
          type: "bar",
          title: reportName,
          xLabel: "Month",
          yLabel: "Avg Active Users",
          darkMode: false,
          forExport: true
        });

        // Override to add stacked configuration
        return {
          ...baseOptions,
          scales: {
            ...baseOptions.scales,
            x: {
              ...baseOptions.scales.x,
              stacked: true
            },
            y: {
              ...baseOptions.scales.y,
              stacked: true
            }
          }
        };
      },
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

  "speed-tier-report": {
    segments: ALL_SEGMENTS, // Available for all segments
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => ({
        labels: data.map((d) => d.speedTier),
        datasets: [{
          label: "User Count",
          data: data.map((d) => d.userCount),
          backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
          borderWidth: 1,
        }],
      }),
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Speed Tier",
        yLabel: "User Count",
        darkMode: false,
        forExport: true
      }),
    },
    csv: {
      headers: ["Speed Tier", "User Count"],
      getRows: (data) => data.map(r => [r.speedTier, r.userCount])
    },
    table: {
      columns: ["Speed Tier", "User Count"],
      getRows: (data) => data.map(r => [r.speedTier, r.userCount])
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
      getOptions: (reportName) => getStandardChartOptions({
        type: "pie",
        title: reportName,
        darkMode: false,
        forExport: true
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

  // USER REPORTS
  "user-session-history": {
    table: {
      columns: ["User ID", "Session Start", "Session End", "Data Used", "Duration"],
      getRows: (data) => data.map(r => [r.userId, r.sessionStart, r.sessionEnd, r.dataUsed, r.duration])
    },
    csv: {
      headers: ["User ID", "Session Start", "Session End", "Data Used", "Duration"],
      getRows: (data) => data.map(r => [r.userId, r.sessionStart, r.sessionEnd, r.dataUsed, r.duration])
    }
  },

  "user-data-consumption": {
    chart: {
      type: "line",
      canvasSize: EXPORT_CANVAS_SIZES.line,
      getData: (data) => {
        // Aggregate by date
        const dateMap = {};
        data.forEach(item => {
          if (!dateMap[item.date]) {
            dateMap[item.date] = 0;
          }
          dateMap[item.date] += item.dataUsedMB;
        });
        const dates = Object.keys(dateMap).sort();
        return {
          labels: dates,
          datasets: [{
            label: "Data Consumption (MB)",
            data: dates.map(date => dateMap[date]),
            borderColor: "#2150a2",
            backgroundColor: "rgba(33, 80, 162, 0.1)",
            fill: true,
            tension: 0.4
          }]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "line",
        title: reportName,
        xLabel: "Date",
        yLabel: "Data (MB)",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["User ID", "Date", "Data Used (MB)", "Sessions"],
      getRows: (data) => data.map(r => [r.userId, r.date, r.dataUsedMB, r.sessions])
    },
    csv: {
      headers: ["User ID", "Date", "Data Used (MB)", "Sessions"],
      getRows: (data) => data.map(r => [r.userId, r.date, r.dataUsedMB, r.sessions])
    }
  },

  // NETWORK INFRASTRUCTURE REPORTS
  "access-point-list": {
    table: {
      columns: ["AP Name", "MAC Address", "Location", "Status", "Connected Users"],
      getRows: (data) => data.map(r => [r.apName, r.mac, r.location, r.status, r.connectedUsers])
    },
    csv: {
      headers: ["AP Name", "MAC Address", "Location", "Status", "Connected Users"],
      getRows: (data) => data.map(r => [r.apName, r.mac, r.location, r.status, r.connectedUsers])
    }
  },

  "access-point-mac-list": {
    table: {
      columns: ["MAC Address", "AP Name", "Vendor"],
      getRows: (data) => data.map(r => [r.mac, r.apName, r.vendor])
    },
    csv: {
      headers: ["MAC Address", "AP Name", "Vendor"],
      getRows: (data) => data.map(r => [r.mac, r.apName, r.vendor])
    }
  },

  "client-list": {
    table: {
      columns: ["Client MAC", "User Name", "AP Name", "Signal Strength", "Connected Time"],
      getRows: (data) => data.map(r => [r.clientMac, r.userName, r.apName, r.signalStrength, r.connectedTime])
    },
    csv: {
      headers: ["Client MAC", "User Name", "AP Name", "Signal Strength", "Connected Time"],
      getRows: (data) => data.map(r => [r.clientMac, r.userName, r.apName, r.signalStrength, r.connectedTime])
    }
  },

  "user-ap-analytics": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => ({
        labels: data.map(d => d.apName),
        datasets: [{
          label: "Unique Users",
          data: data.map(d => d.uniqueUsers),
          backgroundColor: "rgba(33,80,162,0.6)"
        }]
      }),
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Access Point",
        yLabel: "Unique Users",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["AP Name", "Unique Users", "Total Sessions", "Avg Session Time"],
      getRows: (data) => data.map(r => [r.apName, r.uniqueUsers, r.totalSessions, r.avgSessionTime])
    },
    csv: {
      headers: ["AP Name", "Unique Users", "Total Sessions", "Avg Session Time"],
      getRows: (data) => data.map(r => [r.apName, r.uniqueUsers, r.totalSessions, r.avgSessionTime])
    }
  },

  "rogue-ap-list": {
    table: {
      columns: ["MAC Address", "SSID", "Detected Time", "Signal Strength", "Threat Level"],
      getRows: (data) => data.map(r => [r.mac, r.ssid, r.detectedTime, r.signalStrength, r.threat])
    },
    csv: {
      headers: ["MAC Address", "SSID", "Detected Time", "Signal Strength", "Threat Level"],
      getRows: (data) => data.map(r => [r.mac, r.ssid, r.detectedTime, r.signalStrength, r.threat])
    }
  },

  "alarm-list": {
    table: {
      columns: ["Timestamp", "Severity", "Message", "Affected Device", "Status"],
      getRows: (data) => data.map(r => [r.timestamp, r.severity, r.message, r.affectedDevice, r.status])
    },
    csv: {
      headers: ["Timestamp", "Severity", "Message", "Affected Device", "Status"],
      getRows: (data) => data.map(r => [r.timestamp, r.severity, r.message, r.affectedDevice, r.status])
    }
  },

  "event-list": {
    table: {
      columns: ["Timestamp", "Event Type", "User", "Device", "Details"],
      getRows: (data) => data.map(r => [r.timestamp, r.eventType, r.user, r.device, r.details])
    },
    csv: {
      headers: ["Timestamp", "Event Type", "User", "Device", "Details"],
      getRows: (data) => data.map(r => [r.timestamp, r.eventType, r.user, r.device, r.details])
    }
  },

  // INTERNET REPORTS
  "bandwidth-utilization": {
    chart: {
      type: "line",
      canvasSize: EXPORT_CANVAS_SIZES.line,
      getData: (data) => ({
        labels: data.map(d => d.timestamp),
        datasets: [
          {
            label: "Download (Mbps)",
            data: data.map(d => d.downloadMbps),
            borderColor: "#2150a2",
            backgroundColor: "rgba(33, 80, 162, 0.1)",
            fill: false
          },
          {
            label: "Upload (Mbps)",
            data: data.map(d => d.uploadMbps),
            borderColor: "#d9534f",
            backgroundColor: "rgba(217, 83, 79, 0.1)",
            fill: false
          }
        ]
      }),
      getOptions: (reportName) => getStandardChartOptions({
        type: "line",
        title: reportName,
        xLabel: "Time",
        yLabel: "Speed (Mbps)",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Timestamp", "Upload (Mbps)", "Download (Mbps)", "Utilization"],
      getRows: (data) => data.map(r => [r.timestamp, r.uploadMbps, r.downloadMbps, r.utilization])
    },
    csv: {
      headers: ["Timestamp", "Upload (Mbps)", "Download (Mbps)", "Utilization"],
      getRows: (data) => data.map(r => [r.timestamp, r.uploadMbps, r.downloadMbps, r.utilization])
    }
  },

  "internet-uptime": {
    chart: {
      type: "line",
      canvasSize: EXPORT_CANVAS_SIZES.line,
      getData: (data) => ({
        labels: data.map(d => d.date),
        datasets: [{
          label: "Uptime %",
          data: data.map(d => d.uptimePercent),
          borderColor: "#5cb85c",
          backgroundColor: "rgba(92, 184, 92, 0.1)",
          fill: true,
          tension: 0.3
        }]
      }),
      getOptions: (reportName) => getStandardChartOptions({
        type: "line",
        title: reportName,
        xLabel: "Date",
        yLabel: "Uptime (%)",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Date", "Uptime %", "Outages", "Total Downtime"],
      getRows: (data) => data.map(r => [r.date, r.uptimePercent, r.outages, r.totalDowntime])
    },
    csv: {
      headers: ["Date", "Uptime %", "Outages", "Total Downtime"],
      getRows: (data) => data.map(r => [r.date, r.uptimePercent, r.outages, r.totalDowntime])
    }
  },

  // SLA REPORTS
  "sla-compliance": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        // Group by month and metric
        const latestMonth = data.reduce((max, item) =>
          item.month > max ? item.month : max, data[0]?.month || '');
        const latestData = data.filter(item => item.month === latestMonth);

        return {
          labels: latestData.map(d => d.metric),
          datasets: [
            {
              label: "Target",
              data: latestData.map(d => d.target),
              backgroundColor: "rgba(149, 165, 166, 0.6)"
            },
            {
              label: "Actual",
              data: latestData.map(d => d.actual),
              backgroundColor: "rgba(33, 80, 162, 0.6)"
            }
          ]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Metric",
        yLabel: "Value",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Month", "Metric", "Target", "Actual", "Compliance"],
      getRows: (data) => data.map(r => [r.month, r.metric, r.target, r.actual, r.compliance])
    },
    csv: {
      headers: ["Month", "Metric", "Target", "Actual", "Compliance"],
      getRows: (data) => data.map(r => [r.month, r.metric, r.target, r.actual, r.compliance])
    }
  },

  // AUTHENTICATION REPORTS
  "authentication-logs": {
    table: {
      columns: ["Timestamp", "User ID", "Method", "Result", "IP Address"],
      getRows: (data) => data.map(r => [r.timestamp, r.userId, r.method, r.result, r.ipAddress])
    },
    csv: {
      headers: ["Timestamp", "User ID", "Method", "Result", "IP Address"],
      getRows: (data) => data.map(r => [r.timestamp, r.userId, r.method, r.result, r.ipAddress])
    }
  },

  "failed-authentication": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        // Group by reason
        const reasonCount = {};
        data.forEach(item => {
          reasonCount[item.reason] = (reasonCount[item.reason] || 0) + 1;
        });
        return {
          labels: Object.keys(reasonCount),
          datasets: [{
            label: "Failed Attempts",
            data: Object.values(reasonCount),
            backgroundColor: "rgba(217, 83, 79, 0.6)"
          }]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Failure Reason",
        yLabel: "Count",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Timestamp", "User ID", "Attempt Count", "IP Address", "Reason"],
      getRows: (data) => data.map(r => [r.timestamp, r.userId, r.attemptCount, r.ipAddress, r.reason])
    },
    csv: {
      headers: ["Timestamp", "User ID", "Attempt Count", "IP Address", "Reason"],
      getRows: (data) => data.map(r => [r.timestamp, r.userId, r.attemptCount, r.ipAddress, r.reason])
    }
  },

  // UPSELL REPORTS
  "addon-usage-report": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        // Aggregate by addon name
        const addonMap = {};
        data.forEach(item => {
          if (!addonMap[item.addonName]) {
            addonMap[item.addonName] = { users: 0, revenue: 0 };
          }
          addonMap[item.addonName].users += item.users;
          addonMap[item.addonName].revenue += item.revenue;
        });
        const addons = Object.keys(addonMap);
        return {
          labels: addons,
          datasets: [{
            label: "Total Users",
            data: addons.map(name => addonMap[name].users),
            backgroundColor: "rgba(33, 80, 162, 0.6)"
          }]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Add-on",
        yLabel: "Users",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Month", "Add-on Name", "Users", "Revenue", "Purchase Date"],
      getRows: (data) => data.map(r => [r.month, r.addonName, r.users, r.revenue, r.purchaseDate])
    },
    csv: {
      headers: ["Month", "Add-on Name", "Users", "Revenue", "Purchase Date"],
      getRows: (data) => data.map(r => [r.month, r.addonName, r.users, r.revenue, r.purchaseDate])
    }
  },

  "topup-history": {
    chart: {
      type: "line",
      canvasSize: EXPORT_CANVAS_SIZES.line,
      getData: (data) => {
        // Aggregate by date
        const dateMap = {};
        data.forEach(item => {
          if (!dateMap[item.purchaseDate]) {
            dateMap[item.purchaseDate] = 0;
          }
          dateMap[item.purchaseDate] += item.topupAmount;
        });
        const dates = Object.keys(dateMap).sort();
        return {
          labels: dates,
          datasets: [{
            label: "Total Top-ups",
            data: dates.map(date => dateMap[date]),
            borderColor: "#5cb85c",
            backgroundColor: "rgba(92, 184, 92, 0.1)",
            fill: true,
            tension: 0.3
          }]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "line",
        title: reportName,
        xLabel: "Date",
        yLabel: "Amount",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["User ID", "Top-up Amount", "Purchase Date", "Remaining"],
      getRows: (data) => data.map(r => [r.userId, r.topupAmount, r.purchaseDate, r.remaining])
    },
    csv: {
      headers: ["User ID", "Top-up Amount", "Purchase Date", "Remaining"],
      getRows: (data) => data.map(r => [r.userId, r.topupAmount, r.purchaseDate, r.remaining])
    }
  },
};

/**
 * Get report definition by ID
 */
export function getReportDefinition(reportId) {
  return REPORT_DEFINITIONS[reportId] || null;
}

/**
 * Check if report has custom component
 */
export function hasCustomComponent(reportId) {
  return REPORT_DEFINITIONS[reportId]?.component !== undefined;
}

/**
 * Get CSV configuration for report
 */
export function getCSVConfig(reportId) {
  const definition = REPORT_DEFINITIONS[reportId];
  return definition?.csv || null;
}

/**
 * Get chart configuration for report
 */
export function getChartConfig(reportId) {
  const definition = REPORT_DEFINITIONS[reportId];
  return definition?.chart || null;
}

/**
 * Get table configuration for report
 */
export function getTableConfig(reportId) {
  const definition = REPORT_DEFINITIONS[reportId];
  return definition?.table || null;
}

/**
 * Check if report is available for the given segment
 */
export function isReportAvailableForSegment(reportId, segment) {
  const definition = REPORT_DEFINITIONS[reportId];
  if (!definition) return false;

  // If no segments specified, available for all
  if (!definition.segments) return true;

  return definition.segments.includes(segment);
}

/**
 * Get all reports available for a segment
 */
export function getReportsForSegment(segment) {
  return Object.keys(REPORT_DEFINITIONS).filter(reportId =>
    isReportAvailableForSegment(reportId, segment)
  );
}