// src/reports/charts/PolicyMonthlyAvgUsersChart.js

import React from "react";
import { Bar } from "react-chartjs-2";

const PolicyMonthlyAvgUsersChart = ({ data }) => {
  const uniquePolicies = [...new Set(data.map((d) => d.policy))];
  const months = [...new Set(data.map((d) => d.month))];

  const datasets = uniquePolicies.map((policy, idx) => ({
    label: policy,
    data: months.map(
      (month) =>
        data.find((d) => d.month === month && d.policy === policy)?.avgActiveUsers || 0
    ),
    backgroundColor: idx % 2 === 0 ? "rgba(33,80,162,0.7)" : "rgba(49,120,115,0.7)",
  }));

  const chartData = { labels: months, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
  };

  return <>{<Bar data={chartData} options={options} />}</>;
};

export default PolicyMonthlyAvgUsersChart;
