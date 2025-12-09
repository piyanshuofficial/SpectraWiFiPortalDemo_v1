// src/utils/exportReportPDF.js

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { generateChartImage } from "./generateChartImage";
import { SPECTRA_TTF_BASE64 } from "../assets/fonts/spectraFontBase64.js";
import { CHART, EXPORT } from "../constants/appConstants";
import { PINNED_REPORT_BRAND_COLORS } from "../constants/colorConstants";

/**
 * Get random brand color for PDF header
 * @returns {string} Random color from brand colors
 */
function getRandomBrandColor() {
  const randomIndex = Math.floor(Math.random() * PINNED_REPORT_BRAND_COLORS.length);
  return PINNED_REPORT_BRAND_COLORS[randomIndex];
}

/**
 * Calculate summary statistics from report data
 * @param {array} rows - Table row data
 * @returns {object} Summary statistics
 */
function calculateSummaryStats(rows) {
  if (!rows || rows.length === 0) return null;
  
  const numericColumns = [];
  
  for (let colIndex = 1; colIndex < rows[0].length; colIndex++) {
    const isNumeric = rows.every(row => {
      const val = String(row[colIndex]).replace(/[^0-9.-]/g, '');
      return !isNaN(parseFloat(val));
    });
    if (isNumeric) {
      numericColumns.push(colIndex);
    }
  }
  
  if (numericColumns.length === 0) return null;
  
  const totals = {};
  numericColumns.forEach(colIndex => {
    const sum = rows.reduce((acc, row) => {
      const val = parseFloat(String(row[colIndex]).replace(/[^0-9.-]/g, '')) || 0;
      return acc + val;
    }, 0);
    totals[colIndex] = sum;
  });
  
  return {
    totalRows: rows.length,
    totals: totals
  };
}

/**
 * Generate executive summary insights from data
 * Only includes statistics for meaningful metrics, not identifiers
 * @param {array} rows - Table row data
 * @param {array} headers - Table headers
 * @returns {array} Array of insight strings
 */
function generateExecutiveInsights(rows, headers) {
  if (!rows || rows.length === 0) return null;

  const insights = [];

  // List of field names/patterns that should NOT have averages/peaks
  const excludePatterns = [
    /user.*id/i,
    /mac/i,
    /ip.*address/i,
    /client.*mac/i,
    /phone/i,
    /mobile/i,
    /email/i,
    /name/i,
    /device.*id/i,
    /session.*id/i,
    /transaction.*id/i,
    /attempt.*count/i,  // Individual attempt counts shouldn't be averaged
    /vendor/i,
    /location/i,
    /ssid/i,
    /method/i,
    /result/i,
    /status/i,
    /reason/i,
    /message/i,
    /details/i,
    /type/i,
    /policy/i,
    /timestamp/i,
    /date/i,
    /time/i
  ];

  for (let colIndex = 1; colIndex < rows[0].length && colIndex < headers.length; colIndex++) {
    const headerName = String(headers[colIndex]);

    // Skip if header matches any exclude pattern
    const shouldExclude = excludePatterns.some(pattern => pattern.test(headerName));
    if (shouldExclude) continue;

    const values = rows.map(row => {
      const val = parseFloat(String(row[colIndex]).replace(/[^0-9.-]/g, ''));
      return isNaN(val) ? null : val;
    }).filter(v => v !== null);

    // Only calculate insights if we have meaningful numeric data
    if (values.length > 1) {
      const total = values.reduce((a, b) => a + b, 0);
      const avg = (total / values.length).toFixed(2);
      const max = Math.max(...values);

      // Only add insights for columns with significant variation
      // (Skip if all values are the same or very similar)
      const hasVariation = max > avg * 1.1; // At least 10% variation

      if (hasVariation || values.length >= 5) {
        insights.push("Average " + headerName + ": " + avg);
        insights.push("Peak " + headerName + ": " + max);
      }
    }
  }

  return insights.length > 0 ? insights.slice(0, 3) : null;
}

