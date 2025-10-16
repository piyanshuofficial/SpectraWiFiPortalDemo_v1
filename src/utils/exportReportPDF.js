// src/utils/exportReportPDF.js

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { generateChartImage } from "./generateChartImage";
import { SPECTRA_TTF_BASE64 } from "../assets/fonts/spectraFontBase64.js"; // use correct path here!

const SUPPORTING_COLORS = {
  purple: "#9465AA",
  indigo: "#5B879F",
  aqua: "#4AA7A9",
  mint: "#42C1B5"
};
const REPORT_COLOR_ASSIGNMENTS = {
  network_usage: 'aqua',
  license_usage: 'indigo',
  alerts_summary: 'purple',
  site_monthly_active_users: 'mint'
};

function getReportBranding(reportId) {
  const colorKey = REPORT_COLOR_ASSIGNMENTS[reportId] || "aqua";
  const color = SUPPORTING_COLORS[colorKey] || "#4AA7A9";
  return { color, colorKey };
}

export async function exportReportPDF({
  title,
  headers,
  rows,
  chartData,
  chartOptions,
  filename,
  rolePermissions,
  exportCanvasWidth = 900,
  exportCanvasHeight = 450,
  reportId
}) {
  if (!rolePermissions.canViewReports) {
    alert("You do not have permission to export reports.");
    return;
  }

  const { color } = getReportBranding(reportId);
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ---- Colored banner strip (draw first!) ----
  doc.setFillColor(color);
  doc.rect(0, 0, pageWidth, 90, "F");

  // ---- Register Spectra font and render white heading text ----
  doc.addFileToVFS("Spectra-Regular.ttf", SPECTRA_TTF_BASE64);
  doc.addFont("Spectra-Regular.ttf", "spectra", "normal");
  doc.setFont("spectra", "normal");
  doc.setTextColor("#fff");
  doc.setFontSize(42);
  // Center heading text vertically in the banner strip
  doc.text("SPECTRA", pageWidth / 2, 60, { align: "center" });

  // ---- Continue with regular content ----
  doc.setFont("helvetica", "bold");
  doc.setTextColor(color);
  doc.setFontSize(18);
  doc.text(title || "", pageWidth / 2, 110, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#000");
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 130, { align: "center" });

  let tableStartY = 160;
  if (chartData && chartOptions) {
    try {
      const base64Image = await generateChartImage(chartData, chartOptions, exportCanvasWidth, exportCanvasHeight);
      const chartWidth = pageWidth - 120;
      const chartHeight = (exportCanvasHeight * chartWidth) / exportCanvasWidth;
      doc.addImage(base64Image, "PNG", 60, 155, chartWidth, chartHeight);
      tableStartY = 145 + chartHeight + 20;
    } catch (e) {
      alert("Chart image embedding failed, exporting data only.");
    }
  }

  autoTable(doc, {
    startY: tableStartY,
    head: [headers],
    body: rows,
    theme: "striped",
    headStyles: {
      fillColor: color,
      fontStyle: "bold",
      textColor: "#000",
      fontSize: 12
    },
    bodyStyles: {
      textColor: "#000",
      fontSize: 11
    },
    styles: { halign: "center", valign: "middle" },
    margin: { left: 40, right: 40 },
    didDrawPage: () => {
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.setTextColor("#444");
      doc.text("Spectra Wi-Fi Management Portal | Confidential", 40, doc.internal.pageSize.getHeight() - 10);
      doc.text(`Page ${pageNumber}`, pageWidth - 60, doc.internal.pageSize.getHeight() - 10);
    }
  });

  doc.save(filename);
}
