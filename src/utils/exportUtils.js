// src/utils/exportUtils.js

import Papa from 'papaparse';

// Unified CSV export function for table or chart data
export const exportChartDataToCSV = (data, filename = 'chart-data.csv') => {
  let csv = '';

  if (data.headers && data.rows) {
    // Table data export
    csv = Papa.unparse({
      fields: data.headers,
      data: data.rows,
    });
  } else if (data.labels && data.datasets) {
    // Chart data export
    const csvData = data.labels.map((label, i) => {
      const row = [label];
      data.datasets.forEach(dataset => row.push(dataset.data[i]));
      return row;
    });
    csv = Papa.unparse({
      fields: ['Label', ...data.datasets.map(ds => ds.label)],
      data: csvData,
    });
  } else {
    alert('CSV Export failed: Invalid data format.');
    return;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
