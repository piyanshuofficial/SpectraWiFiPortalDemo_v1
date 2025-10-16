// src/utils/generateChartImage.js
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);


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