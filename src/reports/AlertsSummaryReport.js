// src/reports/AlertsSummaryReport.js

import React from "react";
import ChartContainer from "../components/common/ChartContainer";
import ReportTable from "../components/common/ReportTable";
import { Pie } from "react-chartjs-2";

const AlertsSummaryReport = ({ data }) => {
  const columns = ["Alert Type", "Count"];
  const tableData = data.map((d) => [d.alertType, d.count]);

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } },
    },
  };

  return (
    <div style={{ padding: 20 }}>
      <ChartContainer>
        <Pie data={chartData} options={chartOptions} />
      </ChartContainer>
      <ReportTable columns={columns} data={tableData} />
    </div>
  );
};

export default AlertsSummaryReport;
