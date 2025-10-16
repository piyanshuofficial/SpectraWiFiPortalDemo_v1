// src/reports/PolicyWiseMonthlyAverageActiveUsers.js

import React from "react";
import ChartContainer from "../components/common/ChartContainer";
import ReportTable from "../components/common/ReportTable";
import { Bar } from "react-chartjs-2";

const PolicyWiseMonthlyAverageActiveUsers = ({ data }) => {
  const columns = ["Month", "Policy", "Avg. Active Users"];
  const tableData = data.map((d) => [d.month, d.policy, d.avgActiveUsers]);

  const uniquePolicies = [...new Set(data.map(d => d.policy))];
  const months = [...new Set(data.map(d => d.month))];

  const datasets = uniquePolicies.map((policy, idx) => {
    return {
      label: policy,
      data: months.map(month => {
        const record = data.find(d => d.month === month && d.policy === policy);
        return record ? record.avgActiveUsers : 0;
      }),
      backgroundColor: idx % 2 === 0 ? "rgba(33, 80, 162, 0.7)" : "rgba(49, 120, 115, 0.7)"
    };
  });

  const chartData = {
    labels: months,
    datasets: datasets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } }
    },
    scales: {
      x: { stacked: true, title: { display: true, text: "Month" } },
      y: { stacked: true, beginAtZero: true, title: { display: true, text: "Avg. Active Users" } }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Policy-wise Monthly Average Active Users</h2>
      <ChartContainer>
        <Bar data={chartData} options={chartOptions} />
      </ChartContainer>
      <ReportTable columns={columns} data={tableData} />
    </div>
  );
};

export default PolicyWiseMonthlyAverageActiveUsers;
