import Chart from "chart.js/auto";

export async function generateChartImage(data, options, width = 1200, height = 600) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    try {
      const chartInstance = new Chart(canvas, {
        type: "bar",  // update as needed
        data,
        options,
      });

      setTimeout(() => {
        const base64Image = canvas.toDataURL("image/png");
        chartInstance.destroy();
        resolve(base64Image);
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
}
