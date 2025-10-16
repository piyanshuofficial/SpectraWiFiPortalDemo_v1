// src/reports/charts/LicenseUsageChart.js

import React from "react";
import { Bar } from "react-chartjs-2";

const LicenseUsageChart = ({ data, options }) => {
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

  return <Bar data={chartData} options={options} />;
};

export default LicenseUsageChart;
