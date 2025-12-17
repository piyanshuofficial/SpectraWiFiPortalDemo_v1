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

  // ============================================
  // GUEST ACCESS REPORTS
  // ============================================
  "guest-access-summary": {
    chart: {
      type: "line",
      canvasSize: EXPORT_CANVAS_SIZES.line,
      getData: (data) => ({
        labels: data.map(d => d.date),
        datasets: [
          {
            label: "Total Guests",
            data: data.map(d => d.totalGuests),
            borderColor: "#2150a2",
            backgroundColor: "rgba(33, 80, 162, 0.1)",
            fill: false,
            tension: 0.3
          },
          {
            label: "Active Guests",
            data: data.map(d => d.activeGuests),
            borderColor: "#5cb85c",
            backgroundColor: "rgba(92, 184, 92, 0.1)",
            fill: false,
            tension: 0.3
          }
        ]
      }),
      getOptions: (reportName) => getStandardChartOptions({
        type: "line",
        title: reportName,
        xLabel: "Date",
        yLabel: "Guests",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Date", "Total Guests", "Active Guests", "Checked In", "Checked Out", "Data Used"],
      getRows: (data) => data.map(r => [r.date, r.totalGuests, r.activeGuests, r.checkedIn, r.checkedOut, r.dataUsed])
    },
    csv: {
      headers: ["Date", "Total Guests", "Active Guests", "Checked In", "Checked Out", "Data Used"],
      getRows: (data) => data.map(r => [r.date, r.totalGuests, r.activeGuests, r.checkedIn, r.checkedOut, r.dataUsed])
    }
  },

  "guest-activity-log": {
    table: {
      columns: ["Timestamp", "Guest Name", "Action", "Performed By", "Details"],
      getRows: (data) => data.map(r => [r.timestamp, r.guestName, r.action, r.performedBy, r.details])
    },
    csv: {
      headers: ["Timestamp", "Guest Name", "Action", "Performed By", "Details"],
      getRows: (data) => data.map(r => [r.timestamp, r.guestName, r.action, r.performedBy, r.details])
    }
  },

  "guest-voucher-report": {
    chart: {
      type: "pie",
      canvasSize: EXPORT_CANVAS_SIZES.pie,
      getData: (data) => {
        const statusCount = { Active: 0, Redeemed: 0, Expired: 0 };
        data.forEach(item => {
          if (statusCount[item.status] !== undefined) {
            statusCount[item.status]++;
          }
        });
        return {
          labels: Object.keys(statusCount),
          datasets: [{
            data: Object.values(statusCount),
            backgroundColor: ["#5cb85c", "#2150a2", "#d9534f"]
          }]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "pie",
        title: reportName,
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Voucher Code", "Status", "Guest Type", "Created By", "Redeemed By", "Validity (hrs)", "Created Date"],
      getRows: (data) => data.map(r => [r.voucherCode, r.status, r.guestType, r.createdBy, r.redeemedBy, r.validityHours, r.createdDate])
    },
    csv: {
      headers: ["Voucher Code", "Status", "Guest Type", "Created By", "Redeemed By", "Validity (hrs)", "Created Date"],
      getRows: (data) => data.map(r => [r.voucherCode, r.status, r.guestType, r.createdBy, r.redeemedBy, r.validityHours, r.createdDate])
    }
  },

  "guest-type-breakdown": {
    chart: {
      type: "pie",
      canvasSize: EXPORT_CANVAS_SIZES.pie,
      getData: (data) => ({
        labels: data.map(d => d.guestType),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: ["#2150a2", "#3f51b5", "#7986cb", "#c5cae9", "#e8eaf6"]
        }]
      }),
      getOptions: (reportName) => getStandardChartOptions({
        type: "pie",
        title: reportName,
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Month", "Guest Type", "Count", "Percentage", "Avg Duration", "Data Used"],
      getRows: (data) => data.map(r => [r.month, r.guestType, r.count, r.percentage, r.avgDuration, r.dataUsed])
    },
    csv: {
      headers: ["Month", "Guest Type", "Count", "Percentage", "Avg Duration", "Data Used"],
      getRows: (data) => data.map(r => [r.month, r.guestType, r.count, r.percentage, r.avgDuration, r.dataUsed])
    }
  },

  "guest-data-usage": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        // Aggregate by guest type
        const typeMap = {};
        data.forEach(item => {
          const usage = parseFloat(item.dataUsed);
          if (!typeMap[item.guestType]) {
            typeMap[item.guestType] = 0;
          }
          typeMap[item.guestType] += usage;
        });
        return {
          labels: Object.keys(typeMap),
          datasets: [{
            label: "Data Usage (GB)",
            data: Object.values(typeMap).map(v => v.toFixed(2)),
            backgroundColor: "rgba(33, 80, 162, 0.6)"
          }]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Guest Type",
        yLabel: "Data Usage (GB)",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Guest ID", "Guest Name", "Guest Type", "Date", "Data Used", "Sessions", "Avg Session"],
      getRows: (data) => data.map(r => [r.guestId, r.guestName, r.guestType, r.date, r.dataUsed, r.sessions, r.avgSession])
    },
    csv: {
      headers: ["Guest ID", "Guest Name", "Guest Type", "Date", "Data Used", "Sessions", "Avg Session"],
      getRows: (data) => data.map(r => [r.guestId, r.guestName, r.guestType, r.date, r.dataUsed, r.sessions, r.avgSession])
    }
  },

  // ============================================
  // COMPANY-LEVEL REPORTS
  // ============================================
  "company-overview-dashboard": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        const sites = data.sites || [];
        return {
          labels: sites.map(s => s.siteName),
          datasets: [{
            label: "Users",
            data: sites.map(s => s.users),
            backgroundColor: "rgba(33, 80, 162, 0.6)"
          }]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Site",
        yLabel: "Users",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Site Name", "Site ID", "Users", "Devices", "Bandwidth"],
      getRows: (data) => {
        const sites = data.sites || [];
        return sites.map(r => [r.siteName, r.siteId, r.users, r.devices, r.bandwidth]);
      }
    },
    csv: {
      headers: ["Site Name", "Site ID", "Users", "Devices", "Bandwidth"],
      getRows: (data) => {
        const sites = data.sites || [];
        return sites.map(r => [r.siteName, r.siteId, r.users, r.devices, r.bandwidth]);
      }
    }
  },

  "cross-site-usage-comparison": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        const latestMonth = [...new Set(data.map(d => d.month))].sort().pop();
        const latestData = data.filter(d => d.month === latestMonth);
        return {
          labels: latestData.map(d => d.siteName),
          datasets: [{
            label: "Total Users",
            data: latestData.map(d => d.totalUsers),
            backgroundColor: "rgba(33, 80, 162, 0.6)"
          }]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Site",
        yLabel: "Users",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Month", "Site Name", "Total Users", "Avg Bandwidth", "Data Usage"],
      getRows: (data) => data.map(r => [r.month, r.siteName, r.totalUsers, r.avgBandwidth, r.dataUsage])
    },
    csv: {
      headers: ["Month", "Site Name", "Total Users", "Avg Bandwidth", "Data Usage"],
      getRows: (data) => data.map(r => [r.month, r.siteName, r.totalUsers, r.avgBandwidth, r.dataUsage])
    }
  },

  "consolidated-billing-report": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        const latestMonth = [...new Set(data.map(d => d.month))].sort().pop();
        const latestData = data.filter(d => d.month === latestMonth);
        return {
          labels: latestData.map(d => d.siteName),
          datasets: [{
            label: "Active Users",
            data: latestData.map(d => d.activeUsers),
            backgroundColor: "rgba(33, 80, 162, 0.6)"
          }]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Site",
        yLabel: "Active Users",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Month", "Site Name", "Active Users", "Billed Amount", "Due Date"],
      getRows: (data) => data.map(r => [r.month, r.siteName, r.activeUsers, r.billedAmount, r.dueDate])
    },
    csv: {
      headers: ["Month", "Site Name", "Active Users", "Billed Amount", "Due Date"],
      getRows: (data) => data.map(r => [r.month, r.siteName, r.activeUsers, r.billedAmount, r.dueDate])
    }
  },

  "company-license-utilization": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => ({
        labels: data.map(d => d.siteName),
        datasets: [
          {
            label: "Used Licenses",
            data: data.map(d => d.usedLicenses),
            backgroundColor: "rgba(33, 80, 162, 0.6)"
          },
          {
            label: "Available Licenses",
            data: data.map(d => d.availableLicenses),
            backgroundColor: "rgba(149, 165, 166, 0.6)"
          }
        ]
      }),
      getOptions: (reportName) => {
        const baseOptions = getStandardChartOptions({
          type: "bar",
          title: reportName,
          xLabel: "Site",
          yLabel: "Licenses",
          darkMode: false,
          forExport: true
        });
        return {
          ...baseOptions,
          scales: {
            ...baseOptions.scales,
            x: { ...baseOptions.scales.x, stacked: true },
            y: { ...baseOptions.scales.y, stacked: true }
          }
        };
      }
    },
    table: {
      columns: ["Site Name", "Allocated Licenses", "Used Licenses", "Available Licenses", "Utilization Rate"],
      getRows: (data) => data.map(r => [r.siteName, r.allocatedLicenses, r.usedLicenses, r.availableLicenses, r.utilizationRate])
    },
    csv: {
      headers: ["Site Name", "Allocated Licenses", "Used Licenses", "Available Licenses", "Utilization Rate"],
      getRows: (data) => data.map(r => [r.siteName, r.allocatedLicenses, r.usedLicenses, r.availableLicenses, r.utilizationRate])
    }
  },

  "company-user-distribution": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        const latestMonth = [...new Set(data.map(d => d.month))].sort().pop();
        const latestData = data.filter(d => d.month === latestMonth);
        return {
          labels: latestData.map(d => d.siteName),
          datasets: [
            {
              label: "Active Users",
              data: latestData.map(d => d.activeUsers),
              backgroundColor: "rgba(92, 184, 92, 0.6)"
            },
            {
              label: "Suspended Users",
              data: latestData.map(d => d.suspendedUsers),
              backgroundColor: "rgba(217, 83, 79, 0.6)"
            },
            {
              label: "New Users",
              data: latestData.map(d => d.newUsers),
              backgroundColor: "rgba(33, 80, 162, 0.6)"
            }
          ]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Site",
        yLabel: "Users",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Month", "Site Name", "Active Users", "Suspended Users", "New Users"],
      getRows: (data) => data.map(r => [r.month, r.siteName, r.activeUsers, r.suspendedUsers, r.newUsers])
    },
    csv: {
      headers: ["Month", "Site Name", "Active Users", "Suspended Users", "New Users"],
      getRows: (data) => data.map(r => [r.month, r.siteName, r.activeUsers, r.suspendedUsers, r.newUsers])
    }
  },

  "company-alerts-summary": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        // Aggregate by site
        const siteMap = {};
        data.forEach(item => {
          if (!siteMap[item.siteName]) {
            siteMap[item.siteName] = { critical: 0, warning: 0, resolved: 0 };
          }
          siteMap[item.siteName].critical += item.criticalAlerts;
          siteMap[item.siteName].warning += item.warningAlerts;
          siteMap[item.siteName].resolved += item.resolvedAlerts;
        });
        const sites = Object.keys(siteMap);
        return {
          labels: sites,
          datasets: [
            {
              label: "Critical",
              data: sites.map(s => siteMap[s].critical),
              backgroundColor: "rgba(217, 83, 79, 0.6)"
            },
            {
              label: "Warning",
              data: sites.map(s => siteMap[s].warning),
              backgroundColor: "rgba(255, 152, 0, 0.6)"
            },
            {
              label: "Resolved",
              data: sites.map(s => siteMap[s].resolved),
              backgroundColor: "rgba(92, 184, 92, 0.6)"
            }
          ]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Site",
        yLabel: "Alert Count",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Date", "Site Name", "Critical Alerts", "Warning Alerts", "Resolved Alerts"],
      getRows: (data) => data.map(r => [r.date, r.siteName, r.criticalAlerts, r.warningAlerts, r.resolvedAlerts])
    },
    csv: {
      headers: ["Date", "Site Name", "Critical Alerts", "Warning Alerts", "Resolved Alerts"],
      getRows: (data) => data.map(r => [r.date, r.siteName, r.criticalAlerts, r.warningAlerts, r.resolvedAlerts])
    }
  },

  "company-guest-overview": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => {
        // Aggregate by site
        const siteMap = {};
        data.forEach(item => {
          if (!siteMap[item.siteName]) {
            siteMap[item.siteName] = { total: 0, active: 0 };
          }
          siteMap[item.siteName].total += item.totalGuests;
          siteMap[item.siteName].active += item.activeGuests;
        });
        const sites = Object.keys(siteMap);
        return {
          labels: sites,
          datasets: [
            {
              label: "Total Guests",
              data: sites.map(s => siteMap[s].total),
              backgroundColor: "rgba(33, 80, 162, 0.6)"
            },
            {
              label: "Active Guests",
              data: sites.map(s => siteMap[s].active),
              backgroundColor: "rgba(92, 184, 92, 0.6)"
            }
          ]
        };
      },
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Site",
        yLabel: "Guests",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Date", "Site Name", "Total Guests", "Active Guests", "Checked In Today", "Data Used"],
      getRows: (data) => data.map(r => [r.date, r.siteName, r.totalGuests, r.activeGuests, r.checkedInToday, r.dataUsed])
    },
    csv: {
      headers: ["Date", "Site Name", "Total Guests", "Active Guests", "Checked In Today", "Data Used"],
      getRows: (data) => data.map(r => [r.date, r.siteName, r.totalGuests, r.activeGuests, r.checkedInToday, r.dataUsed])
    }
  },

  "company-guest-comparison": {
    chart: {
      type: "bar",
      canvasSize: EXPORT_CANVAS_SIZES.bar,
      getData: (data) => ({
        labels: data.map(d => d.siteName),
        datasets: [{
          label: "Guests This Month",
          data: data.map(d => d.guestsThisMonth),
          backgroundColor: "rgba(33, 80, 162, 0.6)"
        }]
      }),
      getOptions: (reportName) => getStandardChartOptions({
        type: "bar",
        title: reportName,
        xLabel: "Site",
        yLabel: "Guest Count",
        darkMode: false,
        forExport: true
      })
    },
    table: {
      columns: ["Month", "Site Name", "Guests This Month", "Avg Duration", "Peak Day", "Top Guest Type"],
      getRows: (data) => data.map(r => [r.month, r.siteName, r.guestsThisMonth, r.avgDuration, r.peakDay, r.topGuestType])
    },
    csv: {
      headers: ["Month", "Site Name", "Guests This Month", "Avg Duration", "Peak Day", "Top Guest Type"],
      getRows: (data) => data.map(r => [r.month, r.siteName, r.guestsThisMonth, r.avgDuration, r.peakDay, r.topGuestType])
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