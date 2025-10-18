// src/reports/DailyAverageActiveUsers.js

import React from "react";
import ChartContainer from "../components/common/ChartContainer";
import ReportTable from "../components/common/ReportTable";
import { Line } from "react-chartjs-2";

const DailyAverageActiveUsers = ({ data }) => {
  const columns = ["Date", "Avg. Active Users"];
  const tableData = data.map((d) => [d.date, d.avgActiveUsers]);

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Avg. Active Users",
        data: data.map((d) => d.avgActiveUsers),
        borderColor: "#2150a2",
        backgroundColor: "rgba(33, 80, 162, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        borderWidth: 2,
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
    x: { 
      title: { display: true, text: "Date" }, 
      ticks: { 
        maxRotation: 45, 
        minRotation: 45 
      },
      //  TO PREVENT OVER-SPACING:
      offset: true,
      grid: {
        offset: true
      }
    },
    y: { 
      title: { display: true, text: "Users" }, 
      beginAtZero: true 
    },
  },
  // TO IMPROVE POINT VISIBILITY:
  elements: {
    line: {
      tension: 0.4
    },
    point: {
      radius: 6,        // Larger points
      hoverRadius: 8,   // Even larger on hover
      hitRadius: 10     // Easier to click
    }
  }
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

export default DailyAverageActiveUsers;
