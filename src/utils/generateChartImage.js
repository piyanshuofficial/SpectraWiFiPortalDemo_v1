// src/utils/generateChartImage.js

/**
 * Generate base64 image from Chart.js chart data
 * Used for PDF export functionality
 * 
 * Chart.js components are registered globally in src/config/chartConfig.js
 */

import { Chart } from '../config/chartConfig';

/**
 * Generate a chart image for PDF export
 * @param {object} data - Chart.js data object
 * @param {object} options - Chart.js options object
 * @param {number} width - Canvas width in pixels
 * @param {number} height - Canvas height in pixels
 * @returns {Promise<string>} Base64 encoded image
 */
export async function generateChartImage(data, options, width = 900, height = 450) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    let chart;
    try {
      chart = new Chart(canvas, {
        type: options.type || "line",
        data,
        options,
      });

      setTimeout(() => {
        try {
          const base64Image = canvas.toDataURL("image/png");
          resolve(base64Image);
        } catch (error) {
          reject(error);
        } finally {
          chart.destroy();
          document.body.removeChild(canvas);
        }
      }, 1000);
    } catch (error) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      reject(error);
    }
  });
}