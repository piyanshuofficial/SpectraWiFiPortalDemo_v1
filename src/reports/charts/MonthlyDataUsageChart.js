// src/reports/charts/MonthlyDataUsageChart.js

import React from "react";
import { Bar } from "react-chartjs-2";

const MonthlyDataUsageChart = ({ data }) => {
  const chartData = {
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
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return <>{<Bar data={chartData} options={options} />}</>;
};

export default MonthlyDataUsageChart;
