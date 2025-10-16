// src/utils/chartConfigs.js

export const getNetworkUsageChartConfig = (data) => ({
  type: "line",
  data: {
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
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } },
    },
    scales: {
      x: { title: { display: true, text: "Day" } },
      y: { title: { display: true, text: "Usage (GB)" }, beginAtZero: true },
    },
  },
});

export const getLicenseUsageChartConfig = (data) => ({
  type: "bar",
  data: {
    labels: data.map((d) => d.licenseType),
    datasets: [
      {
        label: "License Usage",
        data: data.map((d) => d.usageCount),
        backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});

export const getAlertsSummaryChartConfig = (data) => ({
  type: "pie",
  data: {
    labels: data.map((d) => d.alertType),
    datasets: [
      {
        label: "Alerts",
        data: data.map((d) => d.count),
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});

