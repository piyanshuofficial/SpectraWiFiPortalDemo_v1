import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Utility to convert image URL to base64 for embedding in pdf
export async function toBase64Image(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

/**
 * Generates a PDF report with optional chart image.
 *
 * @param {object} params - Parameters.
 * @param {string} params.title - Report title.
 * @param {string} params.reportName - Report name.
 * @param {string} params.reportDate - Report generation date.
 * @param {array} params.reportData - Table body data.
 * @param {array} params.columns - Table header columns.
 * @param {string|null} params.chartBase64 - Base64 PNG image of chart to embed.
 * @param {object} params.branding - Branding details like logoUrl, companyName, address.
 */
export async function generateReportPDF({
  title,
  reportName,
  reportDate,
  reportData,
  columns,
  chartBase64 = null,
  branding = {
    logoUrl: "",
    companyName: "Spectra",
    companyAddress: "Plot No. 21-22, Phase-IV,Udyog Vihar, Gurugram, Harayna, India - 122015",
  },
}) {
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // Draw colored header bar
  doc.setFillColor("#5B8AC3"); // Indigo brand color
  doc.rect(0, 0, pageWidth, 85, "F");

  // Prepare base64 logo
  let logoBase64 = null;
  if (branding.logoUrl) {
    try {
      logoBase64 = await toBase64Image(branding.logoUrl);
    } catch (e) {
      console.warn("Logo load failed", e);
    }
  }

  // Add logo image
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 40, 20, 50, 50);
  }

  // Add company name and address over colored header bar
  doc.setTextColor("#fff");
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(branding.companyName, 100, 50);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(branding.companyAddress, 100, 65);

  // Reset color for main content
  doc.setTextColor("#000");

  // Add report title and date
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title || reportName, pageWidth / 2, 110, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Report Date: ${reportDate || new Date().toLocaleDateString()}`,
    pageWidth / 2,
    130,
    { align: "center" }
  );

  // Variables for chart image size and table start position
  const chartWidth = pageWidth - 80; // 40pt margin on each side
  let tableStartY = 160;

  // If chart image base64 is provided, add image below header
  if (chartBase64) {
    const chartHeight = chartWidth / 2; // maintain aspect ratio 2:1
    doc.addImage(chartBase64, "PNG", 40, 145, chartWidth, chartHeight);
    tableStartY = 145 + chartHeight + 20;
  }

  // Add data table using autoTable plugin with styling
  autoTable(doc, {
    startY: tableStartY,
    head: [columns],
    body: reportData,
    theme: "striped",
    headStyles: {
      fillColor: "#5B8AC3",
      fontStyle: "bold",
      textColor: "#FFF",
      fontSize: 12,
    },
    bodyStyles: { textColor: "#2A2A2A", fontSize: 11 },
    styles: { halign: "center", valign: "middle" },
    margin: { left: 40, right: 40 },

    didDrawPage: (data) => {
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.setTextColor("#444");
      doc.text(
        "Spectra Wi-Fi Management Portal | Confidential",
        40,
        doc.internal.pageSize.getHeight() - 10
      );
      doc.text(
        `Page ${pageNumber}`,
        pageWidth - 60,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });

  return doc;
}
