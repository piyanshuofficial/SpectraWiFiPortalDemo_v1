// src/utils/exportUtils.js

import Papa from 'papaparse';

/**
 * Unified CSV export function for table or chart data
 * Works with centralized data from userSampleData and siteSampleData
 * @param {object} data - Data to export (headers/rows or labels/datasets)
 * @param {string} filename - Output filename
 * @returns {Promise<void>}
 */
export const exportChartDataToCSV = async (data, filename = 'chart-data.csv') => {
  return new Promise((resolve, reject) => {
    try {
      let csv = '';

      if (data.headers && data.rows) {
        csv = Papa.unparse({
          fields: data.headers,
          data: data.rows,
        });
      } else if (data.labels && data.datasets) {
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
        reject(new Error('Invalid data format for CSV export'));
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
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};