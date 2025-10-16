// src/utils/commonChartOptions.js

import { CHART } from '../constants/appConstants';

export function getStandardChartOptions({ 
  type, 
  title, 
  xLabel, 
  yLabel, 
  darkMode = false, 
  forExport = false 
}) {
  const gridColor = darkMode ? "#444" : "#e5e5e5";
  const textColor = darkMode ? "#fff" : "#222";

  const baseFontSize = forExport ? CHART.EXPORT_BASE_FONT : CHART.DISPLAY_BASE_FONT;
  const titleFontSize = forExport ? CHART.EXPORT_TITLE_FONT : CHART.DISPLAY_TITLE_FONT;
  const tickFontSize = forExport ? CHART.EXPORT_TICK_FONT : CHART.DISPLAY_TICK_FONT;

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