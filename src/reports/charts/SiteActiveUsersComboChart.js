// src/reports/charts/SiteActiveUsersComboChart.js

import React from "react";
import { Bar, Line } from "react-chartjs-2";

const SiteActiveUsersComboChart = ({ data }) => {
  const chartData = {
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
  };

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    stacked: false,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
      },
    },
  };

  return <>{<Bar data={chartData} options={options} />}</>;
};

export default SiteActiveUsersComboChart;
