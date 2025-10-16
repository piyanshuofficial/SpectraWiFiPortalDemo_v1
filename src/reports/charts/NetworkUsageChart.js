// src/reports/charts/NetworkUsageChart.js

import React from "react";
import { Line } from "react-chartjs-2";

const NetworkUsageChart = ({ data, options }) => {
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

  return <Line data={chartData} options={options} />;
};

export default NetworkUsageChart;
