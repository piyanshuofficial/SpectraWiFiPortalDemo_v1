// src/reports/MonthlyDataUsageSummary.js

import React from "react";
import ChartContainer from "../components/common/ChartContainer";
import ReportTable from "../components/common/ReportTable";
import { Bar } from "react-chartjs-2";

const MonthlyDataUsageSummary = ({ data }) => {
  const columns = ["Month", "Total Usage (GB)", "Peak Usage (GB)", "Avg Usage (GB)"];
  const tableData = data.map((d) => [
    d.month,
    d.totalUsageGB,
    d.peakUsageGB,
    d.avgUsageGB,
  ]);

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Total Usage (GB)",
        data: data.map((d) => d.totalUsageGB),
        backgroundColor: "rgba(33,80,162,0.6)",
      },
      {
        label: "Peak Usage (GB)",
        data: data.map((d) => d.peakUsageGB),
        backgroundColor: "rgba(217,83,79,0.6)",
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Monthly Data Usage Summary</h2>
      <ChartContainer>
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </ChartContainer>
      <ReportTable columns={columns} data={tableData} />
    </div>
  );
};

export default MonthlyDataUsageSummary;
