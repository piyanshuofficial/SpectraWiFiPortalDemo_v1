// src/reports/LicenseUsageReport.js

import React from "react";
import ChartContainer from "../components/common/ChartContainer";
import ReportTable from "../components/common/ReportTable";
import { Bar } from "react-chartjs-2";

const LicenseUsageReport = ({ data }) => {
  const columns = ["License", "Usage"];
  const tableData = data.map((d) => [d.licenseType, d.usageCount]);

  const chartData = {
    labels: data.map((d) => d.licenseType),
    datasets: [
      {
        label: "License Usage",
        data: data.map((d) => d.usageCount),
        backgroundColor: ["#004aad", "#3f51b5", "#7986cb", "#c5cae9"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } },
    },
    scales: {
      x: { title: { display: true, text: "License" } },
      y: { title: { display: true, text: "Usage" }, beginAtZero: true },
    },
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>License Usage by Type</h2>
      <ChartContainer>
        <Bar data={chartData} options={chartOptions} />
      </ChartContainer>
      <ReportTable columns={columns} data={tableData} />
    </div>
  );
};

export default LicenseUsageReport;
