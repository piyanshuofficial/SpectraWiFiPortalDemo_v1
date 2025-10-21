// src/utils/exportReportPDF.js

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { generateChartImageWithRetry } from "./generateChartImage"; // ✅ Use retry version
import { SPECTRA_TTF_BASE64 } from "../assets/fonts/spectraFontBase64.js";
import { CHART, EXPORT } from "../constants/appConstants";
import { SUPPORTING_COLORS, REPORT_COLOR_ASSIGNMENTS } from "../constants/colorConstants";

/**
 * Get report branding color by report ID
 * @param {string} reportId - Report identifier
 * @returns {object} { color: string, colorKey: string }
 */
function getReportBranding(reportId) {
  const colorKey = REPORT_COLOR_ASSIGNMENTS[reportId] || "AQUA";
  const color = SUPPORTING_COLORS[colorKey] || SUPPORTING_COLORS.AQUA;
  return { color, colorKey };
}

/**
 * Export report data to PDF with chart visualization
 * @param {object} params - Export parameters
 * @param {string} params.title - Report title
 * @param {array} params.headers - Table column headers
 * @param {array} params.rows - Table row data
 * @param {object} params.chartData - Chart.js data object
 * @param {object} params.chartOptions - Chart.js options object
 * @param {string} params.filename - Output filename
 * @param {object} params.rolePermissions - User role permissions
 * @param {number} params.exportCanvasWidth - Canvas width for chart
 * @param {number} params.exportCanvasHeight - Canvas height for chart
 * @param {string} params.reportId - Report identifier for color branding
 */
export async function exportReportPDF({
  title,
  headers,
  rows,
  chartData,
  chartOptions,
  filename,
  rolePermissions,
  exportCanvasWidth = CHART.EXPORT_LINE_WIDTH,
  exportCanvasHeight = CHART.EXPORT_LINE_HEIGHT,
  reportId
}) {
  // Permission check
  if (!rolePermissions.canViewReports) {
    alert("You do not have permission to export reports.");
    return;
  }

  // Detect mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  // Adjust canvas size for mobile
  const finalWidth = isMobile ? Math.min(exportCanvasWidth, 600) : exportCanvasWidth;
  const finalHeight = isMobile ? Math.min(exportCanvasHeight, 400) : exportCanvasHeight;

  // Get report-specific branding color
  const { color } = getReportBranding(reportId);
  
  // Initialize PDF document
  const doc = new jsPDF(EXPORT.PDF_ORIENTATION, "pt", EXPORT.PDF_PAGE_SIZE);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ============================================
  // HEADER: Colored banner strip with SPECTRA logo
  // ============================================
  doc.setFillColor(color);
  doc.rect(0, 0, pageWidth, 90, "F");

  // Register and use Spectra font for header
  doc.addFileToVFS("Spectra-Regular.ttf", SPECTRA_TTF_BASE64);
  doc.addFont("Spectra-Regular.ttf", "spectra", "normal");
  doc.setFont("spectra", "normal");
  doc.setTextColor("#fff");
  doc.setFontSize(42);
  doc.text("SPECTRA", pageWidth / 2, 60, { align: "center" });

  // ============================================
  // TITLE SECTION
  // ============================================
  doc.setFont("helvetica", "bold");
  doc.setTextColor(color);
  doc.setFontSize(18);
  doc.text(title || "", pageWidth / 2, 110, { align: "center" });

  // Report metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#000");
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 130, { align: "center" });

  // ============================================
  // CHART SECTION
  // ============================================
  let tableStartY = 160;
  if (chartData && chartOptions) {
    try {
      // Use mobile-optimized chart generation
      const base64Image = await generateChartImageWithRetry(
        chartData, 
        chartOptions, 
        finalWidth,
        finalHeight,
        isMobile ? 1 : 2 // Fewer retries on mobile
      );
      
      const chartWidth = pageWidth - 120;
      const chartHeight = (exportCanvasHeight * chartWidth) / exportCanvasWidth;
      doc.addImage(base64Image, "PNG", 60, 155, chartWidth, chartHeight);
      tableStartY = 145 + chartHeight + 20;
    } catch (error) {
      console.error("Chart embedding failed:", error);
      // Better error message for mobile
      if (isMobile) {
        alert("Chart image could not be embedded on this device. The PDF will include data only.");
      } else {
        alert("Chart image embedding failed, exporting data only.");
      }
    }
  }

  // ============================================
  // DATA TABLE SECTION
  // ============================================
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
    styles: { 
      halign: "center", 
      valign: "middle" 
    },
    margin: { left: 40, right: 40 },
    didDrawPage: (data) => {
      // Footer on each page
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.setTextColor("#444");
      doc.text(
        "SpectraOne Wi-Fi Portal | Confidential", 
        40, 
        pageHeight - 10
      );
      doc.text(
        `Page ${pageNumber}`, 
        pageWidth - 60, 
        pageHeight - 10
      );
    }
  });

  // Save PDF file
  doc.save(filename);
}