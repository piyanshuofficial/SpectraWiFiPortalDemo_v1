// src/reports/charts/AlertsSummaryChart.js

import React from "react";
import { Pie } from "react-chartjs-2";

const AlertsSummaryChart = ({ data, options }) => {
  const chartData = {
    labels: data.map((d) => d.alertType),
    datasets: [
      {
        label: "Alerts",
        data: data.map((d) => d.count),
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  };

  return <Pie data={chartData} options={options} />;
};

export default AlertsSummaryChart;
