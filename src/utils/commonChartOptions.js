// src/utils/commonChartOptions.js

export function getStandardChartOptions({ type, title, xLabel, yLabel, darkMode = false, forExport = false }) {
  const gridColor = darkMode ? "#444" : "#e5e5e5";
  const textColor = darkMode ? "#fff" : "#222";

  const baseFontSize = forExport ? 20 : 14;
  const titleFontSize = forExport ? 28 : 18;
  const tickFontSize = forExport ? 18 : 12;

  return {
    type,
    responsive: !forExport,
    maintainAspectRatio: !forExport,
    animation: !forExport,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: textColor,
          font: { size: baseFontSize, family: "Helvetica", weight: "bold" },
        },
      },
      title: {
        display: Boolean(title),
        text: title,
        font: { size: titleFontSize, family: "Helvetica", weight: "bold" },
        color: textColor,
      },
    },
    scales: type === "pie" ? undefined : {
      x: {
        display: true,
        title: { display: Boolean(xLabel), text: xLabel, font: { size: baseFontSize } },
        ticks: { color: textColor, font: { size: tickFontSize } },
        grid: { color: gridColor },
      },
      y: {
        display: true,
        title: { display: Boolean(yLabel), text: yLabel, font: { size: baseFontSize } },
        ticks: { color: textColor, font: { size: tickFontSize } },
        grid: { color: gridColor },
        beginAtZero: true,
      },
    },
  };
}
