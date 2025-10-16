// src/reports/charts/DailyAverageActiveUsersChart.js

import React from "react";
import { Line } from "react-chartjs-2";

const DailyAverageActiveUsersChart = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Avg. Active Users",
        data: data.map((d) => d.avgActiveUsers),
        borderColor: "#2150a2",
        backgroundColor: "rgba(33, 80, 162, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Users" }, beginAtZero: true },
    },
  };

  return <>{<Line data={chartData} options={options} />}</>;
};

export default DailyAverageActiveUsersChart;
