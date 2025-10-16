// src/utils/buildChartConfig.js

import { getStandardChartOptions } from "./commonChartOptions";

export function buildChartConfig({ type, title, xLabel, yLabel, labels, datasets, darkMode = false }) {
  const displayOptions = getStandardChartOptions({
    type,
    title,
    xLabel,
    yLabel,
    darkMode,
    forExport: false
  });
  const exportOptions = getStandardChartOptions({
    type,
    title,
    xLabel,
    yLabel,
    darkMode,
    forExport: true
  });

  return {
    display: {
      data: { labels, datasets },
      options: displayOptions
    },
    export: {
      data: { labels, datasets },
      options: exportOptions
    }
  };
}
