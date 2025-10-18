// src/reports/NetworkUsageReport.js

import React from "react";
import ChartContainer from "../components/common/ChartContainer";
import ReportTable from "../components/common/ReportTable";
import { Line } from "react-chartjs-2";

const NetworkUsageReport = ({ data }) => {
  const columns = ["Day", "Network Usage (GB)"];
  const tableData = data.map((d) => [d.day, d.usageGB]);

  const chartData = {
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
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } },
    },
    scales: {
      x: { title: { display: true, text: "Day" } },
      y: { title: { display: true, text: "Usage (GB)" }, beginAtZero: true },
    },
  };

  return (
    <div style={{ padding: 20 }}>
      <ChartContainer>
        <Line data={chartData} options={chartOptions} />
      </ChartContainer>
      <ReportTable columns={columns} data={tableData} />
    </div>
  );
};

export default NetworkUsageReport;