/**
 * Format criteria for display in PDF
 * @param {object} criteria - Report criteria object
 * @returns {string} Formatted criteria text
 */
function formatCriteriaForPDF(criteria) {
  if (!criteria) return null;
  
  const parts = [];
  
  if (criteria.dateRange) {
    parts.push("Date Range: " + criteria.dateRange.start + " to " + criteria.dateRange.end);
  }
  
  if (criteria.monthRange) {
    parts.push("Month Range: " + criteria.monthRange.start + " to " + criteria.monthRange.end);
  }
  
  if (criteria.policies && criteria.policies.length > 0) {
    parts.push("Policies: " + criteria.policies.join(", "));
  }
  
  if (criteria.location) {
    parts.push("Location: " + criteria.location);
  }
  
  if (criteria.segment) {
    parts.push("Segment: " + criteria.segment);
  }
  
  return parts.length > 0 ? parts.join(" | ") : null;
}

/**
 * Add watermark to PDF page
 * @param {object} doc - jsPDF document instance
 * @param {number} pageWidth - Page width
 * @param {number} pageHeight - Page height
 * @param {string} text - Watermark text
 */
function addWatermark(doc, pageWidth, pageHeight, text) {
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.1 }));
  doc.setTextColor("#004aad");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(60);
  
  const angle = -45;
  doc.text(text, pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: angle
  });
  
  doc.restoreGraphicsState();
}

/**
 * Add footer to current page
 * @param {object} doc - jsPDF document instance
 * @param {number} pageWidth - Page width
 * @param {number} pageHeight - Page height
 */
