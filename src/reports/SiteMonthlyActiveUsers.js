// src/reports/SiteMonthlyActiveUsers.js

import React from "react";
import ChartContainer from "../components/common/ChartContainer";
import ReportTable from "../components/common/ReportTable";
import { Bar } from "react-chartjs-2";

const SiteMonthlyActiveUsers = ({ data }) => {
  const columns = [
    "Month",
    "Avg. Active Users",
    "New Users",
    "Churned Users",
    "Activations",
    "Deactivations",
    "Change vs Prev.",
  ];

  const rows = data.map((r) => [
    r.month,
    r.avgActiveUsers,
    r.newUsers,
    r.churnedUsers,
    r.activations,
    r.deactivations,
    r.changeFromPrevMonth >= 0 ? `+${r.changeFromPrevMonth}` : `${r.changeFromPrevMonth}`,
  ]);

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } },
    },
    interaction: { mode: "index", intersect: false },
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
  };

  return (
    <div style={{ padding: 20 }}>
      <ChartContainer>
        <Bar data={chartData} options={chartOptions} />
      </ChartContainer>
      <ReportTable columns={columns} data={rows} />
    </div>
  );
};

export default SiteMonthlyActiveUsers;