function addFooter(doc, pageWidth, pageHeight) {
  const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
  const totalPages = doc.internal.getNumberOfPages();
  
  doc.setDrawColor("#e0e0e0");
  doc.setLineWidth(0.5);
  doc.line(40, pageHeight - 35, pageWidth - 40, pageHeight - 35);
  
  doc.setFontSize(8);
  doc.setTextColor("#666");
  doc.setFont("helvetica", "normal");
  doc.text("SpectraOne", 40, pageHeight - 22);
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#d32f2f");
  doc.text("CONFIDENTIAL", pageWidth / 2, pageHeight - 22, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#666");
  doc.text("Page " + currentPage + " of " + totalPages, pageWidth - 40, pageHeight - 22, { align: "right" });
  
  doc.setFontSize(7);
  doc.setTextColor("#999");
  doc.text("© 2025 Shyam Spectra Private Limited. All rights reserved.", pageWidth / 2, pageHeight - 10, { align: "center" });
}

/**
 * Export report data to PDF with chart visualization
 * Data sourced from centralized userSampleData or siteSampleData
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
 * @param {object} params.criteria - Report criteria/filters used
 * @param {boolean} params.addWatermark - Whether to add watermark (default: false)
 * @param {string} params.watermarkText - Custom watermark text (default: "CONFIDENTIAL")
 * @param {string} params.disclaimerText - Optional disclaimer text to add at end
 * @param {boolean} params.includeExecutiveSummary - Whether to include executive insights (default: true)
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
  reportId,
  criteria,
  addWatermark: shouldAddWatermark = false,
  watermarkText = "CONFIDENTIAL",
  disclaimerText = null,
  includeExecutiveSummary = true
}) {
  if (!rolePermissions.canViewReports) {
    alert("You do not have permission to export reports.");
    return;
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  const finalWidth = isMobile ? Math.min(exportCanvasWidth, 600) : exportCanvasWidth;
  const finalHeight = isMobile ? Math.min(exportCanvasHeight, 400) : exportCanvasHeight;

  const color = getRandomBrandColor();
  
  const doc = new jsPDF(EXPORT.PDF_ORIENTATION, "pt", EXPORT.PDF_PAGE_SIZE);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const currentDate = new Date();
  doc.setProperties({
    title: title || "Report",
    subject: "Wi-Fi Management Report - " + (title || "Analytics"),
    author: "SpectraOne",
    keywords: "wifi, network, analytics, report, " + (reportId || "data"),
    creator: "Shyam Spectra Private Limited",
    creationDate: currentDate
  });

  const tableMarginLeft = 40;
  const tableMarginRight = 40;
  const tableWidth = pageWidth - tableMarginLeft - tableMarginRight;

  doc.setFillColor(color);
  doc.rect(0, 0, pageWidth, 90, "F");

  doc.addFileToVFS("Spectra-Regular.ttf", SPECTRA_TTF_BASE64);
  doc.addFont("Spectra-Regular.ttf", "spectra", "normal");
  doc.setFont("spectra", "normal");
  doc.setTextColor("#fff");
  doc.setFontSize(48);
  doc.text("SPECTRA", pageWidth / 2, 60, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(color);
  doc.setFontSize(20);
  const titleStr = String(title || "Report");
  doc.text(titleStr, pageWidth / 2, 120, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#666");
  const reportDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  const reportTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  doc.text("Generated on " + reportDate + " at " + reportTime, pageWidth / 2, 140, { align: "center" });

  doc.setDrawColor("#e0e0e0");
  doc.setLineWidth(0.5);
  doc.line(80, 150, pageWidth - 80, 150);

  let contentStartY = 165;
  const criteriaText = formatCriteriaForPDF(criteria);
  
  if (criteriaText) {
    const criteriaBoxHeight = 35;
    doc.setFillColor("#e3f2fd");
    doc.roundedRect(tableMarginLeft, contentStartY, tableWidth, criteriaBoxHeight, 3, 3, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor("#1976d2");
    doc.text("FILTERS APPLIED:", tableMarginLeft + 12, contentStartY + 14);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#555");
    doc.text(criteriaText, tableMarginLeft + 12, contentStartY + 26);
    
    contentStartY += criteriaBoxHeight + 15;
  }

  if (includeExecutiveSummary) {
    const insights = generateExecutiveInsights(rows, headers);
    
    if (insights && insights.length > 0) {
      const insightBoxHeight = 25 + (insights.length * 15);
      
      doc.setFillColor("#f0f7ff");
      doc.roundedRect(tableMarginLeft, contentStartY, tableWidth, insightBoxHeight, 3, 3, "F");
      
      doc.setDrawColor(color);
      doc.setLineWidth(1);
      doc.roundedRect(tableMarginLeft, contentStartY, tableWidth, insightBoxHeight, 3, 3, "S");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(color);
      doc.text("KEY INSIGHTS", tableMarginLeft + 12, contentStartY + 18);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor("#333");
      
      let insightY = contentStartY + 35;
      insights.forEach(insight => {
        doc.text("• " + insight, tableMarginLeft + 12, insightY);
        insightY += 15;
      });
      
      contentStartY += insightBoxHeight + 20;
    }
  }

  let tableStartY = contentStartY;
  if (chartData && chartOptions) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor("#333");
    doc.text("Visual Analysis", tableMarginLeft, contentStartY);
    
    doc.setDrawColor(color);
    doc.setLineWidth(2);
    doc.line(tableMarginLeft, contentStartY + 3, tableMarginLeft + 100, contentStartY + 3);
    
    contentStartY += 20;
    
    try {
      const base64Image = await generateChartImage(
        chartData, 
        chartOptions, 
        finalWidth,
        finalHeight
      );
      
      if (base64Image) {
        const chartWidth = pageWidth - 120;
        const chartHeight = (finalHeight * chartWidth) / finalWidth;
        doc.addImage(base64Image, "PNG", 60, contentStartY, chartWidth, chartHeight);
        tableStartY = contentStartY + chartHeight + 25;
      }
    } catch (error) {
      console.error("Chart embedding failed:", error);
      tableStartY = contentStartY + 20;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor("#333");
  doc.text("Detailed Data", tableMarginLeft, tableStartY);
  
  doc.setDrawColor(color);
  doc.setLineWidth(2);
  doc.line(tableMarginLeft, tableStartY + 3, tableMarginLeft + 85, tableStartY + 3);
  
  tableStartY += 20;

  const safeRows = rows.map(row => 
    row.map(cell => String(cell !== null && cell !== undefined ? cell : ""))
  );
  
  const summaryStats = calculateSummaryStats(safeRows);
  
  if (summaryStats) {
    doc.setFillColor("#f5f5f5");
    doc.roundedRect(tableMarginLeft, tableStartY, tableWidth, 50, 3, 3, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor("#333");
    doc.text("Report Summary", tableMarginLeft + 15, tableStartY + 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#666");
    doc.text("Total Records: " + summaryStats.totalRows, tableMarginLeft + 15, tableStartY + 38);
    
    if (safeRows.length > 0) {
      const firstDate = safeRows[0][0];
      const lastDate = safeRows[safeRows.length - 1][0];
      const periodText = "Period: " + firstDate + " to " + lastDate;
      doc.text(periodText, tableMarginLeft + tableWidth - 15, tableStartY + 38, { align: "right" });
    }
    
    tableStartY += 65;
  }

  const safeHeaders = headers.map(h => String(h || ""));

  autoTable(doc, {
    startY: tableStartY,
    head: [safeHeaders],
    body: safeRows,
    theme: "grid",
    headStyles: {
      fillColor: color,
      fontStyle: "bold",
      textColor: "#fff",
      fontSize: 11,
      halign: "center",
      valign: "middle",
      cellPadding: 10
    },
    bodyStyles: {
      textColor: "#333",
      fontSize: 10,
      cellPadding: 8
    },
    alternateRowStyles: {
      fillColor: "#fafafa"
    },
    styles: { 
      halign: "center", 
      valign: "middle",
      lineColor: "#d0d0d0",
      lineWidth: 0.75
    },
    columnStyles: {
      0: { fontStyle: "bold", fillColor: "#f9f9f9" }
    },
    margin: { left: tableMarginLeft, right: tableMarginRight },
    didDrawPage: function() {
      if (shouldAddWatermark) {
        addWatermark(doc, pageWidth, pageHeight, watermarkText);
      }
      
      addFooter(doc, pageWidth, pageHeight);
    }
  });

  if (disclaimerText) {
    const finalY = doc.lastAutoTable.finalY || tableStartY + 100;
    
    const disclaimerStartY = finalY + 30;
    
    if (disclaimerStartY > pageHeight - 100) {
      doc.addPage();
      
      addFooter(doc, pageWidth, pageHeight);
      
      const newDisclaimerY = 60;
      
      doc.setFillColor("#fff9e6");
      doc.setDrawColor("#ffc107");
      doc.setLineWidth(1);
      doc.roundedRect(tableMarginLeft, newDisclaimerY, tableWidth, 70, 3, 3, "FD");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor("#ff6f00");
      doc.text("IMPORTANT NOTICE", tableMarginLeft + 12, newDisclaimerY + 18);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor("#555");
      const disclaimerLines = doc.splitTextToSize(disclaimerText, tableWidth - 30);
      doc.text(disclaimerLines, tableMarginLeft + 12, newDisclaimerY + 35);
    } else {
      doc.setFillColor("#fff9e6");
      doc.setDrawColor("#ffc107");
      doc.setLineWidth(1);
      doc.roundedRect(tableMarginLeft, disclaimerStartY, tableWidth, 70, 3, 3, "FD");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor("#ff6f00");
      doc.text("IMPORTANT NOTICE", tableMarginLeft + 12, disclaimerStartY + 18);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor("#555");
      const disclaimerLines = doc.splitTextToSize(disclaimerText, tableWidth - 30);
      doc.text(disclaimerLines, tableMarginLeft + 12, disclaimerStartY + 35);
    }
  }

  doc.save(filename);
}